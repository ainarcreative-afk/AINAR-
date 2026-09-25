import React, { useState } from 'react';
import { translations } from '../data/translations';
import {
  ServiceConfig,
  saveStoredServices,
  defaultServicesData,
  DEFAULT_URGENT_CONFIG,
  DEFAULT_URGENT_FEE,
  UrgentFeeConfig,
  UrgentFeeType,
  saveStoredUrgentConfig,
  saveStoredUrgentFee,
} from '../data/services';
import {
  SectionOrderItem,
  AgencyInfo,
  getStoredSectionOrder,
  saveStoredSectionOrder,
  defaultSectionOrder,
  getStoredPortfolio,
  saveStoredPortfolio,
  getStoredAgencyInfo,
  saveStoredAgencyInfo,
  defaultAgencyInfo,
} from '../data/customization';
import { ProjectItem } from '../data/portfolio';
import { Language } from '../types';
import {
  Save,
  RotateCcw,
  Check,
  X,
  Lock,
  Zap,
  Truck,
  ExternalLink,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Image,
  Plus,
  Trash2,
  Phone,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  services: ServiceConfig[];
  onUpdateServices: (updated: ServiceConfig[]) => void;
  urgentFee: number;
  onUpdateUrgentFee: (fee: number) => void;
  urgentConfig?: UrgentFeeConfig;
  onUpdateUrgentConfig?: (config: UrgentFeeConfig) => void;
  sectionsOrder: SectionOrderItem[];
  onUpdateSectionsOrder: (sections: SectionOrderItem[]) => void;
  portfolio: ProjectItem[];
  onUpdatePortfolio: (projects: ProjectItem[]) => void;
  agencyInfo: AgencyInfo;
  onUpdateAgencyInfo: (info: AgencyInfo) => void;
  onOpenZimou?: () => void;
}

