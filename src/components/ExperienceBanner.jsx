import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, FlaskConical, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CinematicPageHeader } from './CinematicPageHeader';
import { EASE_FLUID } from '../lib/motion';

// Para añadir una 3ª experiencia a futuro: agrega un objeto aquí
// { id, tab, tag, title, desc, Icon, accent } y la grilla + CTAs se adaptan solos.
// No olvides registrar su `tab` en ExperienceCenter (?tab=xxx) y en Navbar navLinks.
const EXPERIENCES = [
  {
    id: 'quiz',
    tab: 'quiz',
    tag: 'Quiz interactivo',
    title: 'Test de Fragancias',
    desc: '4 preguntas, tu match olfativo ideal en segundos.',
    Icon: Sparkles,
    accent: 'emerald',
  },
  {
    id: 'decant',
    tab: 'crea',
    tag: 'Laboratorio',
    title: 'Crea tu Esencia',
    desc: 'Decant a medida: línea, tamaño y extras.',
    Icon: FlaskConical,
    accent: 'gold',
  },
];

const CSS_PARTICLES = [
  { l: '6%', t: '22%', d: 0, s: 7 },
  { l: '14%', t: '68%', d: 1.1, s: 5 },
  { l: '42%', t: '14%', d: 0.5, s: 6 },
  { l: '60%', t: '80%', d: 1.7, s: 7 },
  { l: '74%', t: '20%', d: 0.8, s: 5 },
  { l: '88%', t: '58%', d: 2, s: 6 },
];

const ExperienceBanner = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [isCoarse] = useState(
    () =>
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(hover: none)').matches
  );
  const showParticles = !reduce && !isCoarse;

  return (
    <section
      aria-label="Experiencias Dupé"
      className="relative overflow-hidden bg-ink text-white pt-[132px] md:pt-[168px] pb-12 md:pb-16"
    >
      {/* ── Fondo cinematográfico (mismo lenguaje que Hero, sin WebGL) ── */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#24453a_0%,#1C1B1A_55%,#0e0e0d_100%)]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[220px] sm:w-[720px] sm:h-[360px] bg-emerald/25 blur-[100px] sm:blur-[130px] rounded-full" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] bg-gold/15 blur-[80px] sm:blur-[120px] rounded-full" />
        {showParticles &&
          CSS_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-gold/70 shadow-glow scent-float-slow"
              style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: `${p.d}s`, opacity: 0.6 }}
            />
          ))}
        <div className="hero-grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Texto */}
          <div>
            <CinematicPageHeader
              variant="dark"
              eyebrow="Experiencias Dupé"
              title={
                <>
                  Vive tu <span className="font-cursive font-normal text-gold-light">experiencia</span> olfativa
                </>
              }
              description="Dos caminos, un mismo destino: tu fragancia ideal. Haz el test sensorial o crea tu decant personalizado en el laboratorio."
            />

            {/* CTAs directos a cada experiencia */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_FLUID }}
              className="flex flex-col sm:flex-row gap-3 mt-2"
            >
              <button
                onClick={() => navigate('/experiencia?tab=quiz')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 min-h-[52px] rounded-full bg-emerald text-white font-bold text-xs uppercase tracking-widest hover:bg-moss transition-colors shadow-xl shadow-emerald/20"
              >
                <Sparkles size={16} className="text-gold-light" />
                Hacer el test
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/experiencia?tab=crea')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 min-h-[52px] rounded-full bg-white/10 border border-gold/40 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/15 transition-colors backdrop-blur-sm"
              >
                <FlaskConical size={16} className="text-gold" />
                Crear mi esencia
              </button>
            </motion.div>

            {/* Mini-cards de experiencias (escalan a 3 cuando llegue la próxima) */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mt-8 max-w-xl">
              {EXPERIENCES.map(({ id, tab, tag, title, desc, Icon, accent }) => (
                <button
                  key={id}
                  onClick={() => navigate(`/experiencia?tab=${tab}`)}
                  className="group flex items-start gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-gold/40 transition-all text-left min-h-[88px]"
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      accent === 'gold' ? 'bg-gold/20 text-gold' : 'bg-emerald/30 text-emerald-100'
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">{tag}</span>
                    <span className="block text-sm font-bold text-white leading-snug">{title}</span>
                    <span className="block text-[11px] text-white/50 leading-snug mt-0.5 line-clamp-2">{desc}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-light mt-1.5 group-hover:gap-2 transition-all">
                      Entrar <ChevronRight size={12} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_FLUID }}
            className="relative hidden sm:block"
          >
            <div className="rounded-3xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/50 aspect-[4/5] max-h-[520px] w-full relative">
              <img
                src="/Images/perfume_refined.webp"
                alt="Experiencia olfativa Dupé"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                <div className="px-4 py-2.5 bg-white/95 text-ink rounded-full font-bold text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Sparkles size={13} className="text-emerald" /> Test + Laboratorio
                </div>
                <span className="px-3 py-1.5 rounded-full bg-ink/60 backdrop-blur-md border border-gold/40 text-gold-light text-[10px] font-bold uppercase tracking-widest">
                  Sogamoso
                </span>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-gold/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald/30 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceBanner;
