import { useMotionValue, useSpring } from 'framer-motion';
import { useCallback } from 'react';

// Parallax por mouse con springs (capas texto / frasco / glow).
// Devuelve refs handlers + valores suavizados listos para style={{ x, y }}.
export const useMouseParallax = (strength = 18) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.8 });
  const y = useSpring(my, { stiffness: 90, damping: 20, mass: 0.8 });

  const onMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    mx.set(((e.clientX / innerWidth) - 0.5) * strength * 2);
    my.set(((e.clientY / innerHeight) - 0.5) * strength * 2);
  }, [mx, my, strength]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return { x, y, onMove, onLeave };
};
