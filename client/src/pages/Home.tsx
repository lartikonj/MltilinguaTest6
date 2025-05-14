import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Article, Subject } from "@shared/schema";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import SubjectCard from "@/components/SubjectCard";

export default function Home() {
  const { t } = useTranslation();
  
  // Fetch featured articles
  const { data: featuredArticles, isLoading: isLoadingFeatured } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });
  
  // Fetch subjects
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });
  
  // Fetch recent articles
  const { data: recentArticles, isLoading: isLoadingRecent } = useQuery<Article[]>({
    queryKey: ['/api/articles/recent'],
  });
  
  const isLoading = isLoadingFeatured || isLoadingSubjects || isLoadingRecent;
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{t('hero.title')}</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">{t('hero.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/featured">
                <button className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  {t('start.reading')}
                </button>
              </Link>
              <Link href="/subjects">
                <button className="px-5 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors">
                  {t('browse.subjects')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Articles */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t('featured.articles')}</h2>
            <Link href="/featured" className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center">
              {t('view.all')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Subject Categories */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">{t('explore.by.subject')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('explore.description')}</p>
          </div>
          
          {isLoadingSubjects ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse flex flex-col items-center p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {subjects?.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Latest Articles */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t('latest.articles')}</h2>
            <Link href="/recent" className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center">
              {t('view.all')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {isLoadingRecent ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden animate-pulse h-[500px]">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-800"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-[500px]">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                <div className="space-y-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-start gap-4 pb-5 border-b border-gray-200 dark:border-gray-800 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        <div className="flex space-x-1">
                          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main recent article */}
              {recentArticles && recentArticles.length > 0 && (
                <ArticleCard 
                  article={recentArticles[0]} 
                  variant="featured" 
                  showAuthor={true}
                />
              )}
              
              {/* Sidebar with recent articles list */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-4">{t('recent.updates')}</h3>
                <div className="space-y-5">
                  {recentArticles?.slice(1, 5).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary-700 dark:bg-primary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/featured">
              <button className="px-6 py-3 bg-white text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                {t('get.started')}
              </button>
            </Link>
            <Link href="/about">
              <button className="px-6 py-3 bg-transparent text-white border border-white hover:bg-primary-600 dark:hover:bg-primary-800 rounded-lg font-medium transition-colors">
                {t('learn.more')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
