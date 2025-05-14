import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface BreadcrumbItem {
  name?: string;
  translationKey?: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();
  
  const getDisplayName = (item: BreadcrumbItem): string => {
    // Return name if provided
    if (item.name) return item.name;
    
    // Handle translation key
    if (item.translationKey) {
      const translated = t(item.translationKey);
      if (typeof translated === 'string') {
        return translated;
      }
      console.warn(`Translation key "${item.translationKey}" returned non-string value`);
      return item.translationKey; // Fallback to key
    }
    
    return ''; // Fallback for empty items
  };

  return (
    <nav className="flex text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center hover:text-primary-600 dark:hover:text-primary-400">
            <Home className="w-4 h-4 mr-2" />
            {t('nav.home')}
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {getDisplayName(item)}
                </Link>
              ) : (
                <span className="text-gray-700 dark:text-gray-300">
                  {getDisplayName(item)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
