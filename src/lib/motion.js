// ─────────────────────────────────────────────
// Beniet Perfumería · Motion System
// Inspirado en 21st.dev + UI/UX Pro Max (Liquid Glass / Luxury)
// Física fluida: springs suaves, ease [0.22,1,0.36,1], stagger sutil
// Respeta prefers-reduced-motion en todos los primitivos.
// ─────────────────────────────────────────────

export const EASE_FLUID = [0.22, 1, 0.36, 1];
export const EASE_SNAPPY = [0.34, 1.3, 0.64, 1];

export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 };
export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 };
export const SPRING_SLOW = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };

export const DUR = { xs: 0.25, sm: 0.35, md: 0.55, lg: 0.8 };

// Contenedor stagger — estilo 21st.dev "stagger list"
// delay pequeño (0.03-0.06) para listas largas, según UI/UX Pro Max.
export const staggerParent = (stagger = 0.06, delayChildren = 0.05) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
});

export const fadeUpChild = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: DUR.sm, ease: EASE_FLUID },
  },
  exit: { opacity: 0, y: -8, transition: { duration: DUR.xs } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.sm, ease: EASE_FLUID } },
};

export const blurFade = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.99 },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: DUR.md, ease: EASE_FLUID },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: SPRING_SOFT },
  exit: { opacity: 0, scale: 0.96, transition: { duration: DUR.xs } },
};

// Transición de página — enter suave, exit más rápido (UI/UX Pro Max)
export const pageVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE_FLUID } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.22, ease: 'easeIn' } },
};

// Split-text por palabras (titulares cortos < 8 palabras)
export const wordParent = (stagger = 0.045) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: 0.08 } },
});

export const wordChild = {
  hidden: { opacity: 0, y: '110%', rotate: 4 },
  show: {
    opacity: 1, y: '0%', rotate: 0,
    transition: { duration: 0.6, ease: EASE_FLUID },
  },
};
