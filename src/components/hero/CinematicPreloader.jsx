import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_FLUID } from '../../lib/motion';

// Preloader cinematográfico: conteo 0→100 + cortina de salida.
// Se muestra una vez por sesión (sessionStorage).
export const CinematicPreloader = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { onDone?.(); return; }
    try {
      if (sessionStorage.getItem('dupe-preloader') === 'done') { onDone?.(); return; }
    } catch { /* noop */ }
    setVisible(true);
    const start = performance.now();
    const dur = 900;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      // ease-out para sensación premium
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setVisible(false);
          try { sessionStorage.setItem('dupe-preloader', 'done'); } catch { /* noop */ }
          onDone?.();
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[80] bg-ink text-linen flex flex-col items-center justify-center overflow-hidden"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: EASE_FLUID } }}
        >
          <motion.img
            src="/Images/Dupé_logo.jpg"
            alt="Dupé"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_FLUID }}
            className="w-16 h-16 rounded-full object-cover border border-gold/40 shadow-glow mb-5"
          />
          <div className="font-serif text-3xl md:text-4xl tracking-tight">
            Dupé <span className="font-cursive text-gold-light font-normal">Parfums</span>
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.4em] text-linen/50">
            Sogamoso · Plaza Barcelona
          </div>
          <div className="mt-8 w-52 h-px bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-light"
              style={{ width: `${count}%` }}
            />
          </div>
          <div className="mt-3 text-xs font-bold tracking-[0.3em] text-gold-light tabular-nums">{count}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
