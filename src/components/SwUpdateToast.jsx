import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// Avisa cuando el service worker detecta una versión nueva desplegada.
// Sin esto, una pestaña abierta puede correr el bundle viejo indefinidamente.
const SwUpdateToast = () => {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let timer;
    const check = () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
        reg.update().catch(() => { /* sin red: silencio */ });
      }).catch(() => { /* noop */ });
    };
    check();
    // Re-verifica cada 30 min por si la pestaña queda abierta
    timer = setInterval(check, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (!updateReady) return null;

  return (
    <div
      role="status"
      className="fixed left-4 right-4 bottom-[150px] md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[110] bg-ink text-white rounded-2xl shadow-2xl border border-gold/30 p-4 flex items-center gap-3"
    >
      <span className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
        <RefreshCw size={18} className="text-gold-light" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight">Nueva versión disponible</p>
        <p className="text-xs text-white/60 leading-tight">Recarga para ver lo último de Dupé.</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="shrink-0 px-5 py-3 min-h-[48px] rounded-xl bg-gold text-ink text-xs font-extrabold uppercase tracking-widest active:scale-95 transition-transform"
      >
        Recargar
      </button>
    </div>
  );
};

export default SwUpdateToast;
