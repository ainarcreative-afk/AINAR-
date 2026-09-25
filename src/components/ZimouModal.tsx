import React, { useState } from 'react';
import { Language } from '../types';
import {
  ZimouSettings,
  ZimouParcel,
  getZimouSettings,
  saveZimouSettings,
  getZimouParcels,
  addZimouParcel,
} from '../data/zimou';
import { algeriaWilayasData, WilayaData } from '../data/wilayas';
import {
  Truck,
  ExternalLink,
  CheckCircle2,
  Package,
  Plus,
  Search,
  Key,
  Globe,
  X,
  FileCheck,
  Building2,
  MapPin,
  Home,
} from 'lucide-react';

interface ZimouModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ZimouModal: React.FC<ZimouModalProps> = ({ isOpen, onClose, lang }) => {
  const [settings, setSettings] = useState<ZimouSettings>(getZimouSettings());
  const [parcels, setParcels] = useState<ZimouParcel[]>(getZimouParcels());
  const [activeTab, setActiveTab] = useState<'status' | 'tarifs' | 'create' | 'parcels' | 'settings'>('status');

  // New parcel form states with Wilaya and Commune selection
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const activeWilaya: WilayaData =
    algeriaWilayasData.find((w) => w.code === selectedWilayaCode) || algeriaWilayasData[15];
  const [selectedCommune, setSelectedCommune] = useState(activeWilaya.communes[0] || '');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [serviceTitle, setServiceTitle] = useState('تصميم وطباعة أقمصة - AINAR CREATIVE');
  const [amountToCollect, setAmountToCollect] = useState('3500');
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Settings form
  const [apiToken, setApiToken] = useState(settings.apiToken);
  const [tokenSaved, setTokenSaved] = useState(false);

  // Search & Filter
  const [searchTracking, setSearchTracking] = useState('');
  const [searchTarif, setSearchTarif] = useState('');

  if (!isOpen) return null;

