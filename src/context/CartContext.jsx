import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { CART_STORAGE_KEY, cartCount, cartSubtotal } from '../lib/cart';

const CartContext = createContext(null);

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((it) => it && it.key && it.qty > 0) : [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item, qty = 1 } = action.payload;
      const existing = state.items.find((i) => i.key === item.key);
      const items = existing
        ? state.items.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i))
        : [...state.items, { ...item, qty }];
      return { ...state, items, lastAddedAt: Date.now() };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.key !== action.payload.key) };
    case 'SET_QTY': {
      const { key, qty } = action.payload;
      if (qty <= 0) return { ...state, items: state.items.filter((i) => i.key !== key) };
      return { ...state, items: state.items.map((i) => (i.key === key ? { ...i, qty } : i)) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    items: loadInitial(),
    isOpen: false,
    lastAddedAt: 0,
  }));

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* noop */
    }
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      count: cartCount(state.items),
      subtotal: cartSubtotal(state.items),
      lastAddedAt: state.lastAddedAt,
      addItem: (item, qty = 1) => dispatch({ type: 'ADD', payload: { item, qty } }),
      removeItem: (key) => dispatch({ type: 'REMOVE', payload: { key } }),
      setQty: (key, qty) => dispatch({ type: 'SET_QTY', payload: { key, qty } }),
      clear: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};
