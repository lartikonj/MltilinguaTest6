import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface LanguageBadgeProps {
  code: string;
  active?: boolean;
  size?: "small" | "medium";
  onClick?: () => void;
}

export default function LanguageBadge({ 
  code, 
  active = false, 
  size = "medium", 
  onClick 
}: LanguageBadgeProps) {
  const { language, setLanguage } = useLanguage();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (code !== language) {
      setLanguage(code);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center text-xs uppercase font-medium",
        size === "small" ? "w-5 h-5" : "w-6 h-6",
        active || code === language
          ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        onClick && "cursor-pointer hover:opacity-90"
      )}
    >
      {code}
    </button>
  );
}
