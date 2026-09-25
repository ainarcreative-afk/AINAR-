import React, { useState } from 'react';
import { translations } from '../data/translations';
import { ServiceConfig } from '../data/services';
import { Language, ServiceMode } from '../types';
import {
  Shirt,
  CreditCard,
  Store,
  BookOpen,
  Share2,
  Globe,
  Coffee,
  CheckCircle,
  X,
  MessageCircle,
  Zap,
  Paintbrush,
  Printer,
} from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
  services: ServiceConfig[];
  onSelectServiceForOrder: (serviceKey: string, isUrgent?: boolean, mode?: ServiceMode) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  services,
  onSelectServiceForOrder,
}) => {
  const t = translations[lang].services;
  const [activeModalService, setActiveModalService] = useState<ServiceConfig | null>(null);

  const getIcon = (key: string) => {
    switch (key) {
      case 'apparel':
        return <Shirt className="w-5 h-5" />;
      case 'cards':
        return <CreditCard className="w-5 h-5" />;
      case 'storefront':
        return <Store className="w-5 h-5" />;
      case 'books':
        return <BookOpen className="w-5 h-5" />;
      case 'social':
        return <Share2 className="w-5 h-5" />;
      case 'web':
        return <Globe className="w-5 h-5" />;
      case 'mugs':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Shirt className="w-5 h-5" />;
    }
  };

  const getServiceContent = (key: keyof typeof t.items) => {
    return t.items[key] || t.items.apparel;
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Services Grid (7 items including books and updated starting prices) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((svc) => {
            const itemContent = getServiceContent(svc.key);
            const displayTitle = (lang === 'ar' && svc.customTitleAr) ? svc.customTitleAr : itemContent.title;
            const displayDesc = (lang === 'ar' && svc.customDescAr) ? svc.customDescAr : itemContent.desc;
            const displayBullets = (lang === 'ar' && svc.customBulletsAr && svc.customBulletsAr.length > 0) ? svc.customBulletsAr : itemContent.bullets;

            return (
              <div
                key={svc.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden text-start"
              >
                {/* Image Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-800">
                  <img
                    src={svc.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Service icon tag */}
                  <div className="absolute top-3 start-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 shadow-md">
                    {getIcon(svc.key)}
                  </div>

                  {/* Starting price tag */}
                  <div className="absolute bottom-3 end-3 px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                    <span className="text-slate-300 font-normal">{t.startingFrom} </span>
                    <span className="text-indigo-300 font-bold tabular-nums">
                      {svc.startingPrice.toLocaleString()} {t.dzd}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>

                    {/* Bullets */}
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {displayBullets.slice(0, 3).map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions: Distinct Design Only & Design + Print Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {/* For apparel, books, storefront, cards, mugs: provide explicit dual buttons */}
                    {['apparel', 'books', 'storefront', 'cards', 'mugs'].includes(svc.key) ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectServiceForOrder(svc.id, false, 'design_only')}
                          className="cursor-pointer py-2 px-2 rounded-lg text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-1 transition-all text-center"
                          title={lang === 'ar' ? 'طلب التصميم الجرافيكي فقط بصيغ جاهزة' : 'Commander le design graphique seul'}
                        >
                          <Paintbrush className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="line-clamp-1">{lang === 'ar' ? 'التصميم فقط' : lang === 'fr' ? 'Design seul' : 'Design Only'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectServiceForOrder(svc.id, false, 'design_and_print')}
                          className="cursor-pointer py-2 px-2 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm flex items-center justify-center gap-1 transition-all text-center"
                          title={lang === 'ar' ? 'طلب التصميم مع الطباعة والتوصيل' : 'Commander la conception + impression'}
                        >
                          <Printer className="w-3 h-3 text-white shrink-0" />
                          <span className="line-clamp-1">{lang === 'ar' ? 'تصميم + طباعة' : lang === 'fr' ? 'Design + Print' : 'Design + Print'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectServiceForOrder(svc.id, false)}
                          className="cursor-pointer flex-1 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                        >
                          {t.orderThis}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalService(svc)}
                        className="cursor-pointer flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                      >
                        {t.viewDetails}
                      </button>

                      {/* Urgent Order quick button */}
                      <button
                        onClick={() => onSelectServiceForOrder(svc.id, true)}
                        className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300/80 dark:border-amber-800/80 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title={translations[lang].nav.urgentOrder}
                      >
                        <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>{lang === 'ar' ? 'مستعجل ⚡' : 'Express ⚡'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-start">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/9 w-full overflow-hidden bg-slate-900">
              <img
                src={activeModalService.image}
                alt="Service showcase"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {getIcon(activeModalService.key)}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {(lang === 'ar' && activeModalService.customTitleAr)
                    ? activeModalService.customTitleAr
                    : getServiceContent(activeModalService.key).title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {(lang === 'ar' && activeModalService.customDescAr)
                  ? activeModalService.customDescAr
                  : getServiceContent(activeModalService.key).desc}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'ar'
                    ? 'المميزات والمواصفات'
                    : lang === 'fr'
                    ? 'Caractéristiques & Spécifications'
                    : 'Features & Specifications'}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-200">
                  {((lang === 'ar' && activeModalService.customBulletsAr && activeModalService.customBulletsAr.length > 0)
                    ? activeModalService.customBulletsAr
                    : getServiceContent(activeModalService.key).bullets
                  ).map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Reminder in Modal */}
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300">
                <strong>{translations[lang].hero.paymentNotice}</strong>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {t.startingFrom}
                  </span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    {activeModalService.startingPrice.toLocaleString()} {t.dzd}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      / {getServiceContent(activeModalService.key).unit}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['apparel', 'books', 'storefront', 'cards', 'mugs'].includes(activeModalService.key) ? (
                    <>
                      <button
                        onClick={() => {
                          const svcId = activeModalService.id;
                          setActiveModalService(null);
                          onSelectServiceForOrder(svcId, false, 'design_only');
                        }}
                        className="cursor-pointer py-2 px-3 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-all"
                      >
                        <Paintbrush className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'طلب التصميم فقط' : lang === 'fr' ? 'Design Seul' : 'Design Only'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const svcId = activeModalService.id;
                          setActiveModalService(null);
                          onSelectServiceForOrder(svcId, false, 'design_and_print');
                        }}
                        className="cursor-pointer py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5 text-white" />
                        <span>{lang === 'ar' ? 'تصميم + طباعة وتوصيل' : lang === 'fr' ? 'Design + Impression' : 'Design + Print'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        const svcId = activeModalService.id;
                        setActiveModalService(null);
                        onSelectServiceForOrder(svcId, false);
                      }}
                      className="cursor-pointer py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {t.orderThis}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const svcId = activeModalService.id;
                      setActiveModalService(null);
                      onSelectServiceForOrder(svcId, true);
                    }}
                    className="cursor-pointer py-2 px-3 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{translations[lang].nav.urgentOrder}</span>
                  </button>

                  <a
                    href={`https://wa.me/213673187994?text=${encodeURIComponent(
                      `مرحباً AINAR CREATIVE، أود الاستفسار عن خدمة: ${
                        getServiceContent(activeModalService.key).title
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer py-2.5 px-3 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
