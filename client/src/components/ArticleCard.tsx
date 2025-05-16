import { Link } from "wouter";
import { Article } from "shared/schema";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/providers/LanguageProvider";
import { LanguageBadge } from "./LanguageBadge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguage();

  if (!article) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-48 bg-gray-200 dark:bg-gray-800" />
        <CardContent className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const translation = article.translations[currentLanguage] || article.translations.en;
  if (!translation) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/subject/${article.subjectId}/${article.slug}`}>
        <CardHeader className="p-0">
          <img
            src={article.imageUrl}
            alt={translation.title}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{translation.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {translation.excerpt}
          </p>
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.authorImage} />
              <AvatarFallback>{article.author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{article.author}</span>
          </div>
          <div className="flex space-x-2">
            {article.availableLanguages.map(lang => (
              <LanguageBadge key={lang} language={lang} />
            ))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}