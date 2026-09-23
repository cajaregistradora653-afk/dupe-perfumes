import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const AddToCartButton = ({ item, qty = 1, className = '', label = 'Agregar al carrito', openAfter = true }) => {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!item) return;
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    if (openAfter) setTimeout(openCart, 250);
  };

  return (
    <button
      onClick={handleAdd}
      className={`flex items-center justify-center text-center gap-2 w-full py-4 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest active:scale-[0.98] transition-all ${
        added
          ? 'bg-emerald text-white shadow-lg shadow-emerald/20'
          : 'bg-ink text-white hover:bg-moss shadow-lg shadow-ink/20'
      } ${className}`}
    >
      {added ? <Check size={16} className="shrink-0" /> : <ShoppingCart size={16} className="shrink-0" />}
      <span>{added ? '¡Agregado!' : label}</span>
    </button>
  );
};

export default AddToCartButton;