type AdminTab = 'pricing' | 'sections' | 'portfolio' | 'agencyInfo';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  lang,
  services,
  onUpdateServices,
  urgentFee,
  onUpdateUrgentFee,
  urgentConfig = DEFAULT_URGENT_CONFIG,
  onUpdateUrgentConfig,
  sectionsOrder,
  onUpdateSectionsOrder,
  portfolio,
  onUpdatePortfolio,
  agencyInfo,
  onUpdateAgencyInfo,
  onOpenZimou,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ainar_admin_logged_in') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<AdminTab>('pricing');

  // Editable states
  const [editableServices, setEditableServices] = useState<ServiceConfig[]>(services);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'apparel');
  const [editableUrgentFee, setEditableUrgentFee] = useState<number>(urgentFee);
  const [editableUrgentType, setEditableUrgentType] = useState<UrgentFeeType>(urgentConfig.type || 'fixed');
  const [editableUrgentValue, setEditableUrgentValue] = useState<number>(urgentConfig.value || urgentFee || 1500);

  // Sections order & visibility
  const [editableSections, setEditableSections] = useState<SectionOrderItem[]>(sectionsOrder);

  // Portfolio items
  const [editablePortfolio, setEditablePortfolio] = useState<ProjectItem[]>(portfolio);

  // Agency info & contact details
  const [editableAgencyInfo, setEditableAgencyInfo] = useState<AgencyInfo>(agencyInfo);

  // New project modal / form
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    category: 'apparel',
    titleAr: '',
    client: '',
    descriptionAr: '',
    image: '',
    tags: ['AINAR CREATIVE'],
  });
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Accept username "Ainar creative" (or email "ainarcreative@gmail.com") and password "Zouaoui1963"
    const isValidUser =
      cleanUser === 'ainar creative' ||
      cleanUser === 'ainarcreative' ||
      cleanUser === 'ainarcreative@gmail.com';

    const isValidPass = cleanPass === 'Zouaoui1963';

    if (isValidUser && isValidPass) {
      setIsAuthenticated(true);
      localStorage.setItem('ainar_admin_logged_in', 'true');
      setAuthError('');
    } else {
      setAuthError(
        lang === 'ar'
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مجدداً.'
          : 'Nom d’utilisateur ou mot de passe incorrect.'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ainar_admin_logged_in');
  };

  // Reorder sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editableSections.length) return;
    const updated = [...editableSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setEditableSections(updated);
  };

  const toggleSectionVisibility = (id: string) => {
    setEditableSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  // Portfolio image upload handler (reads image file as Base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميغابايت.' : 'Image trop volumineuse (max 4Mo)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewProject((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = () => {
    if (!newProject.titleAr || !newProject.image) {
      alert(lang === 'ar' ? 'يرجى كتابة عنوان المشروع وإرفاق الصورة (أو رابطها).' : 'Veuillez renseigner le titre et l’image.');
      return;
    }

    const project: ProjectItem = {
      id: `p-custom-${Date.now()}`,
      category: (newProject.category as any) || 'apparel',
      titleAr: newProject.titleAr || 'مشروع جديد',
      titleFr: newProject.titleAr || 'Nouveau projet',
      titleEn: newProject.titleAr || 'New project',
      client: newProject.client || 'AINAR Client',
      descriptionAr: newProject.descriptionAr || 'تنفيذ احترافي بواسطة وكالة AINAR CREATIVE.',
      descriptionFr: 'Réalisé par l’agence AINAR CREATIVE.',
      descriptionEn: 'Created by AINAR CREATIVE Agency.',
      image: newProject.image || '',
      tags: ['جديد', 'AINAR CREATIVE'],
    };

    const updated = [project, ...editablePortfolio];
    setEditablePortfolio(updated);
    setNewProject({
      category: 'apparel',
      titleAr: '',
      client: '',
      descriptionAr: '',
      image: '',
      tags: ['AINAR CREATIVE'],
    });
    setShowAddProjectForm(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العمل من المعرض؟' : 'Supprimer ce projet ?')) {
      setEditablePortfolio((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Pricing edits
  const currentService =
    editableServices.find((s) => s.id === selectedServiceId) || editableServices[0];

  const handleStartingPriceChange = (val: number) => {
    setEditableServices((prev) =>
      prev.map((s) => (s.id === selectedServiceId ? { ...s, startingPrice: Math.max(0, val) } : s))
    );
  };

  const handleOptionPriceChange = (optionId: string, newPrice: number) => {
    setEditableServices((prev) =>
      prev.map((s) => {
        if (s.id !== selectedServiceId) return s;
        return {
          ...s,
          options: s.options.map((opt) =>
            opt.id === optionId ? { ...opt, basePrice: Math.max(0, newPrice) } : opt
          ),
        };
      })
    );
  };

  const handleOptionNameArChange = (optionId: string, newName: string) => {
    setEditableServices((prev) =>
      prev.map((s) => {
        if (s.id !== selectedServiceId) return s;
        return {
          ...s,
          options: s.options.map((opt) =>
            opt.id === optionId ? { ...opt, nameAr: newName } : opt
          ),
        };
      })
    );
  };

  const handleServiceTitleChange = (val: string) => {
    setEditableServices((prev) =>
      prev.map((s) => (s.id === selectedServiceId ? { ...s, customTitleAr: val } : s))
    );
  };

  const handleServiceDescChange = (val: string) => {
    setEditableServices((prev) =>
      prev.map((s) => (s.id === selectedServiceId ? { ...s, customDescAr: val } : s))
    );
  };

  const handleServiceBulletChange = (idx: number, val: string) => {
    setEditableServices((prev) =>
      prev.map((s) => {
        if (s.id !== selectedServiceId) return s;
        const defaultBullets = translations.ar.services.items[s.key as keyof typeof translations.ar.services.items]?.bullets || [];
        const currentBullets = (s.customBulletsAr && s.customBulletsAr.length > 0) ? [...s.customBulletsAr] : [...defaultBullets];
        currentBullets[idx] = val;
        return { ...s, customBulletsAr: currentBullets };
      })
    );
  };

  const handleAddServiceBullet = () => {
    setEditableServices((prev) =>
      prev.map((s) => {
        if (s.id !== selectedServiceId) return s;
        const defaultBullets = translations.ar.services.items[s.key as keyof typeof translations.ar.services.items]?.bullets || [];
        const currentBullets = (s.customBulletsAr && s.customBulletsAr.length > 0) ? [...s.customBulletsAr] : [...defaultBullets];
        currentBullets.push('ميزة / مواصفة جديدة');
        return { ...s, customBulletsAr: currentBullets };
      })
    );
  };

  const handleRemoveServiceBullet = (idx: number) => {
    setEditableServices((prev) =>
      prev.map((s) => {
        if (s.id !== selectedServiceId) return s;
        const defaultBullets = translations.ar.services.items[s.key as keyof typeof translations.ar.services.items]?.bullets || [];
        const currentBullets = (s.customBulletsAr && s.customBulletsAr.length > 0) ? [...s.customBulletsAr] : [...defaultBullets];
        currentBullets.splice(idx, 1);
        return { ...s, customBulletsAr: currentBullets };
      })
    );
  };

  // Portfolio edits
  const handleUpdatePortfolioItemTitle = (id: string, newTitle: string) => {
    setEditablePortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, titleAr: newTitle, titleFr: newTitle, titleEn: newTitle } : item))
    );
  };

  const handleUpdatePortfolioItemDesc = (id: string, newDesc: string) => {
    setEditablePortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, descriptionAr: newDesc, descriptionFr: newDesc, descriptionEn: newDesc } : item))
    );
  };

  const handleUpdatePortfolioItemClient = (id: string, newClient: string) => {
    setEditablePortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, client: newClient } : item))
    );
  };

  // Save everything
  const handleSaveAll = () => {
    // 1. Pricing & Urgent Configuration (Fixed or Percentage)
    const newUrgentConfig: UrgentFeeConfig = {
      type: editableUrgentType,
      value: editableUrgentValue,
    };
    saveStoredServices(editableServices);
    saveStoredUrgentConfig(newUrgentConfig);
    onUpdateServices(editableServices);
    onUpdateUrgentFee(editableUrgentValue);
    if (onUpdateUrgentConfig) {
      onUpdateUrgentConfig(newUrgentConfig);
    }

    // 2. Sections Order
    saveStoredSectionOrder(editableSections);
    onUpdateSectionsOrder(editableSections);

    // 3. Portfolio & Images
    saveStoredPortfolio(editablePortfolio);
    onUpdatePortfolio(editablePortfolio);

    // 4. Agency Info
    saveStoredAgencyInfo(editableAgencyInfo);
    onUpdateAgencyInfo(editableAgencyInfo);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        lang === 'ar'
          ? 'هل أنت متأكد من استعادة كافة الترتيبات والأسعار والمعلومات الافتراضية؟'
          : 'Réinitialiser tous les réglages par défaut ?'
      )
    ) {
      setEditableServices(defaultServicesData);
      setEditableUrgentFee(DEFAULT_URGENT_FEE);
      setEditableUrgentType(DEFAULT_URGENT_CONFIG.type);
      setEditableUrgentValue(DEFAULT_URGENT_CONFIG.value);
      setEditableSections(defaultSectionOrder);
      setEditableAgencyInfo(defaultAgencyInfo);

      saveStoredServices(defaultServicesData);
      saveStoredUrgentConfig(DEFAULT_URGENT_CONFIG);
      saveStoredSectionOrder(defaultSectionOrder);
      saveStoredAgencyInfo(defaultAgencyInfo);

      onUpdateServices(defaultServicesData);
      onUpdateUrgentFee(DEFAULT_URGENT_FEE);
      if (onUpdateUrgentConfig) {
        onUpdateUrgentConfig(DEFAULT_URGENT_CONFIG);
      }
      onUpdateSectionsOrder(defaultSectionOrder);
      onUpdateAgencyInfo(defaultAgencyInfo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-900/60 overflow-hidden flex flex-col max-h-[92vh] text-start">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white font-bold text-xs">
              ADMIN
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'لوحة تحكم وإدارة وكالة AINAR CREATIVE الشاملة'
                  : 'Panneau de contrôle & gestion AINAR CREATIVE'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAuthenticated
                  ? 'مرحباً بالمدير (Ainar creative) - كامل الصلاحيات مفعلة'
                  : lang === 'ar'
                  ? 'منطقة مخصصة للمدير فقط'
                  : 'Espace restreint'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold cursor-pointer"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!isAuthenticated ? (
          /* Login Form */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'تسجيل الدخول كمسؤول (Admin)' : 'Connexion Administrateur'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'يرجى كتابة بيانات الإدارة لتعديل أماكن الأقسام، رفع الصور، والتحكم بالأسعار والمعلومات'
                  : 'Veuillez vous identifier pour gérer les sections, images et tarifs'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'اسم المستخدم (Username)' : 'Nom d’utilisateur'}
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : 'Nom d’utilisateur'}
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'كلمة المرور (Password)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'دخول لوحة التحكم' : 'Accéder au panneau'}
              </button>
            </form>
          </div>
        ) : (
          /* Multi-Tab Admin Panel */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Navigation Bar for Admin Tabs */}
            <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  activeTab === 'pricing'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تعديل الخدمات والمواصفات والأسعار' : 'Services, Infos & Tarifs'}</span>
              </button>

              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  activeTab === 'sections'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'ar' ? 'ترتيب أماكن الأقسام وإخفائها' : 'Ordre des Sections'}</span>
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  activeTab === 'portfolio'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة صور وتعديل المعرض' : 'Galerie & Photos'}</span>
              </button>

              <button
                onClick={() => setActiveTab('agencyInfo')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  activeTab === 'agencyInfo'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>{lang === 'ar' ? 'معلومات الوكالة والتواصل' : 'Infos & Contacts'}</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: PRICING */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {/* Direct Zimou Express integration card in Admin */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>حساب زيمو إكسبريس للتوصيل (Zimou Express)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            مربوط بحسابك
                          </span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          ملفك الشخصي: <span className="font-mono text-indigo-600 dark:text-indigo-400">{editableAgencyInfo.zimouProfileUrl}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onOpenZimou && (
                        <button
                          type="button"
                          onClick={onOpenZimou}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                        >
                          إدارة الطرد والشحن
                        </button>
                      )}
                      <a
                        href={editableAgencyInfo.zimouProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 inline-flex items-center gap-1"
                      >
                        <span>فتح زيمو</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Configurable Urgent Order Fee (Fixed DZD or Percentage %) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                          <Zap className="w-5 h-5 fill-slate-950" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{lang === 'ar' ? 'طريقة احتساب رسم الطلب المستعجل (VIP Express)' : 'Tarification Commande Urgente'}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
                              {editableUrgentType === 'percentage'
                                ? `${editableUrgentValue}% نسبة مئوية`
                                : `${editableUrgentValue.toLocaleString()} د.ج مبلغ ثابت`}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {lang === 'ar'
                              ? 'يمكنك تحديد رسوم الاستعجال إما كمبلغ مالي ثابت بالدينار، أو كنسبة مئوية (%) تُحسب تلقائياً من إجمالي تكلفة الطلب'
                              : 'Définissez les frais express soit en montant fixe (DZD), soit en pourcentage (%) du total'}
                          </p>
                        </div>
                      </div>

                      {/* Type switcher: Fixed DZD vs Percentage % */}
                      <div className="inline-flex p-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setEditableUrgentType('fixed')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            editableUrgentType === 'fixed'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {lang === 'ar' ? 'مبلغ ثابت (د.ج)' : 'Fixe (DZD)'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditableUrgentType('percentage')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            editableUrgentType === 'percentage'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>%</span>
                          <span>{lang === 'ar' ? 'نسبة مئوية' : 'Pourcentage'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Numeric Input & Interactive Demo preview */}
                    <div className="pt-3 border-t border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {editableUrgentType === 'percentage'
                            ? (lang === 'ar' ? 'النسبة المئوية المضافة للطلب المستعجل:' : 'Pourcentage appliqué :')
                            : (lang === 'ar' ? 'قيمة المبلغ الثابت بالدينار الجزائري:' : 'Montant fixe :')}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min="0"
                            max={editableUrgentType === 'percentage' ? 200 : 100000}
                            value={editableUrgentValue}
                            onChange={(e) => {
                              const v = Math.max(0, Number(e.target.value));
                              setEditableUrgentValue(v);
                              setEditableUrgentFee(v);
                            }}
                            className="w-28 px-3 py-1.5 rounded-lg border border-amber-400 dark:border-amber-700 bg-white dark:bg-slate-900 text-sm font-black text-amber-700 dark:text-amber-300 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <span className="ms-1.5 text-xs font-black text-slate-600 dark:text-slate-400">
                            {editableUrgentType === 'percentage' ? '%' : 'د.ج'}
                          </span>
                        </div>
                      </div>

                      {/* Live explanation */}
                      <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg font-medium">
                        {editableUrgentType === 'percentage' ? (
                          <span>
                            💡 مثال: طلب بقيمة 10,000 د.ج ستضاف له رسوم استعجال قدرها <strong>{Math.round(10000 * editableUrgentValue / 100).toLocaleString()} د.ج</strong> ({editableUrgentValue}%)
                          </span>
                        ) : (
                          <span>
                            💡 تضاف قيمة ثابتة قدرها <strong>{editableUrgentValue.toLocaleString()} د.ج</strong> مهما كانت كمية الطلب
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service selector tabs */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {lang === 'ar' ? 'اختر الخدمة لتعديل أسعارها وخياراتها:' : 'Sélectionner le service à éditer :'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editableServices.map((svc) => (
                        <button
                          key={svc.id}
                          onClick={() => setSelectedServiceId(svc.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            selectedServiceId === svc.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>
                            {translations[lang].services.items[
                              svc.key as keyof typeof translations.ar.services.items
                            ]?.title.split(' ')[0] || svc.key}
                          </span>
                          <span className="ms-1.5 px-1.5 py-0.5 rounded text-[10px] bg-black/20 text-white">
                            {svc.startingPrice} د.ج
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Service Editor Card */}
                  {currentService && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {translations[lang].services.items[
                              currentService.key as keyof typeof translations.ar.services.items
                            ]?.title || currentService.id}
                          </h4>
                          <span className="text-xs text-slate-500">
                            ID: {currentService.id} · Key: {currentService.key}
                          </span>
                        </div>

                        {/* Starting Price Field */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {lang === 'ar' ? 'السعر الابتدائي (د.ج):' : 'Prix de départ (DZD) :'}
                          </label>
                          <input
                            type="number"
                            value={currentService.startingPrice}
                            onChange={(e) => handleStartingPriceChange(Number(e.target.value))}
                            className="w-28 px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Title & Description Fields */}
                      <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {lang === 'ar' ? 'تعديل نصوص ومعلومات الخدمة:' : 'Textes et détails du service :'}
                        </h5>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            عنوان الخدمة:
                          </label>
                          <input
                            type="text"
                            value={
                              currentService.customTitleAr ||
                              translations.ar.services.items[
                                currentService.key as keyof typeof translations.ar.services.items
                              ]?.title ||
                              ''
                            }
                            onChange={(e) => handleServiceTitleChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            شرح ووصف الخدمة:
                          </label>
                          <textarea
                            rows={2}
                            value={
                              currentService.customDescAr ||
                              translations.ar.services.items[
                                currentService.key as keyof typeof translations.ar.services.items
                              ]?.desc ||
                              ''
                            }
                            onChange={(e) => handleServiceDescChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Bullets editor */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              قائمة المميزات والمواصفات (Bullets):
                            </label>
                            <button
                              type="button"
                              onClick={handleAddServiceBullet}
                              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة ميزة</span>
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {(
                              (currentService.customBulletsAr && currentService.customBulletsAr.length > 0)
                                ? currentService.customBulletsAr
                                : translations.ar.services.items[
                                    currentService.key as keyof typeof translations.ar.services.items
                                  ]?.bullets || []
                            ).map((bullet, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => handleServiceBulletChange(bIdx, e.target.value)}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveServiceBullet(bIdx)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                  title="حذف الميزة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {lang === 'ar' ? 'خيارات وأنواع الخدمة والأسعار:' : 'Options & tarifs unitaires :'}
                        </h5>

                        <div className="space-y-2.5">
                          {currentService.options.map((opt) => (
                            <div
                              key={opt.id}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="flex-1 w-full space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    opt.mode === 'design_only'
                                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  }`}>
                                    {opt.mode === 'design_only' ? '🎨 تصميم فقط' : '🖨️ تصميم + طباعة'}
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.nameAr}
                                    onChange={(e) => handleOptionNameArChange(opt.id, e.target.value)}
                                    className="flex-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-1"
                                  />
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Min Qty: {opt.minQuantity} | Step: {opt.unitStep}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <label className="text-xs text-slate-500">السعر:</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={opt.basePrice}
                                    onChange={(e) =>
                                      handleOptionPriceChange(opt.id, Number(e.target.value))
                                    }
                                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white tabular-nums text-end focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                  />
                                  <span className="text-[10px] text-slate-400 ms-1">د.ج</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SECTIONS REORDER & TOGGLE */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
                    <p className="font-bold mb-1">
                      {lang === 'ar'
                        ? '🔄 تحكم كامل بترتيب أماكن كل قسم في الصفحة:'
                        : '🔄 Réorganisez l’ordre d’apparition des sections sur le site :'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {lang === 'ar'
                        ? 'استخدم أسهم (للأعلى ⬆️ / للأسفل ⬇️) لتقديم أو تأخير أي قسم في الصفحة، أو زر العين لإخفائه أو إظهاره متى أردت.'
                        : 'Montez ou descendez les sections, ou masquez-les en un clic.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {editableSections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          sec.visible
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {lang === 'ar' ? sec.nameAr : sec.nameFr}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              #{sec.id}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Move Up */}
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="تحريك للأعلى"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>

                          {/* Move Down */}
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === editableSections.length - 1}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="تحريك للأسفل"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(sec.id)}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              sec.visible
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                                : 'bg-rose-50 dark:bg-rose-950 text-rose-500'
                            }`}
                            title={sec.visible ? 'إخفاء القسم' : 'إظهار القسم'}
                          >
                            {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PORTFOLIO & IMAGES MANAGEMENT */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? 'إدارة صور وأعمال المعرض (Portfolio)' : 'Gestion du Portfolio'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {lang === 'ar'
                          ? 'يمكنك إضافة صور أعمال جديدة مباشرة من جهازك أو حذف أي صورة سابقة.'
                          : 'Ajoutez de nouvelles photos depuis votre appareil ou supprimez des réalisations existantes.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'إضافة عمل / صورة جديدة' : 'Ajouter une photo'}</span>
                    </button>
                  </div>

                  {/* Add Project Form */}
                  {showAddProjectForm && (
                    <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-4">
                      <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                        {lang === 'ar' ? 'بيانات العمل الجديد:' : 'Nouveau Projet :'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            عنوان العمل أو المشروع:
                          </label>
                          <input
                            type="text"
                            value={newProject.titleAr}
                            onChange={(e) => setNewProject({ ...newProject, titleAr: e.target.value })}
                            placeholder="مثال: طباعة أقمصة لمطعم الساحل"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            اسم الزبون أو العلامة:
                          </label>
                          <input
                            type="text"
                            value={newProject.client}
                            onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                            placeholder="مثال: Le Gourmet Restaurant"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            تصنيف العمل:
                          </label>
                          <select
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                          >
                            <option value="apparel">الأقمصة والملابس (Apparel)</option>
                            <option value="cards">بطاقات العمل والشكر (Cards)</option>
                            <option value="storefront">واجهات المحلات واللافتات (Storefront)</option>
                            <option value="books">أغلفة الكتب والمجلات (Books)</option>
                            <option value="social">بوستات السوشيال ميديا (Social)</option>
                            <option value="web">تصميم المواقع (Web)</option>
                            <option value="mugs">طباعة الكؤوس (Mugs)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            الصورة (رفع من الجهاز أو رابط):
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                          </div>
                          {newProject.image && (
                            <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-indigo-400">
                              <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          وصف العمل والمواصفات:
                        </label>
                        <textarea
                          rows={2}
                          value={newProject.descriptionAr}
                          onChange={(e) => setNewProject({ ...newProject, descriptionAr: e.target.value })}
                          placeholder="مثال: طباعة سيلك سكرين عالية الثبات على قطن أسود 100%..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddProjectForm(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          إضافة للصورة والمعرض
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Portfolio Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {editablePortfolio.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                          <img
                            src={item.image}
                            alt={item.titleAr}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white">
                            {item.category}
                          </span>
                        </div>

                        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block">عنوان العمل:</label>
                              <input
                                type="text"
                                value={item.titleAr}
                                onChange={(e) => handleUpdatePortfolioItemTitle(item.id, e.target.value)}
                                className="w-full text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block">شرح ومواصفات العمل:</label>
                              <textarea
                                rows={2}
                                value={item.descriptionAr}
                                onChange={(e) => handleUpdatePortfolioItemDesc(item.id, e.target.value)}
                                className="w-full text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={item.client}
                              placeholder="اسم الزبون / العلامة"
                              onChange={(e) => handleUpdatePortfolioItemClient(item.id, e.target.value)}
                              className="text-[10px] text-slate-500 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 py-0.5 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(item.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AGENCY INFO & CONTACTS */}
              {activeTab === 'agencyInfo' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                    <p className="font-bold mb-1">
                      {lang === 'ar'
                        ? '📞 تخصيص بيانات التواصل والإعلانات:'
                        : '📞 Personnalisez les coordonnées et annonces :'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {lang === 'ar'
                        ? 'قم بتحديث أرقام الهاتف ورابط ملف زيمو إكسبريس ونص الإعلان المباشر في أي وقت.'
                        : 'Mettez à jour les téléphones, WhatsApp et liens de livraison.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم الهاتف المباشر:
                      </label>
                      <input
                        type="text"
                        value={editableAgencyInfo.phone}
                        onChange={(e) =>
                          setEditableAgencyInfo({ ...editableAgencyInfo, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم الواتساب (بالكود الدولي مثل 213673187994):
                      </label>
                      <input
                        type="text"
                        value={editableAgencyInfo.whatsappNumber}
                        onChange={(e) =>
                          setEditableAgencyInfo({
                            ...editableAgencyInfo,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        البريد الإلكتروني للوكالة:
                      </label>
                      <input
                        type="email"
                        value={editableAgencyInfo.email}
                        onChange={(e) =>
                          setEditableAgencyInfo({ ...editableAgencyInfo, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رابط ملف زيمو إكسبريس (Zimou Express Profile):
                      </label>
                      <input
                        type="url"
                        value={editableAgencyInfo.zimouProfileUrl}
                        onChange={(e) =>
                          setEditableAgencyInfo({
                            ...editableAgencyInfo,
                            zimouProfileUrl: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      العنوان والمقر:
                    </label>
                    <input
                      type="text"
                      value={editableAgencyInfo.agencyAddress}
                      onChange={(e) =>
                        setEditableAgencyInfo({ ...editableAgencyInfo, agencyAddress: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نص إعلاني أو معلومة خاصة للموقع:
                    </label>
                    <textarea
                      rows={2}
                      value={editableAgencyInfo.announcementText}
                      onChange={(e) =>
                        setEditableAgencyInfo({
                          ...editableAgencyInfo,
                          announcementText: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        {isAuthenticated && (
          <div className="px-6 py-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {saveSuccess && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {lang === 'ar'
                    ? 'تم حفظ وتطبيق التعديلات والأماكن والصور فوراً على الموقع!'
                    : 'Modifications appliquées immédiatement !'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                title="استعادة الوضع الافتراضي"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">استعادة الافتراضي</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Fermer'}
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ كافة التغييرات' : 'Enregistrer tout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
