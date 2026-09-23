import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CATEGORIES_DATA } from '../data/categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';

const CategoryBubbles = ({ activeFilter, onSelectCategory }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const reduce = useReducedMotion();

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    if (onSelectCategory && cat.filterType) {
      onSelectCategory(cat.filterType);
    } else if (cat.route) {
      navigate(cat.route);
    }
  };

  return (
    <div className="w-full relative py-6 md:py-8">
      {/* Controls for desktop */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-gold block">
            Explora por Categoría
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-emerald font-bold">
            Líneas & Experiencias
          </h3>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-white/80 border border-moss/10 flex items-center justify-center text-moss/70 hover:bg-emerald hover:text-white hover:border-emerald transition-all shadow-sm"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-white/80 border border-moss/10 flex items-center justify-center text-moss/70 hover:bg-emerald hover:text-white hover:border-emerald transition-all shadow-sm"
            aria-label="Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Bubble List */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 md:gap-8 overflow-x-auto no-scrollbar mask-fade-x py-2 px-1 scroll-smooth snap-x"
      >
        {CATEGORIES_DATA.map((cat, idx) => {
          const isSelected = activeFilter && activeFilter === cat.filterType;

          return (
            <motion.button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.04, 0.3), duration: 0.35, ease: EASE_FLUID }}
              whileHover={reduce ? undefined : { y: -3, transition: SPRING_SOFT }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="flex flex-col items-center shrink-0 group focus:outline-none snap-start text-center w-[86px] sm:w-[100px] md:w-[115px]"
            >
              {/* Circular Avatar Container — estilo referencia (círculo gris limpio) */}
              <div
                className={`relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] md:w-[94px] md:h-[94px] rounded-full transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-ink ring-offset-2 ring-offset-linen scale-105 shadow-md'
                    : 'bg-[#E9E7E4] group-hover:scale-105 group-hover:shadow-md'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title */}
              <span className={`mt-3 text-xs sm:text-sm font-bold tracking-tight transition-colors line-clamp-1 ${
                isSelected ? 'text-ink' : 'text-ink/80 group-hover:text-ink'
              }`}>
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBubbles;
