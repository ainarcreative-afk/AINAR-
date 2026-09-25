import React, { useState } from 'react';
import { translations } from '../data/translations';
import { portfolioProjects, ProjectItem } from '../data/portfolio';
import { Language } from '../types';
import { ArrowUpRight, X, ExternalLink, MessageCircle, Layers } from 'lucide-react';

interface PortfolioSectionProps {
  lang: Language;
  projects?: ProjectItem[];
  onSelectForOrder?: (category: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  lang,
  projects = portfolioProjects,
  onSelectForOrder,
}) => {
  const t = translations[lang].portfolio;
  const [filter, setFilter] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filterTabs = [
    { key: 'all', label: t.filterAll },
    { key: 'apparel', label: t.filterApparel },
    { key: 'cards', label: t.filterCards },
    { key: 'storefront', label: t.filterStorefront },
    { key: 'books', label: t.filterBooks },
    { key: 'social', label: t.filterSocial },
    { key: 'web', label: t.filterWeb },
    { key: 'mugs', label: t.filterMugs },
  ];

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  const getTitle = (p: ProjectItem) => {
    if (lang === 'ar') return p.titleAr;
    if (lang === 'fr') return p.titleFr;
    return p.titleEn;
  };

  const getDescription = (p: ProjectItem) => {
    if (lang === 'ar') return p.descriptionAr;
    if (lang === 'fr') return p.descriptionFr;
    return p.descriptionEn;
  };

  return (
    <section id="portfolio" className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Layers className="w-3.5 h-3.5" />
            <span>AINAR Portfolio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-start flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                <img
                  src={project.image}
                  alt={getTitle(project)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 start-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {project.client}
                </div>

                {/* Hover Reveal Button */}
                <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {getTitle(project)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {getDescription(project)}
                  </p>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-start">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/9 w-full bg-slate-900 overflow-hidden">
              <img
                src={activeProject.image}
                alt={getTitle(activeProject)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeProject.client}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {activeProject.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {getTitle(activeProject)}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {getDescription(activeProject)}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activeProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quick WhatsApp Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.closeModal}
                </button>
                <a
                  href={`https://wa.me/213673187994?text=${encodeURIComponent(
                    `مرحباً AINAR CREATIVE، أود طلب تصميم أو عمل مماثل لهذا المشروع: ${getTitle(
                      activeProject
                    )} (${activeProject.client})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.orderSimilar}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
