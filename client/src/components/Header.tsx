
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { SearchDialog } from "./SearchDialog";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  translationKey: string;
}

interface SubjectNavItem {
  name: string;
  slug: string;
  translationKey: string;
}

export default function Header() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubjectsOpen, setMobileSubjectsOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Home", href: "/", translationKey: "nav.home" },
    { label: "Popular", href: "/popular", translationKey: "nav.popular" },
    { label: "Recent", href: "/recent", translationKey: "nav.recent" },
    { label: "About", href: "/about", translationKey: "nav.about" },
  ];

  const subjects: SubjectNavItem[] = [
    { name: "Technology", slug: "technology", translationKey: "technology" },
    { name: "Science", slug: "science", translationKey: "science" },
    { name: "Environment", slug: "environment", translationKey: "environment" },
    { name: "Health", slug: "health", translationKey: "health" },
    { name: "Arts & Culture", slug: "arts-culture", translationKey: "arts-culture" },
    { name: "Travel", slug: "travel", translationKey: "travel" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-gray-900/75">
      <nav className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-800 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">{t('site.name', 'MultiLingua')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  location === item.href
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                {t(item.translationKey)}
              </Link>
            ))}
            
            {/* Desktop Subjects Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                <span>{t("nav.subjects")}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.slug}
                      href={`/subject/${subject.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t(subject.translationKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            <SearchDialog />
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 top-[64px] bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === item.href
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.translationKey)}
              </Link>
            ))}
            
            {/* Mobile Subjects Menu */}
            <div className="space-y-1">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileSubjectsOpen(!mobileSubjectsOpen)}
              >
                <span>{t("nav.subjects")}</span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${
                    mobileSubjectsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`space-y-1 pl-4 ${
                  mobileSubjectsOpen ? "block" : "hidden"
                }`}
              >
                {subjects.map((subject) => (
                  <Link
                    key={subject.slug}
                    href={`/subject/${subject.slug}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(subject.translationKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
