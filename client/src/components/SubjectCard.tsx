import { Link } from "wouter";
import { Subject } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface SubjectCardProps {
  subject: Subject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const { t } = useTranslation();
  
  // Convert subject.icon (e.g., "ri-computer-line") to actual icon component
  const getIconClass = (iconName: string) => {
    return iconName;
  };
  
  // Get background and text color based on subject
  const getColorClass = (subjectId: number) => {
    const colorMap: Record<number, { bg: string, hover: string, text: string }> = {
      1: { // Technology
        bg: "bg-primary-100 dark:bg-primary-900",
        hover: "group-hover:bg-primary-200 dark:group-hover:bg-primary-800",
        text: "text-primary-700 dark:text-primary-400"
      },
      2: { // Science
        bg: "bg-blue-100 dark:bg-blue-900",
        hover: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800",
        text: "text-blue-700 dark:text-blue-400"
      },
      3: { // Environment
        bg: "bg-green-100 dark:bg-green-900",
        hover: "group-hover:bg-green-200 dark:group-hover:bg-green-800",
        text: "text-green-700 dark:text-green-400"
      },
      4: { // Health
        bg: "bg-red-100 dark:bg-red-900",
        hover: "group-hover:bg-red-200 dark:group-hover:bg-red-800",
        text: "text-red-700 dark:text-red-400"
      },
      5: { // Arts & Culture
        bg: "bg-yellow-100 dark:bg-yellow-900",
        hover: "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800",
        text: "text-yellow-700 dark:text-yellow-400"
      },
      6: { // Travel
        bg: "bg-indigo-100 dark:bg-indigo-900",
        hover: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800",
        text: "text-indigo-700 dark:text-indigo-400"
      }
    };
    
    return colorMap[subjectId] || colorMap[1]; // Default to Technology colors
  };
  
  const colorClass = getColorClass(subject.id);
  
  return (
    <Link href={`/subject/${subject.slug}`}>
      <div className="group flex flex-col items-center p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all cursor-pointer">
        <div className={`w-12 h-12 rounded-full ${colorClass.bg} ${colorClass.hover} flex items-center justify-center mb-3 transition-colors`}>
          <i className={`${getIconClass(subject.icon)} text-xl ${colorClass.text}`}></i>
        </div>
        <h3 className="font-medium">{t(subject.slug)}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{subject.articleCount} {t('articles')}</span>
      </div>
    </Link>
  );
}
