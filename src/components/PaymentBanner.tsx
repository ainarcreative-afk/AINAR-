import React from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import { ShieldAlert, Check, Coins, Truck, FileCheck, ArrowRight } from 'lucide-react';

interface PaymentBannerProps {
  lang: Language;
}

export const PaymentBanner: React.FC<PaymentBannerProps> = ({ lang }) => {
  const t = translations[lang].paymentPolicy;

  return (
    <section className="py-10 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent dark:via-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 p-6 sm:p-8 lg:p-10 shadow-xl shadow-indigo-500/5 overflow-hidden">
          {/* Decorative side accent */}
          <div
            className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left/Start text */}
            <div className="lg:col-span-7 space-y-3 text-start">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Coins className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{t.badge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.mainRule}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.subtext}
              </p>

              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                {t.points.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right/End Visual Diagram for 50/50 breakdown */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                {lang === 'ar'
                  ? 'مخطط الدفع السهل والآمن'
                  : lang === 'fr'
                  ? 'Schéma de règlement sécurisé'
                  : 'Transparent Payment Flow'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Step 1: 50% deposit */}
                <div className="p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/80 text-start space-y-1">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    50%
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'ar'
                      ? 'عند تأكيد الطلب'
                      : lang === 'fr'
                      ? 'À la commande'
                      : 'Upon Order'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'ar'
                      ? 'عربون لبدء التصميم والتنفيذ'
                      : lang === 'fr'
                      ? 'Acompte pour validation et création'
                      : 'Deposit for design & production'}
                  </div>
                </div>

                {/* Step 2: 50% on receipt */}
                <div className="p-3.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/80 text-start space-y-1">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    50%
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'ar'
                      ? 'عند استلام الطلب'
                      : lang === 'fr'
                      ? 'À la livraison'
                      : 'Upon Delivery'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'ar'
                      ? '+ ثمن التوصيل مع شركة الشحن'
                      : lang === 'fr'
                      ? '+ frais de transporteur'
                      : '+ courier shipping fee'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                <Truck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  {lang === 'ar'
                    ? 'توصيل سريع مضمون مع معاينة الطرد لجميع الولايات'
                    : lang === 'fr'
                    ? 'Livraison rapide avec vérification du colis sur les 58 wilayas'
                    : 'Fast insured nationwide delivery with package inspection'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
