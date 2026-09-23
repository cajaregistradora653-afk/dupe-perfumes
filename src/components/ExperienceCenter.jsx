import { useState, useMemo, useEffect, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Maximize, Sparkles, X, ChevronRight, Wind, Droplets, Heart, Gem, MapPin, RotateCcw, FlaskConical, Beaker, Send, Layers, Eye } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socialLinks } from '../data/fragrances';
import { dupes } from '../data/dupes';
import { LINEAS_FRAGANCIA, DECANT_PRICING } from '../data/decantData';
import { useCart } from '../context/CartContext';
import { BeatingHeart, GoldSparkles, TierBadge } from './MatchCelebration';
import { fromCatalogProduct, fromCustomDecant, cheapestSize } from '../lib/cart';
import { ShoppingCart } from 'lucide-react';
import { EASE_FLUID, SPRING_SOFT } from '../lib/motion';

/* ═══════════════════════════════════════════
   QUIZ LOGIC — maps answers → real perfumes
   ═══════════════════════════════════════════ */
const OCCASIONS = {
  'Diario': ['fresco', 'cítrico', 'verde', 'fresco especiado'],
  'Noche / Fiesta': ['avainillado', 'dulce', 'cálido especiado', 'ámbar'],
  'Trabajo / Oficina': ['fresco especiado', 'almizclado', 'atalcado', 'cítrico'],
  'Cita Romántica': ['avainillado', 'dulce', 'floral blanco', 'rosas'],
};

const MOODS = {
  'Energía y frescura': ['fresco', 'cítrico', 'verde', 'fresco especiado'],
  'Calidez y misterio': ['avainillado', 'dulce', 'ámbar', 'cálido especiado'],
  'Elegancia y poder': ['amaderado', 'almizclado', 'atalcado', 'balsámico'],
  'Dulzura y seducción': ['dulce', 'afrutados', 'avainillado', 'floral blanco'],
};

const INTENSITIES = {
  'Sutil — que quede cerca': ['fresco', 'cítrico', 'verde', 'atalcado'],
  'Moderada — para tu espacio': ['fresco especiado', 'almizclado', 'floral blanco', 'afrutados'],
  'Fuerte — que te anuncien': ['avainillado', 'dulce', 'ámbar', 'cálido especiado'],
};

