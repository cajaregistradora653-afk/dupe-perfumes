import { motion, useReducedMotion } from 'framer-motion';
import { EASE_FLUID } from '../lib/motion';
import { Reveal } from './motion-primitives';

// Header cinematográfico reutilizable para páginas internas.
// variant: "light" (catálogo, ofertas, noticias, sedes) | "dark" (experiencia/kiosco)
export const CinematicPageHeader = ({
  eyebrow = '',
  title = null,
  description = '',
  variant = 'light',
  align = 'left',
}) => {
  const reduce = useReducedMotion();
  const dark = variant === 'dark';
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'items-start text-left';

  return (
    <div className={`max-w-3xl mb-8 md:mb-12 flex flex-col ${alignCls}`}>
      <Reveal>
        <div className={`flex items-center gap-3 mb-3 ${dark ? 'text-gold-light' : 'text-emerald'}`}>
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_FLUID }}
            className={`h-px w-10 origin-left ${dark ? 'bg-gold/50' : 'bg-emerald/30'}`}
          />
          <span className="uppercase tracking-[0.35em] text-[11px] font-bold">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`text-3xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`text-sm md:text-base leading-relaxed max-w-xl mt-4 ${dark ? 'text-white/60' : 'text-ink/60'}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
};
