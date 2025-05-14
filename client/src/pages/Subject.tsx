import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRoute } from "wouter";
import { Subject, Article } from "@shared/schema";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";

export default function SubjectPage() {
  const { t } = useTranslation();
  const [, params] = useRoute<{ slug: string }>("/subject/:slug");
  const slug = params?.slug || "";
  
  // Fetch subject data
  const { data: subject, isLoading: isLoadingSubject } = useQuery<Subject>({
    queryKey: [`/api/subjects/${slug}`],
  });
  
  // Fetch articles for this subject
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: [`/api/articles/subject/${subject?.id}`],
    enabled: !!subject?.id,
  });
  
  const isLoading = isLoadingSubject || isLoadingArticles;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { name: t('subjects'), href: "/subjects", translationKey: "subjects" },
              { name: subject?.name || slug, translationKey: slug }
            ]} 
          />
        </div>
        
        {/* Subject header */}
        <div className="mb-12 text-center">
          {isLoadingSubject ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4 mx-auto">
                <i className={`${subject?.icon} text-2xl text-primary-700 dark:text-primary-400`}></i>
              </div>
              <h1 className="text-3xl font-bold mb-2">{t(slug)}</h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subject?.articleCount} {t('articles')} {t('available.in.multiple.languages')}
              </p>
            </>
          )}
        </div>
        
        {/* Articles grid */}
        {isLoadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden animate-pulse h-96">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-800"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="flex space-x-1">
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">{t('no.articles.found')}</p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
