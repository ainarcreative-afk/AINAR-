import React, { useState } from 'react';
import { socialLinks } from '../data/social';
import { Language } from '../types';
import {
  QrCode,
  ExternalLink,
  Instagram,
  Facebook,
  Share2,
  Check,
  Copy,
  Globe,
  Sparkles,
} from 'lucide-react';

// Custom TikTok SVG Icon
export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

interface SocialMediaSectionProps {
  lang: Language;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ lang }) => {
  const [selectedSocial, setSelectedSocial] = useState<'website' | 'instagram' | 'tiktok' | 'facebook' | 'whatsapp'>('website');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = socialLinks[selectedSocial];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="social" className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Share2 className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'تابعنا وتواصل معنا عبر منصات التواصل والموقع'
                : lang === 'fr'
                ? 'Rejoignez notre communauté sur les réseaux'
                : 'Connect with AINAR CREATIVE on Social Media'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar'
              ? 'حساباتنا الرسمية + رمز الاستجابة السريعة (QR Code)'
              : lang === 'fr'
              ? 'Nos Réseaux Sociaux & Scanner QR Code'
              : 'Official Channels & Instant QR Scan'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {lang === 'ar'
              ? 'امسح الـ QR Code بكاميرا هاتفك أو انقر لمتابعة جديد تصاميمنا وأعمالنا على انستغرام، تيك توك، فايسبوك أو مشاركة الموقع فوراً'
              : lang === 'fr'
              ? 'Scannez le QR code avec votre téléphone ou cliquez pour explorer nos réalisations sur Instagram, TikTok et Facebook'
              : 'Scan the QR code with your phone camera or click to follow our latest work on Instagram, TikTok, and Facebook'}
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left/Start: Social Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-3 text-start">
            {/* Website Direct Clean URL & QR Card */}
            <div
              onClick={() => setSelectedSocial('website')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedSocial === 'website'
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 shadow-xl shadow-indigo-500/10'
                  : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'رابط الموقع الرسمي للوكالة' : 'Site Web Officiel'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                      الموقع الرسمي
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    ainarcreative.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                  <QrCode className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Instagram Card */}
            <div
              onClick={() => setSelectedSocial('instagram')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedSocial === 'instagram'
                  ? 'bg-white dark:bg-slate-800 border-pink-500 shadow-xl shadow-pink-500/10'
                  : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'انستغرام (Instagram)' : 'Instagram'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 font-bold">
                      الأكثر نشاطاً
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    @ainarcreative
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={socialLinks.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 transition-colors"
                  title="فتح في انستغرام"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* TikTok Card */}
            <div
              onClick={() => setSelectedSocial('tiktok')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedSocial === 'tiktok'
                  ? 'bg-white dark:bg-slate-800 border-cyan-500 shadow-xl shadow-cyan-500/10'
                  : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-cyan-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-md shrink-0 border border-slate-700">
                  <TikTokIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'تيك توك (TikTok)' : 'TikTok'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-bold">
                      فيديوهات وأعمال
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    @ainarcreative
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={socialLinks.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-600 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80 transition-colors"
                  title="فتح في تيك توك"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Facebook Card */}
            <div
              onClick={() => setSelectedSocial('facebook')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedSocial === 'facebook'
                  ? 'bg-white dark:bg-slate-800 border-blue-600 shadow-xl shadow-blue-500/10'
                  : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Facebook className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'فايسبوك (Facebook)' : 'Facebook'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold">
                      الصفحة الرسمية
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    AINAR CREATIVE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={socialLinks.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 transition-colors"
                  title="فتح في فايسبوك"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right/End: Interactive QR CODE Card with embedded official Falcon Logo in center (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl shadow-indigo-500/10 text-center space-y-5 relative overflow-hidden">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR CODE {active.name.toUpperCase()}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? `امسح للوصول إلى ${active.nameAr}`
                  : `Scannez pour ouvrir ${active.name}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'وجّه كاميرا هاتفك مباشرة نحو الرمز أدناه'
                  : 'Pointez l’appareil photo de votre smartphone'}
              </p>
            </div>

            {/* QR Code Container with High-Res Image & Logo In Center */}
            <div className="relative mx-auto w-60 h-60 p-4 rounded-2xl bg-white border-4 border-slate-900 dark:border-indigo-400/40 shadow-xl flex items-center justify-center">
              <img
                src={active.qrUrl}
                alt={`QR Code for ${active.name}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {/* Logo emblem in center */}
              <div className="absolute w-12 h-12 rounded-lg bg-white p-0.5 shadow-md border border-slate-200 flex items-center justify-center overflow-hidden pointer-events-none">
                <img
                  src="/logo.png"
                  alt="Ainar Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Buttons: Direct Link & Copy */}
            <div className="space-y-2 pt-1">
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>
                  {lang === 'ar'
                    ? `فتح رابط ${active.nameAr} مباشرة`
                    : `Visiter le profil ${active.name}`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(active.url, active.id)}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedId === active.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lang === 'ar' ? 'تم نسخ الرابط النظيف!' : 'Lien copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'نسخ رابط الموقع' : 'Copier le lien'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
