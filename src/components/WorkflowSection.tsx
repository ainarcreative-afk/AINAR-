import React from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import { MessageSquare, CreditCard, Sparkles, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

interface WorkflowSectionProps {
  lang: Language;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ lang }) => {
  const t = translations[lang].workflow;
  const isRtl = lang === 'ar';

  const icons = [
    <MessageSquare key="1" className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    <CreditCard key="2" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    <Sparkles key="3" className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    <Truck key="4" className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
  ];

  return (
    <section id="workflow" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between text-start hover:border-indigo-500/50 transition-all hover:shadow-lg group"
            >
              <div>
                {/* Number & Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/80 group-hover:scale-110 transition-transform">
                    {icons[idx]}
                  </div>
                  <span className="text-3xl font-black text-indigo-200 dark:text-indigo-900 font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Special callout on 50% steps */}
              {idx === 1 && (
                <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-950/80 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {lang === 'ar'
                    ? 'عربون 50% عبر بريدي موب / CCP'
                    : lang === 'fr'
                    ? 'Acompte 50% BaridiMob/CCP'
                    : '50% Deposit BaridiMob/CCP'}
                </div>
              )}
              {idx === 3 && (
                <div className="mt-4 pt-3 border-t border-teal-100 dark:border-teal-950/80 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  {lang === 'ar'
                    ? 'دفع 50% نقداً + ثمن التوصيل'
                    : lang === 'fr'
                    ? 'Solde 50% + Frais à la livraison'
                    : 'Balance 50% + Shipping on delivery'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
