import React, { useState, useEffect } from 'react';
import { translations } from '../data/translations';
import {
  ServiceConfig,
  ServiceOption,
  UrgentFeeConfig,
  DEFAULT_URGENT_CONFIG,
} from '../data/services';
import { algeriaWilayasData, WilayaData } from '../data/wilayas';
import { Language, ServiceMode } from '../types';
import {
  Calculator,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Minus,
  Sparkles,
  Zap,
  MapPin,
  Building2,
  Home,
  Percent,
  Paintbrush,
  Printer,
} from 'lucide-react';

interface OrderCalculatorProps {
  lang: Language;
  services: ServiceConfig[];
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
  initialIsUrgent?: boolean;
  initialMode?: ServiceMode;
  urgentFee?: number; // legacy prop compatibility
  urgentConfig?: UrgentFeeConfig;
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  lang,
  services,
  selectedServiceId,
  onSelectServiceId,
  initialIsUrgent = false,
  initialMode,
  urgentFee = 1500,
  urgentConfig = DEFAULT_URGENT_CONFIG,
}) => {
  const t = translations[lang].calculator;

  // Mode filter tab state ('all' | 'design_only' | 'design_and_print')
  const [activeModeFilter, setActiveModeFilter] = useState<'all' | ServiceMode>(
    initialMode || 'all'
  );

  // Sync initialMode if updated from external clicks
  useEffect(() => {
    if (initialMode) {
      setActiveModeFilter(initialMode);
    }
  }, [initialMode]);

  // Find active service safely
  const currService =
    services.find((s) => s.id === selectedServiceId) || services[0] || {
      id: 'apparel',
      key: 'apparel',
      startingPrice: 2500,
      options: [],
    };

  // Filtered options based on selected Mode tab
  const eligibleOptions = currService.options.filter((opt) => {
    if (activeModeFilter === 'all') return true;
    if (activeModeFilter === 'design_only') return opt.mode === 'design_only';
    if (activeModeFilter === 'design_and_print') return opt.mode === 'design_and_print' || !opt.mode;
    return true;
  });

  // Display options fallback to all if filtered is empty
  const displayOptions = eligibleOptions.length > 0 ? eligibleOptions : currService.options;

  // Form states
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    displayOptions[0]?.id || currService.options[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(
    displayOptions[0]?.minQuantity || 1
  );
  const [isUrgent, setIsUrgent] = useState<boolean>(initialIsUrgent);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Wilaya and Commune selection with Zimou Express rates
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<string>('16'); // Default Alger (16)
  const currentWilaya: WilayaData =
    algeriaWilayasData.find((w) => w.code === selectedWilayaCode) || algeriaWilayasData[15];

  const [selectedCommune, setSelectedCommune] = useState<string>(
    currentWilaya.communes[0] || ''
  );
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialIsUrgent) {
      setIsUrgent(true);
    }
  }, [initialIsUrgent]);

  // Keep option synced when service changes or mode filter changes
  useEffect(() => {
    if (displayOptions.length > 0) {
      const exists = displayOptions.find((o) => o.id === selectedOptionId);
      if (!exists) {
        setSelectedOptionId(displayOptions[0].id);
        setQuantity(displayOptions[0].minQuantity || 1);
      }
    }
  }, [currService, activeModeFilter, selectedOptionId, displayOptions]);

  // When wilaya changes, select its first commune
  const handleWilayaChange = (code: string) => {
    setSelectedWilayaCode(code);
    const target = algeriaWilayasData.find((w) => w.code === code);
    if (target && target.communes.length > 0) {
      setSelectedCommune(target.communes[0]);
    } else {
      setSelectedCommune('');
    }
  };

  // Active option
  const activeOption =
    displayOptions.find((o) => o.id === selectedOptionId) ||
    currService.options.find((o) => o.id === selectedOptionId) ||
    currService.options[0];

  // Check if current chosen option is Design Only (digital files only, no parcel shipping needed)
  const isDesignOnly = activeOption?.mode === 'design_only';

  const handleServiceChange = (serviceId: string) => {
    onSelectServiceId(serviceId);
    const newService = services.find((s) => s.id === serviceId);
    if (newService && newService.options.length > 0) {
      setSelectedOptionId(newService.options[0].id);
      setQuantity(newService.options[0].minQuantity || 1);
    }
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOptionId(optionId);
    const opt = currService.options.find((o) => o.id === optionId);
    if (opt) {
      setQuantity(Math.max(quantity, opt.minQuantity));
    }
  };

  const getOptionName = (opt: ServiceOption) => {
    if (lang === 'ar') return opt.nameAr;
    if (lang === 'fr') return opt.nameFr;
    return opt.nameEn;
  };

  const getServiceTitle = (svcKey: string) => {
    return (
      translations[lang].services.items[
        svcKey as keyof typeof translations.ar.services.items
      ]?.title || svcKey
    );
  };

  // Delivery fee from Zimou Express based on wilaya & type (0 if Design Only digital delivery)
  const deliveryFee = isDesignOnly
    ? 0
    : deliveryType === 'home'
    ? currentWilaya.homeDeliveryPrice
    : currentWilaya.deskDeliveryPrice;

  // Calculations with separate Urgent Fee (Fixed or Percentage) & Delivery Fee
  const unitPrice = activeOption ? activeOption.basePrice : currService.startingPrice;
  const subtotalPrice = unitPrice * quantity;

  // Determine active urgent fee configuration
  const activeUrgentType = urgentConfig?.type || 'fixed';
  const activeUrgentValue = urgentConfig ? urgentConfig.value : urgentFee;

  // Compute exact calculated fee amount in DZD
  const computedUrgentAmount =
    activeUrgentType === 'percentage'
      ? Math.round((subtotalPrice * activeUrgentValue) / 100)
      : activeUrgentValue;

  const currentUrgentFee = isUrgent ? computedUrgentAmount : 0;
  const serviceTotal = subtotalPrice + currentUrgentFee;
  const deposit50 = Math.round(serviceTotal * 0.5);
  // Remaining balance = 50% balance of service + delivery fee paid to courier
  const balance50 = serviceTotal - deposit50;
  const totalDueAtDelivery = balance50 + deliveryFee;
  const grandTotalWithDelivery = serviceTotal + deliveryFee;

  // Display label for the urgent fee badge
  const urgentBadgeLabel =
    activeUrgentType === 'percentage'
      ? `+${activeUrgentValue}% (${computedUrgentAmount.toLocaleString()} د.ج)`
      : `+${activeUrgentValue.toLocaleString()} د.ج`;

  const handleIncrement = () => {
    const step = activeOption?.unitStep || 1;
    setQuantity((prev) => prev + step);
  };

  const handleDecrement = () => {
    const step = activeOption?.unitStep || 1;
    const min = activeOption?.minQuantity || 1;
    setQuantity((prev) => Math.max(min, prev - step));
  };

  const generateWhatsAppMessage = () => {
    const optionName = activeOption ? getOptionName(activeOption) : '';
    const serviceTitle = getServiceTitle(currService.key);
    const wilayaName = `${currentWilaya.code} - ${currentWilaya.nameAr} (${currentWilaya.nameFr})`;
    const deliveryTypeLabel =
      deliveryType === 'home'
        ? 'توصيل للمنزل / للمقر (À domicile)'
        : 'استلام من مكتب زيمو إكسبريس (Stop Desk)';

    const modeTextAr = isDesignOnly
      ? '🎨 [طلب تصميم جرافيكي فقط - تسليم ملفات رقمية مفتوحة عالية الدقة 300DPI]'
      : '🖨️ [طلب تصميم جرافيكي + طباعة وتوصيل إلى باب العنوان/المكتب]';

    if (lang === 'ar') {
      const urgentText =
        activeUrgentType === 'percentage'
          ? `+${activeUrgentValue}% (+${computedUrgentAmount.toLocaleString()} د.ج)`
          : `+${computedUrgentAmount.toLocaleString()} د.ج`;

      return `مرحباً وكالة AINAR CREATIVE 👋
${modeTextAr}
${
  isUrgent
    ? `⚡⚡ [طلب مستعجل فائق السرعة VIP (${urgentText})] ⚡⚡\n`
    : ''
}أود تقديم طلب بالمعلومات والمواصفات التالية:
----------------------------------------
📌 *الخدمة المطلوبة:* ${serviceTitle}
🎨 *نوع الطلب:* ${isDesignOnly ? 'تصميم فقط (ملفات جاهزة للمطبعة)' : 'تصميم + طباعة وتوصيل'}
🔍 *النوع والمواصفات:* ${optionName}
🔢 *الكمية:* ${quantity}
💵 *تكلفة الخدمة الأساسية:* ${subtotalPrice.toLocaleString()} د.ج
${isUrgent ? `⚡ *رسوم الطلب المستعجل (VIP):* ${urgentText}\n` : ''}💰 *قيمة الخدمة الإجمالية:* ${serviceTotal.toLocaleString()} د.ج
💳 *العربون المطلوب (50٪ عند الطلب):* ${deposit50.toLocaleString()} د.ج
----------------------------------------
${
  isDesignOnly
    ? `📁 *طريقة التسليم:* تسليم إلكتروني للملفات المصدرية المفتوحة (Google Drive / WeTransfer / WhatsApp) بدقة 300DPI وCMYK جاهزة فوراً دون شحن.`
    : `🚚 *تفاصيل التوصيل (شركة زيمو إكسبريس Zimou):*
📍 *الولاية:* ${wilayaName}
🏙️ *البلدية:* ${selectedCommune || 'حسب العنوان المرفق'}
🏢 *نوع التوصيل:* ${deliveryTypeLabel}
📦 *سعر توصيل زيمو:* ${deliveryFee.toLocaleString()} د.ج
💵 *المبلغ الإجمالي المسدد عند الاستلام:* ${totalDueAtDelivery.toLocaleString()} د.ج (المتبقي 50٪ + التوصيل)`
}
----------------------------------------
👤 *الاسم / المؤسسة:* ${fullName.trim() || 'غير محدد'}
📞 *رقم الهاتف:* ${phone.trim() || '0673187994'}
📝 *ملاحظات خاصة بالتصميم:* ${notes.trim() || 'لا توجد ملاحظات إضافية'}
----------------------------------------
أرجو تزويدي برقم حساب BaridiMob (بريدي موب) أو حساب CCP لتحويل العربون (50٪) والبدء فوراً. شكراً لكم!`;
    }

    if (lang === 'fr') {
      return `Bonjour AINAR CREATIVE 👋
${
  isUrgent
    ? `⚡⚡ [COMMANDE URGENTE VIP EXPRESS (+${urgentFee.toLocaleString()} DZD)] ⚡⚡\n`
    : ''
}Je souhaite passer commande avec les informations suivantes :
----------------------------------------
📌 *Service :* ${serviceTitle}
🎨 *Option choisie :* ${optionName}
🔢 *Quantité :* ${quantity}
💵 *Tarif service :* ${serviceTotal.toLocaleString()} DZD
💳 *Acompte requis (50%) :* ${deposit50.toLocaleString()} DZD
----------------------------------------
🚚 *Livraison Zimou Express :*
📍 *Wilaya :* ${currentWilaya.code} - ${currentWilaya.nameFr}
🏙️ *Commune :* ${selectedCommune}
🏢 *Option :* ${deliveryType === 'home' ? 'À domicile' : 'Stop Desk (Bureau)'}
📦 *Tarif livraison Zimou :* ${deliveryFee.toLocaleString()} DZD
💵 *Total payable à la réception :* ${totalDueAtDelivery.toLocaleString()} DZD (Solde 50% + livraison)
----------------------------------------
👤 *Nom / Client :* ${fullName.trim() || 'Non spécifié'}
📞 *Téléphone :* ${phone.trim() || '0673187994'}
📝 *Détails / Notes :* ${notes.trim() || 'Aucune note particulière'}
----------------------------------------
Merci de m'envoyer le compte BaridiMob ou CCP pour verser l'acompte de 50% et démarrer.`;
    }

    return `Hello AINAR CREATIVE 👋
${
  isUrgent
    ? `⚡⚡ [VIP URGENT PRIORITY RUSH ORDER (+${urgentFee.toLocaleString()} DZD)] ⚡⚡\n`
    : ''
}I would like to place an order with the following details:
----------------------------------------
📌 *Service:* ${serviceTitle}
🎨 *Option:* ${optionName}
🔢 *Quantity:* ${quantity}
💵 *Service Total:* ${serviceTotal.toLocaleString()} DZD
💳 *Required Deposit (50%):* ${deposit50.toLocaleString()} DZD
----------------------------------------
🚚 *Zimou Express Shipping:*
📍 *Wilaya:* ${currentWilaya.code} - ${currentWilaya.nameFr}
🏙️ *Commune:* ${selectedCommune}
🏢 *Method:* ${deliveryType === 'home' ? 'Home Delivery' : 'Stop Desk'}
📦 *Zimou Shipping Fee:* ${deliveryFee.toLocaleString()} DZD
💵 *Total Due at Delivery:* ${totalDueAtDelivery.toLocaleString()} DZD (50% balance + shipping)
----------------------------------------
👤 *Name / Company:* ${fullName.trim() || 'Not specified'}
📞 *Phone Number:* ${phone.trim() || '0673187994'}
📝 *Design Notes:* ${notes.trim() || 'None'}
----------------------------------------
Please send BaridiMob or postal CCP transfer details for the 50% advance deposit to start right away.`;
  };

  const handleSendOrder = () => {
    const text = generateWhatsAppMessage();
    const url = `https://wa.me/213673187994?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Calculator className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'حاسبة فورية + حساب سعر التوصيل مع زيمو'
                : lang === 'fr'
                ? 'Calculateur instantané + Tarifs Zimou'
                : 'Instant Quote & Zimou Express Delivery'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Selectors (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/90 dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-start">
            
            {/* Mode Selector Tabs: Design Only vs Design + Print */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{lang === 'ar' ? 'اختر صيغة ونوع الطلب:' : lang === 'fr' ? 'Formule du service :' : 'Order Mode:'}</span>
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {lang === 'ar' ? 'تصميم فقط (رقمي) أو تصميم + طباعة' : 'Design Seul ou Avec Impression'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModeFilter('all')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    activeModeFilter === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'عرض الكل' : lang === 'fr' ? 'Tous' : 'All'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModeFilter('design_only')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeModeFilter === 'design_only'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'التصميم فقط' : lang === 'fr' ? 'Design Seul' : 'Design Only'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModeFilter('design_and_print')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeModeFilter === 'design_and_print'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تصميم + طباعة' : lang === 'fr' ? 'Design + Print' : 'Design + Print'}</span>
                </button>
              </div>
            </div>

            {/* Urgent Order Toggle Callout with Explicit Price Badge */}
            <div
              onClick={() => setIsUrgent(!isUrgent)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isUrgent
                  ? 'bg-amber-500/10 border-amber-500 dark:border-amber-400 text-amber-950 dark:text-amber-100 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isUrgent
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  <Zap className={`w-5 h-5 ${isUrgent ? 'fill-white' : ''}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                    <span>{t.urgentBadge}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                      {urgentBadgeLabel}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.urgentDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  {isUrgent
                    ? lang === 'ar'
                      ? 'مفعّل ⚡'
                      : 'Activé ⚡'
                    : lang === 'ar'
                    ? 'انقر للتفعيل'
                    : 'Activer'}
                </span>
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                    isUrgent
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                  }`}
                >
                  {isUrgent && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Service Selection Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t.serviceLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {services.map((svc) => {
                  const title = getServiceTitle(svc.key);
                  const isSelected = svc.id === currService.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => handleServiceChange(svc.id)}
                      className={`cursor-pointer p-3 rounded-xl border text-xs font-bold transition-all text-start flex flex-col justify-between h-20 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="line-clamp-2">{title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {svc.startingPrice.toLocaleString()} {translations[lang].services.dzd}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options Selection */}
            {displayOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.optionsLabel}
                  </label>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {displayOptions.length} {lang === 'ar' ? 'خيارات' : 'options'}
                  </span>
                </div>

                <div className="space-y-2">
                  {displayOptions.map((opt) => {
                    const isSelected = opt.id === selectedOptionId;
                    const isOptDesignOnly = opt.mode === 'design_only';

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleOptionChange(opt.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isOptDesignOnly
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {isOptDesignOnly
                                ? (lang === 'ar' ? '🎨 تصميم فقط' : '🎨 Design Seul')
                                : (lang === 'ar' ? '🖨️ تصميم + طباعة' : '🖨️ Design + Print')}
                            </span>
                            <p className="text-xs sm:text-sm font-semibold">
                              {getOptionName(opt)}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {lang === 'ar'
                              ? `الحد الأدنى: ${opt.minQuantity}`
                              : `Min: ${opt.minQuantity}`}
                          </span>
                        </div>
                        <div className="text-end shrink-0">
                          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {opt.basePrice.toLocaleString()}{' '}
                            <span className="text-[10px] text-slate-500 font-normal">
                              {translations[lang].services.dzd}
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.quantityLabel}
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lang === 'ar'
                    ? `خطوة الزيادة: +${activeOption?.unitStep || 1}`
                    : `Incrément : +${activeOption?.unitStep || 1}`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-800 dark:text-white cursor-pointer active:scale-95 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center text-lg font-black text-slate-900 dark:text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Client Coordinates + Wilaya + Commune + Zimou Delivery Rates */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.clientInfo}
                </label>
                <div className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>توصيل مع زيمو إكسبريس (Zimou Express)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Delivery and Wilaya selection (Visible if Design + Print, or replaced by Digital Delivery badge if Design Only) */}
              {!isDesignOnly ? (
                <>
                  {/* Wilaya Selection & Commune Selection Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Wilaya select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span>{lang === 'ar' ? 'اختر الولاية' : 'Wilaya'}</span>
                      </label>
                      <select
                        value={selectedWilayaCode}
                        onChange={(e) => handleWilayaChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {algeriaWilayasData.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.nameAr} / {w.nameFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Commune select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-indigo-500" />
                        <span>{lang === 'ar' ? 'اختر البلدية' : 'Commune'}</span>
                      </label>
                      <select
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {currentWilaya.communes.map((commune, idx) => (
                          <option key={idx} value={commune}>
                            {commune}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Delivery Type Option (Home vs Stop Desk) with Zimou Pricing */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      {lang === 'ar'
                        ? 'طريقة وسعر التوصيل لـ ' + currentWilaya.nameAr + ' عبر زيمو إكسبريس:'
                        : 'Mode de livraison Zimou Express :'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Home delivery option */}
                      <div
                        onClick={() => setDeliveryType('home')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          deliveryType === 'home'
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div>
                            <div className="text-xs font-bold">
                              {lang === 'ar' ? 'توصيل للمنزل / للمقر' : 'À domicile'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {lang === 'ar' ? 'لباب العنوان المحدد' : 'Directement chez vous'}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                            {currentWilaya.homeDeliveryPrice.toLocaleString()} د.ج
                          </span>
                        </div>
                      </div>

                      {/* Stop desk / pickup option */}
                      <div
                        onClick={() => setDeliveryType('desk')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          deliveryType === 'desk'
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                          <div>
                            <div className="text-xs font-bold">
                              {lang === 'ar' ? 'استلام من مكتب زيمو' : 'Stop Desk (Bureau)'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {lang === 'ar' ? 'نقطة استلام أقرب إليك' : 'Point relais Zimou'}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                            {currentWilaya.deskDeliveryPrice.toLocaleString()} د.ج
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Notice for Design Only delivery */
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
                  <Paintbrush className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold block">
                      {lang === 'ar' ? 'تسليم إلكتروني فوري ومباشر (بدون شحن):' : 'Livraison Digitale Directe :'}
                    </span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-300">
                      {lang === 'ar'
                        ? 'طلب التصميم الجرافيكي فقط لا يحتاج شحناً؛ ستتسلم كافة الملفات الأصلية بصيغ (PDF, AI, PNG 300DPI) عبر الإيميل أو الواتساب أو Google Drive فور إنجازها.'
                        : 'Les fichiers source haute résolution seront livrés directement via Email, WhatsApp ou Google Drive sans frais de livraison.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Design Notes */}
              <div>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Summary: Financial Breakdown (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4 text-start">
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-700/40 relative overflow-hidden">
              {/* Background ambient badge */}
              <div
                className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{t.summaryTitle}</span>
                  </h3>
                  {isUrgent ? (
                    <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/30">
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>URGENT VIP ({urgentBadgeLabel})</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300">
                      50% / 50%
                    </span>
                  )}
                </div>

                {/* Selection overview */}
                <div className="space-y-1.5 text-xs text-indigo-200/90">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الخدمة:</span>
                    <span className="font-semibold text-white">
                      {getServiceTitle(currService.key)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">النوع:</span>
                    <span className="font-semibold text-white line-clamp-1 max-w-[200px]">
                      {activeOption ? getOptionName(activeOption) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">الكمية:</span>
                    <span className="font-semibold text-white">{quantity}</span>
                  </div>

                  {/* Mode & Details */}
                  <div className="flex justify-between">
                    <span className="text-slate-400">{lang === 'ar' ? 'نوع الطلب:' : 'Formule :'}</span>
                    <span className="font-semibold text-white">
                      {isDesignOnly
                        ? (lang === 'ar' ? '🎨 تصميم جرافيكي فقط (رقمي)' : '🎨 Design Graphique Seul')
                        : (lang === 'ar' ? '🖨️ تصميم + طباعة وتوصيل' : '🖨️ Design + Print & Livraison')}
                    </span>
                  </div>

                  {/* Delivery Location badge */}
                  {!isDesignOnly ? (
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-slate-400">الولاية والبلدية:</span>
                      <span className="font-semibold text-white text-end">
                        {currentWilaya.nameAr} - {selectedCommune}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-slate-400">طريقة الاستلام:</span>
                      <span className="font-semibold text-emerald-400 text-end">
                        تسليم ملفات أصلية (Email / Drive / WhatsApp)
                      </span>
                    </div>
                  )}

                  {isUrgent && (
                    <div className="flex justify-between text-amber-300 font-bold pt-1 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-300" />
                        سعر الطلب المستعجل:
                      </span>
                      <span>+{computedUrgentAmount.toLocaleString()} {translations[lang].services.dzd} {activeUrgentType === 'percentage' ? `(${activeUrgentValue}%)` : ''}</span>
                    </div>
                  )}
                </div>

                {/* Total breakdown */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-300">تكلفة الخدمة الإجمالية:</span>
                    <div className="text-xl font-black text-white tabular-nums">
                      {serviceTotal.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-indigo-300">
                        {translations[lang].services.dzd}
                      </span>
                    </div>
                  </div>

                  {/* Zimou Delivery Fee Row */}
                  {!isDesignOnly ? (
                    <div className="flex items-center justify-between text-xs text-amber-300">
                      <span className="flex items-center gap-1 font-semibold">
                        <Truck className="w-3.5 h-3.5" />
                        توصيل زيمو ({deliveryType === 'home' ? 'للمنزل' : 'مكتب'}):
                      </span>
                      <span className="font-black tabular-nums">
                        +{deliveryFee.toLocaleString()} {translations[lang].services.dzd}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-emerald-300">
                      <span className="flex items-center gap-1 font-semibold">
                        <Paintbrush className="w-3.5 h-3.5" />
                        شحن وتسليم الملفات:
                      </span>
                      <span className="font-bold">
                        مجاني (تسليم إلكتروني فوري)
                      </span>
                    </div>
                  )}

                  <div className="h-px bg-white/10 my-2" />

                  {/* 50% Deposit */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">
                      {t.advanceDeposit}:
                    </span>
                    <span className="text-sm font-black text-emerald-400 tabular-nums">
                      {deposit50.toLocaleString()} {translations[lang].services.dzd}
                    </span>
                  </div>

                  {/* 50% On delivery + Shipping */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-bold">
                      {isDesignOnly ? 'المتبقي عند تسليم الملفات (50٪):' : `${t.balanceOnDelivery}:`}
                    </span>
                    <span className="text-sm font-black text-purple-300 tabular-nums">
                      {balance50.toLocaleString()} {translations[lang].services.dzd}
                    </span>
                  </div>

                  {/* Total to pay courier on arrival */}
                  {!isDesignOnly ? (
                    <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-between text-xs text-white">
                      <span className="font-bold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        المسدد عند الاستلام مع زيمو:
                      </span>
                      <span className="font-black text-amber-300 tabular-nums text-sm">
                        {totalDueAtDelivery.toLocaleString()} {translations[lang].services.dzd}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-200 text-center font-medium">
                      ✨ تسليم الملفات المفتوحة الأصلية بدقة عالية فور سداد الرصيد
                    </div>
                  )}
                </div>

                {/* Submit to WhatsApp */}
                <button
                  type="button"
                  onClick={handleSendOrder}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer ${
                    isUrgent
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black shadow-amber-500/25 ring-2 ring-amber-400/50'
                      : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-indigo-500/30'
                  }`}
                >
                  {isUrgent ? (
                    <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  <span>{isUrgent ? t.sendUrgentWhatsApp : t.sendWhatsApp}</span>
                </button>

                {/* Direct info prompt */}
                <div className="text-center pt-2">
                  <p className="text-xs text-indigo-300/80 mb-1">
                    {t.directChatPrompt}
                  </p>
                  <a
                    href="https://wa.me/213673187994"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>0673187994</span>
                    <span>(واتساب فوري)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Guarantee note card - BaridiMob and CCP deposit + Zimou COD */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  {lang === 'ar'
                    ? 'طريقة الدفع والشحن المعتمدة مع زيمو إكسبريس'
                    : 'Modalités de paiement et livraison Zimou'}
                </span>
              </div>
              <p className="leading-relaxed">
                {lang === 'ar'
                  ? 'يتم دفع عربون 50٪ فقط عبر تطبيق بريدي موب (BaridiMob) أو حساب CCP للبدء في التصميم. بينما يُدفع باقي المبلغ (50٪) + ثمن توصيل زيمو إكسبريس نقداً لمندوب التوصيل عند استلام الطرد في بلديتك.'
                  : 'Acompte 50% réglé par BaridiMob ou CCP à la commande. Le solde restant (50%) + les frais de livraison Zimou Express sont réglés en espèces à la livraison.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
