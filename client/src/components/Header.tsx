import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
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

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "About", href: "/about", translationKey: "nav.about" },
    { label: "Subjects", href: "/subject", translationKey: "nav.subjects" },
    { label: "Popular", href: "/popular", translationKey: "nav.popular" },
    { label: "Recent", href: "/recent", translationKey: "nav.recent" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl">{t('site.name')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {t('nav.menu')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full">
                      {t(item.translationKey)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <SearchDialog />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <SearchDialog />
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
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
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.translationKey)}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}