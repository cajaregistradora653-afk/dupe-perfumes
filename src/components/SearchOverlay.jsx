import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Sparkles, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dupes } from '../data/dupes';
import { useCart } from '../context/CartContext';
import { fromCatalogProduct, cheapestSize } from '../lib/cart';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Close on Escape key + scroll lock (con Lenis detenido, si no el
  // overlay queda congelado igual que el detalle en móvil)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      try { window.__lenis?.stop(); } catch { /* noop */ }
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      try { window.__lenis?.start(); } catch { /* noop */ }
    };
  }, [isOpen, onClose]);

  const filteredResults = query.trim().length > 0
    ? dupes.filter(dupe => {
        const q = query.toLowerCase();
        return (
          dupe.dupe?.toLowerCase().includes(q) ||
          dupe.codigo?.toLowerCase().includes(q) ||
          dupe.descripcion?.toLowerCase().includes(q) ||
          dupe.categoria?.toLowerCase().includes(q) ||
          dupe.genero?.toLowerCase().includes(q) ||
          dupe.acordes_principales?.some(a => a.toLowerCase().includes(q)) ||
          dupe.notas_salida?.some(n => n.toLowerCase().includes(q)) ||
          dupe.corazon?.some(n => n.toLowerCase().includes(q)) ||
          dupe.base?.some(n => n.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : [];

  const handleSelect = useCallback((item) => {
    onClose();
    // Navigate to catalog with the selected item's code as a query param
    navigate(`/catalogo?perfume=${encodeURIComponent(item.codigo)}`);
  }, [navigate, onClose]);

  const genderStyle = (g) => {
    if (g === 'Hombres') return 'bg-sky-50 text-sky-700';
    if (g === 'Dama') return 'bg-rose-50 text-rose-600';
    return 'bg-emerald-50 text-emerald-700';
  };

  // Popular quick searches
  const popularSearches = ['Poison Girl', 'Sauvage', 'Versace Eros', 'Coco Chanel', 'Kayali'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-moss/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="max-w-2xl mx-auto mt-20 md:mt-28 mx-4 md:mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-moss/10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-moss/10">
              <Search size={22} className="text-moss/30 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar perfumes, notas, categorías..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-lg text-moss bg-transparent outline-none placeholder:text-moss/30 font-elegant"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-moss/30 hover:text-moss transition-colors">
                  <X size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-[10px] font-bold uppercase tracking-widest text-moss/30 px-3 py-1.5 rounded-lg bg-moss/5 hover:bg-moss/10 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div data-lenis-prevent className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {query.trim().length === 0 ? (
                /* Popular Searches */
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-moss/30 block mb-4">
                    <Sparkles size={12} className="inline mr-2" />
                    Búsquedas populares
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 rounded-xl bg-shine/80 text-moss text-sm font-bold hover:bg-emerald/10 hover:text-emerald transition-all border border-transparent hover:border-emerald/20"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-moss/10" />
                    <button
                      onClick={() => { onClose(); navigate('/catalogo'); }}
                      className="text-[11px] font-bold uppercase tracking-widest text-emerald hover:text-moss transition-colors flex items-center gap-2"
                    >
                      Ver catálogo completo <ChevronRight size={14} />
                    </button>
                    <span className="h-px flex-1 bg-moss/10" />
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Search Results */
                <div className="py-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-moss/30 px-6 py-2 block">
                    {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''}
                  </span>
                  {filteredResults.map((item) => (
                    <div
                      key={item.codigo}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-shine/60 transition-all text-left group cursor-pointer"
                    >
                      {/* Bottle Image */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-shine to-white flex items-center justify-center shrink-0 overflow-hidden border border-moss/5">
                        <img
                          src={item.bottleImage || "/Images/perfume_isolated.webp"}
                          alt={item.dupe}
                          className="w-10 h-10 object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gold/10 text-gold">
                            Inspiración
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${genderStyle(item.genero)}`}>
                            {item.genero}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-moss group-hover:text-emerald transition-colors truncate">
                          {item.dupe}
                        </h4>
                        <span className="text-[11px] text-moss/40">
                          {item.categoria} · Desde ${Object.values(item.precios).sort((a, b) => {
                            const pa = parseFloat(a.replace(/\./g, ''));
                            const pb = parseFloat(b.replace(/\./g, ''));
                            return pa - pb;
                          })[0]}
                        </span>
                      </div>

                      {/* Arrow */}
                      <button
                        onClick={(e) => { e.stopPropagation(); addItem(fromCatalogProduct(item, cheapestSize(item.precios))); onClose(); openCart(); }}
                        aria-label={`Agregar ${item.dupe} al carrito`}
                        className="w-9 h-9 rounded-full bg-emerald/10 text-emerald flex items-center justify-center hover:bg-emerald hover:text-white active:scale-95 transition-all shrink-0"
                      >
                        <ShoppingCart size={15} />
                      </button>
                      <ChevronRight size={16} className="text-moss/20 group-hover:text-emerald group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                /* No Results */
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-moss/5 flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-moss/30" />
                  </div>
                  <h4 className="text-lg font-elegant text-moss mb-2">Sin resultados</h4>
                  <p className="text-sm text-moss/40 mb-4">No encontramos fragancias con "{query}"</p>
                  <button
                    onClick={() => { onClose(); navigate('/catalogo'); }}
                    className="text-xs font-bold uppercase tracking-widest text-emerald hover:text-moss transition-colors"
                  >
                    Explorar catálogo completo →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
