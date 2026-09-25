import tshirtImg from '../assets/images/tshirt_apparel_mockup_1790190864244.jpg';
import cardsImg from '../assets/images/business_cards_mockup_1790190874268.jpg';
import storefrontImg from '../assets/images/storefront_facade_sign_1790190885491.jpg';
import bookCoverImg from '../assets/images/book_magazine_cover_1790191774183.jpg';
import mugsImg from '../assets/images/mug_printing_mockup_1790190896098.jpg';
import studioImg from '../assets/images/hero_agency_studio_1790190851540.jpg';
import { ServiceConfig, ServiceOption } from '../types';

export type { ServiceConfig, ServiceOption };

export type UrgentFeeType = 'fixed' | 'percentage';

export interface UrgentFeeConfig {
  type: UrgentFeeType;
  value: number; // e.g., 1500 for fixed, or 20 for 20%
}

export const DEFAULT_URGENT_CONFIG: UrgentFeeConfig = {
  type: 'fixed',
  value: 1500,
};

export const DEFAULT_URGENT_FEE = 1500; // fallback backwards compatibility
const URGENT_CONFIG_KEY = 'ainar_urgent_fee_config_v2';
const URGENT_FEE_KEY = 'ainar_urgent_fee_dzd';

export const getStoredUrgentConfig = (): UrgentFeeConfig => {
  if (typeof window === 'undefined') return DEFAULT_URGENT_CONFIG;
  try {
    const raw = localStorage.getItem(URGENT_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.type === 'fixed' || parsed.type === 'percentage')) {
        return {
          type: parsed.type,
          value: Math.max(0, Number(parsed.value) || 0),
        };
      }
    }
    // Fallback to legacy key if exists
    const legacyVal = localStorage.getItem(URGENT_FEE_KEY);
    if (legacyVal !== null) {
      const num = Number(legacyVal);
      if (!isNaN(num) && num >= 0) return { type: 'fixed', value: num };
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_URGENT_CONFIG;
};

export const saveStoredUrgentConfig = (config: UrgentFeeConfig) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(URGENT_CONFIG_KEY, JSON.stringify(config));
    if (config.type === 'fixed') {
      localStorage.setItem(URGENT_FEE_KEY, String(config.value));
    }
  } catch (e) {
    console.error(e);
  }
};

export const getStoredUrgentFee = (): number => {
  return getStoredUrgentConfig().value;
};

export const saveStoredUrgentFee = (fee: number) => {
  saveStoredUrgentConfig({ type: 'fixed', value: fee });
};

