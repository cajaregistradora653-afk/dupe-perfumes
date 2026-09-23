import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartButton = ({ className = '', iconSize = 20 }) => {
  const { count, openCart, lastAddedAt } = useCart();
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito (${count} productos)`}
      className={`relative p-2 hover:bg-ink/5 rounded-full transition-colors text-ink ${className}`}
    >
      <ShoppingBag size={iconSize} />
      {count > 0 && (
        <motion.span
          key={lastAddedAt}
          initial={reduce ? false : { scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-emerald text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </button>
  );
};

export default CartButton;
