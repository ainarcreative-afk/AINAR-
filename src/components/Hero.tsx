import React from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import {
  MessageCircle,
  Calculator,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface HeroProps {
  lang: Language;
  onOpenCalculator: () => void;
  onOpenUrgentOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenCalculator,
  onOpenUrgentOrder,
}) => {
  const t = translations[lang].hero;

  const whatsappHeroUrl =
    'https://wa.me/213673187994?text=' +
    encodeURIComponent(
      lang === 'ar'
        ? 'مرحباً AINAR CREATIVE، أود طلب استشارة أو تسعيرة لأحد خدماتكم الإعلانية.'
        : lang === 'fr'
        ? 'Bonjour AINAR CREATIVE, je souhaite obtenir un devis pour mes supports de communication.'
        : 'Hello AINAR CREATIVE, I would like to get a quote for advertising design and printing.'
    );

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
      {/* Subtle blue & purple ambient glow backgrounds */}
      <div
        className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-10 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Hero Copy - 7 cols */}
          <div className="lg:col-span-7 space-y-6 text-start">
            {/* Top agency kicker & urgent badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.badge}</span>
              </div>

              <button
                onClick={onOpenUrgentOrder}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{translations[lang].nav.urgentOrder}</span>
              </button>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.titlePrimary}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                {t.titleAccent}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenCalculator}
                className="cursor-pointer px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.ctaPrimary}</span>
              </button>

              <a
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>{t.ctaSecondary}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={onOpenUrgentOrder}
                className="cursor-pointer px-4 py-3.5 rounded-xl font-bold text-xs text-amber-950 dark:text-amber-100 bg-amber-400 hover:bg-amber-500 border border-amber-500/50 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                title="طلب مستعجل VIP بأولوية تسليم قصوى"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'ar' ? 'طلب مستعجل ⚡' : 'Commande Express ⚡'}</span>
              </button>
            </div>

            {/* Clean Metrics / Proof Strip */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{t.stats.projects}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{t.stats.quality}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{t.stats.delivery}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{t.stats.satisfaction}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset: Official Logo Showcase Card - 5 cols */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl p-3 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-600/30 dark:to-purple-600/30 shadow-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800">
                {/* Official Logo emblem */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/logo.png"
                    alt="AINAR CREATIVE Official Logo"
                    className="w-full h-full object-contain filter drop-shadow-xl"
                  />
                </div>

                {/* Subtitle */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    AINAR CREATIVE
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    {lang === 'ar' ? 'الهوية الرسمية للوكالة' : 'Official Agency Identity'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    {lang === 'ar'
                      ? 'تصميم إشهاري، طباعة حرارية، واجهات محلات ومواقع'
                      : 'Design graphique, flocage, enseignes & web design'}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="mt-6 w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">
                    📞 0673187994
                  </span>
                  <a
                    href="https://wa.me/213673187994"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all"
                  >
                    تواصل الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
