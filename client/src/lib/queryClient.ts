import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { isStaticDeployment, apiBaseUrl } from "./environment";
import * as staticApi from '../data/api';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use static data when in static deployment mode (Vercel/Netlify)
    if (isStaticDeployment) {
      const path = (queryKey[0] as string);
      
      // Map API endpoints to static data functions
      if (path === '/api/subjects') {
        return staticApi.getSubjects();
      } 
      else if (path.startsWith('/api/subjects/')) {
        const slug = path.replace('/api/subjects/', '');
        return staticApi.getSubjectBySlug(slug);
      }
      else if (path === '/api/articles') {
        return staticApi.getArticles();
      }
      else if (path === '/api/articles/featured') {
        return staticApi.getFeaturedArticles();
      }
      else if (path === '/api/articles/recent') {
        return staticApi.getRecentArticles();
      }
      else if (path.startsWith('/api/articles/subject/')) {
        const subjectId = parseInt(path.replace('/api/articles/subject/', ''));
        return staticApi.getArticlesBySubject(subjectId);
      }
      else if (path.startsWith('/api/articles/')) {
        const slug = path.replace('/api/articles/', '');
        return staticApi.getArticleBySlug(slug);
      }
      
      throw new Error(`Unhandled static API path: ${path}`);
    }
    
    // Normal API request flow for development
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