export const defaultServicesData: ServiceConfig[] = [
  {
    id: 'apparel',
    key: 'apparel',
    icon: 'Shirt',
    image: tshirtImg,
    startingPrice: 1500, // Design only starts at 1,500 DZD
    options: [
      // Design Only
      {
        id: 'apparel_design_only',
        nameAr: 'تصميم جرافيك فقط: تيشيرت / هودي (ملف فكتور عالي الدقة جاهز للمطبعة PNG/PDF/AI)',
        nameFr: 'Design Graphique Seul : T-shirt / Hoodie (Fichier Vectoriel HD 300DPI)',
        nameEn: 'Graphic Design Only: T-Shirt / Hoodie (Print-ready Vector AI/PDF)',
        basePrice: 1500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      // Design + Print
      {
        id: 'tshirt_dtf_single',
        nameAr: 'تصميم + طباعة: تيشيرت قطن فاخر 100% + طباعة DTF كاملة الألوان (جهة واحدة)',
        nameFr: 'Design + Impression : T-Shirt Coton Premium 100% + Impression DTF 1 face',
        nameEn: 'Design + Print: 100% Cotton Premium T-Shirt + Single-side DTF Print',
        basePrice: 2500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'tshirt_dtf_double',
        nameAr: 'تصميم + طباعة: تيشيرت قطن ممشط فاخر + طباعة جهتين (أمام وخلف)',
        nameFr: 'Design + Impression : T-Shirt Coton Peigné + Impression Recto/Verso',
        nameEn: 'Design + Print: Combed Cotton T-Shirt + Double-side Print (Front & Back)',
        basePrice: 3000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'hoodie_custom',
        nameAr: 'تصميم + طباعة: هودي شتوي قطن سميك مبطن + ألوان فائقة الثبات',
        nameFr: 'Design + Impression : Hoodie épais molletonné + Impression premium',
        nameEn: 'Design + Print: Heavyweight Winter Hoodie + Custom High-durability Print',
        basePrice: 4500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'apparel_bulk',
        nameAr: 'تصميم + طباعة باقة شركات وأقمصة عمل (10 قمصان فأكثر - سعر القميص)',
        nameFr: 'Design + Impression : Pack Entreprise (dès 10 pièces - prix par unité)',
        nameEn: 'Design + Print: Corporate Pack (10+ pieces - bulk unit price)',
        basePrice: 2200,
        minQuantity: 10,
        unitStep: 5,
        mode: 'design_and_print',
      },
    ],
  },
  {
    id: 'cards',
    key: 'cards',
    icon: 'CreditCard',
    image: cardsImg,
    startingPrice: 1200, // Design only starting at 1200 DZD
    options: [
      // Design Only
      {
        id: 'cards_design_only',
        nameAr: 'تصميم جرافيك فقط: بطاقة عمل أو شكر وجهين (ملف مطبعة جاهز 300DPI CMYK)',
        nameFr: 'Design Graphique Seul : Carte de visite / remerciement (Fichier PDF/AI prêt presse)',
        nameEn: 'Graphic Design Only: Business / Thank-you Card (300DPI Press-ready)',
        basePrice: 1200,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      // Design + Print
      {
        id: 'cards_standard_100',
        nameAr: 'تصميم + طباعة: 100 بطاقة عمل (ورق كوشيه 350g + سلوفان مات جهتين)',
        nameFr: 'Design + Impression : 100 Cartes de visite (Papier 350g mat recto/verso)',
        nameEn: 'Design + Print: 100 Business Cards (350g Matte Laminated Double-sided)',
        basePrice: 2000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'cards_premium_500',
        nameAr: 'تصميم + طباعة: 500 بطاقة عمل احترافية + تشطيب لامع أو مات أنيق',
        nameFr: 'Design + Impression : 500 Cartes professionnelles + Pelliculage haute qualité',
        nameEn: 'Design + Print: 500 Premium Business Cards + Glossy or Matte Touch',
        basePrice: 5500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'cards_gold_foil_100',
        nameAr: 'تصميم + طباعة: 100 بطاقة VIP بختم فويل ذهبي أو فضي بارز (Dorure à chaud)',
        nameFr: 'Design + Impression : 100 Cartes Luxe VIP avec Dorure or/argent à chaud',
        nameEn: 'Design + Print: 100 Luxury VIP Cards with Hot Gold/Silver Foil Stamp',
        basePrice: 4500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'cards_thankyou_ecom_200',
        nameAr: 'تصميم + طباعة: 200 بطاقة شكر أنيقة لمتاجر التجارة الإلكترونية (Thank You Cards)',
        nameFr: 'Design + Impression : 200 Cartes de remerciement E-Commerce & Boutiques',
        nameEn: 'Design + Print: 200 E-Commerce Thank You Customer Loyalty Cards',
        basePrice: 3200,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
    ],
  },
  {
    id: 'storefront',
    key: 'storefront',
    icon: 'Store',
    image: storefrontImg,
    startingPrice: 3500, // Design only starts at 3,500 DZD
    options: [
      // Design Only
      {
        id: 'storefront_design_only',
        nameAr: 'تصميم جرافيك فقط: لافتة واجهة أو أوتوكولون أو وان واي (بالمقاسات الدقيقة وملفات التنفيذ)',
        nameFr: 'Design Graphique Seul : Maquette Façade / Bâche / One Way (Dimensions réelles CMYK)',
        nameEn: 'Graphic Design Only: Storefront / Banner / One Way (Full Scale CMYK Print File)',
        basePrice: 3500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      // Design + Print
      {
        id: 'banner_bache_basic',
        nameAr: 'تصميم + طباعة: لافتة واجهة إعلانية باش كوري متين ومقاوم للشمس والأمطار',
        nameFr: 'Design + Impression : Bâche publicitaire tendue haute résistance UV & pluie',
        nameEn: 'Design + Print: Heavy-duty Outdoor Vinyl Banner (Weatherproof UV)',
        basePrice: 9000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'autocollant_oneway_glass',
        nameAr: 'تصميم + طباعة: تغليف زجاج بستيكر وان واي (One Way Vision) أو فينيل أوتوكولون',
        nameFr: 'Design + Impression : Habillage vitrine adhésif One Way Vision ou Vinyle Autocollant',
        nameEn: 'Design + Print: Storefront Window Perforated One Way Vision & Vinyl Decals',
        basePrice: 11000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'storefront_alucobond_3d',
        nameAr: 'تصميم + تنفيذ: واجهة متكاملة ألوكوبوند (Alucobond) + حروف نافرة ثلاثية الأبعاد 3D',
        nameFr: 'Conception + Réalisation : Façade Alucobond + Lettres boîtier 3D en relief',
        nameEn: 'Design + Build: Alucobond Store Facade + Raised 3D Box Channel Letters',
        basePrice: 28000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'led_lightbox_sign',
        nameAr: 'تصميم + تجهيز: لافتة ضوئية عصرية مضيئة بتقنية LED اقتصادية ومشرقة ليلاً',
        nameFr: 'Conception + Fabrication : Enseigne caisson lumineux LED rétroéclairé',
        nameEn: 'Design + Fabrication: Modern LED Illuminated Lightbox Sign',
        basePrice: 18000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
    ],
  },
  {
    id: 'books',
    key: 'books',
    icon: 'BookOpen',
    image: bookCoverImg,
    startingPrice: 3500, // Design only starting at 3500 DZD
    options: [
      // Design Only
      {
        id: 'book_cover_full_print',
        nameAr: 'تصميم غلاف فقط: غلاف كتاب / رواية كامل (أمام، خلف، كعب Spine) جاهز للمطبعة',
        nameFr: 'Design Graphique Seul : Couverture complète de livre (1ère, 4ème et dos tranche)',
        nameEn: 'Design Only: Complete Book Cover Design (Front, Back & Spine - Press Ready)',
        basePrice: 4500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'ebook_digital_cover',
        nameAr: 'تصميم غلاف فقط: كتاب رقمي (E-book) لمنصات أمازون كيندل والمواقع + Mockup 3D',
        nameFr: 'Design Graphique Seul : Couverture E-Book digitale haute résolution + Mockup 3D',
        nameEn: 'Design Only: High-Impact Digital E-Book Cover for Web & Publishing + 3D Mockup',
        basePrice: 3500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'magazine_catalog_cover',
        nameAr: 'تصميم غلاف فقط: غلاف مجلة أو كتالوج احترافي + Mockup ثلاثي الأبعاد',
        nameFr: 'Design Graphique Seul : Couverture de magazine ou catalogue corporate + Mockup 3D',
        nameEn: 'Design Only: Magazine or Corporate Catalog Cover + 3D Realistic Mockup',
        basePrice: 5000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      // Design + Print
      {
        id: 'book_print_sample_pack',
        nameAr: 'تصميم + طباعة: تصميم الغلاف كاملاً + طباعة وتجليد عينات أولية ورقية فاخرة',
        nameFr: 'Design + Impression : Couverture complète + Épreuve imprimée reliée haute qualité',
        nameEn: 'Design + Print: Full Cover Design + Printed & Bound Deluxe Proof Copies',
        basePrice: 8500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'book_editorial_bundle',
        nameAr: 'تصميم + طباعة: باقة متكاملة: تصميم الغلاف + تنسيق الصفحات + عينات طباعية',
        nameFr: 'Design + Impression : Pack éditorial complet : Couverture + Mise en page + Épreuve',
        nameEn: 'Design + Print: Full Editorial Package: Cover Design + Page Layout + Prints',
        basePrice: 15000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
    ],
  },
  {
    id: 'social',
    key: 'social',
    icon: 'Share2',
    image: studioImg,
    startingPrice: 3500,
    options: [
      {
        id: 'social_single_post',
        nameAr: 'تصميم بوست إعلاني فردي احترافي (إنستغرام، فيسبوك، لينكدإن)',
        nameFr: 'Design d’une publication sponsorisée individuelle (Post/Story)',
        nameEn: 'Single Custom Ad Post / Story Design',
        basePrice: 3500,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'social_pack_6',
        nameAr: 'باقة 6 تصاميم بوستات متناسقة وهوية موحدة لمنصات التواصل',
        nameFr: 'Pack de 6 publications coordonnées pour booster votre feed',
        nameEn: '6 Consistent Social Media Posts Branding Pack',
        basePrice: 16000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'social_pack_12',
        nameAr: 'باقة شهرية متكاملة (12 تصميم بوست + 6 ستوريات إبداعية)',
        nameFr: 'Pack mensuel complet (12 posts + 6 stories créatives)',
        nameEn: 'Full Monthly Pack (12 Custom Posts + 6 Story Creatives)',
        basePrice: 28000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
    ],
  },
  {
    id: 'web',
    key: 'web',
    icon: 'Globe',
    image: studioImg,
    startingPrice: 25000,
    options: [
      {
        id: 'landing_page_starter',
        nameAr: 'تصميم وبرمجة صفحة هبوط إعلانية (Landing Page) سريعة وموجهة للمبيعات',
        nameFr: 'Landing Page optimisée pour la conversion et acquisition clients',
        nameEn: 'High-Converting Sales Landing Page for Lead Generation',
        basePrice: 25000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'corporate_showcase_website',
        nameAr: 'موقع تعريفي متكامل للمؤسسات والشركات (Multi-page + متجاوب 100%)',
        nameFr: 'Site vitrine d’entreprise moderne, multilingue et responsive',
        nameEn: 'Full Corporate Showcase Website (Multi-page, Responsive & SEO)',
        basePrice: 42000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      {
        id: 'ecommerce_store',
        nameAr: 'متجر إلكتروني متكامل لإدارة المنتجات، الطلبات، والربط مع التوصيل',
        nameFr: 'Boutique E-Commerce clé en main avec gestion des commandes',
        nameEn: 'Turnkey E-Commerce Store with Product & Order Management',
        basePrice: 65000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
    ],
  },
  {
    id: 'mugs',
    key: 'mugs',
    icon: 'Coffee',
    image: mugsImg,
    startingPrice: 700, // Design only starts at 700 DZD
    options: [
      // Design Only
      {
        id: 'mug_bag_design_only',
        nameAr: 'تصميم جرافيك فقط: تصميم كؤوس أو حقائب يد أو كؤوس زجاجية (ملف 300DPI جاهز للطباعة والتسامي)',
        nameFr: 'Design Graphique Seul : Mugs / Verres / Sacs Tote Bag (Fichier Sublimation 300DPI)',
        nameEn: 'Design Only: Mugs / Glassware / Tote Bags (Sublimation & Screen-print ready)',
        basePrice: 700,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_only',
      },
      // Ceramic Mugs Design + Print
      {
        id: 'mug_ceramic_white',
        nameAr: 'تصميم + طباعة: كوب سيراميك أبيض فاخر نخب أول + طباعة ملونة مقاومة للحرارة',
        nameFr: 'Design + Impression : Mug céramique blanc haute brillance + Impression sublimation',
        nameEn: 'Design + Print: Premium White Ceramic Mug + High-Gloss Heat Print',
        basePrice: 850,
        minQuantity: 2,
        unitStep: 1,
        mode: 'design_and_print',
      },
      {
        id: 'mug_magic_heat',
        nameAr: 'تصميم + طباعة: الكوب السحري (يظهر التصميم والصور عند سكب المشروب الساخن)',
        nameFr: 'Design + Impression : Mug Magique thermo-réactif (révèle l’image avec la chaleur)',
        nameEn: 'Design + Print: Magic Heat-Sensitive Color Changing Surprise Mug',
        basePrice: 1200,
        minQuantity: 2,
        unitStep: 1,
        mode: 'design_and_print',
      },
      // Glassware Design + Print
      {
        id: 'glassware_custom_mug',
        nameAr: 'تصميم + طباعة: كؤوس زجاجية شفافة أو مثلجة (Givré) فاخرة ومخصصة بشعارك',
        nameFr: 'Design + Impression : Verres personnalisés transparents ou dépolis/givrés avec logo',
        nameEn: 'Design + Print: Custom Frosted / Clear Glassware Drinkware with Logo',
        basePrice: 1100,
        minQuantity: 2,
        unitStep: 1,
        mode: 'design_and_print',
      },
      // Canvas Tote Bags Design + Print
      {
        id: 'tote_bag_canvas_custom',
        nameAr: 'تصميم + طباعة: حقائب يد قماشية فاخرة (Tote Bags) أصلية وعالية المتانة للمتاجر والشركات',
        nameFr: 'Design + Impression : Sacs cabas en toile (Tote Bags) personnalisés haute résistance',
        nameEn: 'Design + Print: Premium Custom Canvas Tote Bags for Boutiques & Brands',
        basePrice: 950,
        minQuantity: 3,
        unitStep: 1,
        mode: 'design_and_print',
      },
      // Corporate Bulk Pack
      {
        id: 'mug_corporate_pack_24',
        nameAr: 'تصميم + طباعة باقة شركات: 24 قطعة (كؤوس سيراميك أو زجاج أو حقائب) بشعار وهوية علامتك',
        nameFr: 'Design + Impression : Pack Entreprise 24 pièces (Mugs / Verres / Sacs) personnalisées',
        nameEn: 'Design + Print: Corporate Pack (24 pieces custom drinkware or tote bags)',
        basePrice: 18000,
        minQuantity: 1,
        unitStep: 1,
        mode: 'design_and_print',
      },
    ],
  },
];

const STORAGE_KEY = 'ainar_services_catalog_v2';

export const getStoredServices = (): ServiceConfig[] => {
  if (typeof window === 'undefined') return defaultServicesData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultServicesData;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: ServiceConfig) => {
        const fallback = defaultServicesData.find((d) => d.id === item.id);
        return {
          ...item,
          image: fallback ? fallback.image : defaultServicesData[0].image,
        };
      });
    }
  } catch (err) {
    console.error('Failed to parse stored services:', err);
  }
  return defaultServicesData;
};

export const saveStoredServices = (services: ServiceConfig[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  } catch (err) {
    console.error('Failed to save services in localStorage:', err);
  }
};

export const servicesData = getStoredServices();
