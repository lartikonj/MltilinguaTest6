import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Globe, Menu, ChevronDown, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { SearchDialog } from "./SearchDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Navigation items
  const navItems: NavItem[] = [
    { label: "Home", href: "/", translationKey: "nav.home" },
    { label: "Popular", href: "/popular", translationKey: "nav.popular" },
    { label: "Recent", href: "/recent", translationKey: "nav.recent" },
    { label: "About", href: "/about", translationKey: "nav.about" }
  ];

  // Subjects for dropdown
  const subjects: SubjectNavItem[] = [
    { name: "Technology", slug: "technology", translationKey: "technology" },
    { name: "Science", slug: "science", translationKey: "science" },
    { name: "Environment", slug: "environment", translationKey: "environment" },
    { name: "Health", slug: "health", translationKey: "health" },
    { name: "Arts & Culture", slug: "arts-culture", translationKey: "arts-culture" },
    { name: "Travel", slug: "travel", translationKey: "travel" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSubjects = () => {
    setMobileSubjectsOpen(!mobileSubjectsOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-gray-900/75">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Globe className="text-white" />
              </div>
              <span className="font-bold text-xl">{t('site.name', 'MultiLingua')}</span>
            </Link>
          </div>

          {/* Main navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium ${
                  location === item.href
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                } transition-colors`}
              >
                {t(item.translationKey)}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 gap-1">
                  {t("nav.subjects")}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {subjects.map((subject) => (
                  <DropdownMenuItem key={subject.slug} asChild>
                    <Link href={`/subject/${subject.slug}`} className="cursor-pointer">
                      {t(subject.translationKey)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* User controls */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <SearchDialog />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="default"
              size="icon"
              className="md:hidden bg-primary-500 hover:bg-primary-600 text-white ml-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 absolute w-full left-0 top-16 z-50">
          <div className="py-3 px-3 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2 px-3 font-medium text-sm rounded-md transition-colors ${
                  location === item.href
                    ? "bg-primary-500 text-white"
                    : "text-gray-800 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.translationKey)}
              </Link>
            ))}

            {/* Mobile subjects dropdown */}
            <button
              className="flex w-full items-center justify-between py-2.5 px-4 font-medium text-base rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMobileSubjects}
            >
              {t('nav.subjects')}
              <ChevronDown className={`h-5 w-5 transform transition-transform ${mobileSubjectsOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileSubjectsOpen && (
              <div className="pl-6 pr-4 space-y-2">
                {subjects.map((subject) => (
                  <Link
                    key={subject.slug}
                    href={`/subject/${subject.slug}`}
                    className="block py-2 px-4 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(subject.translationKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}