function scorePerfumes(gender, occasion, mood, intensity) {
  const wantedAccords = [
    ...(OCCASIONS[occasion] || []),
    ...(MOODS[mood] || []),
    ...(INTENSITIES[intensity] || []),
  ];

  return dupes
    .filter(d => gender === 'Ambos' || d.genero === gender || d.genero === 'Unisex')
    .map(d => {
      const accords = d.acordes_principales || [];
      let score = 0;
      wantedAccords.forEach(w => {
        if (accords.some(a => a.toLowerCase() === w.toLowerCase())) score++;
      });
      return { ...d, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // top 3
}

/* Detección de línea por nombre (misma regla en quiz, builder y sugerencias) */
const NICHE_KEYWORDS = ['marly', 'kilian', 'xerjof', 'lattafa', 'kayali'];
const detectLinea = (name = '') => {
  const n = (name || '').toLowerCase();
  return NICHE_KEYWORDS.some(k => n.includes(k)) ? 'nicho' : 'disenador';
};

/* ═══════════════════════════════════════════
   FRASCO ELEGANTE — flacón sobrio que se llena
   según ml, color por familia y etiqueta con nombre
   ═══════════════════════════════════════════ */
const FAMILY_COLORS = {
  dulce: '#8E1E4A',
  fresco: '#1E5A8E',
  frutal: '#8E2A1E',
  floral: '#5E2A8E',
  'cálido especiado': '#8E4A1E',
  amaderado: '#5A4A3A',
  cítrico: '#8E6A1E',
};

const familyColor = (categoria) =>
  FAMILY_COLORS[(categoria || '').toLowerCase()] || '#8E6A1E';

/* ── Color del líquido según nivel de llenado ──
   Vacío → crema pálido · Medio → color de la familia · Lleno → profundo.
   Así el tarrito "cambia de color" a medida que se llena con los extras. */
const hexToRgb = (hex) => {
  const h = (hex || '#8E6A1E').replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(v, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mixHex = (a, b, t) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * Math.min(1, Math.max(0, t))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
};
const liquidColor = (base, fill) =>
  fill <= 0.5
    ? mixHex('#F4EFE6', base, fill * 2)
    : mixHex(base, '#17100A', (fill - 0.5) * 2 * 0.6);

/* Posiciones fijas de burbujas/destellos dentro del cuerpo */
const BUBBLE_SPOTS = [
  [48, 170], [70, 160], [92, 172], [58, 145], [82, 140], [48, 125], [72, 118], [92, 130],
];

const BottleVisual = ({ ml = 30, color = '#8E6A1E', className = 'h-44', boost = 0, bubbles = 0, glow = 0, shine = 0 }) => {
  const gid = useId().replace(/:/g, '');
  const effMl = Math.min(100, Math.max(0, ml + boost));
  const fill = effMl / 100;
  // Interior del cuerpo: x 30..110, y 62..196
  const innerH = 128 * fill;
  const innerY = 190 - innerH;
  const nb = Math.min(8, Math.max(0, bubbles));
  const ng = Math.min(6, Math.max(0, glow));
  const shineOp = Math.min(0.22, 0.10 + shine * 0.03);
  // El color del líquido evoluciona con el nivel de llenado
  const liq = liquidColor(color, fill);
  const liqTransition = { transition: 'stop-color 0.6s ease' };
  const levelTransition = { transition: 'y 0.6s ease, height 0.6s ease' };
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 140 214" className="h-full w-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id={`${gid}-liq`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="18%" stopColor={liq} stopOpacity="0.95" style={liqTransition} />
            <stop offset="50%" stopColor={liq} stopOpacity="1" style={liqTransition} />
            <stop offset="82%" stopColor={liq} stopOpacity="0.95" style={liqTransition} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`${gid}-liqv`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id={`${gid}-cap`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="22%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#0a0a0a" />
            <stop offset="78%" stopColor="#2e2e2e" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <linearGradient id={`${gid}-gold`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="30%" stopColor="#F4E3A1" />
            <stop offset="55%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#7a5f26" />
          </linearGradient>
          <radialGradient id={`${gid}-floor`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Sombra de piso */}
        <ellipse cx="70" cy="204" rx="36" ry="6" fill={`url(#${gid}-floor)`} />
        {/* Tapa metálica con filete dorado */}
        <rect x="52" y="4" width="36" height="22" rx="4" fill={`url(#${gid}-cap)`} stroke="#C9A84C" strokeOpacity="0.5" />
        <rect x="56" y="7" width="8" height="16" rx="4" fill="#ffffff" opacity="0.14" />
        <rect x="52" y="22" width="36" height="3.5" fill={`url(#${gid}-gold)`} />
        {/* Cuello con luz lateral */}
        <rect x="60" y="29" width="20" height="12" fill="#0d0d0d" stroke="#C9A84C" strokeOpacity="0.45" />
        <rect x="62" y="30" width="4" height="10" fill="#ffffff" opacity="0.18" />
        {/* Hombros y cuerpo base */}
        <path d="M60 41 L80 41 L92 56 L92 62 L48 62 L48 56 Z" fill="#161616" stroke="#ffffff" strokeOpacity="0.25" />
        <path d="M54 50 L58 44 L60 46 L56 52 Z" fill="#ffffff" opacity="0.25" />
        <rect x="30" y="62" width="80" height="134" rx="10" fill="#0e0e0e" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* Líquido con volumen cilíndrico */}
        {innerH > 3 && (
          <>
            <rect x="35" y={innerY} width="70" height={innerH} rx="7" fill={`url(#${gid}-liq)`} style={levelTransition} />
            <rect x="35" y={innerY} width="70" height={innerH} rx="7" fill={`url(#${gid}-liqv)`} style={levelTransition} />
            <rect x="35" y={innerY} width="70" height="7" rx="3.5" fill="#ffffff" opacity="0.28" />
            <ellipse cx="70" cy={innerY + 4} rx="30" ry="2.5" fill="#ffffff" opacity="0.20" />
            {/* Burbujas de extras */}
            {BUBBLE_SPOTS.slice(0, nb).map(([bx, by], i) => (
              by > innerY + 8 && <circle key={i} cx={bx} cy={by} r={2 + (i % 2)} fill="#ffffff" opacity="0.4" />
            ))}
            {/* Destellos dorados de feromona */}
            {BUBBLE_SPOTS.slice(0, ng).map(([bx, by], i) => (
              by > innerY + 8 && <circle key={`g${i}`} cx={bx + 8} cy={by - 4} r={1.6} fill="#E8D48B" opacity="0.95" />
            ))}
          </>
        )}
        {/* Reflejos de vidrio (el fijador los intensifica) */}
        <rect x="30" y="62" width="80" height="134" rx="10" fill={`url(#${gid}-glass)`} />
        <rect x="37" y="70" width="8" height="118" rx="4" fill="#ffffff" opacity={shineOp} />
        <rect x="47" y="74" width="3" height="110" rx="1.5" fill="#ffffff" opacity={Math.min(0.28, shineOp + 0.06)} />
        <rect x="99" y="72" width="3.5" height="116" rx="1.75" fill="#ffffff" opacity="0.14" />
        {/* Etiqueta crema con doble filete y sombra (solo ml, sin textos) */}
        <rect x="44" y="112" width="52" height="48" rx="3" fill="#000000" opacity="0.35" />
        <rect x="43" y="111" width="52" height="48" rx="3" fill="#F4EFE6" />
        <rect x="47" y="115" width="46" height="42" rx="2" fill="none" stroke="#1C1B1A" strokeOpacity="0.7" strokeWidth="0.75" />
        <text x="70" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1C1B1A" opacity="0.75">{ml} ml</text>
      </svg>
    </div>
  );
};

/* ── Medidor de llenado (móvil): % + muestra del color actual ── */
const BottleFillMeter = ({ ml = 30, boost = 0, color = '#8E6A1E' }) => {
  const effMl = Math.min(100, Math.max(0, ml + boost));
  const fill = effMl / 100;
  const liq = liquidColor(color, fill);
  const pct = Math.round(fill * 100);
  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-white/55 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-white/40 transition-colors duration-500"
            style={{ backgroundColor: liq }}
          />
          Llenado {pct}%
        </span>
        <span>{effMl} ml</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Nivel de llenado del frasco"
        className="h-1.5 rounded-full bg-white/10 overflow-hidden"
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: liq, transition: 'width 0.6s ease, background-color 0.6s ease' }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const ExperienceCenter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [isKiosk, setIsKiosk] = useState(false);
  const [kioskMode, setKioskMode] = useState(null); // null='choice', 'quiz', 'decant'
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  // Decant / Custom essence state
  const [dStep, setDStep] = useState(0);
  const [linea, setLinea] = useState(null);
  const [tamano, setTamano] = useState(null);
  const [extraGramos, setExtraGramos] = useState(0);
  const [extraFeromona, setExtraFeromona] = useState(0);
  const [extraFijador, setExtraFijador] = useState(0);
  const [perfumeName, setPerfumeName] = useState('');
  const [showPerfumeSuggestions, setShowPerfumeSuggestions] = useState(false);
  const { addItem, openCart } = useCart();

  // Check URL params for direct opening
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'quiz') {
      setIsKiosk(true);
      setKioskMode('quiz');
    } else if (tabParam === 'crea' || tabParam === 'decant') {
      setIsKiosk(true);
      setKioskMode('decant');
    }
  }, [searchParams]);


  const steps = [
    {
      key: 'gender',
      q: '¿Para quién buscas la fragancia?',
      sub: 'Esto nos ayuda a refinar las opciones.',
      options: ['Hombres', 'Dama', 'Ambos'],
    },
    {
      key: 'occasion',
      q: '¿Para qué ocasión la necesitas?',
      sub: 'Cada momento merece su aroma.',
      options: Object.keys(OCCASIONS),
    },
    {
      key: 'mood',
      q: '¿Qué sensación quieres transmitir?',
      sub: 'Tu fragancia habla por ti.',
      options: Object.keys(MOODS),
    },
    {
      key: 'intensity',
      q: '¿Qué nivel de proyección prefieres?',
      sub: 'La estela que dejas al pasar.',
      options: Object.keys(INTENSITIES),
    },
  ];

  const showResult = step >= steps.length;

  const recommendations = useMemo(() => {
    if (!showResult) return [];
    const res = scorePerfumes(
      answers.gender || 'Ambos',
      answers.occasion || '',
      answers.mood || '',
      answers.intensity || ''
    );
    // % relativo al mejor match + presentación más económica (evita $undefined)
    const top = res[0]?.score || 1;
    return res.map(p => {
      const entries = Object.entries(p.precios || {}).sort(
        (a, b) => (parseFloat(a[1].replace(/\./g, '')) || 0) - (parseFloat(b[1].replace(/\./g, '')) || 0)
      );
      return { ...p, pct: Math.round((p.score / top) * 100), minEntry: entries[0] };
    });
  }, [showResult, answers]);

  /* Cierra el kiosk y abre la ficha del perfume en el catálogo */
  const openPerfumeSheet = (perf) => {
    setIsKiosk(false);
    navigate(`/catalogo?perfume=${encodeURIComponent(perf.codigo)}`);
  };

  const handleOption = (value) => {
    const newAnswers = { ...answers, [steps[step].key]: value };
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const resetExperience = () => {
    setIsKiosk(false);
    setKioskMode(null);
    setStep(0);
    setAnswers({});
    resetDecant();
  };

  const restartQuiz = () => { setStep(0); setAnswers({}); };

  const resetDecant = () => {
    setDStep(0);
    setLinea(null);
    setTamano(null);
    setExtraGramos(0);
    setExtraFeromona(0);
    setExtraFijador(0);
    setPerfumeName('');
    setShowPerfumeSuggestions(false);
  };

  const startDecantWithPerfume = (perfume) => {
    setKioskMode('decant');
    setPerfumeName(perfume.dupe);
    setLinea(detectLinea(`${perfume.dupe} ${perfume.codigo || ''}`));
    setTamano(30);
    setDStep(1); // Jump directly to sizing step!
  };

  const filteredDupes = useMemo(() => {
    if (!perfumeName) return [];
    return dupes.filter(d =>
      d.dupe.toLowerCase().includes(perfumeName.toLowerCase())
    ).slice(0, 5);
  }, [perfumeName]);

  const handleSelectPerfume = (perf) => {
    setPerfumeName(perf.dupe);
    setLinea(detectLinea(perf.dupe));
    setShowPerfumeSuggestions(false);
  };

  const canAdvanceDecant = () => {
    if (dStep === 0) return perfumeName.trim() !== '' && linea !== null;
    if (dStep === 1) return tamano !== null;
    if (dStep === 2) return true; // Extras are optional
    return false;
  };

  const dShowResult = dStep >= 3;

  const currentSizeObj = useMemo(() => {
    if (!linea || !tamano) return null;
    const standardSize = DECANT_PRICING[linea].sizes.find(s => s.ml === tamano);
    if (standardSize) return standardSize;

    // For custom sizes, calculate proportionally based on the 100ml standard
    const ref100 = DECANT_PRICING[linea].sizes.find(s => s.ml === 100);
    const baseGrams = Math.round(tamano * (ref100.baseGrams / 100) * 10) / 10;
    const price = Math.round(tamano * (ref100.price / 100));

    return {
      ml: tamano,
      baseGrams,
      price,
      desc: `Incluye ${baseGrams}g ${linea === 'disenador' ? '+ 3 gotas feromona/fijador' : ''}`
    };
  }, [linea, tamano]);

  /* Color del frasco: familia del perfume si coincide, si no línea */
  const bottleDupe = useMemo(() => {
    const n = perfumeName.trim().toLowerCase();
    if (!n) return null;
    return dupes.find(d => d.dupe.toLowerCase() === n) || null;
  }, [perfumeName]);
  const bottleColor = bottleDupe
    ? familyColor(bottleDupe.categoria)
    : linea === 'nicho' ? '#1E5144' : '#C9A84C';
  const bottleSub = linea ? (LINEAS_FRAGANCIA.find(l => l.id === linea)?.label || '') : '';

  const totalPrecio = useMemo(() => {
    if (!linea || !currentSizeObj) return 0;
    const base = currentSizeObj.price;
    const extra = (extraGramos * DECANT_PRICING[linea].extras.gramo) +
      (extraFeromona * DECANT_PRICING[linea].extras.feromona) +
      (extraFijador * DECANT_PRICING[linea].extras.fijador);
    return base + extra;
  }, [linea, currentSizeObj, extraGramos, extraFeromona, extraFijador]);

  const decantMsg = useMemo(() => {
    if (!dShowResult) return '';
    const lInfo = LINEAS_FRAGANCIA.find(l => l.id === linea);
    const baseG = currentSizeObj?.baseGrams || 0;
    const defaultFeromona = linea === 'disenador' ? 3 : 0;
    const defaultFijador = linea === 'disenador' ? 3 : 0;

    const extrasText = [];
    if (extraGramos > 0) extrasText.push(`+ ${extraGramos}g fragancia`);
    if (extraFeromona > 0) extrasText.push(`+ ${extraFeromona} gotas feromona`);
    if (extraFijador > 0) extrasText.push(`+ ${extraFijador} gotas fijador`);
    const extrasStr = extrasText.length > 0 ? `🎁 Adicionales: ${extrasText.join(', ')}` : '';

    const lines = [
      '✨ *Solicitud de Decant Personalizado — Dupé*',
      `✨ Fragancia: ${perfumeName.trim()}`,
      `✨ Línea: ${lInfo?.label}`,
      `✨ Tamaño: ${tamano} ml`,
      `💧 Fragancia pura base: ${baseG}g`,
      `✨ Feromona incluida: ${defaultFeromona} gotas`,
      `✨ Fijador incluido: ${defaultFijador} gotas`
    ];

    if (extrasStr) {
      lines.push(extrasStr);
    }

    lines.push(`💰 Total estimado: $${totalPrecio.toLocaleString('es-CO')}`);
    lines.push('');
    lines.push(`¡Hola! Me gustaría pedir un decant de *${perfumeName.trim()}* con estas especificaciones.`);

    return encodeURIComponent(lines.join('\n'));
  }, [dShowResult, linea, tamano, extraGramos, extraFeromona, extraFijador, totalPrecio, currentSizeObj, perfumeName]);

  const quizMsg = useMemo(() => {
    if (!showResult || recommendations.length === 0) return '';
    const names = recommendations.map(p => p.dupe).join(', ');
    return encodeURIComponent(['✨ *Mi Match Olfativo — Dupé*', '', '¡Hola! Hice el quiz sensorial y estas son las fragancias recomendadas:', '', `🏆 ${names}`, '', '¿Tienen disponibilidad para probarlas?'].join('\n'));
  }, [showResult, recommendations]);

  const handleAddDecantToCart = () => {
    if (!dShowResult || !linea || !currentSizeObj) return;
    addItem(fromCustomDecant({
      name: perfumeName.trim(),
      linea,
      lineaLabel: LINEAS_FRAGANCIA.find((l) => l.id === linea)?.label,
      tamano,
      baseGrams: currentSizeObj.baseGrams,
      extraGramos,
      extraFeromona,
      extraFijador,
      totalPrecio,
    }));
    openCart();
  };

  const handleAddQuizToCart = () => {
    recommendations.slice(0, 3).forEach((p) => {
      addItem(fromCatalogProduct(p, cheapestSize(p.precios)));
    });
    openCart();
  };

  const dSteps = [
    { t: 'Fragancia y Línea', s: 'Indica el perfume de tu elección y su línea base.' },
    { t: '¿Qué tamaño?', s: 'Elige la presentación en ml.' },
    { t: 'Personalización', s: 'Añade gramos o gotas extras si lo deseas.' }
  ];

  /* Dark backgrounds so white text is always legible */
  const bgGradients = [
    'from-[#0D1B16] to-[#14261E]',
    'from-[#111F1A] to-[#0D1B16]',
    'from-[#14261E] to-[#0F2118]',
    'from-[#0F2118] to-[#0D1B16]',
    'from-[#0D1B16] to-[#091410]', // result
  ];
  const currentGrad = bgGradients[Math.min(step, bgGradients.length - 1)];

  return (
    <section id="experiencia" className={`relative transition-all duration-700 ${isKiosk ? 'z-[100]' : 'py-14 md:py-10 bg-linen text-moss overflow-hidden'}`}>

      {/* ════════════════════════════════════
          KIOSKO FULLSCREEN OVERLAY
          ════════════════════════════════════ */}
      <AnimatePresence>
        {isKiosk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_FLUID }}
            className={`fixed inset-0 z-[100] bg-gradient-to-br ${currentGrad} flex flex-col overflow-hidden text-white transition-colors duration-1000`}
          >
            {/* Ambient cinematográfico: glows + grano + viñeta */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/[0.03] rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[100px]" />
              <div className="hero-grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_45%,rgba(0,0,0,0.5)_100%)]" />
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-12 py-5 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <img src="/Images/Dupé_logo.jpg" alt="Dupé" className="h-12 w-12 rounded-full border-2 border-gold/30" />
                <div className="hidden md:block">
                  <span className="block text-sm font-bold">Dupé</span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40">Creado para ti</span>
                </div>
              </div>

              <div className="hidden md:block">
                <span className="text-[11px] tracking-[0.35em] uppercase font-bold text-white/50 border border-white/10 px-6 py-2 rounded-full">
                  Viaje Sensorial
                </span>
              </div>

              <button
                onClick={resetExperience}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-16 relative z-10 min-h-0 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ──── CHOICE SCREEN ──── */}
                {kioskMode === null ? (
                  <motion.div
                    key="choice-screen"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease: EASE_FLUID }}
                    className="w-full max-w-4xl"
                  >
                    <div className="text-center mb-12">
                      <h3 className="text-4xl md:text-6xl font-elegant leading-tight mb-4">
                        Bienvenido a la <span className="text-gold">Experiencia Dupé</span>
                      </h3>
                      <p className="text-white/50 text-lg md:text-xl font-elegant">
                        ¿Cómo te gustaría comenzar tu viaje hoy?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setKioskMode('quiz')}
                        className="group relative p-8 md:p-12 bg-white/[0.05] border border-white/10 rounded-3xl text-left overflow-hidden transition-all hover:bg-white/[0.08]"
                      >
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-emerald/20 flex items-center justify-center text-emerald mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={32} />
                          </div>
                          <h4 className="text-2xl md:text-3xl font-elegant mb-3">Encontrar mi <span className="text-emerald">Fragancia</span></h4>
                          <p className="text-white/50 text-sm md:text-base font-elegant leading-relaxed mb-8">
                            Responde nuestro breve cuestionario y descubre el perfume ideal basado en tu personalidad y estilo.
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                            Comenzar Quiz <ChevronRight size={14} />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Sparkles size={120} />
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setKioskMode('decant')}
                        className="group relative p-8 md:p-12 bg-white/[0.05] border border-white/10 rounded-3xl text-left overflow-hidden transition-all hover:bg-white/[0.08]"
                      >
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                            <FlaskConical size={32} />
                          </div>
                          <h4 className="text-2xl md:text-3xl font-elegant mb-3">Armar mi <span className="text-gold">Decant</span></h4>
                          <p className="text-white/50 text-sm md:text-base font-elegant leading-relaxed mb-8">
                            Diseña tu decant seleccionando la línea, el tamaño y los extras para tu fragancia.
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                            Pedir Decant <ChevronRight size={14} />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <FlaskConical size={120} />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : kioskMode === 'quiz' ? (
                  /* ──── QUIZ FLOW ──── */
                  <AnimatePresence mode="wait">
                    {!showResult ? (
                      <motion.div
                        key={`step-${step}`}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 48, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, x: -48, filter: 'blur(6px)' }}
                        transition={{ duration: 0.4, ease: EASE_FLUID }}
                        className="w-full max-w-3xl"
                      >
                        <div className="flex items-center gap-3 mb-10">
                          {steps.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }}
                                className="h-full bg-white/70 rounded-full"
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          ))}
                          <span className="text-[10px] font-bold tracking-widest text-white/40 ml-2">{step + 1}/{steps.length}</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-elegant leading-tight mb-3 text-white">{steps[step].q}</h3>
                        <p className="text-sm md:text-base text-white/50 font-elegant mb-8">{steps[step].sub}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {steps[step].options.map((opt, idx) => (
                            <motion.button
                              key={opt}
                              initial={reduce ? false : { opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05, duration: 0.3, ease: EASE_FLUID }}
                              whileHover={reduce ? undefined : { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)', transition: SPRING_SOFT }}
                              whileTap={reduce ? undefined : { scale: 0.97 }}
                              onClick={() => handleOption(opt)}
                              className="flex items-center justify-between gap-3 px-5 sm:px-7 py-5 sm:py-6 min-h-[72px] bg-white/[0.06] border border-white/10 rounded-2xl text-left text-base sm:text-lg md:text-xl font-bold backdrop-blur-sm group"
                            >
                              <span>{opt}</span>
                              <ChevronRight size={20} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="results" initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.5, ease: EASE_FLUID }} className="w-full max-w-5xl py-6">
                        <div className="text-center mb-8">
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/25 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-white/85 mb-4">
                            <Sparkles size={12} /> Tu perfil olfativo
                          </span>
                          <h3 className="text-3xl md:text-4xl font-elegant text-white">Tus Fragancias <span className="text-gold-light">Ideales</span></h3>
                          <p className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold-light text-[11px] font-bold uppercase tracking-[0.25em]">
                            ¡Match perfecto encontrado!
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {recommendations.map((perf, idx) => (
                            <motion.div
                              key={perf.codigo}
                              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(5px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              transition={idx === 0 ? { delay: 0.35, type: 'spring', stiffness: 220, damping: 19 } : { delay: idx * 0.12, duration: 0.45, ease: EASE_FLUID }}
                              className={`relative rounded-2xl overflow-hidden ${idx === 0 ? 'bg-white text-moss shadow-2xl shadow-black/30 z-10' : 'bg-[#101F1A] text-white border border-white/20 shadow-xl shadow-black/40 backdrop-blur-sm'}`}
                            >
                              {idx === 0 && <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-emerald text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">★ Mejor match</div>}
                              <TierBadge pct={perf.pct} isWinner={idx === 0} countDelay={500 + idx * 200} />
                              <div className={`relative flex items-center justify-center py-5 px-4 ${idx === 0 ? 'bg-gradient-to-b from-shine to-white' : 'bg-black/30'}`}>
                                {idx === 0 && (
                                  <>
                                    <GoldSparkles />
                                    <BeatingHeart />
                                  </>
                                )}
                                <img src={perf.bottleImage || "/Images/perfume_isolated.webp"} alt={perf.dupe} className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg" />
                              </div>
                              <div className="p-4 md:p-5">
                                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${idx === 0 ? 'text-emerald/60' : 'text-gold-light/90'}`}>{perf.categoria} · {perf.genero}</span>
                                <h4 className={`text-xl font-elegant leading-snug mt-1 mb-3 ${idx === 0 ? 'text-moss' : 'text-white'}`}>{perf.dupe}</h4>
                                <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${idx === 0 ? 'text-stone' : 'text-white/90'}`}>{perf.descripcion}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {perf.acordes_principales?.slice(0, 3).map(a => (
                                    <span key={a} className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${idx === 0 ? 'bg-emerald/10 text-emerald' : 'bg-gold/15 text-gold-light border border-gold/30'}`}>{a}</span>
                                  ))}
                                </div>
                                <div className={`mt-4 pt-4 border-t flex items-end justify-between ${idx === 0 ? 'border-moss/10' : 'border-white/15'}`}>
                                  <div>
                                    <span className={`text-[8px] uppercase tracking-widest font-bold block ${idx === 0 ? 'text-moss/40' : 'text-white/60'}`}>Desde · {perf.minEntry?.[0] === '100ml' ? '100 ml' : perf.minEntry?.[0] === '8ml_lujo' ? '8 ml lujo' : `${perf.minEntry?.[0]}`}</span>
                                    <span className={`text-lg font-bold ${idx === 0 ? 'text-emerald' : 'text-gold-light'}`}>${perf.minEntry?.[1]}</span>
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest ${idx === 0 ? 'text-emerald/60' : 'text-white/60'}`}>Cód. {perf.codigo.split('-')[0]}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() => openPerfumeSheet(perf)}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${idx === 0 ? 'bg-emerald text-white border-emerald hover:bg-moss' : 'bg-white text-moss border-white hover:bg-shine'}`}
                                  >
                                    <Eye size={13} /> Ver ficha
                                  </button>
                                  <button
                                    onClick={() => startDecantWithPerfume(perf)}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${idx === 0 ? 'bg-gold text-white border-gold hover:bg-gold/90 shadow-md shadow-gold/20' : 'bg-gold text-ink border-gold hover:bg-gold-light shadow-md shadow-gold/20'}`}
                                  >
                                    🧪 Armar decant
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                          <button onClick={handleAddQuizToCart} className="flex items-center justify-center gap-3 px-6 py-3 bg-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"><ShoppingCart size={16} /> Agregar mis matches</button>
                          <button onClick={restartQuiz} className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-emerald rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"><RotateCcw size={16} /> Volver a Empezar</button>
                          <a href={`${socialLinks.whatsapp}?text=${quizMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-moss rounded-xl font-bold text-xs uppercase tracking-widest border border-white hover:bg-shine transition-all"><Send size={16} /> Enviar Match por WhatsApp</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  /* ──── DECANT BUILDER FLOW ──── */
                  <AnimatePresence mode="wait">
                    {!dShowResult ? (
                      <div key="dform" className="w-full max-w-6xl"
                      >
                        {/* Stepper con etiquetas */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-4">
                          {dSteps.map((s, i) => (
                            <div key={i} className="flex-1 flex items-center gap-2 min-w-0">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${i < dStep ? 'bg-emerald text-white' : i === dStep ? 'bg-gold text-white' : 'bg-white/10 text-white/40'}`}>
                                {i < dStep ? '✓' : i + 1}
                              </span>
                              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate ${i === dStep ? 'text-white' : 'text-white/35'}`}>
                                {s.t}
                              </span>
                            </div>
                          ))}
                          <span className="text-[10px] font-bold tracking-widest text-white/40 ml-2 shrink-0">{dStep + 1}/3</span>
                        </div>
                        <div className="flex items-center gap-3 mb-10">
                          {dSteps.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: i < dStep ? '100%' : i === dStep ? '50%' : '0%' }}
                                className="h-full bg-gold/70 rounded-full"
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Frasco móvil sticky: persiste entre pasos y al scrollear */}
                        <div className="lg:hidden sticky top-0 z-20 px-3 pt-2 pb-3 mb-5 bg-[#0D1B16]/80 backdrop-blur-md rounded-2xl border border-white/10">
                          <div className="flex items-center justify-center gap-4">
                            <BottleVisual ml={tamano || 30} color={bottleColor} boost={extraGramos} bubbles={extraGramos + extraFeromona + extraFijador} glow={extraFeromona} shine={extraFijador} className="h-24" />
                            <div className="min-w-0">
                              <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold/70">Tu creación</p>
                              <p className="text-xl font-bold text-white truncate">{perfumeName.trim() || 'Sin fragancia'}</p>
                              <p className="text-sm font-bold text-gold">{linea && currentSizeObj ? `$${totalPrecio.toLocaleString('es-CO')}` : `${tamano || 30} ml`}</p>
                            </div>
                          </div>
                          <BottleFillMeter ml={tamano || 30} boost={extraGramos} color={bottleColor} />
                        </div>
                        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
                          <div className="min-w-0">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`dstep-${dStep}`}
                                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40, filter: 'blur(6px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40, filter: 'blur(6px)' }}
                                transition={{ duration: 0.38, ease: EASE_FLUID }}
                              >
                        <h3 className="text-3xl md:text-5xl font-elegant leading-tight mb-2 text-white">{dSteps[dStep].t}</h3>
                        <p className="text-sm text-white/50 font-elegant mb-8">{dSteps[dStep].s}</p>
                        {/* Step 0: Fragancia y Línea */}
                        {dStep === 0 && (
                          <div className="space-y-6">
                            {/* Fragancia Input */}
                            <div className="relative">
                              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">1. ¿Qué fragancia deseas envasar?</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Ej. Poison Girl Dior, Sauvage Elixir..."
                                  value={perfumeName}
                                  onChange={(e) => {
                                    setPerfumeName(e.target.value);
                                    setShowPerfumeSuggestions(true);
                                  }}
                                  onFocus={() => setShowPerfumeSuggestions(true)}
                                  className="flex-1 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold/50 transition-all font-elegant"
                                />
                                {perfumeName && (
                                  <button
                                    onClick={() => { setPerfumeName(''); setLinea(null); }}
                                    className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase tracking-wider text-white/60 transition-all"
                                  >
                                    Limpiar
                                  </button>
                                )}
                              </div>

                              {/* Autocomplete Dropdown */}
                              {showPerfumeSuggestions && perfumeName.trim().length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 bg-[#0F2118] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto backdrop-blur-lg">
                                  {filteredDupes.length > 0 ? (
                                    filteredDupes.map(p => (
                                      <button
                                        key={p.codigo}
                                        type="button"
                                        onClick={() => handleSelectPerfume(p)}
                                        className="w-full px-5 py-3 text-left hover:bg-white/5 text-sm text-white/80 transition-all border-b border-white/5 last:border-b-0 flex items-center justify-between"
                                      >
                                        <span>{p.dupe}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-white/30">{p.categoria}</span>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-5 py-3 text-sm text-white/40 italic">Usa "{perfumeName}" como fragancia personalizada</div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Popular Suggestions */}
                            <div>
                              <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Sugerencias Populares</span>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { dupe: 'Poison Girl Dior' },
                                  { dupe: 'Sauvage Elixir Dior' },
                                  { dupe: 'Coco Mademoiselle de Chanel' },
                                  { dupe: 'Versace Eros' },
                                  { dupe: 'Sedley de Parfums de Marly' }
                                ].map(sug => (
                                  <button
                                    key={sug.dupe}
                                    type="button"
                                    onClick={() => {
                                      const pObj = dupes.find(d => d.dupe.toLowerCase() === sug.dupe.toLowerCase()) || sug;
                                      handleSelectPerfume(pObj);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${perfumeName === sug.dupe ? 'bg-gold/20 border-gold text-gold' : 'bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/[0.06] hover:text-white'}`}
                                  >
                                    {sug.dupe.split(' de ')[0].split(' de by ')[0]}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Línea Base */}
                            <div className="pt-2">
                              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">2. Elige la línea base (Define el precio)</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {LINEAS_FRAGANCIA.map(l => {
                                  const minPrice = Math.min(...DECANT_PRICING[l.id].sizes.map(s => s.price));
                                  const suggested = perfumeName.trim() !== '' && detectLinea(perfumeName) === l.id;
                                  return (
                                    <button
                                      key={l.id}
                                      type="button"
                                      onClick={() => { setLinea(l.id); setTamano(tamano || 30); }}
                                      className={`relative flex flex-col gap-2 px-6 py-5 rounded-2xl border text-left transition-all ${linea === l.id ? 'bg-white/10 border-gold/50 shadow-lg shadow-gold/5' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'}`}
                                    >
                                      {suggested && (
                                        <span className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-gold text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow">
                                          Sugerida para tu fragancia
                                        </span>
                                      )}
                                      <span className={`text-lg font-bold ${linea === l.id ? 'text-gold' : 'text-white'}`}>{l.label}</span>
                                      <span className="text-xs text-white/40">{l.desc}</span>
                                      <span className={`text-sm font-bold ${linea === l.id ? 'text-gold' : 'text-white/60'}`}>Desde ${minPrice.toLocaleString('es-CO')}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 1: Tamaño */}
                        {dStep === 1 && linea && (
                          <div className="space-y-8">
                            {/* Standard Sizes */}
                            <div>
                              <span className="block text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Tamaños Estándar</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {DECANT_PRICING[linea].sizes.map(s => (
                                  <motion.button
                                    key={s.ml}
                                    onClick={() => setTamano(s.ml)}
                                    className={`flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border transition-all text-center ${tamano === s.ml ? 'bg-white/15 border-gold/50 shadow-lg shadow-gold/10' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'}`}
                                  >
                                    <Beaker size={24} className={tamano === s.ml ? 'text-gold' : 'text-white/50'} />
                                    <span className={`text-xl font-bold ${tamano === s.ml ? 'text-gold' : 'text-white'}`}>{s.ml} ml</span>
                                    <span className={`text-[10px] leading-tight ${tamano === s.ml ? 'text-gold/80' : 'text-white/40'}`}>{s.desc}</span>
                                    <span className={`text-sm font-bold mt-2 ${tamano === s.ml ? 'text-gold' : 'text-white/60'}`}>${s.price.toLocaleString('es-CO')}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Custom Slider */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <span className="block text-xs font-bold text-white/80">Tamaño Personalizado</span>
                                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Ajusta el volumen exacto</span>
                                </div>
                                <span className="text-2xl font-bold text-gold">{tamano} ml</span>
                              </div>
                              <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={tamano || 30}
                                onChange={(e) => setTamano(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                                style={{
                                  background: 'linear-gradient(to right, #D4AF37 0%, #D4AF37 ' + (tamano || 30) + '%, rgba(255,255,255,0.1) ' + (tamano || 30) + '%, rgba(255,255,255,0.1) 100%)'
                                }}
                              />
                              <div className="flex justify-between text-[10px] text-white/40 mt-2 font-mono">
                                <span>5 ml</span>
                                <span>25 ml</span>
                                <span>50 ml</span>
                                <span>75 ml</span>
                                <span>100 ml</span>
                              </div>
                            </div>

                            {/* Dynamic Dosage Info Card */}
                            {currentSizeObj && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-gold/10 via-white/[0.02] to-transparent border border-gold/20 rounded-2xl p-6 backdrop-blur-md"
                              >
                                <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold mb-4 flex items-center gap-2">
                                  <Sparkles size={12} /> Dosificación de la Fragancia en Tiempo Real
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs md:text-sm">
                                  <div className="space-y-3">
                                    <div className="flex justify-between pb-2 border-b border-white/5">
                                      <span className="text-white/50">Línea de decant:</span>
                                      <span className="font-bold text-gold uppercase tracking-wider text-xs">
                                        {linea === 'disenador' ? 'Beniet Diseñador' : 'Beniet Nicho'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-white/5">
                                      <span className="text-white/50">Fragancia pura base:</span>
                                      <span className="font-bold text-white">{currentSizeObj.baseGrams}g</span>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex justify-between pb-2 border-b border-white/5">
                                      <span className="text-white/50">Feromona incluida por defecto:</span>
                                      <span className="font-bold text-white">{linea === 'disenador' ? '3 gotas' : '0 gotas'}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-white/5">
                                      <span className="text-white/50">Fijador incluido por defecto:</span>
                                      <span className="font-bold text-white">{linea === 'disenador' ? '3 gotas' : '0 gotas'}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}

                        {/* Step 2: Extras */}
                        {dStep === 2 && linea && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                            {/* Gramos Adicionales */}
                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center">
                              <span className="text-lg font-bold text-white mb-1">Gramos extra</span>
                              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-5">+${DECANT_PRICING[linea].extras.gramo} c/u</span>
                              <div className="flex items-center gap-6">
                                <button onClick={() => setExtraGramos(Math.max(0, extraGramos - 1))} aria-label="Quitar un gramo extra" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 active:scale-95 transition-all">-</button>
                                <span className="text-3xl font-elegant w-8 text-center">{extraGramos}</span>
                                <button onClick={() => setExtraGramos(extraGramos + 1)} aria-label="Agregar un gramo extra" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-gold/20 text-gold flex items-center justify-center text-2xl hover:bg-gold/30 active:scale-95 transition-all">+</button>
                              </div>
                            </div>

                            {/* Feromona */}
                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center">
                              <span className="text-lg font-bold text-white mb-1">Gotas Feromona</span>
                              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-5">+${DECANT_PRICING[linea].extras.feromona} c/u</span>
                              <div className="flex items-center gap-6">
                                <button onClick={() => setExtraFeromona(Math.max(0, extraFeromona - 1))} aria-label="Quitar una gota de feromona" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 active:scale-95 transition-all">-</button>
                                <span className="text-3xl font-elegant w-8 text-center">{extraFeromona}</span>
                                <button onClick={() => setExtraFeromona(extraFeromona + 1)} aria-label="Agregar una gota de feromona" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-gold/20 text-gold flex items-center justify-center text-2xl hover:bg-gold/30 active:scale-95 transition-all">+</button>
                              </div>
                            </div>

                            {/* Fijador */}
                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center">
                              <span className="text-lg font-bold text-white mb-1">Gotas Fijador</span>
                              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-5">+${DECANT_PRICING[linea].extras.fijador} c/u</span>
                              <div className="flex items-center gap-6">
                                <button onClick={() => setExtraFijador(Math.max(0, extraFijador - 1))} aria-label="Quitar una gota de fijador" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 active:scale-95 transition-all">-</button>
                                <span className="text-3xl font-elegant w-8 text-center">{extraFijador}</span>
                                <button onClick={() => setExtraFijador(extraFijador + 1)} aria-label="Agregar una gota de fijador" className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-gold/20 text-gold flex items-center justify-center text-2xl hover:bg-gold/30 active:scale-95 transition-all">+</button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Decant Nav */}
                        <div className="flex items-center justify-between mt-10">
                          <button onClick={() => dStep > 0 ? setDStep(dStep - 1) : setKioskMode(null)} className="text-[11px] uppercase tracking-widest font-bold text-white/30 hover:text-white transition-colors">← Volver</button>
                          <button
                            onClick={() => canAdvanceDecant() && setDStep(dStep + 1)}
                            disabled={!canAdvanceDecant()}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${canAdvanceDecant() ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                          >
                            Siguiente <ChevronRight size={16} />
                          </button>
                        </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          {/* Resumen sticky en vivo (desktop) */}
                          <aside className="hidden lg:block sticky top-6 bg-white/[0.06] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold/70 mb-4 text-center">Tu creación en vivo</h4>
                            <BottleVisual ml={tamano || 30} color={bottleColor} boost={extraGramos} bubbles={extraGramos + extraFeromona + extraFijador} glow={extraFeromona} shine={extraFijador} className="h-52 mb-4" />
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between gap-3 pb-2 border-b border-white/5">
                                <span className="text-white/45">Fragancia</span>
                                <span className="font-bold text-white text-right truncate">{perfumeName.trim() || '—'}</span>
                              </div>
                              <div className="flex justify-between gap-3 pb-2 border-b border-white/5">
                                <span className="text-white/45">Línea</span>
                                <span className="font-bold text-white">{linea ? LINEAS_FRAGANCIA.find(l => l.id === linea)?.label : '—'}</span>
                              </div>
                              <div className="flex justify-between gap-3 pb-2 border-b border-white/5">
                                <span className="text-white/45">Tamaño</span>
                                <span className="font-bold text-white">{tamano ? `${tamano} ml` : '—'}</span>
                              </div>
                              <div className="flex justify-between gap-3 pb-2 border-b border-white/5">
                                <span className="text-white/45">Extras</span>
                                <span className="font-bold text-white">{extraGramos + extraFeromona + extraFijador > 0 ? `${extraGramos + extraFeromona + extraFijador}` : '—'}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-white/45">Total estimado</span>
                                <span className="text-2xl font-bold text-gold">{linea && currentSizeObj ? `$${totalPrecio.toLocaleString('es-CO')}` : '—'}</span>
                              </div>
                            </div>
                          </aside>
                        </div>
                      </div>
                    ) : (
                      <motion.div key="dresult" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl">
                        <div className="text-center mb-10">
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-gold/80 mb-4"><Sparkles size={12} /> Tu Creación</span>
                          <h3 className="text-3xl md:text-4xl font-elegant text-white">Tu Fragancia <span className="text-gold">Personalizada</span></h3>
                        </div>
                        <div className="flex justify-center mb-8">
                          <BottleVisual ml={tamano || 30} color={bottleColor} boost={extraGramos} bubbles={extraGramos + extraFeromona + extraFijador} glow={extraFeromona} shine={extraFijador} className="h-56" />
                        </div>
                        <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-8">
                          <div className="max-w-xl mx-auto space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold/60">Detalles de Selección</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5"><span className="text-sm text-white/50 font-bold text-gold">Fragancia</span><span className="font-bold text-white">{perfumeName}</span></div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-sm text-white/50">Línea</span><span className="font-bold text-white">{LINEAS_FRAGANCIA.find(l => l.id === linea)?.label}</span></div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-sm text-white/50">Tamaño Base</span><span className="font-bold text-white">{tamano} ml ({currentSizeObj?.baseGrams}g)</span></div>
                              {(extraGramos > 0 || extraFeromona > 0 || extraFijador > 0) && (
                                <div className="py-2 border-b border-white/5">
                                  <span className="block text-[10px] uppercase tracking-widest text-gold/80 mb-1">Extras Añadidos:</span>
                                  {extraGramos > 0 && <div className="flex justify-between text-xs"><span className="text-white/50">+{extraGramos}g fragancia</span><span className="text-white">${(extraGramos * DECANT_PRICING[linea].extras.gramo).toLocaleString()}</span></div>}
                                  {extraFeromona > 0 && <div className="flex justify-between text-xs"><span className="text-white/50">+{extraFeromona} gotas feromona</span><span className="text-white">${(extraFeromona * DECANT_PRICING[linea].extras.feromona).toLocaleString()}</span></div>}
                                  {extraFijador > 0 && <div className="flex justify-between text-xs"><span className="text-white/50">+{extraFijador} gotas fijador</span><span className="text-white">${(extraFijador * DECANT_PRICING[linea].extras.fijador).toLocaleString()}</span></div>}
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-2"><span className="text-sm text-white/50">Inversión estimada</span><span className="text-2xl font-bold text-gold">${totalPrecio.toLocaleString('es-CO')}</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button onClick={handleAddDecantToCart} className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"><ShoppingCart size={16} /> Agregar al carrito</button>
                          <a href={`${socialLinks.whatsapp}?text=${decantMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-gold text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"><Send size={16} /> Enviar por WhatsApp</a>
                          <button onClick={resetDecant} className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"><RotateCcw size={16} /> Empezar de Nuevo</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-6 md:px-12 py-4 shrink-0 relative z-10 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 text-white/20">
                <Wind size={14} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Dupé · Creado para ti</span>
              </div>
              {!showResult && step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-[11px] uppercase tracking-widest font-bold text-white/30 hover:text-white transition-colors"
                >
                  ← Anterior
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          NORMAL WEB MODE (teaser / entry point)
          ════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Copy side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-emerald mb-4">
                <span className="h-px w-10 bg-emerald/30" />
                <span className="uppercase tracking-[0.35em] text-[11px] font-bold">Laboratorio & Test</span>
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl mb-6 leading-tight font-serif">
                <span className="text-emerald block mb-1">Crea tu</span>
                <span className="font-cursive text-moss text-3xl sm:text-5xl md:text-6xl block ml-4 sm:ml-12">Esencia Única</span>
              </h2>

              <p className="text-moss/70 text-sm md:text-base font-sans leading-relaxed max-w-xl mb-8">
                Diseña tu perfume personalizado con fórmulas preparadas a tu medida (seleccionando género, tamaño de frasco y perfil olfativo) o realiza nuestro <strong className="text-emerald">Test de Fragancia</strong> para encontrar tu match sensorial ideal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { setIsKiosk(true); setKioskMode('decant'); }}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-moss transition-all hover:scale-[1.02] shadow-xl shadow-emerald/20 border border-gold/30"
                >
                  <Beaker size={18} className="group-hover:rotate-12 transition-transform text-gold" />
                  Personalizar mi Esencia
                </button>
                <button
                  onClick={() => { setIsKiosk(true); setKioskMode('quiz'); }}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-moss rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-shine transition-all border border-moss/10 shadow-sm"
                >
                  <Sparkles size={18} className="text-gold" />
                  Hacer Test Olfativo
                </button>
              </div>

              {/* Cómo funciona + precio desde */}
              <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
                {[
                  { n: '1', t: 'Elige tu fragancia' },
                  { n: '2', t: 'Define tamaño y línea' },
                  { n: '3', t: 'Pídelo por WhatsApp' },
                ].map(s => (
                  <div key={s.n} className="bg-white border border-moss/10 rounded-2xl p-3 sm:p-4 text-center shadow-sm">
                    <span className="w-7 h-7 rounded-full bg-emerald text-white text-xs font-extrabold inline-flex items-center justify-center mb-2">{s.n}</span>
                    <p className="text-[10px] sm:text-xs font-bold text-moss leading-snug">{s.t}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-moss/50 font-bold uppercase tracking-widest">
                Decants personalizados desde <span className="text-emerald text-sm">$20.000</span>
              </p>
            </div>
          </div>

          {/* Visual side */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 cursor-pointer group"
              onClick={() => setIsKiosk(true)}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald/10 border-4 border-white aspect-[4/5] relative">
                <img src="/Images/perfume_refined.webp" alt="Crea tu Esencia" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald/70 via-transparent to-transparent flex items-end justify-center pb-8 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="px-6 py-2.5 bg-white/95 text-emerald rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 border border-gold/40">
                    <Sparkles size={14} className="text-gold" /> Entrar al Laboratorio &rarr;
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-emerald/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-moss/5 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceCenter;

