import { useState } from 'react';
import { Instagram, Facebook, MapPin, Clock, Phone, X, ShieldCheck, FileText, Info, Mail, CreditCard, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { socialLinks } from '../data/fragrances';
import InfoSectionsModal from './InfoSectionsModal';
import { Reveal } from './motion-primitives';
import { EASE_FLUID } from '../lib/motion';
import { APP_VERSION } from '../lib/build';

const ThreadsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.781 3.632 2.695 6.539 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.082-1.152 3.475-1.22 1.005-.048 1.943.024 2.818.171-.072-.842-.29-1.496-.66-1.956-.46-.572-1.172-.86-2.117-.86l-.09.001c-.656.012-1.2.18-1.619.502-.39.3-.667.718-.826 1.244l-1.98-.54c.256-.852.722-1.55 1.384-2.078.837-.667 1.893-1.01 3.14-1.038h.13c1.504 0 2.725.543 3.53 1.57.665.847 1.042 1.968 1.13 3.35.307.065.607.14.9.224 1.073.314 1.96.81 2.637 1.475.838.824 1.32 1.862 1.435 3.086.128 1.37-.264 2.882-1.13 4.124-1.005 1.44-2.538 2.476-4.558 3.08-1.328.398-2.857.613-4.54.623zm-.834-9.138c-.988.047-1.757.31-2.288.783-.493.44-.73 1.005-.69 1.634.045.808.47 1.408 1.265 1.785.587.278 1.326.387 2.082.349 1.107-.06 1.965-.465 2.551-1.203.497-.627.83-1.466.978-2.475-.855-.168-1.79-.264-2.792-.264-.374 0-.74.013-1.106.039v-.648z"/>
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M173.3 118.7c-10.2 0-19.6-3.4-27.2-9.3v44.1c0 22.5-18.3 40.8-40.8 40.8-22.5 0-40.8-18.3-40.8-40.8s18.3-40.8 40.8-40.8c5.2 0 10.1 1 14.6 2.9V86.2c-6.3-3-13.4-4.7-20.7-4.7-34.1 0-61.8 27.7-61.8 61.8s27.7 61.8 61.8 61.8c34.1 0 61.8-27.7 61.8-61.8V81.4h27.2c0 10.8 4.2 20.4 11.1 27.8 6.9 7.5 16.4 11.7 26.4 11.7v-27.6c-5.2 0-10.3-1.1-15-3.2-4.8-2.1-9-5.2-12.4-9.1-3.5-4-6.1-8.7-7.6-13.8h-7.9v38.8Z" fill="currentColor"/>
  </svg>
);

