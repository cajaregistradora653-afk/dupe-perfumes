import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles, Eye, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dupes } from '../data/dupes';
import { useCart } from '../context/CartContext';
import { fromCatalogProduct, cheapestSize } from '../lib/cart';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';
import { Reveal } from './motion-primitives';

/* ── Accord dot colours ── */
const ACCORD_COLORS = {
  'avainillado': '#FF9800', 'atalcado': '#8D6E63', 'almizclado': '#9E9E9E',
  'cítrico': '#FFEB3B', 'fresco especiado': '#42A5F5', 'verde': '#66BB6A',
  'amaderado': '#A1887F', 'ámbar': '#FF7043', 'dulce': '#F06292',
  'afrutados': '#EF5350', 'fresco': '#29B6F6', 'floral blanco': '#D7CCC8',
  'rosas': '#EC407A', 'cálido especiado': '#FF8A65',
};

const AccordDot = ({ name }) => {
  const color = ACCORD_COLORS[name.toLowerCase()] || '#BDBDBD';
  return (
    <span
      title={name}
      className="inline-block w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm shrink-0 transition-transform hover:scale-125"
      style={{ backgroundColor: color }}
    />
  );
};

const genderStyle = (g) => {
  if (g === 'Hombres') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (g === 'Dama') return 'bg-rose-50 text-rose-600 border-rose-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

const CatalogPreview = () => {
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const [hoveredCode, setHoveredCode] = useState(null);
  const scrollRef = useRef(null);
  const reduce = useReducedMotion();

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.7 * (direction === 'left' ? -1 : 1);
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Pick 6 highlighted dupes (diverse categories/genders)
  const featured = [
    dupes.find(d => d.codigo === '0R1585-DEC1585'),   // Poison Girl (Dama, Dulce)
    dupes.find(d => d.codigo === '0R0047-DECO047'),    // Versace Eros (Hombres, Dulce)
    dupes.find(d => d.codigo === '0R1797-DEC1797'),    // Coco Mademoiselle (Dama, Floral)
    dupes.find(d => d.codigo === '0R1793-DEC1793'),    // Eden Juicy Apple (Unisex, Frutal)
    dupes.find(d => d.codigo === '0R1579-DEC1579'),    // Sauvage Elixir (Hombres, Fresco)
    dupes.find(d => d.codigo === '0R1578-DEC1578'),    // Angels' Share (Unisex, Dulce)
  ].filter(Boolean);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald/[0.03] rounded-full blur-[120px] pointer-events-none" />
      {/* Decorative dot texture + gold glow */}
      <div className="absolute left-0 top-10 w-1/3 h-64 opacity-[0.07] pointer-events-none bg-[radial-gradient(#1E5144_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute -right-20 bottom-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header + flechas del carrusel */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <Reveal>
            <div className="flex items-center gap-3 text-emerald mb-3">
              <motion.span
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_FLUID }}
                className="h-px w-10 bg-emerald/30 origin-left"
              />
              <span className="uppercase tracking-[0.35em] text-[11px] font-bold">Selección Destacada</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-emerald leading-tight">
                Te Puede <span className="font-cursive text-moss text-3xl sm:text-5xl">Gustar</span>
              </h2>
              <div className="hidden sm:flex items-center gap-2 shrink-0 pb-2">
                <button
                  onClick={() => handleScroll('left')}
                  className="w-10 h-10 rounded-full bg-white border border-moss/10 flex items-center justify-center text-moss/70 hover:bg-ink hover:text-white hover:border-ink transition-all shadow-sm"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="w-10 h-10 rounded-full bg-white border border-moss/10 flex items-center justify-center text-moss/70 hover:bg-ink hover:text-white hover:border-ink transition-all shadow-sm"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <p className="text-moss/70 text-sm md:text-base font-sans leading-relaxed max-w-xl mt-4">
              Inspiradas en las fragancias más codiciadas a nivel mundial. Conoce nuestras fórmulas más elogiadas por su fijación.
            </p>
          </Reveal>
        </div>

        {/* Cards — carrusel horizontal con peek (estilo referencia) */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-1 scroll-smooth"
        >
          {featured.map((item, index) => {
            const isHovered = hoveredCode === item.codigo;

            return (
              <motion.article
                key={item.codigo}
                layout
                initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: EASE_FLUID }}
                whileHover={reduce ? undefined : { y: -6, transition: SPRING_SOFT }}
                onMouseEnter={() => {
                  setHoveredCode(item.codigo);
                  if (item.image) new Image().src = item.image;
                  if (item.bottleImage) new Image().src = item.bottleImage;
                }}
                onMouseLeave={() => setHoveredCode(null)}
                onClick={() => navigate(`/catalogo?perfume=${encodeURIComponent(item.codigo)}`)}
                className="group bg-white rounded-3xl border border-moss/[0.08] overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover hover:border-gold/40 flex flex-col relative min-w-[78%] sm:min-w-[46%] lg:min-w-[31.5%] snap-start shrink-0 will-change-transform"
              >
                {/* Perfume Image & Top Badges */}
                <div className="relative bg-[#F4F4F4] p-6 pb-2 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald text-white shadow-sm flex items-center gap-1 border border-gold/30">
                      <Sparkles size={10} className="text-gold" /> Inspiración 1.1
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.descuento && (
                        <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[#E91E8C] text-white shadow-sm">
                          {item.descuento}
                        </span>
                      )}
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${genderStyle(item.genero)}`}>
                        {item.genero}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center my-2">
                    <img
                      src={item.bottleImage || "/Images/perfume_isolated.webp"}
                      alt={item.dupe}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Quick Preview Overlay */}
                  <div className={`absolute inset-0 bg-emerald/95 backdrop-blur-md p-6 flex flex-col justify-between text-white transition-all duration-300 z-30 ${
                    isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">
                            Notas & Acordes
                          </span>
                          <h4 className="text-lg font-serif font-bold text-white line-clamp-1">
                            {item.dupe}
                          </h4>
                        </div>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={`Ficha ${item.dupe}`}
                            className="w-11 h-14 object-cover rounded-lg border border-white/30 shadow-md shrink-0"
                            loading="lazy"
                          />
                        )}
                      </div>
                      {item.notas_salida?.length > 0 && (
                        <p className="text-xs text-linen/90 font-sans mb-1.5">
                          <strong className="text-gold-light">Salida:</strong> {item.notas_salida.slice(0, 3).join(', ')}
                        </p>
                      )}
                      {item.corazon?.length > 0 && (
                        <p className="text-xs text-linen/90 font-sans mb-2">
                          <strong className="text-gold-light">Corazón:</strong> {item.corazon.slice(0, 3).join(', ')}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.acordes_principales?.slice(0, 3).map(a => (
                          <span key={a} className="text-[9px] bg-white/15 px-2 py-0.5 rounded-full text-linen font-medium uppercase">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-linen/70 font-bold">
                          {Object.keys(item.precios || {}).length} presentaciones
                        </span>
                        <span className="text-sm font-bold text-gold font-sans">
                          Desde ${Object.values(item.precios || {}).sort((a, b) => parseFloat(a.replace(/\./g, '')) - parseFloat(b.replace(/\./g, '')))[0]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gold text-xs font-bold">
                        <span className="flex items-center gap-1"><Eye size={14} /> Vista Rápida</span>
                        <span>Ver Ficha &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 pt-3 flex flex-col flex-grow bg-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-moss/40 mb-1">
                    Familia {item.categoria}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-ink leading-snug mb-1 group-hover:text-emerald transition-colors line-clamp-2 min-h-[3.5rem]">
                    {item.dupe}
                  </h3>

                  {/* Accord dots */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {item.acordes_principales?.slice(0, 5).map(a => (
                      <AccordDot key={a} name={a} />
                    ))}
                    {item.acordes_principales?.length > 5 && (
                      <span className="text-[9px] text-moss/40 font-bold ml-1">+{item.acordes_principales.length - 5}</span>
                    )}
                  </div>

                  {/* Price Row */}
                  <div className="mt-auto pt-3 border-t border-moss/[0.08] flex items-end justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-moss/40 block">Desde</span>
                      <span className="text-2xl font-bold text-ink leading-none">
                        ${Object.values(item.precios).sort((a, b) => {
                          const pa = parseFloat(a.replace(/\./g, ''));
                          const pb = parseFloat(b.replace(/\./g, ''));
                          return pa - pb;
                        })[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-emerald font-bold text-xs group-hover:translate-x-1 transition-transform">
                        <span>Ver Perfume</span>
                        <ChevronRight size={16} />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); addItem(fromCatalogProduct(item, cheapestSize(item.precios))); openCart(); }}
                        aria-label={`Agregar ${item.dupe} al carrito`}
                        className="w-10 h-10 rounded-full bg-emerald text-white flex items-center justify-center hover:bg-moss active:scale-95 transition-all shadow-md shadow-emerald/25 shrink-0"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CTA to full catalog */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/catalogo')}
            className="inline-flex items-center gap-3 bg-emerald text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider hover:bg-moss transition-all shadow-md shadow-emerald/20 hover:scale-105 active:scale-95 group border border-gold/30"
          >
            <span>Ver Catálogo Completo (23+ Fragancias)</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;
