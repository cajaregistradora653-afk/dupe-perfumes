import { useState, useEffect } from 'react';
import { Menu, X, Search, Truck, ShieldCheck, Phone, Sparkles, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';
import CartButton from './CartButton';
import { EASE_FLUID, SPRING_SNAPPY } from '../lib/motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    // Oculta la nav al bajar, muestra al subir (fluido, estilo 21st.dev dock)
    if (!reduce) setHidden(y > 320 && y > prev);
  });

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // La tab bar móvil abre el buscador global vía evento
  useEffect(() => {
    const open = () => setIsSearchOpen(true);
    window.addEventListener('dupe:open-search', open);
    return () => window.removeEventListener('dupe:open-search', open);
  }, []);

  // Experiencias separadas: cada una con ruta profunda (?tab=) para abrir
  // el kiosco directo en quiz o decant. Para añadir una 3ª experiencia en el
  // futuro, basta con pushear otro objeto con su `tab` aquí + en ExperienceBanner.
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Test de Fragancias', path: '/experiencia?tab=quiz', Icon: Sparkles, highlight: true },
    { name: 'Crea tu Esencia', path: '/experiencia?tab=crea', Icon: FlaskConical },
    { name: 'Síguenos', path: '/siguenos' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Ubicaciones', path: '/ubicaciones' },
  ];

  // Activo exacto para las 2 experiencias (NavLink solo mira pathname y
  // marcaría ambas a la vez en /experiencia). Se discrimina por ?tab=.
  const isExperienceActive = (link) => {
    const [linkPath, linkQuery] = link.path.split('?');
    const currentPath = location.pathname;
    if (currentPath !== linkPath) return false;
    if (!linkQuery) return location.search === '' || location.search === '?';
    return location.search.includes(linkQuery.split('=')[1]);
  };

  const categoryLinks = [
    { name: 'Todos', tipo: 'todos' },
    { name: 'Inspiraciones 1.1', tipo: 'inspiracion' },
    { name: 'Originales', tipo: 'original' },
    { name: 'Decants', tipo: 'decant' },
    { name: 'Temporada', tipo: 'temporada' },
  ];

  return (
    <>
      {/* Barra utilitaria superior */}
      <div className="fixed top-0 w-full z-50 bg-ink text-white/85 text-[10px] sm:text-[11px] font-semibold tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 truncate">
            <Truck size={13} className="shrink-0" />
            <span className="truncate">Envíos a Sogamoso, Tunja, Duitama, Paipa y todo el país</span>
          </span>
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} /> Garantía de fijación
            </span>
            <a href="https://wa.me/573223201574" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
              <Phone size={13} /> +57 322 3201574
            </a>
          </div>
        </div>
      </div>

      <motion.nav
        animate={reduce ? undefined : { y: hidden && !isOpen ? '-110%' : '0%' }}
        transition={{ duration: 0.35, ease: EASE_FLUID }}
        className={`fixed top-8 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-ink/10 transition-shadow duration-300 ${scrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 h-16 md:h-[72px]">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0"
            >
              <Link to="/" className="flex items-center gap-2.5">
                <img src="/Images/Dupé_logo.jpg" alt="Dupé Perfumería" className="h-9 w-9 md:h-10 md:w-10 object-contain rounded-full shadow-sm border border-ink/10" />
                <img src="/Images/Dupé_name.webp" alt="Dupé" className="h-10 md:h-12 object-contain hidden xs:block sm:block" style={{ filter: 'brightness(0.75) contrast(1.3)' }} />
              </Link>
            </motion.div>

            {/* Buscador central (desktop) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex flex-1 items-center gap-3 bg-[#F4F4F4] hover:bg-[#ECECEC] border border-transparent rounded-full pl-5 pr-2 py-2 text-left transition-colors group"
            >
              <span className="flex-1 text-sm text-ink/40 group-hover:text-ink/60 truncate">Buscar perfumes, notas, categorías…</span>
              <span className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
                <Search size={16} />
              </span>
            </button>

            {/* Nav desktop (7 ítems: experiencias separadas) */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0">
              {navLinks.map((link) => {
                const expActive = link.path.startsWith('/experiencia') ? isExperienceActive(link) : null;
                const LinkIcon = link.Icon;
                return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => {
                    const active = expActive ?? isActive;
                    return `text-[11px] xl:text-[12px] font-bold uppercase tracking-widest transition-colors relative group flex items-center gap-1.5 ${active ? 'text-emerald' : link.highlight ? 'text-emerald/80 hover:text-emerald' : 'text-ink/60 hover:text-ink'}`;
                  }}
                >
                  {({ isActive }) => {
                    const active = expActive ?? isActive;
                    return (
                    <>
                      {LinkIcon && <LinkIcon size={13} className={active ? 'text-emerald' : 'text-gold'} />}
                      {link.name}
                      {active ? (
                        <motion.span
                          layoutId="nav-underline"
                          transition={SPRING_SNAPPY}
                          className="absolute -bottom-1 left-0 h-0.5 w-full bg-emerald rounded-full"
                        />
                      ) : (
                        <span className="absolute -bottom-1 left-0 h-0.5 bg-emerald transition-all duration-300 w-0 group-hover:w-full" />
                      )}
                    </>
                    );
                  }}
                </NavLink>
                );
              })}
            </div>

            {/* Carrito (desktop) */}
            <div className="hidden md:flex items-center shrink-0">
              <CartButton iconSize={21} />
            </div>

            {/* Acciones móvil */}
            <div className="flex items-center gap-0.5 md:hidden ml-auto">
              <CartButton iconSize={20} />
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-11 h-11 flex items-center justify-center text-ink/70 hover:text-ink transition-colors rounded-full active:bg-ink/5"
                aria-label="Buscar perfume"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isOpen}
                className="w-11 h-11 flex items-center justify-center hover:bg-ink/5 rounded-full transition-colors text-ink active:bg-ink/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* La búsqueda móvil vive en la tab bar (Botón Buscar) */}

          {/* Fila de categorías (desktop) */}
          <div className="hidden md:flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
            {categoryLinks.map((cat) => (
              <button
                key={cat.tipo}
                onClick={() => navigate(cat.tipo === 'todos' ? '/catalogo' : `/catalogo?tipo=${cat.tipo}`)}
                className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-ink/60 hover:text-white hover:bg-ink transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-ink/10 shrink-0" />
            <button
              onClick={() => navigate('/siguenos')}
              className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#E91E8C] hover:bg-[#E91E8C] hover:text-white transition-colors whitespace-nowrap"
            >
              Síguenos
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: EASE_FLUID }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-ink/10 overflow-hidden"
            >
              <div className="px-6 pt-6 pb-safe flex flex-col gap-1 max-h-[70dvh] overflow-y-auto">
                {navLinks.map((link, i) => {
                  const expActive = link.path.startsWith('/experiencia') ? isExperienceActive(link) : null;
                  const Icon = link.Icon;
                  return (
                  <motion.div
                    key={link.name}
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.3, ease: EASE_FLUID }}
                  >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => {
                      const active = expActive ?? isActive;
                      return `text-sm font-bold uppercase tracking-widest transition-colors py-3.5 border-b border-ink/5 text-left min-h-[48px] flex items-center gap-3 ${active ? 'text-emerald font-extrabold' : link.highlight ? 'text-ink hover:text-emerald active:text-emerald' : 'text-ink/70 hover:text-ink active:text-ink'}`;
                    }}
                  >
                    {Icon ? (
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.highlight ? 'bg-emerald/10 text-emerald' : 'bg-gold/10 text-gold'}`}>
                        <Icon size={18} />
                      </span>
                    ) : null}
                    <span className="flex-1">{link.name}</span>
                    {link.highlight && (
                      <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald text-white px-2 py-1 rounded-full shrink-0">
                        Quiz
                      </span>
                    )}
                  </NavLink>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
