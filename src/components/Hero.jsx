import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, CreditCard, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';
import { KineticHeadline } from './hero/KineticHeadline';
import { CinematicPreloader } from './hero/CinematicPreloader';
import { useMouseParallax } from '../hooks/useMouseParallax';

const TRUST = [
  { icon: Truck, label: 'Envíos a todo el país' },
  { icon: CreditCard, label: 'Pago contraentrega' },
  { icon: ShieldCheck, label: 'Garantía de fijación' },
];

const MARQUEE = ['Sauvage Elixir', 'Versace Eros', 'Poison Girl', 'Coco Mademoiselle', 'Angels Share', 'Erba Pura', 'Eden Juicy Apple'];

// Partículas CSS baratas (8 dots, sin WebGL)
const CSS_PARTICLES = [
  { l: '8%', t: '20%', d: 0, s: 8 },
  { l: '16%', t: '70%', d: 1.2, s: 6 },
  { l: '46%', t: '12%', d: 0.6, s: 7 },
  { l: '58%', t: '82%', d: 1.8, s: 8 },
  { l: '72%', t: '18%', d: 0.9, s: 6 },
  { l: '86%', t: '55%', d: 2.1, s: 7 },
  { l: '92%', t: '80%', d: 1.5, s: 6 },
  { l: '30%', t: '88%', d: 2.4, s: 6 },
];

const Hero = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // Parallax por scroll + mouse (puro Framer, 0 costo GPU extra)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const layerText = useMouseParallax(10);
  const layerBottle = useMouseParallax(22);
  // En táctil no hay mouse: se desactiva el parallax (ahorra GPU y evita saltos)
  const [isCoarse] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia &&
    window.matchMedia('(hover: none)').matches
  );

  return (
    <section
      id="inicio"
      ref={ref}
      onMouseMove={(e) => { if (isCoarse) return; layerText.onMove(e); layerBottle.onMove(e); }}
      onMouseLeave={() => { if (isCoarse) return; layerText.onLeave(); layerBottle.onLeave(); }}
      className="relative overflow-hidden bg-ink text-linen select-none pt-[104px] md:pt-[124px]"
    >
      <CinematicPreloader />

      {/* ── Fondo cinematográfico CSS (sin WebGL) ── */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#24453a_0%,#1C1B1A_55%,#0e0e0d_100%)]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[220px] sm:w-[720px] sm:h-[360px] bg-emerald/25 blur-[100px] sm:blur-[130px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] bg-gold/15 blur-[80px] sm:blur-[120px] rounded-full" />
        {!reduce && CSS_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold/70 shadow-glow scent-float-slow"
            style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: `${p.d}s`, opacity: 0.6 }}
          />
        ))}
        <div className="hero-grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* ── Contenido ── */}
      <motion.div style={reduce ? undefined : { y: contentY, opacity: contentOpacity }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-16 pb-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center lg:min-h-[68vh]">
            {/* Texto */}
            <motion.div
              style={reduce || isCoarse ? undefined : { x: layerText.x, y: layerText.y }}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_FLUID }}
            >
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE_FLUID }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-gold/30 backdrop-blur-md text-gold-light text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Nueva colección · Plaza Barcelona
              </motion.span>

              <h1 className="leading-[0.95] tracking-tight mb-5">
                <KineticHeadline
                  text="Creado para ti"
                  delay={0.2}
                  className="block font-serif font-bold text-4xl xs:text-5xl sm:text-6xl lg:text-7xl text-linen"
                />
                <motion.span
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.55, ease: EASE_FLUID }}
                  className="block font-cursive font-normal text-gold-light text-3xl xs:text-4xl sm:text-5xl lg:text-6xl mt-2"
                >
                  un mundo de fragancias
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.7, ease: EASE_FLUID }}
                className="text-sm md:text-base text-linen/65 leading-relaxed max-w-md mb-8"
              >
                Inspiraciones 1.1, decants y originales. Fijación y proyección de alta gama, con envíos a todo el país.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.8, ease: EASE_FLUID }}
                className="flex flex-col xs:flex-row flex-wrap gap-3"
              >
                <motion.button
                  onClick={() => navigate('/catalogo')}
                  whileHover={reduce ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={SPRING_SOFT}
                  className="group bg-gradient-to-r from-gold to-gold-light text-ink px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow w-full xs:w-auto min-h-[52px]"
                >
                  Explorar Catálogo
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/experiencia')}
                  whileHover={reduce ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={SPRING_SOFT}
                  className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 text-linen hover:border-gold/60 hover:bg-white/5 backdrop-blur-md w-full xs:w-auto min-h-[52px] flex items-center justify-center"
                >
                  Crea tu Esencia
                </motion.button>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.95 } } }}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-[11px] font-bold uppercase tracking-wider text-linen/50"
              >
                {TRUST.map(({ icon: Icon, label }) => (
                  <motion.span
                    key={label}
                    variants={reduce ? undefined : { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_FLUID } } }}
                    className="flex items-center gap-1.5"
                  >
                    <Icon size={14} className="text-gold" /> {label}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Frasco nítido WebP */}
            <motion.div
              style={reduce || isCoarse ? undefined : { x: layerBottle.x, y: layerBottle.y }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE_FLUID }}
              className="relative flex items-center justify-center min-h-[300px] sm:min-h-[380px] lg:min-h-[520px]"
            >
              <div aria-hidden className="absolute w-72 h-72 lg:w-[26rem] lg:h-[26rem] rounded-full bg-gold/20 blur-[100px]" />
              <div aria-hidden className="absolute w-56 h-56 rounded-full border border-gold/20" />
              <div aria-hidden className="absolute w-80 h-80 rounded-full border border-white/5" />
              <motion.img
                src="/Images/Barcelona/Frascos/Sauvage Elixir Dior-Photoroom.webp"
                alt="Sauvage Elixir — Dupé Fragancia"
                width={640}
                height={640}
                fetchpriority="high"
                className="relative w-56 sm:w-72 lg:w-[24rem] aspect-square object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] will-change-transform"
                animate={reduce ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={reduce ? undefined : { scale: 1.04, transition: SPRING_SOFT }}
              />
              {/* Precio flotante glass */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5, ease: EASE_FLUID }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/8 border border-white/15 backdrop-blur-xl rounded-full pl-2 pr-5 py-1.5"
              >
                <img src="/Images/Dupé_logo.jpg" alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-[0.25em] text-gold-light font-bold">Desde</div>
                  <div className="text-sm font-bold text-white leading-none">$26.000</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Marquee de fragancias ── */}
        <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
          <div className="hero-marquee flex items-center gap-10 whitespace-nowrap py-3.5 px-6 w-max">
            {[...MARQUEE, ...MARQUEE].map((name, i) => (
              <span key={i} className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-linen/45">
                {name} <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-linen/40"
          >
            <span className="text-[9px] uppercase tracking-[0.35em]">Descubre</span>
            <ChevronDown size={16} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;
