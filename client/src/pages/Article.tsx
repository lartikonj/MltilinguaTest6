import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRoute } from "wouter";
import { Article, Subject } from "@shared/schema";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import LanguageBadge from "@/components/LanguageBadge";
import { useLanguage } from "@/providers/LanguageProvider";

export default function ArticlePage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Fetch article data
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
  });
  
  // Fetch subject for breadcrumb
  const { data: subject, isLoading: isLoadingSubject } = useQuery<Subject>({
    queryKey: [`/api/subjects/${article?.subjectId}`],
    enabled: !!article?.subjectId,
  });
  
  const isLoading = isLoadingArticle || isLoadingSubject;
  
  // Get the appropriate translation or fall back to English
  const translation = article?.translations[language as keyof typeof article.translations] || 
                     article?.translations.en;
  const [match, params] = useRoute("/subject/:subjectSlug/:slug");
  
  if (!match) return <NotFound />;
  const { subjectSlug, slug } = params!;
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        {!isLoading && article && subject && (
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { name: t('subjects'), href: "/subjects", translationKey: "subjects" },
                { 
                  name: subject.name, 
                  href: `/subject/${subject.slug}`, 
                  translationKey: subject.slug
                },
                { name: translation?.title || article.title }
              ]} 
            />
          </div>
        )}
        
        {isLoadingArticle ? (
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
            </div>
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          </div>
        ) : article && translation ? (
          <article className="max-w-3xl mx-auto">
            {/* Article header */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{translation.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Subject badge */}
              <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                {t(subject?.slug || '')}
              </span>
              
              {/* Read time */}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {article.readTime} {t('min.read')}
              </span>
              
              {/* Available languages */}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                  {t('available.in')}:
                </span>
                {article.availableLanguages.map(langCode => (
                  <LanguageBadge key={langCode} code={langCode} />
                ))}
              </div>
            </div>
            
            {/* Featured image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={translation.title} 
                className="w-full object-cover h-auto" 
              />
            </div>
            
            {/* Author and date */}
            <div className="flex items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
              {article.authorImage && (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={article.authorImage} 
                    alt={article.author} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{article.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(article.publishDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            
            {/* Article content */}
            <div className="prose dark:prose-invert max-w-none">
              {translation.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('article.not.found')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
