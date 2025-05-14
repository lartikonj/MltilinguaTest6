import { Link } from "wouter";
import { AlertCircle, Home, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-300" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{t('not.found.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{t('not.found.description')}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('back.home')}
              </Button>
            </Link>
            
            <Link href="/subjects">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t('browse.subjects')}
              </Button>
            </Link>
          </div>
          
          <div className="mt-16">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">{t('popular.topics')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Link href="/subject/technology">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
                      {t('technology')}
                    </div>
                  </Link>
                  <Link href="/subject/health">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
                      {t('health')}
                    </div>
                  </Link>
                  <Link href="/subject/travel">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
                      {t('travel')}
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
