import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ShoppingBag, Trash2, ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../lib/cart';
import { checkoutProviders, buildOrder } from '../lib/payments';
import { EASE_FLUID } from '../lib/motion';
import CartItemRow from './CartItemRow';

const CartDrawer = () => {
  const { items, isOpen, closeCart, count, subtotal, clear } = useCart();
  const reduce = useReducedMotion();
  const [confirmClear, setConfirmClear] = useState(false);

  const whatsapp = checkoutProviders.find((p) => p.id === 'whatsapp');
  const gateway = checkoutProviders.find((p) => p.id === 'gateway');

  // Al abrir el carrito: lock robusto (body fixed preserva scrollY) + Lenis detenido
  useEffect(() => {
    if (!isOpen) return;
    const y = window.scrollY;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    try { window.__lenis?.stop(); } catch { /* noop */ }
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, y);
      try { window.__lenis?.start(); } catch { /* noop */ }
    };
  }, [isOpen]);

  const handleCheckout = () => {
    if (!items.length) return;
    buildOrder(items);
    whatsapp.checkout(items);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_FLUID }}
            onClick={closeCart}
            className="fixed inset-0 z-[120] bg-moss/60 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label="Carrito de compras"
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: '100%', opacity: 0.5 }}
            transition={reduce ? { duration: 0.2 } : { type: 'tween', duration: 0.3, ease: EASE_FLUID }}
            className="fixed top-0 right-0 z-[121] h-full h-dvh w-full max-w-md bg-white shadow-2xl flex flex-col"
            onKeyDown={(e) => e.key === 'Escape' && closeCart()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-moss/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-emerald leading-none">Tu Carrito</h3>
                  <p className="text-[11px] text-moss/50 font-bold uppercase tracking-widest mt-1">
                    {count === 0 ? 'Vacío' : `${count} producto${count !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="w-9 h-9 rounded-xl bg-moss/5 hover:bg-moss/10 flex items-center justify-center text-moss transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-linen flex items-center justify-center text-moss/25 mb-5">
                  <ShoppingBag size={34} />
                </div>
                <h4 className="text-xl font-serif font-bold text-moss mb-2">Tu carrito está vacío</h4>
                <p className="text-sm text-moss/50 leading-relaxed mb-6">
                  Explora el catálogo y agrega tus fragancias favoritas. El pedido se confirma por WhatsApp.
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-emerald text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-all shadow-lg shadow-emerald/20"
                >
                  Explorar catálogo <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-2">
                  {items.map((item) => (
                    <CartItemRow key={item.key} item={item} />
                  ))}
                  <button
                    onClick={() => (confirmClear ? (clear(), setConfirmClear(false)) : setConfirmClear(true))}
                    onBlur={() => setConfirmClear(false)}
                    className="mt-3 mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-moss/35 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={13} /> {confirmClear ? 'Toca de nuevo para confirmar' : 'Vaciar carrito'}
                  </button>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-moss/10 bg-white px-5 pt-5 pb-safe space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-moss/50">Subtotal</span>
                    <span className="text-2xl font-extrabold text-emerald">{formatCOP(subtotal)}</span>
                  </div>
                  <p className="text-[11px] text-moss/45 leading-relaxed">
                    Envío se coordina por WhatsApp según tu ciudad. Aceptamos Nequi, Daviplata, Bancolombia y contraentrega.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 min-h-[52px] bg-[#25D366] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-[#1EBE5B] active:scale-[0.98] transition-all shadow-lg shadow-emerald/20 flex items-center justify-center gap-2"
                  >
                    {whatsapp.label}
                  </button>
                  <button
                    disabled
                    title="La pasarela de pagos se habilitará próximamente"
                    className="w-full py-3.5 bg-white text-moss/40 border border-moss/15 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock size={14} /> {gateway.label} · Próximamente
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
