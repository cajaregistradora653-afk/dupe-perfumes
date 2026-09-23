import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, Instagram, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Evento para abrir el buscador global desde la tab bar (el estado vive en Navbar)
export const openGlobalSearch = () => {
  window.dispatchEvent(new CustomEvent('dupe:open-search'));
};

const BottomTabBar = () => {
  const { count, openCart } = useCart();
  const location = useLocation();

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, to: '/' },
    { id: 'catalogo', label: 'Catálogo', icon: LayoutGrid, to: '/catalogo' },
    { id: 'buscar', label: 'Buscar', icon: Search, action: () => openGlobalSearch() },
    { id: 'siguenos', label: 'Síguenos', icon: Instagram, to: '/siguenos' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="md:hidden fixed bottom-0 inset-x-0 z-[95] bg-white/95 backdrop-blur-xl border-t border-ink/10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5 h-16">
        {tabs.map(({ id, label, icon: Icon, to, action }) => {
          const active = to ? isActive(to) : false;
          const cls = `relative flex flex-col items-center justify-center gap-1 min-h-[56px] min-w-0 active:bg-ink/5 transition-colors ${
            active ? 'text-emerald' : 'text-ink/50'
          }`;
          const inner = (
            <>
              {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-emerald" />}
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              <span className={`text-[10px] leading-none ${active ? 'font-extrabold' : 'font-semibold'}`}>
                {label}
              </span>
            </>
          );
          return to ? (
            <NavLink key={id} to={to} aria-label={label} className={cls}>
              {inner}
            </NavLink>
          ) : (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => { action?.(); }}
              className={cls}
            >
              {inner}
            </button>
          );
        })}

        {/* Carrito */}
        <button
          type="button"
          aria-label={`Abrir carrito, ${count} productos`}
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-1 min-h-[56px] min-w-0 text-ink/50 active:bg-ink/5 transition-colors"
        >
          <span className="relative">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E91E8C] text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </span>
          <span className="text-[10px] leading-none font-semibold">Carrito</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomTabBar;
