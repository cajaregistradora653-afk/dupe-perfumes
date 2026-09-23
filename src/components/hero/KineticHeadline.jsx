import { motion, useReducedMotion } from 'framer-motion';
import { EASE_FLUID } from '../../lib/motion';

// Titular kinético por caracteres — lujo editorial.
// Uso: <KineticHeadline text="Creado para ti" />
export const KineticHeadline = ({ text = '', className = '', as: Tag = 'span', delay = 0.15 }) => {
  const reduce = useReducedMotion();
  const chars = text.split('');
  if (reduce) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%', rotate: 5, opacity: 0 }}
            animate={{ y: '0%', rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: delay + i * 0.028, ease: EASE_FLUID }}
          >
            {c === ' ' ? '\u00A0' : c}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};
