import React, { useState } from 'react';
import { Language } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  lang: Language;
  whatsappNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  lang,
  whatsappNumber = '213673187994',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const message =
    lang === 'ar'
      ? 'مرحباً AINAR CREATIVE، أود الاستفسار وطلب تسعيرة لخدماتكم الإعلانية.'
      : lang === 'fr'
      ? 'Bonjour AINAR CREATIVE, je souhaite obtenir un devis.'
      : 'Hello AINAR CREATIVE, I would like to get a quote.';

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="pointer-events-auto relative max-w-xs bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-2xl rounded-2xl p-3.5 text-start animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 end-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              AINAR CREATIVE
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight pe-4">
            {lang === 'ar'
              ? 'تواصل معنا فوراً عبر واتساب للرد على استفسارك!'
              : lang === 'fr'
              ? 'Contactez-nous sur WhatsApp pour une réponse rapide !'
              : 'Chat with us on WhatsApp for instant response!'}
          </p>
          <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            0673187994
          </div>
        </div>
      )}

      {/* Pulsing floating button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all transform active:scale-95 focus:ring-4 focus:ring-emerald-400/40"
        aria-label="WhatsApp Contact 0673187994"
      >
        <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>
        <MessageCircle className="w-6 h-6 shrink-0 fill-current" />
        <span className="hidden sm:inline-block text-xs font-bold font-mono tracking-wide">
          0673187994
        </span>
      </a>
    </div>
  );
};
