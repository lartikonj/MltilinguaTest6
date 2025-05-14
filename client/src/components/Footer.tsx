import { Link } from "wouter";
import { Globe, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Globe className="text-white" />
              </div>
              <span className="font-bold text-xl">MultiLingua</span>
            </div>
            <p className="text-gray-400 mb-6">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.explore')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-gray-400 hover:text-white transition-colors">
                  {t('featured.articles')}
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-gray-400 hover:text-white transition-colors">
                  {t('subjects')}
                </Link>
              </li>
              <li>
                <Link href="/recent" className="text-gray-400 hover:text-white transition-colors">
                  {t('latest.articles')}
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-gray-400 hover:text-white transition-colors">
                  {t('popular')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.languages')}</h3>
            <ul className="space-y-3">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {t('english')}
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {t('french')}
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {t('spanish')}
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {t('arabic')}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.about')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.mission')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/contributors" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.contributors')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{t('footer.copyright')}</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              {t('footer.privacy')}
            </button>
            <span className="text-gray-600">•</span>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              {t('footer.terms')}
            </button>
            <span className="text-gray-600">•</span>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              {t('footer.cookies')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
