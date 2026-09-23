import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

const VISITS_KEY = 'dupe-visits';
const DISMISS_KEY = 'dupe-install-dismissed';

// Prompt de instalación PWA mobile-first:
// - Android/Chrome: usa beforeinstallprompt (nativo).
// - iOS Safari: no hay evento → muestra instrucciones manuales.
// - Timing: a partir de la 2ª visita y máx. 1 vez cada 7 días.
// - Posición: tarjeta sobre la tab bar (nunca encima del WhatsApp).
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent || '';
    const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    setIsIOS(ios);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (standalone) return; // ya instalada: no molestar

    let visits = 0;
    try {
      visits = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) || 0;
      localStorage.setItem(VISITS_KEY, String(visits + 1));
      const dismissedAt = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10) || 0;
      if (Date.now() - dismissedAt < 7 * 24 * 3600 * 1000) return; // snooze 7 días
    } catch { /* noop */ }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (visits + 1 >= 2) {
        // Pequeño retardo para no tapar el primer pantallazo
        setTimeout(() => setVisible(true), 2500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS: sin evento nativo → instrucciones a partir de la 2ª visita
    if (ios && visits + 1 >= 2) {
      setTimeout(() => setVisible(true), 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        dismiss();
      }).catch(() => dismiss());
    } else {
      dismiss(); // iOS: ya vio las instrucciones
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Instalar aplicación Dupé"
      className="fixed left-4 right-4 bottom-[150px] md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[96] bg-white rounded-2xl shadow-2xl border border-ink/10 p-4 flex items-center gap-3"
    >
      <span className="w-11 h-11 rounded-xl bg-emerald/10 flex items-center justify-center shrink-0">
        <Download size={19} className="text-emerald" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold text-ink leading-tight">Lleva Dupé contigo</p>
        {isIOS && !deferredPrompt ? (
          <p className="text-xs text-ink/60 leading-snug flex items-center gap-1">
            Toca <Share size={12} className="shrink-0" /> Compartir → “Añadir a pantalla de inicio”
          </p>
        ) : (
          <p className="text-xs text-ink/60 leading-snug">Instala la app para acceso rápido y ofertas.</p>
        )}
      </div>
      <button
        onClick={handleInstall}
        className="shrink-0 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald text-white text-[11px] font-extrabold uppercase tracking-widest active:scale-95 transition-transform"
      >
        {isIOS && !deferredPrompt ? 'Entendido' : 'Instalar'}
      </button>
      <button
        onClick={dismiss}
        aria-label="Cerrar aviso de instalación"
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default InstallPrompt;
