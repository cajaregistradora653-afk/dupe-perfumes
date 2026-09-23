import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { EASE_FLUID } from '../lib/motion';

/* Banner cinematográfico del Test de Fragancias.
   Video siempre silenciado (muted + pista webm sin audio),
   autoplay en loop. Con reduced-motion muestra solo el póster. */
const QuizVideoBanner = () => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_FLUID }}
      className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40 mb-5 sm:mb-8"
    >
      <video
        className="w-full h-24 sm:h-44 md:h-52 object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/test-fragancia-poster.webp"
        aria-label="Video ambiental del Test de Fragancias"
      >
        <source src="/videos/test-fragancia.webm" type="video/webm" />
        <source src="/videos/test-fragancia.mp4" type="video/mp4" />
      </video>
      {/* Degradado para legibilidad del badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30 pointer-events-none" />
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/60 backdrop-blur-md border border-gold/40 text-gold-light text-[10px] font-bold uppercase tracking-widest">
          <Sparkles size={12} /> Test de Fragancias
        </span>
      </div>
    </motion.div>
  );
};

export default QuizVideoBanner;
