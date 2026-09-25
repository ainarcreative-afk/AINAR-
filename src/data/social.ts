export interface SocialLink {
  id: string;
  name: string;
  nameAr: string;
  handle: string;
  url: string;
  shortDisplay: string;
  color: string;
  hoverBorder: string;
  qrUrl: string;
}

// Clean production app URL
export const CLEAN_APP_URL = 'https://ais-pre-u5mtuds2qrr46wfsybhs7c-554345431209.europe-west3.run.app';
export const SHORT_BRAND_URL = 'ainarcreative.com';

export const socialLinks = {
  website: {
    id: 'website',
    name: 'Website',
    nameAr: 'الموقع الرسمي للوكالة',
    handle: SHORT_BRAND_URL,
    shortDisplay: 'ainar-creative',
    url: CLEAN_APP_URL,
    color: 'from-blue-600 to-indigo-700',
    hoverBorder: 'hover:border-indigo-500/50',
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      CLEAN_APP_URL
    )}`,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    nameAr: 'انستغرام',
    handle: '@ainarcreative',
    shortDisplay: 'instagram.com/ainarcreative',
    url: 'https://www.instagram.com/ainarcreative?stkn=MTl0dmRmNHZ1eGgwMg==',
    color: 'from-pink-500 via-rose-500 to-amber-500',
    hoverBorder: 'hover:border-pink-500/50',
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      'https://www.instagram.com/ainarcreative?stkn=MTl0dmRmNHZ1eGgwMg=='
    )}`,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    nameAr: 'تيك توك',
    handle: '@ainarcreative',
    shortDisplay: 'tiktok.com/@ainarcreative',
    url: 'https://vm.tiktok.com/ZS9Amgug2dKrw-ljSQF/',
    color: 'from-cyan-400 via-slate-900 to-rose-500',
    hoverBorder: 'hover:border-cyan-500/50',
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      'https://vm.tiktok.com/ZS9Amgug2dKrw-ljSQF/'
    )}`,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    nameAr: 'فايسبوك',
    handle: 'AINAR CREATIVE',
    shortDisplay: 'facebook.com/ainarcreative',
    url: 'https://www.facebook.com/share/18dYgqFF8C/',
    color: 'from-blue-600 to-indigo-600',
    hoverBorder: 'hover:border-blue-500/50',
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      'https://www.facebook.com/share/18dYgqFF8C/'
    )}`,
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    nameAr: 'واتساب',
    handle: '0673187994',
    shortDisplay: 'wa.me/213673187994',
    url: 'https://wa.me/213673187994',
    color: 'from-emerald-500 to-teal-600',
    hoverBorder: 'hover:border-emerald-500/50',
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      'https://wa.me/213673187994'
    )}`,
  },
};
