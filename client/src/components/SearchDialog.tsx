import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/providers/LanguageProvider";
import { Article, Translation } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function SearchDialog() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Fetch all articles
  const { data: articles } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Filter articles based on search term
  useEffect(() => {
    if (!articles || !searchTerm.trim()) {
      setFilteredArticles([]);
      return;
    }

    const results = articles.filter(article => {
      // Get the appropriate translation or fall back to English
      const translations = article.translations as Record<string, Translation>;
      const translation = translations[language] || translations.en;
      
      const titleMatch = translation.title.toLowerCase().includes(searchTerm.toLowerCase());
      const excerptMatch = translation.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = translation.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      return titleMatch || excerptMatch || contentMatch;
    });

    setFilteredArticles(results);
  }, [searchTerm, articles, language]);

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear search when dialog closes
      setSearchTerm("");
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('search')}>
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('search.title')}</DialogTitle>
        </DialogHeader>
        <div className="relative mt-4">
          <Input 
            className="pr-10" 
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {searchTerm && filteredArticles.length === 0 && (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('search.no.results')}
            </p>
          )}
          
          {filteredArticles.map(article => {
            // Get the appropriate translation or fall back to English
            const translations = article.translations as Record<string, Translation>;
            const translation = translations[language] || translations.en;
            
            return (
              <Link 
                key={article.id} 
                href={`/article/${article.slug}`}
                onClick={closeDialog}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <h3 className="font-medium">{translation.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{translation.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}