const Footer = () => {
  const [legalType, setLegalType] = useState(null);
  const [infoModalType, setInfoModalType] = useState(null);

  const legalContent = {
    terminos: {
      title: 'Términos y Condiciones',
      icon: <FileText className="text-emerald" />,
      content: [
        'El acceso y uso de este sitio web se rige por los términos aquí descritos.',
        'Dupé Perfumería se reserva el derecho de actualizar precios y disponibilidad de productos sin previo aviso.',
        'Las imágenes de los productos son ilustrativas y corresponden a formulaciones inspiradas de alta concentración.',
        'Queda prohibida la reproducción total o parcial del contenido gráfico y textual de este sitio sin autorización expresa.'
      ]
    },
    privacidad: {
      title: 'Política de Privacidad',
      icon: <ShieldCheck className="text-emerald" />,
      content: [
        'De acuerdo con la Ley 1581 de 2012 (Habeas Data), Dupé Perfumería informa que los datos suministrados por los clientes serán tratados con absoluta confidencialidad.',
        'La finalidad del tratamiento de datos es únicamente para la gestión de pedidos, asesoría personalizada y atención al cliente.',
        'El titular de los datos tiene derecho a conocer, actualizar y rectificar su información en cualquier momento.'
      ]
    },
    cookies: {
      title: 'Política de Cookies',
      icon: <Info className="text-emerald" />,
      content: [
        'Este sitio web utiliza almacenamiento local y cookies esenciales para garantizar la navegación y recordar tus preferencias de filtrado.',
        'Usted puede desactivar las cookies desde su navegador, aunque esto podría afectar la fluidez de algunas funciones interactivas.'
      ]
    }
  };

  return (
    <footer className="bg-[#F4F4F4] text-ink pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden relative border-t border-ink/10">
      {/* Top gold accent animado */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE_FLUID }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      {/* Marquee de marca */}
      <div aria-hidden className="relative border-b border-ink/5 mb-12 md:mb-16 overflow-hidden">
        <div className="hero-marquee flex items-center gap-8 whitespace-nowrap py-4 px-6 w-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.35em] text-ink/25">
              Creado para ti <span className="text-gold/60">✦</span> Dupé Perfumería <span className="text-gold/60">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 relative z-10">
          
          {/* Brand Info */}
          <Reveal>
          <div className="space-y-5 md:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/Images/Dupé_logo.jpg" alt="Dupé" className="h-9 w-9 rounded-full border border-ink/10" />
              <img src="/Images/Dupé_name.webp" alt="Dupé" className="h-6 object-contain" />
            </div>
            <p className="text-ink/60 text-xs leading-relaxed max-w-xs">
              "Creado para ti" <br />
              Inspiraciones de lujo 1.1, decants y fórmulas preparadas con esencias importadas de alta perdurabilidad.
            </p>
            <div className="flex gap-2.5">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all"><Instagram size={16} /></a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all"><Facebook size={16} /></a>
              <a href={socialLinks.threads} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all"><ThreadsIcon className="w-4 h-4" /></a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all"><TikTokIcon className="w-4 h-4" /></a>
            </div>
          </div>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={0.07}>
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] text-ink">Navegación</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li><Link to="/" className="text-ink/60 hover:text-ink transition-colors font-medium">Inicio</Link></li>
              <li><Link to="/catalogo" className="text-ink/60 hover:text-ink transition-colors font-medium">Catálogo Completo</Link></li>
              <li><Link to="/experiencia" className="text-ink/60 hover:text-ink transition-colors font-medium">Crea tu Esencia</Link></li>
              <li><Link to="/experiencia?tab=quiz" className="text-ink/60 hover:text-ink transition-colors font-medium">Test Olfativo</Link></li>
              <li><Link to="/siguenos" className="text-ink/60 hover:text-ink transition-colors font-medium">Síguenos</Link></li>
              <li><Link to="/ubicaciones" className="text-ink/60 hover:text-ink transition-colors font-medium">Sedes en Boyacá</Link></li>
            </ul>
          </div>
          </Reveal>

          {/* Customer Service & Policies (Mapa del cliente) */}
          <Reveal delay={0.14}>
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] text-ink">Atención al Cliente</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li>
                <button
                  onClick={() => setInfoModalType('politicas')}
                  className="text-ink/60 hover:text-ink transition-colors font-medium flex items-center gap-1.5 text-left"
                >
                  <RefreshCw size={13} className="text-emerald shrink-0" /> Políticas y Garantía
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInfoModalType('medios_pago')}
                  className="text-ink/60 hover:text-ink transition-colors font-medium flex items-center gap-1.5 text-left"
                >
                  <CreditCard size={13} className="text-emerald shrink-0" /> Medios de Pago
                </button>
              </li>
              {/* Payment badges row */}
              <li className="pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center border border-ink/10" title="Nequi">
                    <img src="/Images/nequi-logo.webp" alt="Nequi" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center border border-ink/10" title="Daviplata">
                    <img src="/Images/daviplata-logo.webp" alt="Daviplata" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center border border-ink/10" title="Bancolombia">
                    <img src="/Images/bancolombia-logo.webp" alt="Bancolombia" className="w-full h-full object-contain" />
                  </div>
                </div>
              </li>
              <li>
                <button
                  onClick={() => setInfoModalType('soporte')}
                  className="text-ink/60 hover:text-ink transition-colors font-medium flex items-center gap-1.5 text-left"
                >
                  <MessageSquare size={13} className="text-emerald shrink-0" /> Soporte & Chatbot
                </button>
              </li>
            </ul>
          </div>
          </Reveal>

          {/* Contact Info */}
          <Reveal delay={0.21}>
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] text-ink">Contacto Directo</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-emerald shrink-0" />
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-emerald transition-colors">{socialLinks.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-emerald shrink-0" />
                <a href={`mailto:${socialLinks.email}`} className="text-ink hover:text-emerald transition-colors">{socialLinks.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                <a href={socialLinks.maps} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-emerald transition-colors">Sogamoso, Tunja, Duitama, Paipa</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-emerald shrink-0" />
                <span className="text-ink/60">Lun - Sáb: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
          </Reveal>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 md:mt-16 relative z-10 bg-ink text-white/75 rounded-2xl px-6 py-5 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-[11px] uppercase tracking-[0.2em] font-medium">© 2026 Dupé Perfumería. Creado para ti. <span className="text-white/40">· v{APP_VERSION}</span></p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
            <button onClick={() => setLegalType('terminos')} className="hover:text-white transition-colors">Términos</button>
            <button onClick={() => setLegalType('privacidad')} className="hover:text-white transition-colors">Privacidad</button>
            <button onClick={() => setLegalType('cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>

      {/* Info Modals (Políticas, Medios de Pago, Soporte) */}
      <InfoSectionsModal
        type={infoModalType}
        isOpen={!!infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Legal Modal */}
      <AnimatePresence>
        {legalType && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE_FLUID }} onClick={() => setLegalType(null)} className="fixed inset-0 z-[100] bg-moss/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.95, y: 12, filter: 'blur(4px)' }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
              <div className="bg-linen w-full max-w-md rounded-3xl p-8 shadow-2xl relative pointer-events-auto border border-gold/20">
                <button onClick={() => setLegalType(null)} className="absolute top-6 right-6 text-moss/40 hover:text-moss transition-colors"><X size={20} /></button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center">{legalContent[legalType].icon}</div>
                  <h3 className="text-2xl font-serif text-moss">{legalContent[legalType].title}</h3>
                </div>
                <div className="space-y-4">
                  {legalContent[legalType].content.map((p, i) => (<p key={i} className="text-xs text-moss/80 leading-relaxed font-sans">{p}</p>))}
                </div>
                <button onClick={() => setLegalType(null)} className="mt-8 w-full py-3.5 bg-emerald text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-moss transition-all">Entendido</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;

