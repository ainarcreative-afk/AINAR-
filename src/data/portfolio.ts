import tshirtImg from '../assets/images/tshirt_apparel_mockup_1790190864244.jpg';
import cardsImg from '../assets/images/business_cards_mockup_1790190874268.jpg';
import storefrontImg from '../assets/images/storefront_facade_sign_1790190885491.jpg';
import bookCoverImg from '../assets/images/book_magazine_cover_1790191774183.jpg';
import mugsImg from '../assets/images/mug_printing_mockup_1790190896098.jpg';
import studioImg from '../assets/images/hero_agency_studio_1790190851540.jpg';

export interface ProjectItem {
  id: string;
  category: 'apparel' | 'cards' | 'storefront' | 'books' | 'social' | 'web' | 'mugs';
  titleAr: string;
  titleFr: string;
  titleEn: string;
  client: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  image: string;
  tags: string[];
}

export const portfolioProjects: ProjectItem[] = [
  {
    id: 'p-apparel-1',
    category: 'apparel',
    titleAr: 'مجموعة أقمصة وهوديز ستريت وير لعلامة أزياء شبابية',
    titleFr: 'Collection T-shirts & Hoodies Streetwear pour marque de mode',
    titleEn: 'Streetwear T-shirts & Hoodies Collection for Youth Fashion Brand',
    client: 'Urban Pulse Apparel',
    descriptionAr: 'طباعة حرارية DTF فائقة الدقة على قطن 100% أسود نقي مع ثبات ألوان ومقاومة عالية للغسيل المتكرر.',
    descriptionFr: 'Impression DTF haute résolution sur coton noir 100% avec rendu éclatant et résistance aux lavages.',
    descriptionEn: 'Ultra high-definition DTF print on pure 100% black combed cotton with wash-resistant finish.',
    image: tshirtImg,
    tags: ['DTF Printing', 'Apparel Design', '100% Cotton'],
  },
  {
    id: 'p-cards-1',
    category: 'cards',
    titleAr: 'هوية وبطاقات عمل فاخرة مع ختم فويل ذهبي بارز',
    titleFr: 'Cartes de visite de prestige avec dorure or à chaud',
    titleEn: 'Prestige Business Cards with Hot Gold Foil Stamping',
    client: 'Elite Architecture Studio',
    descriptionAr: 'ورق مقوى 400g مغلف بسلوفان سوفت تاتش المخملي ولمسات ذهبية راقية تبرز هوية المكتب المعماري.',
    descriptionFr: 'Carton 400g pelliculage soft-touch au toucher peau de pêche et dorure métallique or.',
    descriptionEn: '400gsm luxury stock with soft-touch velvet lamination and metallic gold foil stamping.',
    image: cardsImg,
    tags: ['Gold Foil', 'Soft Touch', '350gsm'],
  },
  {
    id: 'p-storefront-1',
    category: 'storefront',
    titleAr: 'واجهة محل تجاري فخمة مع حروف 3D LED وباش وأوتوكولون',
    titleFr: 'Façade de boutique de luxe en Alucobond, Bâche & Lettres 3D LED',
    titleEn: 'Luxury Storefront Facade with 3D LED Letters, Banners & Autocollants',
    client: 'Café & Lounge Barista',
    descriptionAr: 'تصميم وتنفيذ كامل لواجهة بمساحة 8 أمتار، إضاءة خلفية نيون LED ساحرة وألواح ألوكوبوند وطباعة أوتوكولون مقاومة للمناخ.',
    descriptionFr: 'Habillage complet 8 mètres en Alucobond noir mat, lettrage 3D rétro-éclairé et bâches haute durabilité.',
    descriptionEn: 'Complete 8-meter shopfront cladding in matte black Alucobond with backlit 3D acrylic lettering and vinyl banners.',
    image: storefrontImg,
    tags: ['Autocollant & Bâche', '3D LED Letters', 'One Way Vision'],
  },
  {
    id: 'p-books-1',
    category: 'books',
    titleAr: 'تصميم غلاف رواية أدبية ومجلة أعمال دورية بأحدث معايير الإخراج',
    titleFr: 'Design de couverture de roman littéraire & magazine économique',
    titleEn: 'Editorial Novel Book Cover & Periodic Business Magazine Design',
    client: 'Dar El Fikr Publishing & Business Weekly',
    descriptionAr: 'تصميم إبداعي متكامل للغلاف الأمامي والخلفي والكعب مع إخراج طباعي دقيق للمطابع وحساب سماكة الورق بدقة.',
    descriptionFr: 'Création graphique complète recto/verso/dos pour livre littéraire et maquette de magazine moderne.',
    descriptionEn: 'Complete front, back and spine cover artwork with print-ready CMYK prepress calibration.',
    image: bookCoverImg,
    tags: ['Book Cover', 'Editorial Design', 'Magazine Layout'],
  },
  {
    id: 'p-mugs-1',
    category: 'mugs',
    titleAr: 'أكواب سيراميك مخصصة مع هوية بصرية لشركة استشارات',
    titleFr: 'Mugs personnalisés en céramique pour cabinet de conseil',
    titleEn: 'Custom Branded Ceramic Mugs for Corporate Advisory',
    client: 'Nexus Consult Group',
    descriptionAr: 'طباعة حرارية بألوان نقية ومشرقة على 150 كوب مع علب تغليف هدايا فردية راقية.',
    descriptionFr: 'Impression en sublimation haute netteté sur 150 tasses céramique avec coffrets individuels.',
    descriptionEn: 'Crisp sublimation print on 150 premium ceramic mugs with custom individual gift packaging.',
    image: mugsImg,
    tags: ['Sublimation', 'Corporate Gifts', 'Ceramic Mugs'],
  },
  {
    id: 'p-social-1',
    category: 'social',
    titleAr: 'باقة تصاميم سوشيال ميديا وإعلانات ممولة لمتجر هواتف',
    titleFr: 'Campagne de visuels réseaux sociaux & sponsorisations e-commerce',
    titleEn: 'Social Media Campaign & Meta Ad Creatives for Tech Retailer',
    client: 'Apex Tech Store',
    descriptionAr: 'تصميم 20 بوست إعلاني و10 ستوريات مع نصوص تسويقية جذابة رفعت التفاعل والمبيعات بنسبة 180%.',
    descriptionFr: 'Création de 20 visuels publicitaires et 10 stories dynamiques générant une hausse de +180% des ventes.',
    descriptionEn: 'Creation of 20 high-converting feed posts and 10 dynamic stories generating +180% sales surge.',
    image: studioImg,
    tags: ['Social Media', 'Ad Creatives', 'Instagram & FB'],
  },
  {
    id: 'p-web-1',
    category: 'web',
    titleAr: 'صفحة هبوط إعلانية تفاعلية مع نظام طلب واتساب مباشر',
    titleFr: 'Landing Page dynamique de vente avec commande WhatsApp',
    titleEn: 'High-Converting Sales Landing Page with Direct WhatsApp Orders',
    client: 'BioSkin Cosmetics',
    descriptionAr: 'موقع فائق السرعة متوافق 100% مع الهواتف مع استمارة طلب فورية تضاعف معدل التحويل.',
    descriptionFr: 'Site web ultra-rapide optimisé smartphone avec bouton de commande WhatsApp en un clic.',
    descriptionEn: 'Lightning-fast mobile-optimized landing page with 1-click instant WhatsApp order integration.',
    image: studioImg,
    tags: ['Web Design', 'Mobile-First', 'Fast Loading'],
  },
];