  const handleWilayaChange = (code: string) => {
    setSelectedWilayaCode(code);
    const target = algeriaWilayasData.find((w) => w.code === code);
    if (target && target.communes.length > 0) {
      setSelectedCommune(target.communes[0]);
    }
  };

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      apiToken: apiToken.trim(),
      isLinked: true,
    };
    setSettings(updated);
    saveZimouSettings(updated);
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 2500);
  };

  const handleCreateParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientPhone.trim()) return;

    // Generate Zimou Express tracking code format: ZM-XXXXXX
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `ZM-${randomCode}`;

    const newParcel: ZimouParcel = {
      trackingNumber,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      wilaya: `${activeWilaya.code} - ${activeWilaya.nameAr}`,
      commune: selectedCommune,
      serviceTitle: `${serviceTitle.trim()} (${deliveryType === 'home' ? 'توصيل للمنزل' : 'Stop Desk'})`,
      amountToCollect: Number(amountToCollect) || 0,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addZimouParcel(newParcel);
    setParcels(getZimouParcels());
    setCreateSuccess(trackingNumber);
    setRecipientName('');
    setRecipientPhone('');
    setTimeout(() => {
      setCreateSuccess(null);
    }, 5000);
  };

  const filteredParcels = parcels.filter(
    (p) =>
      p.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(searchTracking.toLowerCase()) ||
      p.recipientPhone.includes(searchTracking) ||
      p.wilaya.toLowerCase().includes(searchTracking.toLowerCase())
  );

  const filteredWilayas = algeriaWilayasData.filter(
    (w) =>
      w.nameAr.includes(searchTarif) ||
      w.nameFr.toLowerCase().includes(searchTarif.toLowerCase()) ||
      w.code.includes(searchTarif) ||
      w.communes.some((c) => c.includes(searchTarif))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-900/60 overflow-hidden flex flex-col max-h-[92vh] text-start">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-700 font-black flex items-center justify-center shadow">
              <Truck className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar'
                    ? 'بوابة الربط مع زيمو إكسبريس (Zimou Express)'
                    : 'Intégration Logistique Zimou Express'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                  {settings.isLinked
                    ? lang === 'ar'
                      ? 'حساب متصل ومفعل'
                      : 'Connecté'
                    : 'Non configuré'}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                {lang === 'ar'
                  ? 'إدارة شحنات وطبيات AINAR CREATIVE حسب كل ولاية وبلدية'
                  : 'Gestion des expéditions & tarifs par wilaya et commune'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://zimou.express/panel/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/20"
            >
              <span>{lang === 'ar' ? 'ملفي الشخصي في زيمو' : 'Mon Profil Zimou'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'status'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'ar' ? 'حالة الحساب والربط' : 'Statut & Synchronisation'}
          </button>
          <button
            onClick={() => setActiveTab('tarifs')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'tarifs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أسعار الولايات والبلديات (58)' : 'Tarifs Wilayas & Communes'}</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إنشاء طرد جديد (Bordereau)' : 'Nouveau Colis'}</span>
          </button>
          <button
            onClick={() => setActiveTab('parcels')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'parcels'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? `الطرود والشحنات (${parcels.length})`
                : `Colis expédiés (${parcels.length})`}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مفتاح الـ API والإعدادات' : 'Clé API & Paramètres'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Account Status */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Linked Account Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'حساب الشحن والتوصيل الرسمي' : 'Compte Transporteur Officiel'}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Zimou Express Partner</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {lang === 'ar'
                        ? 'البريد الإلكتروني المعتمد في زيمو إكسبريس:'
                        : 'Compte associé :'}{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        ainarcreative@gmail.com
                      </span>
                    </p>
                  </div>

                  <a
                    href="https://zimou.express/panel/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-center"
                  >
                    <span>{lang === 'ar' ? 'فتح لوحة زيمو إكسبريس' : 'Accéder au panel'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Status grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {lang === 'ar' ? 'تغطية التوصيل' : 'Couverture'}
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    58 ولاية + البلديات
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'توصيل للمنزل وللمكتب (Stop Desk)' : 'À domicile et Stop-Desk'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {lang === 'ar' ? 'تحصيل الأموال (COD)' : 'Paiement à la livraison'}
                  </span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    50% + الشحن
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'تحصيل آمن للمتبقي يداً بيد' : 'Encaissement du solde'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {lang === 'ar' ? 'الربط التلقائي' : 'Intégration API'}
                  </span>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    جاهز ومفعل
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {settings.apiToken
                      ? lang === 'ar'
                        ? 'مفتاح الـ API مضاف'
                        : 'Token configuré'
                      : lang === 'ar'
                      ? 'يمكنك إضافة Token من الإعدادات'
                      : 'Token optionnel'}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  <span>
                    {lang === 'ar'
                      ? 'كيف يعمل ربط البلديات والتوصيل مع زيمو إكسبريس؟'
                      : 'Fonctionnement de l’intégration'}
                  </span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <li>
                    {lang === 'ar'
                      ? 'يختار الزبون ولايته وبلديته في الحاسبة ليظهر له سعر التوصيل الدقيق لباب المنزل أو لمكتب زيمو.'
                      : 'Le client sélectionne sa wilaya et commune, le tarif exact s’affiche automatiquement.'}
                  </li>
                  <li>
                    {lang === 'ar'
                      ? 'يدفع الزبون 50٪ فقط من قيمة التصميم عبر بريدي موب أو CCP، ويُدفع الباقي + ثمن التوصيل عند الاستلام.'
                      : 'Acompte 50% par BaridiMob/CCP, solde + livraison réglés à la réception.'}
                  </li>
                  <li>
                    {lang === 'ar'
                      ? 'تنشئ البوليصة هنا أو تتابع شحناتك مباشرة في حسابك بـ https://zimou.express/panel/profile.'
                      : 'Gestion centralisée sur le site et synchronisée avec votre profil Zimou.'}
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Tarifs List (Wilayas & Communes) */}
          {activeTab === 'tarifs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute top-3 start-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTarif}
                    onChange={(e) => setSearchTarif(e.target.value)}
                    placeholder="ابحث بالولاية أو البلدية (الجزائر، وهران، بوفاريك، العلمة...)"
                    className="w-full ps-9 pe-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {filteredWilayas.length} ولاية متوفرة
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredWilayas.map((w) => (
                  <div
                    key={w.code}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs">
                          {w.code}
                        </span>
                        <span>{w.nameAr}</span>
                        <span className="text-slate-400 font-normal">({w.nameFr})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Home className="w-3.5 h-3.5 text-indigo-500" />
                        <span>للمنزل:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {w.homeDeliveryPrice} د.ج
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-purple-500" />
                        <span>المكتب (Stop Desk):</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {w.deskDeliveryPrice} د.ج
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">البلديات: </span>
                      {w.communes.slice(0, 5).join('، ')}
                      {w.communes.length > 5 && ` (+${w.communes.length - 5} بلدية أخرى)`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Create Parcel */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateParcel} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300">
                {lang === 'ar'
                  ? 'املأ بيانات الزبون لاختيار الولاية والبلدية وإنشاء طرد جديد في زيمو إكسبريس واستخراج رقم التتبع فوراً'
                  : 'Renseignez les détails du client pour créer une expédition Zimou Express'}
              </div>

              {createSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>
                      {lang === 'ar'
                        ? `تم إنشاء الطرد بنجاح في زيمو إكسبريس! رقم التتبع: ${createSuccess}`
                        : `Colis enregistré ! N° de suivi : ${createSuccess}`}
                    </span>
                  </div>
                  <a
                    href="https://zimou.express/panel/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-indigo-600 dark:text-indigo-300 hover:text-indigo-800"
                  >
                    {lang === 'ar' ? 'معاينة في زيمو' : 'Voir dans Zimou'}
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'ar' ? 'اسم المستلم / العميل' : 'Nom du destinataire'}
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="مثال: محمد بن علي"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'ar' ? 'رقم هاتف المستلم' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="06XXXXXXXX / 07XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Wilaya & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'ar' ? 'الولاية' : 'Wilaya'}
                  </label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => handleWilayaChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {algeriaWilayasData.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameAr} ({w.nameFr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'ar' ? 'البلدية' : 'Commune'}
                  </label>
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {activeWilaya.communes.map((commune, idx) => (
                      <option key={idx} value={commune}>
                        {commune}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery method + Price to collect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    طريقة التوصيل
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('home')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        deliveryType === 'home'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      منزل ({activeWilaya.homeDeliveryPrice} د.ج)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('desk')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        deliveryType === 'desk'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      مكتب ({activeWilaya.deskDeliveryPrice} د.ج)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'ar' ? 'المبلغ المطلوب تحصيله نقداً (د.ج)' : 'Montant à encaisser (DZD)'}
                  </label>
                  <input
                    type="number"
                    value={amountToCollect}
                    onChange={(e) => setAmountToCollect(e.target.value)}
                    placeholder="50% المتبقية + ثمن التوصيل"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'تفاصيل الطلبية والمنتج' : 'Description du colis'}
                </label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إنشاء الطرد وتسجيله في زيمو إكسبريس' : 'Créer l’expédition'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: Parcels List */}
          {activeTab === 'parcels' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute top-3 start-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTracking}
                    onChange={(e) => setSearchTracking(e.target.value)}
                    placeholder={
                      lang === 'ar'
                        ? 'ابحث برقم التتبع (ZM-...) أو اسم الزبون أو الهاتف أو البلدية...'
                        : 'Rechercher par n° de suivi, nom...'
                    }
                    className="w-full ps-9 pe-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {filteredParcels.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                  <Package className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p>
                    {lang === 'ar'
                      ? 'لا توجد شحنات مسجلة حالياً. يمكنك إنشاء طردك الأول بسهولة من تبويب "إنشاء طرد جديد".'
                      : 'Aucun colis trouvé.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredParcels.map((parcel, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                            {parcel.trackingNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {parcel.status === 'pending' ? 'قيد التجهيز / زيمو' : parcel.status}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {parcel.recipientName} ({parcel.recipientPhone})
                        </div>
                        <div className="text-slate-500">
                          {parcel.wilaya} {parcel.commune && `- ${parcel.commune}`} · {parcel.serviceTitle}
                        </div>
                      </div>

                      <div className="text-start sm:text-end shrink-0 space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white">
                          المطلوب تحصيله: {parcel.amountToCollect.toLocaleString()} د.ج
                        </div>
                        <a
                          href="https://zimou.express/panel/profile"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                        >
                          <span>تتبع في Zimou Express</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: API & Settings */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveToken} className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'إعدادات مفتاح الـ API لشركة زيمو إكسبريس' : 'Configuration API'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'ar'
                    ? 'يمكنك الحصول على مفتاح API Token مباشرة من حسابك في https://zimou.express/panel/profile لربط الطلبات آلياً'
                    : 'Générez votre jeton API depuis votre tableau de bord Zimou Express'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Zimou Express API Token
                  </label>
                  <input
                    type="text"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="e.g. zmo_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {lang === 'ar'
                      ? 'مفتاح الربط الخاص بحساب ainarcreative@gmail.com'
                      : 'Jeton sécurisé associé à ainarcreative@gmail.com'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-500 mb-1">اسم المتجر / المرسل</label>
                    <input
                      type="text"
                      disabled
                      value="AINAR CREATIVE"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 mb-1">رابط الحساب الرسمي</label>
                    <a
                      href="https://zimou.express/panel/profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between"
                    >
                      <span className="truncate">zimou.express/panel/profile</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {tokenSaved && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'تم حفظ إعدادات زيمو إكسبريس بنجاح!' : 'Paramètres enregistrés !'}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  {lang === 'ar' ? 'حفظ إعدادات الربط' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-500" />
            <span>
              {lang === 'ar'
                ? 'شريك التوصيل المعتمد: زيمو إكسبريس (توصيل لكافة الولايات والبلديات)'
                : 'Partenaire livraison : Zimou Express'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://zimou.express/panel/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>https://zimou.express/panel/profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
