// client/src/pages/About.tsx
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "wouter";
import { Globe, BookOpen, Languages } from "lucide-react";

export default function About() {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[
          { name: t('nav.about'), href: "/about" }
        ]} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
            <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <p>
                At MultiLingua, we're revolutionizing language learning by providing 
                authentic content in multiple languages. Our platform enables you to:
              </p>
              <ul className="space-y-3 pl-5 list-disc">
                <li>Read the same article in different languages side-by-side</li>
                <li>Learn specialized vocabulary in context</li>
                <li>Experience cultural nuances through native content</li>
                <li>Track your language progress across diverse subjects</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">{t('about.features.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Languages className="text-primary-600 mr-3" size={24} />
                  <h3 className="font-medium text-lg">{t('about.features.multilingual.title')}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.features.multilingual.description')} Our translations 
                  maintain the original meaning while adapting to cultural contexts.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="text-primary-600 mr-3" size={24} />
                  <h3 className="font-medium text-lg">{t('about.features.subjects.title')}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.features.subjects.description')} Each subject area 
                  has content carefully selected for language learners.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center mt-12">
            <Link 
              href="/subjects" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Globe className="mr-2" size={18} />
              {t('explore subjects')}
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
}
