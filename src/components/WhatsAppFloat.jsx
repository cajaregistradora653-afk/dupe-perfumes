import { motion, useReducedMotion } from 'framer-motion';
import { socialLinks } from '../data/fragrances';
import { EASE_FLUID } from '../lib/motion';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.685-1.386A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.318-.725-6.006-1.955a.5.5 0 00-.394-.082l-3.155.934.998-3.326a.5.5 0 00-.063-.407A9.946 9.946 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
  </svg>
);

const WhatsAppFloat = () => {
  const reduce = useReducedMotion();
  const href = `${socialLinks.whatsapp}?text=${encodeURIComponent('¡Hola! Vengo de la página web y quiero asesoría sobre fragancias.')}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.45, ease: EASE_FLUID }}
      whileHover={reduce ? undefined : { scale: 1.08 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className="group fixed left-4 bottom-[84px] md:left-5 md:bottom-5 z-[90] flex items-center gap-0 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.45)] hover:bg-[#1EBE5B] hover:shadow-[0_16px_36px_rgba(37,211,102,0.55)] transition-colors"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Ping de atención */}
      {!reduce && (
        <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      )}
      <span className="relative flex items-center justify-center w-14 h-14 shrink-0">
        <WhatsAppIcon className="w-7 h-7" />
      </span>
      {/* Etiqueta expandible en desktop */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[160px] group-hover:pr-5 text-sm font-bold">
        ¿Te ayudamos?
      </span>
    </motion.a>
  );
};

export default WhatsAppFloat;
