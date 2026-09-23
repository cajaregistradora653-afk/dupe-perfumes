import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../lib/cart';

const CartItemRow = ({ item }) => {
  const { setQty, removeItem } = useCart();

  return (
    <div className="flex gap-3.5 py-4 border-b border-moss/10 last:border-0">
      <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-b from-shine to-white border border-moss/10 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={item.image || '/Images/perfume_isolated.webp'}
          alt={item.name}
          className="w-14 h-14 object-contain"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-moss leading-snug truncate">{item.name}</h4>
            <p className="text-[11px] text-moss/50 font-semibold mt-0.5">
              {item.sizeLabel}
              {item.codigo ? ` · Cód. ${item.codigo}` : ''}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.key)}
            aria-label={`Quitar ${item.name} del carrito`}
            className="p-1.5 rounded-lg text-moss/30 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1 bg-linen/70 border border-moss/10 rounded-full p-1">
            <button
              onClick={() => setQty(item.key, item.qty - 1)}
              aria-label="Disminuir cantidad"
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-moss hover:bg-moss hover:text-white transition-colors shadow-sm"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-sm font-extrabold text-moss tabular-nums">{item.qty}</span>
            <button
              onClick={() => setQty(item.key, item.qty + 1)}
              aria-label="Aumentar cantidad"
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-moss hover:bg-moss hover:text-white transition-colors shadow-sm"
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-emerald">{formatCOP(item.unitPrice * item.qty)}</span>
            {item.qty > 1 && (
              <span className="block text-[11px] text-moss/40 font-semibold">{formatCOP(item.unitPrice)} c/u</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
