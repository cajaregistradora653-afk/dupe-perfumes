import { motion } from 'framer-motion';

const GoldDivider = ({ className = '', variant = 'default' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      {variant === 'thick' ? (
        <div className="gold-divider-thick" />
      ) : (
        <div className="gold-divider" />
      )}
      
      {/* Center diamond accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div 
          className="w-1.5 h-1.5 rotate-45 opacity-40"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D48B)' }}
        />
      </div>
    </motion.div>
  );
};

export default GoldDivider;
