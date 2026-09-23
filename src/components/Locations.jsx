import { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, ExternalLink, Clock, Phone } from 'lucide-react';
import { CinematicPageHeader } from './CinematicPageHeader';
import { ScentAmbient } from './ScentAmbient';
import { Reveal } from './motion-primitives';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';

// Leaflet fuera del bundle principal: solo carga al visitar Ubicaciones
const SedesMap = lazy(() => import('./SedesMap'));

const MAP_VIEW_URL = 'https://www.google.com/maps/search/?api=1&query=Dup%C3%A9+Perfumer%C3%ADa+Sogamoso+Boyac%C3%A1';

const Locations = () => {
  const sedesPrincipales = [
    { nombre: "Sede Plaza Barcelona", direccion: "Cra. 11 #14-51", lugar: "Centro Comercial Plaza Barcelona", ciudad: "Sogamoso, Boyacá" },
    { nombre: "Sede Plaza de la Villa", direccion: "Cl. 12 #10-88", lugar: "Plaza de la Villa", ciudad: "Sogamoso, Boyacá" },
  ];

  const otrasciudades = ["Tunja", "Duitama", "Paipa", "Villanueva"];
  const reduce = useReducedMotion();

  return (
    <section id="ubicaciones" className="pt-24 pb-32 bg-linen relative overflow-hidden">
      <ScentAmbient variant="light">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <CinematicPageHeader
            eyebrow="Encuéntranos"
            title={<>Nuestras <span className="font-elegant text-emerald">Sedes en</span> <span className="font-cursive font-normal text-moss text-3xl md:text-5xl">Sogamoso</span></>}
            description="Visita nuestras tiendas físicas y sumérgete en el universo aromático de Dupé. También presentes en Tunja, Duitama, Paipa y Villanueva."
          />

          <div className="hidden lg:block">
            <Reveal delay={0.15}>
            <div className="bg-white/50 backdrop-blur-sm border border-white p-6 rounded-organic shadow-lg">
              <div className="flex items-center gap-4 text-moss mb-4">
                <Clock size={20} className="text-emerald" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-moss/40">Horarios de Atención</p>
                  <p className="text-sm font-bold">Lun - Sáb: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-moss">
                <Phone size={20} className="text-emerald" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-moss/40">WhatsApp</p>
                  <p className="text-sm font-bold">+57 322 3201574</p>
                </div>
              </div>
            </div>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Un solo mapa con las 2 sedes, sin paneles */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE_FLUID }}
            className="lg:col-span-7 rounded-organic overflow-hidden shadow-2xl border-8 border-white relative group"
          >
            <div className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-video bg-[#F4F4F4]">
              <Suspense fallback={<div className="absolute inset-0 shimmer-skeleton" aria-label="Cargando mapa" />}>
                <SedesMap />
              </Suspense>
              <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none" style={{ zIndex: 500 }}>
                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald shadow-md border border-gold/30">
                  ● Plaza Barcelona
                </span>
                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald shadow-md border border-gold/30">
                  ● Plaza de la Villa
                </span>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-4">
            {sedesPrincipales.map((sede, idx) => (
              <motion.div
                key={idx}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE_FLUID }}
                whileHover={reduce ? undefined : { y: -4, transition: SPRING_SOFT }}
                className="bg-white p-6 rounded-2xl border border-white shadow-lg hover:shadow-xl hover:border-gold/30 group will-change-transform"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"><MapPin size={20} /></div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-elegant text-moss leading-tight">{sede.nombre}</h3>
                    <p className="text-sm font-bold text-emerald">{sede.lugar}</p>
                    <p className="text-base text-stone font-elegant">{sede.direccion}</p>
                    <p className="text-xs uppercase tracking-widest text-moss/40 font-bold">{sede.ciudad}</p>
                    <a href={MAP_VIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald hover:text-moss transition-colors pt-2">
                      Cómo llegar <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Other cities */}
            <Reveal delay={0.1}>
            <div className="bg-white/60 p-5 rounded-2xl border border-moss/5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-moss/40 mb-3">También en</p>
              <div className="flex flex-wrap gap-2">
                {otrasciudades.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: EASE_FLUID }}
                    className="text-xs font-bold text-emerald bg-emerald/5 px-3 py-1.5 rounded-full"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
            </Reveal>

            {/* Mobile contact */}
            <div className="lg:hidden bg-white border border-moss/10 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-elegant mb-4 flex items-center gap-3 text-emerald"><Clock size={20} /> Contacto</h3>
              <div className="space-y-3">
                <div><p className="text-[10px] uppercase font-bold tracking-widest text-moss/40 mb-1">Horarios</p><p className="text-sm text-moss font-medium">Lun - Sáb: 9:00 AM - 7:00 PM</p></div>
                <div className="h-px bg-moss/10" />
                <div><p className="text-[10px] uppercase font-bold tracking-widest text-moss/40 mb-1">WhatsApp</p><p className="text-sm font-bold text-emerald">+57 322 3201574</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </ScentAmbient>
    </section>
  );
};

export default Locations;
