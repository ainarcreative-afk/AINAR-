import React from 'react';
import { translations } from '../data/translations';
import { socialLinks } from '../data/social';
import { Language } from '../types';
import { MessageCircle, ShieldCheck, Lock, Instagram, Facebook, QrCode } from 'lucide-react';
import { TikTokIcon } from './SocialMediaSection';

import { AgencyInfo } from '../data/customization';

interface FooterProps {
  lang: Language;
  agencyInfo?: AgencyInfo;
  onOpenAdmin: () => void;
  onOpenSocial?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, agencyInfo, onOpenAdmin }) => {
  const t = translations[lang].footer;
  const phone = agencyInfo?.phone || '0673187994';
  const email = agencyInfo?.email || 'ainarcreative@gmail.com';

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 text-start">
          {/* Col 1: Brand, Logo, Bio & Social Pills - 5 cols */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-indigo-900/60 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="AINAR CREATIVE Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AINAR CREATIVE
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Online Creative & Advertising Agency
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.about}
            </p>

            {/* Official Social Links Icons & QR Code */}
            <div className="pt-2 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {lang === 'ar' ? 'منصات التواصل الاجتماعي الرسمية:' : 'Réseaux sociaux officiels :'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* Instagram */}
                <a
                  href={socialLinks.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 transition-all hover:scale-105"
                  title="Instagram: @ainarcreative"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* TikTok */}
                <a
                  href={socialLinks.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all hover:scale-105"
                  title="TikTok: @ainarcreative"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href={socialLinks.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all hover:scale-105"
                  title="Facebook: AINAR CREATIVE"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/213673187994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hover:scale-105"
                  title="WhatsApp: 0673187994"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* QR Code Anchor */}
                <a
                  href="#social"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-800/80 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR CODE</span>
                </a>
              </div>
            </div>

            {/* Admin shortcut button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white font-semibold border border-slate-800 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.adminLink}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links - 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {translations[lang].nav.services}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  {translations[lang].nav.portfolio}
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  {translations[lang].nav.calculator}
                </a>
              </li>
              <li>
                <a href="#social" className="hover:text-white transition-colors">
                  {lang === 'ar' ? 'حسابات التواصل و QR Code' : 'Réseaux & QR Code'}
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  {translations[lang].nav.workflow}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {translations[lang].nav.faq}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {translations[lang].nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Policy Summary - 4 cols */}
          <div className="lg:col-span-4 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.paymentTermsTitle}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                {t.paymentSummary}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'ar'
                  ? 'عربون 50٪ عبر بريدي موب أو CCP عند تأكيد الطلب، ويسدد الباقي + ثمن التوصيل نقداً لشركة زيمو إكسبريس عند استلام الطلبية.'
                  : 'Acompte 50% par BaridiMob ou CCP à la commande, solde + livraison réglés en espèces à la livraison.'}
              </p>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div>📞 {phone}</div>
              <div>✉️ {email}</div>
              <div>🚚 شريك التوصيل: زيمو إكسبريس (Zimou Express)</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{t.rights}</div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {t.adminLink}
            </button>
            <span>AINAR CREATIVE AGENCY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
