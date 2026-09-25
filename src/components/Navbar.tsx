import React, { useState } from 'react';
import { translations } from '../data/translations';
import { Language, Theme } from '../types';
import {
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  onOpenCalculator: () => void;
  onOpenUrgentOrder: () => void;
  onOpenAdmin: () => void;
  onOpenZimou?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  theme,
  toggleTheme,
  onOpenCalculator,
  onOpenUrgentOrder,
  onOpenAdmin,
  onOpenZimou,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const navLinks = [
    { href: '#services', label: t.services },
    { href: '#portfolio', label: t.portfolio },
    { href: '#calculator', label: t.calculator },
    { href: '#social', label: lang === 'ar' ? 'حساباتنا و QR' : 'Réseaux & QR' },
    { href: '#workflow', label: t.workflow },
    { href: '#faq', label: t.faq },
    { href: '#contact', label: t.contact },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Official Brand Logo with the Falcon/Eagle & Typography */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="AINAR CREATIVE Home"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-md border border-slate-200 dark:border-indigo-900/60 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.png"
                alt="AINAR CREATIVE Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-start">
              <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                AINAR CREATIVE
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'ar'
                  ? 'وكالة إعلانية اونلاين'
                  : lang === 'fr'
                  ? 'Agence Créative & Print'
                  : 'Creative & Advertising Agency'}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls: Lang, Theme, Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {(['ar', 'fr', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-1.5 sm:px-2 py-1 rounded-md transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={`Switch language to ${l.toUpperCase()}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle (White / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={theme === 'dark' ? 'Switch to light mode (White theme)' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'الوضع النهاري الأبيض (White)' : 'الوضع الليلي (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Admin shortcut button */}
          <button
            onClick={onOpenAdmin}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="حساب الإدارة والأسعار (Admin)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Admin</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-100" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-start px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>لوحة الإدارة (Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
