import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { socialLinks } from '../data/fragrances';
import { CinematicPageHeader } from './CinematicPageHeader';
import { ScentAmbient } from './ScentAmbient';
import { Reveal } from './motion-primitives';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';

const Ofertas = () => {
  const reduce = useReducedMotion();
  return (
    <section id="ofertas" className="py-16 md:py-24 bg-linen relative overflow-hidden">
      <ScentAmbient variant="light">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header cinematográfico */}
        <CinematicPageHeader
          eyebrow="Síguenos"
          title={<>Nuestras <span className="font-cursive font-normal text-emerald">Publicaciones</span></>}
          description="Descubre aquí mismo nuestras últimas novedades, promociones y lanzamientos publicados en Instagram. ¡Explora nuestro feed en tiempo real y no te pierdas de nada!"
        />

        {/* Instagram Feed Widget */}
        <Reveal>
        <motion.div
          initial={reduce ? false : { scale: 0.98 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_FLUID }}
          className="mt-8 md:mt-12 w-full rounded-2xl overflow-hidden shadow-lg border border-gold/10 bg-white/10 backdrop-blur-sm"
        >
          <iframe
            src="https://emb.fouita.com/widget/0x4704bf/ftzxx0dzxi"
            title="Instagram Feed de Dupé"
            width="100%"
            height="500"
            frameBorder="0"
            className="w-full"
            loading="lazy"
          ></iframe>
        </motion.div>
        </Reveal>

        {/* WhatsApp CTA */}
        <Reveal delay={0.1}>
        <motion.div
          whileHover={reduce ? undefined : { y: -4, transition: SPRING_SOFT }}
          className="mt-8 md:mt-10 will-change-transform"
        >
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-emerald to-moss rounded-2xl px-8 py-6 text-white group hover:shadow-xl hover:shadow-emerald/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.685-1.386A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.318-.725-6.006-1.955a.5.5 0 00-.394-.082l-3.155.934.998-3.326a.5.5 0 00-.063-.407A9.946 9.946 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">¿Tienes preguntas?</p>
                <p className="text-lg font-bold">Escríbenos por WhatsApp</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-white/50 group-hover:text-white transition-colors" />
          </a>
        </motion.div>
        </Reveal>
      </div>
      </ScentAmbient>
    </section>
  );
};

export default Ofertas;
