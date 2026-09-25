export type Language = 'ar' | 'fr' | 'en';
export type Theme = 'dark' | 'light';

export type ServiceKey = 'apparel' | 'cards' | 'storefront' | 'books' | 'social' | 'web' | 'mugs';

export type ServiceMode = 'design_only' | 'design_and_print';

export interface ServiceOption {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  basePrice: number; // in DZD
  minQuantity: number;
  unitStep: number;
  mode?: ServiceMode; // 'design_only' or 'design_and_print'
}

export interface ServiceConfig {
  id: string;
  key: ServiceKey;
  icon: string;
  image: string;
  startingPrice: number;
  customTitleAr?: string;
  customDescAr?: string;
  customBulletsAr?: string[];
  options: ServiceOption[];
}

export interface ServiceItem {
  id: string;
  category: 'apparel' | 'cards' | 'storefront' | 'books' | 'social' | 'web' | 'mugs';
  titleKey: string;
  descKey: string;
  bulletsKey: string[];
  startingPrice: number; // in DZD
  currency: string;
  image: string;
  unitKey: string;
  tags: string[];
}

export interface PortfolioItem {
  id: string;
  titleKey: string;
  category: 'apparel' | 'cards' | 'storefront' | 'books' | 'social' | 'web' | 'mugs';
  clientName: string;
  descKey: string;
  image: string;
  specs: string[];
}

export interface OrderState {
  serviceId: string;
  quantity: number;
  selectedOption: string;
  fullName: string;
  phone: string;
  wilaya: string;
  notes: string;
  isUrgent?: boolean;
}
