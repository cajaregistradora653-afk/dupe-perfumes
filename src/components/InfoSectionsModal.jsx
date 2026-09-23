import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, RefreshCw, CreditCard, MessageSquare, Mail, Phone, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { socialLinks } from '../data/fragrances';

export const InfoSectionsModal = ({ type, isOpen, onClose }) => {
  if (!isOpen) return null;

  const contentMap = {
    politicas: {
      title: 'Políticas de Cambios y Garantía',
      subtitle: 'Transparencia y respaldo en cada una de tus fragancias',
      icon: <RefreshCw className="text-gold" size={24} />,
      content: (
        <div className="space-y-6 text-sm text-moss/80">
          <div className="bg-shine/50 p-4 rounded-2xl border border-gold/20">
            <h4 className="font-bold text-emerald text-base flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-gold" /> Garantía de Satisfacción y Fijación
            </h4>
            <p className="leading-relaxed">
              Nuestras fragancias e inspiraciones son elaboradas con aceites y esencias importadas de grado perfumería fina, garantizando alta proyección y perdurabilidad en piel y ropa.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-moss uppercase tracking-wider text-xs">Condiciones para Cambios:</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                <span>Tienes hasta <strong>5 días hábiles</strong> posteriores a la entrega para solicitar un cambio por defecto de atomizador o daño en el envase.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                <span>El producto debe encontrarse con su contenido prácticamente intacto (mínimo 95%) y en su presentación original.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                <span>En decants de 5ml y 10ml, aplican cambios exclusivamente por fallas en el spray o fuga durante el envío.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald/5 rounded-xl border border-emerald/10 text-xs">
            <p className="flex items-center gap-2 font-semibold text-emerald">
              <Truck size={16} /> Envíos seguros a Sogamoso, Tunja, Duitama, Paipa, Villanueva y todo el país.
            </p>
          </div>
        </div>
      )
    },
    medios_pago: {
      title: 'Medios de Pago Aceptados',
      subtitle: 'Opciones seguras y directas para tus pedidos',
      icon: <CreditCard className="text-gold" size={24} />,
      content: (
        <div className="space-y-6 text-sm text-moss/80">
          <p className="leading-relaxed">
            Puedes abonar tus compras de forma ágil y segura a través de los siguientes métodos oficiales:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nequi */}
            <div className="p-4 bg-white rounded-2xl border border-moss/10 shadow-sm flex items-center gap-3.5 hover:border-gold/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#20002c]/5 border border-[#20002c]/10 flex items-center justify-center p-2 shrink-0">
                <img
                  src="/Images/nequi-logo.webp"
                  alt="Nequi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h5 className="font-bold text-moss text-sm">Nequi</h5>
                <p className="text-xs text-moss/60">Transferencia instantánea / QR</p>
              </div>
            </div>

            {/* Daviplata */}
            <div className="p-4 bg-white rounded-2xl border border-moss/10 shadow-sm flex items-center gap-3.5 hover:border-gold/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-center p-2 shrink-0">
                <img
                  src="/Images/daviplata-logo.webp"
                  alt="Daviplata"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h5 className="font-bold text-moss text-sm">Daviplata</h5>
                <p className="text-xs text-moss/60">Pago directo Davivienda / Celular</p>
              </div>
            </div>

            {/* Bancolombia */}
            <div className="p-4 bg-white rounded-2xl border border-moss/10 shadow-sm flex items-center gap-3.5 hover:border-gold/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-yellow-50/60 border border-yellow-100 flex items-center justify-center p-2 shrink-0">
                <img
                  src="/Images/bancolombia-logo.webp"
                  alt="Bancolombia"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h5 className="font-bold text-moss text-sm">Bancolombia</h5>
                <p className="text-xs text-moss/60">Transferencia Ahorros / QR</p>
              </div>
            </div>

            {/* Contraentrega */}
            <div className="p-4 bg-white rounded-2xl border border-moss/10 shadow-sm flex items-center gap-3.5 hover:border-gold/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center text-xl shrink-0">
                💵
              </div>
              <div>
                <h5 className="font-bold text-moss text-sm">Pago Contraentrega</h5>
                <p className="text-xs text-moss/60">Sogamoso, Tunja, Duitama y Paipa</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-shine rounded-2xl border border-gold/20 flex items-start gap-3">
            <AlertCircle size={18} className="text-gold shrink-0 mt-0.5" />
            <p className="text-xs text-moss/70">
              Al finalizar tu pedido por WhatsApp, nuestro asesor te facilitará el código QR o número de cuenta verificado para validar tu comprobante.
            </p>
          </div>
        </div>
      )
    },
    soporte: {
      title: 'Canales de Atención y Soporte',
      subtitle: 'Estamos aquí para asesorarte en la elección de tu fragancia',
      icon: <MessageSquare className="text-gold" size={24} />,
      content: (
        <div className="space-y-6 text-sm text-moss/80">
          <p className="leading-relaxed">
            ¿Tienes dudas con una referencia, buscas asesoría olfativa o quieres conocer el estado de tu pedido? Comunícate directamente:
          </p>

          <div className="space-y-3">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-emerald/10 rounded-2xl border border-emerald/20 hover:bg-emerald/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald text-white flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-emerald">WhatsApp Oficial / Asesor Directo</h5>
                  <p className="text-xs text-moss/60">Atención rápida de 9:00 AM a 8:00 PM</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald uppercase tracking-wider group-hover:underline">
                Chatear &rarr;
              </span>
            </a>

            <a
              href="mailto:contacto@dupeperfumes.com"
              className="p-4 bg-white rounded-2xl border border-moss/10 hover:border-gold/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-shine text-moss flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-moss">Correo Electrónico</h5>
                  <p className="text-xs text-moss/60">contacto@dupeperfumes.com</p>
                </div>
              </div>
              <span className="text-xs font-bold text-moss/60 uppercase tracking-wider group-hover:text-emerald">
                Escribir &rarr;
              </span>
            </a>
          </div>

          <div className="p-4 bg-shine/40 rounded-xl border border-gold/20 text-center">
            <p className="text-xs text-moss/70">
              📍 Sedes físicas en Boyacá: Tunja, Sogamoso, Duitama, Paipa y Villanueva.
            </p>
          </div>
        </div>
      )
    }
  };

  const active = contentMap[type] || contentMap.politicas;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gold/30 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-shine/70 flex items-center justify-center text-moss/60 hover:text-moss hover:bg-shine transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-emerald/10 text-emerald">
              {active.icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-emerald">
                {active.title}
              </h3>
              <p className="text-xs text-moss/60">{active.subtitle}</p>
            </div>
          </div>

          <hr className="my-5 border-moss/10" />

          {/* Body */}
          {active.content}

          {/* Footer Action */}
          <div className="mt-8 pt-4 border-t border-moss/10 flex justify-end">
            <button
              onClick={onClose}
              className="bg-emerald text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-moss transition-colors shadow-sm"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InfoSectionsModal;
