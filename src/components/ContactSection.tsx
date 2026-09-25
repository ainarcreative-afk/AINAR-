import React from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import { AgencyInfo } from '../data/customization';
import { MessageCircle, Phone, Mail, Clock, MapPin, Send } from 'lucide-react';

interface ContactSectionProps {
  lang: Language;
  agencyInfo?: AgencyInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  agencyInfo,
}) => {
  const t = translations[lang].contact;

  const phone = agencyInfo?.phone || '0673187994';
  const whatsappNum = agencyInfo?.whatsappNumber || '213673187994';
  const email = agencyInfo?.email || 'ainarcreative@gmail.com';
  const address = agencyInfo?.agencyAddress || (lang === 'ar' ? 'الجزائر - 58 ولاية' : 'Algérie - 58 Wilayas');

  const quickTopics = [
    {
      labelAr: '👕 تصميم وطباعة الأقمصة',
      labelFr: '👕 T-shirts & Vêtements',
      labelEn: '👕 Apparel & T-shirts',
      text: 'مرحباً AINAR CREATIVE، أود الاستفسار وطلب تسعيرة لتصميم وطباعة الأقمصة.',
    },
    {
      labelAr: '💳 بطاقات العمل والشكر',
      labelFr: '💳 Cartes de visite',
      labelEn: '💳 Business & Thank You Cards',
      text: 'مرحباً AINAR CREATIVE، أريد تصميم وطباعة بطاقات عمل وبطاقات شكر لمتجري.',
    },
    {
      labelAr: '🏪 واجهات المحلات واللافتات',
      labelFr: '🏪 Façades & Enseignes',
      labelEn: '🏪 Storefront & Signage',
      text: 'مرحباً AINAR CREATIVE، أود استشارة وتسعيرة لتصميم وتنفيذ واجهة محل إعلانية.',
    },
    {
      labelAr: '☕ طباعة الكؤوس والمستلزمات',
      labelFr: '☕ Impression sur Mugs',
      labelEn: '☕ Custom Mug Printing',
      text: 'مرحباً AINAR CREATIVE، أريد الاستفسار عن طباعة كؤوس سيراميك مخصصة.',
    },
    {
      labelAr: '📱 بوستات السوشيال ميديا',
      labelFr: '📱 Réseaux Sociaux',
      labelEn: '📱 Social Media Packs',
      text: 'مرحباً AINAR CREATIVE، أود التعاقد على باقة تصاميم سوشيال ميديا وهوية بصرية.',
    },
    {
      labelAr: '🌐 تصميم وتطوير المواقع',
      labelFr: '🌐 Création de Sites Web',
      labelEn: '🌐 Website Design',
      text: 'مرحباً AINAR CREATIVE، أرغب في إنشاء موقع إلكتروني تعريفي / متجر.',
    },
  ];

  const getTopicLabel = (topic: typeof quickTopics[0]) => {
    if (lang === 'ar') return topic.labelAr;
    if (lang === 'fr') return topic.labelFr;
    return topic.labelEn;
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Direct WhatsApp Card - 7 cols */}
          <div className="lg:col-span-7 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50 flex flex-col justify-between text-start space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {lang === 'ar'
                    ? 'متواجدون الآن عبر واتساب'
                    : lang === 'fr'
                    ? 'En ligne sur WhatsApp'
                    : 'Online on WhatsApp'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {t.whatsappDirect}:{' '}
                <span className="text-emerald-400 font-mono tracking-wider">
                  {phone}
                </span>
              </h3>

              <p className="text-sm text-indigo-200 leading-relaxed max-w-xl">
                {agencyInfo?.announcementText || t.whatsappDesc}
              </p>
            </div>

            {/* Quick Topic Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {lang === 'ar'
                  ? 'اختر موضوع محادثتك للبدء السريع:'
                  : lang === 'fr'
                  ? 'Choisissez votre sujet pour un démarrage rapide :'
                  : 'Select your inquiry topic to chat immediately:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickTopics.map((topic, i) => (
                  <a
                    key={i}
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                      topic.text
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all flex items-center justify-between group"
                  >
                    <span>{getTopicLabel(topic)}</span>
                    <Send className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Big Launch Button */}
            <div>
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>
                  {lang === 'ar'
                    ? `فتح محادثة واتساب فورية (${phone})`
                    : lang === 'fr'
                    ? `Démarrer la discussion WhatsApp (${phone})`
                    : `Open WhatsApp Chat Now (${phone})`}
                </span>
              </a>
            </div>
          </div>

          {/* Direct Agency Credentials Card - 5 cols */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between text-start space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'قنوات الاتصال المباشرة' : lang === 'fr' ? 'Canaux Directs' : 'Direct Channels'}
              </h3>

              <div className="space-y-4">
                {/* Phone Call */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.callUs}
                    </span>
                    <a
                      href={`tel:${phone}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 tabular-nums"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.emailUs}
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {lang === 'ar' ? 'ساعات العمل' : lang === 'fr' ? 'Horaires d’ouverture' : 'Operating Hours'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {t.hours}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.location}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Commitment Banner */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-bold block mb-1">
                {lang === 'ar' ? '⭐ ضمان جودة التنفيذ 100%' : '⭐ Garantie d’excellence 100%'}
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                {lang === 'ar'
                  ? 'لا يتم إرسال أي تصميم للمطبعة إلا بعد معاينتك وموافقتك الكاملة عليه.'
                  : 'Aucun tirage n’est lancé sans votre bon à tirer (BAT) validé.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
