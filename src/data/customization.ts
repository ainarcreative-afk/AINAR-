import { portfolioProjects, ProjectItem } from './portfolio';

export interface SectionOrderItem {
  id: string;
  nameAr: string;
  nameFr: string;
  visible: boolean;
}

export interface AgencyInfo {
  phone: string;
  whatsappNumber: string;
  email: string;
  zimouProfileUrl: string;
  announcementText: string;
  agencyAddress: string;
}

export const defaultSectionOrder: SectionOrderItem[] = [
  { id: 'hero', nameAr: 'واجهة الموقع والبانر الترحيبي (Hero)', nameFr: 'Bannière d’accueil (Hero)', visible: true },
  { id: 'paymentBanner', nameAr: 'شريط سياسة الدفع المعتمدة (50%)', nameFr: 'Conditions de Paiement (50%)', visible: true },
  { id: 'services', nameAr: 'قسم الخدمات الإعلانية (7 خدمات)', nameFr: 'Services Publicitaires', visible: true },
  { id: 'calculator', nameAr: 'حاسبة الأسعار والطلب عبر الواتساب', nameFr: 'Calculateur WhatsApp', visible: true },
  { id: 'portfolio', nameAr: 'معرض الأعمال والمشاريع المنجزة', nameFr: 'Galerie Portfolio', visible: true },
  { id: 'social', nameAr: 'منصات التواصل الاجتماعي و QR Code', nameFr: 'Réseaux Sociaux & QR Code', visible: true },
  { id: 'workflow', nameAr: 'مراحل وخطوات تنفيذ العمل (4 خطوات)', nameFr: 'Processus de Travail', visible: true },
  { id: 'faq', nameAr: 'الأسئلة الشائعة (FAQ)', nameFr: 'Foire Aux Questions', visible: true },
  { id: 'contact', nameAr: 'معلومات التواصل المباشر', nameFr: 'Contact & Formulaire', visible: true },
];

export const defaultAgencyInfo: AgencyInfo = {
  phone: '0673187994',
  whatsappNumber: '213673187994',
  email: 'ainarcreative@gmail.com',
  zimouProfileUrl: 'https://zimou.express/panel/profile',
  announcementText: 'وكالة AINAR CREATIVE: تصميم وطباعة احترافية مع توصيل سريع لـ 58 ولاية عبر زيمو إكسبريس',
  agencyAddress: 'الجزائر - 58 ولاية',
};

const SECTIONS_KEY = 'ainar_admin_sections_order';
const PORTFOLIO_KEY = 'ainar_admin_portfolio_projects';
const AGENCY_INFO_KEY = 'ainar_admin_agency_info';

export const getStoredSectionOrder = (): SectionOrderItem[] => {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return defaultSectionOrder;
};

export const saveStoredSectionOrder = (order: SectionOrderItem[]) => {
  try {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(order));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredPortfolio = (): ProjectItem[] => {
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return portfolioProjects;
};

export const saveStoredPortfolio = (projects: ProjectItem[]) => {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredAgencyInfo = (): AgencyInfo => {
  try {
    const raw = localStorage.getItem(AGENCY_INFO_KEY);
    if (raw) return { ...defaultAgencyInfo, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return defaultAgencyInfo;
};

export const saveStoredAgencyInfo = (info: AgencyInfo) => {
  try {
    localStorage.setItem(AGENCY_INFO_KEY, JSON.stringify(info));
  } catch (e) {
    console.error(e);
  }
};
