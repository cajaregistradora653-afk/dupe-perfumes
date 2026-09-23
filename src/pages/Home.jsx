import Hero from '../components/Hero';
import GoldDivider from '../components/GoldDivider';
import CategoryBubbles from '../components/CategoryBubbles';
import PromoBanner from '../components/PromoBanner';
import CatalogPreview from '../components/CatalogPreview';
import { Stagger, StaggerItem, Reveal } from '../components/motion-primitives';
import { SPRING_SOFT } from '../lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ChevronRight, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExperienceCTA = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Reveal className="flex items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 text-emerald mb-3">
              <span className="h-px w-10 bg-emerald/30" />
              <span className="uppercase tracking-[0.3em] text-[11px] font-bold">Laboratorio Dupé</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink leading-tight">
              Crea tu Esencia
            </h2>
            <p className="text-ink/60 text-sm md:text-base max-w-xl mt-3">
              Formula tu fragancia a medida o realiza nuestro test olfativo interactivo.
            </p>
          </div>
          <button
            onClick={() => navigate('/experiencia')}
            className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald hover:text-moss transition-colors shrink-0"
          >
            Ver todo <ChevronRight size={14} />
          </button>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.1}>
          {/* Custom Perfume Preparation Card */}
          <StaggerItem>
          <motion.button
            onClick={() => navigate('/experiencia')}
            whileHover={reduce ? undefined : { y: -5, transition: SPRING_SOFT }}
            whileTap={reduce ? undefined : { scale: 0.99 }}
            className="group relative p-8 md:p-10 bg-white/80 backdrop-blur-xl rounded-3xl text-left overflow-hidden border border-ink/10 shadow-card hover:shadow-card-hover hover:border-gold/40 w-full flex flex-col justify-between will-change-transform"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Beaker size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald block mb-1">
                Perfumes Preparados
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-ink">
                Laboratorio Personalizado
              </h3>
              <p className="text-ink/60 text-xs md:text-sm leading-relaxed mb-6">
                Selecciona tu género, tamaño del frasco (30ml, 50ml, 100ml) y perfil olfativo. Preparamos tu fragancia única con aceites importados.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald group-hover:gap-3 transition-all">
                Personalizar mi Esencia <ChevronRight size={14} />
              </div>
            </div>
          </motion.button>
          </StaggerItem>

          {/* Test / Quiz Card */}
          <StaggerItem>
          <motion.button
            onClick={() => navigate('/experiencia?tab=quiz')}
            whileHover={reduce ? undefined : { y: -5, transition: SPRING_SOFT }}
            whileTap={reduce ? undefined : { scale: 0.99 }}
            className="group relative p-8 md:p-10 bg-white/80 backdrop-blur-xl rounded-3xl text-left overflow-hidden border border-ink/10 shadow-card hover:shadow-card-hover hover:border-gold/40 w-full flex flex-col justify-between will-change-transform"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald block mb-1">
                Quiz Interactivo
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-ink">
                Test de Fragancia
              </h3>
              <p className="text-ink/60 text-xs md:text-sm leading-relaxed mb-6">
                ¿No sabes qué aroma elegir? Responde 3 preguntas rápidas sobre tus ocasiones y te recomendaremos el perfume perfecto.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald group-hover:gap-3 transition-all">
                Comenzar Test Olfativo <ChevronRight size={14} />
              </div>
            </div>
          </motion.button>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />

      {/* Category Bubbles Bar in Home (Estilo E-commerce Referente) */}
      <section className="bg-[#F6F6F5] border-y border-ink/10 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CategoryBubbles onSelectCategory={(filterType) => {
            if (filterType === 'crea_tu_esencia') {
              navigate('/experiencia');
            } else {
              navigate(`/catalogo?tipo=${filterType}`);
            }
          }} />
        </div>
      </section>

      {/* Promo Banner Carousel */}
      <PromoBanner />

      <GoldDivider className="my-0" />

      {/* Featured Products / "Te puede gustar" */}
      <CatalogPreview />

      <GoldDivider className="my-0" />

      {/* Crea tu Esencia / Test CTA */}
      <ExperienceCTA />
    </div>
  );
};

export default Home;

