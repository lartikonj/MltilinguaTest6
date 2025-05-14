import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Article } from "@shared/schema";
import { useLanguage } from "@/providers/LanguageProvider";
import LanguageBadge from "./LanguageBadge";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
  subjectSlug: string;
  variant?: "default" | "horizontal" | "featured";
  showAuthor?: boolean;
}


export default function ArticleCard({ 
  article, 
  subjectSlug,
  variant = "default",
  showAuthor = false
}: ArticleCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  // Get the appropriate translation or fall back to English
  const translation = article.translations[language as keyof typeof article.translations] || 
                     article.translations.en;
  
  // Format date
  const formattedDate = format(new Date(article.publishDate), "MMMM d, yyyy");
  
  // Find subject by ID for badge
  const getSubjectName = (subjectId: number) => {
    const subjectMap: Record<number, { name: string, class: string }> = {
      1: { name: "Technology", class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      2: { name: "Science", class: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
      3: { name: "Environment", class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      4: { name: "Health", class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      5: { name: "Arts & Culture", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      6: { name: "Travel", class: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
    };
    
    return subjectMap[subjectId] || { name: "General", class: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" };
  };
  
  const subject = getSubjectName(article.subjectId);
  
  if (variant === "horizontal") {
    return (
      <div className="flex items-start gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={translation.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h4 className="font-medium mb-1">{translation.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{formattedDate}</p>
          <div className="flex space-x-1">
            {article.availableLanguages.map(langCode => (
              <LanguageBadge key={langCode} code={langCode} size="small" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === "featured") {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
        <img 
          src={article.imageUrl} 
          alt={translation.title} 
          className="w-full h-64 object-cover" 
        />
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", subject.class)}>
              {t(article.subjectId.toString())}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime} {t('min.read')}</span>
          </div>
          <h3 className="font-bold text-2xl mb-3">{translation.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-5">{translation.excerpt}</p>
          <div className="flex items-center justify-between">
            {showAuthor && article.authorImage && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={article.authorImage} 
                    alt={article.author} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-medium">{article.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>
            )}
            <div className="flex space-x-1">
              {article.availableLanguages.map(langCode => (
                <LanguageBadge key={langCode} code={langCode} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default card
  return (
    <Link href={`/subject/${subjectSlug}/${article.slug}`}  aria-label={`Read article: ${translation.title}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 cursor-pointer">
        <img 
          src={article.imageUrl} 
          alt={translation.title} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", subject.class)}>
              {t(article.subjectId.toString())}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime} {t('min.read')}</span>
          </div>
          <h3 className="font-bold text-xl mb-2">{translation.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{translation.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
            <div className="flex space-x-1">
              {article.availableLanguages.map(langCode => (
                <LanguageBadge key={langCode} code={langCode} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

}
