import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomTabBar from './components/BottomTabBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import CartDrawer from './components/CartDrawer';
import SwUpdateToast from './components/SwUpdateToast';
import InstallPrompt from './components/InstallPrompt';
import { ScrollProgress } from './components/motion-primitives';
import { pageVariants } from './lib/motion';
import { motion, useReducedMotion } from 'framer-motion';

// Code-splitting por ruta: cada página viaja en su propio chunk.
// El JS inicial queda en shell + Home; el resto se descarga al navegar.
const Home = lazy(() => import('./pages/Home'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" aria-busy="true" aria-label="Cargando página">
      <img src="/Images/Dupé_logo.jpg" alt="" className="w-12 h-12 rounded-full object-cover border border-ink/10 animate-pulse" />
      <div className="w-40 h-1 rounded-full bg-ink/10 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-emerald animate-[shimmerSlide_1.2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={reduce ? undefined : pageVariants}
        initial={reduce ? false : 'initial'}
        animate="animate"
        exit="exit"
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/experiencia" element={<ExperiencePage />} />
            <Route path="/siguenos" element={<OffersPage />} />
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/ubicaciones" element={<LocationsPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  // Scroll suave Lenis SOLO en desktop con puntero fino.
  // En táctil se usa scroll nativo (con momentum): cero conflictos con
  // sheets/drawers y menos CPU en gama baja.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) {
      window.__lenis = null;
      return;
    }
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      {/* Espacio para la tab bar móvil */}
      <div aria-hidden className="h-[76px] md:hidden" />
      <BottomTabBar />
      <WhatsAppFloat />
      <CartDrawer />
      <SwUpdateToast />
      <InstallPrompt />
    </div>
  );
}

export default App;
