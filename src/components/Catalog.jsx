import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fragrances } from '../data/fragrances';
import { Search, ChevronRight, Wind, FileText, Download, Sparkles } from 'lucide-react';

const Catalog = () => {
  const [activeTab, setActiveTab] = useState('masculine');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'masculine', name: 'Hombres', icon: <Wind size={18} /> },
    { id: 'feminine', name: 'Mujeres', icon: <Wind size={18} /> },
    { id: 'niche', name: 'Nicho', icon: <Wind size={18} /> },
  ];

  const catalogPDFs = {
    masculine: {
      label: 'Carta Hombres',
      href: '/Fragances/CARTA POR CASA BENIET 2025_Hombres.pdf',
      description: 'Descarga la colección completa de fragancias masculinas',
    },
    feminine: {
      label: 'Carta Mujeres',
      href: '/Fragances/CARTA POR CASA BENIET 2025_Mujeres.pdf',
      description: 'Descarga la colección completa de fragancias femeninas',
    },
    niche: {
      label: 'Carta Nicho',
      href: '/Fragances/CARTA NICHO ACTUALIZADA POR CASA.pdf',
      description: 'Descarga el catálogo exclusivo de fragancias de nicho',
    },
  };

  const currentFragrances = fragrances[activeTab].filter(item =>
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.names.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="catalogo" className="pt-12 pb-6 md:pt-24 md:pb-12 bg-gradient-to-b from-linen via-shine/20 to-shine/20 relative overflow-hidden">
      {/* Decorative Botanical Background Element (Floating Leaf) */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 -right-20 w-[500px] h-[500px] text-moss/5 pointer-events-none opacity-30 select-none"
      >
        <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,20 C100,20 80,60 100,100 C120,60 100,20 100,20 M100,100 C100,100 60,120 20,100 C60,80 100,100 100,100 M100,100 C100,100 140,120 180,100 C140,80 100,100 100,100 M100,100 C100,100 120,140 100,180 C80,140 100,100 100,100" />
        </svg>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-linen/50 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header (Asymmetric) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-12 mb-10 md:mb-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-moss mb-4 md:mb-6">
              <span className="h-px w-8 md:w-12 bg-moss/30"></span>
              <span className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[11px] md:text-xs font-bold">Nuestros Aromas</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-5 md:mb-10 leading-none tracking-tight">
              <span className="font-elegant text-emerald block mb-1 md:mb-2">Esencias que Narran</span>
              <span className="font-cursive text-moss text-3xl md:text-5xl lg:text-6xl xl:text-7xl block ml-6 md:ml-12 lg:ml-20">Historias</span>
            </h2>
            <p className="text-stone text-base md:text-xl leading-relaxed max-w-lg font-elegant">
              Una galería exclusiva diseñada con formas orgánicas para que encuentres tu bienestar en cada nota capturada.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col gap-4 w-full lg:w-96">
            <div className="relative group">
              <input
                type="text"
                placeholder="Encuentra tu aroma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-moss/10 rounded-pill py-4 md:py-5 px-8 pl-12 focus:ring-2 focus:ring-emerald transition-all text-moss shadow-sm group-hover:shadow-md font-elegant text-sm md:text-base"
              />
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-moss/30" size={18} />
            </div>
            <div className="flex justify-end lg:justify-start">
              <a 
                href="#dupes" 
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald hover:text-moss transition-colors flex items-center gap-2 group/link"
              >
                ¿Buscas la Colección Barcelona? <Sparkles size={14} className="group-hover/link:rotate-12 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 md:mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none px-4 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 relative overflow-hidden ${activeTab === tab.id
                ? 'bg-emerald text-shine shadow-[0_15px_40px_rgba(30,81,68,0.25)] scale-105'
                : 'bg-white text-moss/60 hover:text-moss hover:bg-linen border border-chestnut/5'
                }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
              )}
            </button>
          ))}
        </div>

        {/* Grid — 2-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-8 md:gap-y-20">
          <AnimatePresence mode="popLayout">
            {currentFragrances.map((item, index) => (
              <motion.div
                key={`${activeTab}-${item.brand}-${index}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white via-[#FCFAF8] to-linen rounded-organic p-4 md:p-8 h-full border border-white shadow-[0_15px_40px_rgba(60,90,75,0.08)] transition-all group-hover:shadow-[0_40px_100px_rgba(30,81,68,0.15)] md:group-hover:-translate-y-3 flex flex-col relative z-10">

                  <div className="absolute top-0 right-0 w-16 md:w-32 h-16 md:h-32 bg-emerald/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  <div className="rounded-organic overflow-hidden aspect-[4/5] md:aspect-square mb-4 md:mb-8 border-2 md:border-4 border-white shadow-md md:shadow-xl relative group-hover:scale-105 transition-transform duration-700">
                    <img
                      src={activeTab === 'masculine' ? '/Images/category_men.webp' : activeTab === 'feminine' ? '/Images/category_women.webp' : '/Images/perfume_refined.webp'}
                      alt={item.brand}
                      className="w-full h-full object-cover transition-all group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
                  </div>

                  <div className="flex justify-between items-start mb-2 md:mb-6">
                    <h3 className="text-sm md:text-2xl font-elegant text-emerald group-hover:text-moss transition-colors leading-tight">{item.brand}</h3>
                    <div className="hidden md:block px-3 py-1 bg-emerald/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald border border-emerald/10">
                      Premium
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-8 flex-grow">
                    {item.names.slice(0, 2).map((name, i) => (
                      <div key={i} className="flex items-center gap-2 text-moss/80">
                        <div className="w-1 h-1 rounded-full bg-emerald/30 shrink-0"></div>
                        <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider truncate">{name}</span>
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center justify-center md:justify-between w-full p-2.5 md:p-4 bg-emerald text-linen rounded-lg md:rounded-xl font-bold text-[8px] md:text-[10px] uppercase tracking-widest transition-all hover:bg-moss active:scale-95 shadow-md shadow-emerald/10 gap-1">
                    <span className="hidden md:inline">Consultar Disponibilidad</span>
                    <span className="md:hidden">Consultar</span>
                    <ChevronRight size={12} className="md:hidden" />
                    <ChevronRight size={16} className="hidden md:inline" />
                  </button>
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-emerald/5 blur-2xl rounded-full -z-10 group-hover:bg-emerald/10 transition-all"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contextual PDF Strip — reacts to active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-10 md:mt-20"
          >
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 md:px-12 md:py-9 bg-gradient-to-r from-emerald to-moss rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(30,81,68,0.2)] border border-white/10">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

              {/* Text */}
              <div className="relative z-10 flex items-center gap-5 text-shine">
                <div className="hidden sm:flex shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl items-center justify-center border border-white/20 backdrop-blur-sm">
                  <FileText size={22} className="text-linen" />
                </div>
                <div>
                  <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-linen/50 mb-0.5">Catálogo oficial</p>
                  <p className="text-lg md:text-xl font-elegant leading-snug">{catalogPDFs[activeTab].label}</p>
                  <p className="text-linen/50 text-xs md:text-sm mt-0.5">{catalogPDFs[activeTab].description}</p>
                </div>
              </div>

              {/* Download button */}
              <a
                href={catalogPDFs[activeTab].href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 shrink-0 flex items-center gap-3 px-7 py-3.5 md:px-9 md:py-4 bg-linen text-emerald rounded-pill font-bold text-sm hover:bg-shine active:scale-95 transition-all shadow-xl shadow-black/20"
              >
                <Download size={16} />
                <span>Descargar PDF</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Catalog;
