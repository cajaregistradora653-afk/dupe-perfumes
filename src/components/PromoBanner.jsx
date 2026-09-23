import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';

const SLIDES = [
  {
    id: 1,
    tag: 'DÍAS DUPÉ',
    discount: 'HASTA 50% OFF',
    subtitle: 'En comparación con fragancias originales de diseñador',
    highlight: 'Misma fijación y proyección de alta gama',
    buttonText: 'Ver Catálogo',
    route: '/catalogo',
    bgGradient: 'from-emerald via-moss to-[#1a382e]',
    badgeIcon: <Percent size={14} className="text-gold" />,
    image: '/Images/Barcelona/Frascos/Poison Girl Dior-Photoroom.webp'
  },
  {
    id: 2,
    tag: 'CREA TU ESENCIA',
    discount: 'LABORATORIO OLFATIVO',
    subtitle: 'Elige tu tamaño, perfil aromático y notas preferidas',
    highlight: 'Formulación personalizada para ti',
    buttonText: 'Personalizar Ahora',
    route: '/experiencia',
    bgGradient: 'from-[#2C1810] via-chestnut/90 to-moss',
    badgeIcon: <Sparkles size={14} className="text-gold" />,
    image: '/Images/perfume_refined.webp'
  },
  {
    id: 3,
    tag: 'DECANTS & MUESTRAS',
    discount: 'DESDE $26.000',
    subtitle: 'Colecciona y prueba fragancias de lujo en 5ml y 10ml',
    highlight: 'Envíos a todo Boyacá y Colombia',
    buttonText: 'Explorar Decants',
    route: '/catalogo?tipo=decant',
    bgGradient: 'from-moss via-emerald to-[#12382e]',
    badgeIcon: <Truck size={14} className="text-gold" />,
    image: '/Images/Barcelona/Frascos/Versace Eros-Photoroom.webp'
  }
];

const PromoBanner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [isCoarse] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia &&
    window.matchMedia('(hover: none)').matches
  );

  const go = useCallback((idx, dir) => {
    setDirection(dir ?? (idx > current ? 1 : -1));
    setCurrent(idx);
  }, [current]);

  useEffect(() => {
    if (paused || reduce) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused, reduce]);

  const slide = SLIDES[current];

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6 md:my-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-card border border-gold/20 min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={reduce || isCoarse ? { opacity: 0 } : { opacity: 0, x: 48 * direction, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={reduce || isCoarse ? { opacity: 0 } : { opacity: 0, x: -48 * direction, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: EASE_FLUID }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) { setDirection(1); setCurrent((current + 1) % SLIDES.length); }
              else if (info.offset.x > 60) { setDirection(-1); setCurrent((current - 1 + SLIDES.length) % SLIDES.length); }
            }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} p-6 sm:p-8 md:p-10 flex flex-col justify-between`}
          >
            {/* Background elements */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 h-full">
              {/* Left Content */}
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-gold-light text-[11px] font-bold tracking-widest uppercase mb-3 border border-white/15">
                  {slide.badgeIcon}
                  <span>{slide.tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white font-bold leading-tight drop-shadow-sm">
                  {slide.discount}
                </h3>

                <p className="text-linen/90 text-xs sm:text-sm md:text-base font-sans mt-2 max-w-md">
                  {slide.subtitle} — <span className="text-gold font-semibold">{slide.highlight}</span>
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <motion.button
                    onClick={() => navigate(slide.route)}
                    whileHover={reduce ? undefined : { scale: 1.05 }}
                    whileTap={reduce ? undefined : { scale: 0.96 }}
                    transition={SPRING_SOFT}
                    className="bg-gold text-emerald-950 font-bold px-6 py-2.5 min-h-[48px] rounded-full text-xs md:text-sm hover:bg-gold-light shadow-md flex items-center gap-2"
                  >
                    {slide.buttonText} <ArrowRight size={14} />
                  </motion.button>
                  <span className="text-[11px] text-linen/70 flex items-center gap-1 hidden sm:flex">
                    <ShieldCheck size={14} className="text-gold" /> Garantía de Calidad
                  </span>
                </div>
              </div>

              {/* Right Image */}
              <div className="hidden md:flex items-center justify-center shrink-0 w-44 h-44 relative">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
                <img
                  src={slide.image}
                  alt={slide.tag}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] animate-float"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => go(idx)}
              className="min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label={`Ir al slide ${idx + 1}`}
            >
              <span className={`h-2 rounded-full transition-all duration-300 block ${
                current === idx ? 'w-7 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
