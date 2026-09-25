/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Theme, ServiceMode } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PaymentBanner } from './components/PaymentBanner';
import { ServicesSection } from './components/ServicesSection';
import { OrderCalculator } from './components/OrderCalculator';
import { PortfolioSection } from './components/PortfolioSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { WorkflowSection } from './components/WorkflowSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminModal } from './components/AdminModal';
import { ZimouModal } from './components/ZimouModal';
import {
  getStoredServices,
  ServiceConfig,
  getStoredUrgentFee,
  getStoredUrgentConfig,
  UrgentFeeConfig,
} from './data/services';
import {
  getStoredSectionOrder,
  getStoredPortfolio,
  getStoredAgencyInfo,
  SectionOrderItem,
  AgencyInfo,
} from './data/customization';
import { ProjectItem } from './data/portfolio';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ainar_theme') as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>('apparel');
  const [selectedServiceMode, setSelectedServiceMode] = useState<ServiceMode | undefined>(undefined);
  const [isUrgentOrderActive, setIsUrgentOrderActive] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isZimouModalOpen, setIsZimouModalOpen] = useState<boolean>(false);

  // Dynamic Admin customizable state
  const [services, setServices] = useState<ServiceConfig[]>(getStoredServices());
  const [urgentFee, setUrgentFee] = useState<number>(getStoredUrgentFee());
  const [urgentConfig, setUrgentConfig] = useState<UrgentFeeConfig>(getStoredUrgentConfig());
  const [sectionsOrder, setSectionsOrder] = useState<SectionOrderItem[]>(getStoredSectionOrder());
  const [portfolio, setPortfolio] = useState<ProjectItem[]>(getStoredPortfolio());
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>(getStoredAgencyInfo());

  // Sync RTL and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync dark class on documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('ainar_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenCalculator = (isUrgent: boolean = false) => {
    setIsUrgentOrderActive(isUrgent);
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForOrder = (
    serviceId: string,
    isUrgent: boolean = false,
    mode?: ServiceMode
  ) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceMode(mode);
    handleOpenCalculator(isUrgent);
  };

  // Render individual sections based on Admin configured order
  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <Hero
            key="hero"
            lang={lang}
            onOpenCalculator={() => handleOpenCalculator(false)}
            onOpenUrgentOrder={() => handleOpenCalculator(true)}
          />
        );
      case 'paymentBanner':
        return <PaymentBanner key="paymentBanner" lang={lang} />;
      case 'services':
        return (
          <ServicesSection
            key="services"
            lang={lang}
            services={services}
            onSelectServiceForOrder={handleSelectServiceForOrder}
          />
        );
      case 'calculator':
        return (
          <OrderCalculator
            key="calculator"
            lang={lang}
            services={services}
            selectedServiceId={selectedServiceId}
            onSelectServiceId={setSelectedServiceId}
            initialIsUrgent={isUrgentOrderActive}
            initialMode={selectedServiceMode}
            urgentFee={urgentFee}
            urgentConfig={urgentConfig}
          />
        );
      case 'portfolio':
        return (
          <PortfolioSection
            key="portfolio"
            lang={lang}
            projects={portfolio}
            onSelectForOrder={(cat) => handleSelectServiceForOrder(cat, false)}
          />
        );
      case 'social':
        return <SocialMediaSection key="social" lang={lang} />;
      case 'workflow':
        return <WorkflowSection key="workflow" lang={lang} />;
      case 'faq':
        return <FAQSection key="faq" lang={lang} />;
      case 'contact':
        return <ContactSection key="contact" lang={lang} agencyInfo={agencyInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCalculator={() => handleOpenCalculator(false)}
        onOpenUrgentOrder={() => handleOpenCalculator(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenZimou={() => setIsZimouModalOpen(true)}
      />

      {/* Main Content dynamically sorted according to Admin order & visibility */}
      <main>
        {sectionsOrder
          .filter((section) => section.visible)
          .map((section) => renderSection(section.id))}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        agencyInfo={agencyInfo}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Persistent Floating WhatsApp Button */}
      <FloatingWhatsApp lang={lang} whatsappNumber={agencyInfo.whatsappNumber} />

      {/* Full-Powered Admin Control Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
        services={services}
        onUpdateServices={(updated) => setServices(updated)}
        urgentFee={urgentFee}
        onUpdateUrgentFee={(fee) => setUrgentFee(fee)}
        urgentConfig={urgentConfig}
        onUpdateUrgentConfig={(cfg) => setUrgentConfig(cfg)}
        sectionsOrder={sectionsOrder}
        onUpdateSectionsOrder={(updated) => setSectionsOrder(updated)}
        portfolio={portfolio}
        onUpdatePortfolio={(updated) => setPortfolio(updated)}
        agencyInfo={agencyInfo}
        onUpdateAgencyInfo={(updated) => setAgencyInfo(updated)}
        onOpenZimou={() => setIsZimouModalOpen(true)}
      />

      {/* Zimou Express Integration & Parcel Management Modal */}
      <ZimouModal
        isOpen={isZimouModalOpen}
        onClose={() => setIsZimouModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
