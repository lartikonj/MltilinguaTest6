import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Define available languages with their codes and display names
export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ar", name: "Arabic", nativeName: "العربية" }
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // Update language when it changes
  const setLanguage = (newLang: string) => {
    if (LANGUAGES.some((lang) => lang.code === newLang)) {
      setLanguageState(newLang);
      localStorage.setItem("language", newLang);
      i18n.changeLanguage(newLang);
      
      // Set RTL attribute for Arabic
      if (newLang === "ar") {
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
      }
      
      // Update HTML lang attribute
      document.documentElement.lang = newLang;
    }
  };

  // Initialize language on component mount
  useEffect(() => {
    i18n.changeLanguage(language);
    
    // Set RTL attribute for Arabic
    if (language === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [i18n, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
