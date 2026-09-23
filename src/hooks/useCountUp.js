import { useEffect, useState } from 'react';

/** Anima un número 0 → target con ease-out. Respeta reduced-motion (salto directo). */
export const useCountUp = (target, { duration = 1100, delay = 0, enabled = true } = {}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf;
    let start;
    const t0 = performance.now() + delay;
    const tick = (t) => {
      if (t < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay, enabled]);

  return value;
};
