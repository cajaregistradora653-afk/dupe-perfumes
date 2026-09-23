// ─────────────────────────────────────────────
// Primitivos 21st.dev listos para copiar/pegar
// Reveal · MagneticButton · ScrollProgress · PageTransition · TiltCard
// ─────────────────────────────────────────────
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { EASE_FLUID, SPRING_SOFT, pageVariants } from '../lib/motion';

// — Fade-up al entrar en viewport (y:12, 0.35s, power1.out → ease fluido)
export const Reveal = ({ children, delay = 0, y = 14, className, once = true }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: EASE_FLUID }}
    >
      {children}
    </motion.div>
  );
};

// — Botón magnético sutil (sigue el cursor, vuelve con spring)
export const MagneticButton = ({ children, strength = 0.25, ...props }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy, display: 'inline-block' }}>
      <button {...props}>{children}</button>
    </motion.div>
  );
};

// — Barra de progreso de scroll (Liquid Glass + gold)
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-emerald via-gold to-gold-light"
      style={{ scaleX }}
    />
  );
};

// — Transiciones entre rutas (exit más rápido que enter)
export const PageTransition = ({ children }) => {
  const location = useLocation();
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname + location.search}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// — Card con tilt 3D + lift (hover no mueve layout, solo transform)
export const TiltCard = ({ children, className = '', max = 7 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [max, -max]);
  const rotateY = useTransform(mx, [0, 1], [-max, max]);

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { y: -6, transition: SPRING_SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// — Contenedor stagger genérico (sección)
export const Stagger = ({ children, className, stagger = 0.06, delay = 0.05 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-40px' }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_FLUID } },
    }}
  >
    {children}
  </motion.div>
);
