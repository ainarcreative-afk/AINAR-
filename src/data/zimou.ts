export interface ZimouSettings {
  apiToken: string;
  isLinked: boolean;
  merchantName: string;
  accountEmail: string;
  storeName: string;
  defaultDeliveryType: 'home' | 'stopdesk';
  autoExportOrders: boolean;
}

export interface ZimouParcel {
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  wilaya: string;
  commune?: string;
  serviceTitle: string;
  amountToCollect: number; // Balance 50% + shipping
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  createdAt: string;
}

const ZIMOU_STORAGE_KEY = 'ainar_zimou_config_v1';
const ZIMOU_PARCELS_KEY = 'ainar_zimou_parcels_v1';

export const defaultZimouSettings: ZimouSettings = {
  apiToken: '',
  isLinked: true, // Configured for ainarcreative@gmail.com
  merchantName: 'AINAR CREATIVE',
  accountEmail: 'ainarcreative@gmail.com',
  storeName: 'AINAR CREATIVE Agency',
  defaultDeliveryType: 'home',
  autoExportOrders: true,
};

export const getZimouSettings = (): ZimouSettings => {
  if (typeof window === 'undefined') return defaultZimouSettings;
  try {
    const raw = localStorage.getItem(ZIMOU_STORAGE_KEY);
    if (!raw) return defaultZimouSettings;
    return { ...defaultZimouSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
    return defaultZimouSettings;
  }
};

export const saveZimouSettings = (settings: ZimouSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ZIMOU_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
};

export const getZimouParcels = (): ZimouParcel[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ZIMOU_PARCELS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const addZimouParcel = (parcel: ZimouParcel) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getZimouParcels();
    const updated = [parcel, ...current];
    localStorage.setItem(ZIMOU_PARCELS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};
