import { Heart, Sparkles, Star } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

/** Nivel de celebración según % relativo de match. */
export const matchTier = (pct) => {
  if (pct >= 100) return 'perfect';
  if (pct >= 85) return 'great';
  if (pct >= 70) return 'good';
  return 'low';
};

const SPARKS = [
  { l: '12%', s: 14, d: 0.35 },
  { l: '28%', s: 10, d: 0.7 },
  { l: '42%', s: 16, d: 0.5 },
  { l: '55%', s: 11, d: 0.9 },
  { l: '68%', s: 15, d: 0.6 },
  { l: '80%', s: 10, d: 1.0 },
  { l: '90%', s: 13, d: 0.45 },
  { l: '36%', s: 9, d: 1.1 },
];

/** Corazón latiendo + anillo dorado expansivo sobre el frasco ganador. */
export const BeatingHeart = () => {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute -top-1 right-6 z-20 flex items-center justify-center">
      {!reduce && (
        <span className="absolute inline-flex w-11 h-11 rounded-full bg-gold/40 animate-ping [animation-duration:1.2s]" />
      )}
      <span className={`relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-b from-[#E14B6B] to-[#B91C3F] shadow-lg shadow-rose-900/40 border-2 border-white/80 ${reduce ? '' : 'animate-heartbeat'}`}>
        <Heart size={20} className="text-white fill-white" />
      </span>
    </div>
  );
};

/** Lluvia de destellos dorados (CSS puro, se atenúan solos). */
export const GoldSparkles = () => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none z-20">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute top-0 animate-sparkle-fall"
          style={{ left: s.l, animationDelay: `${s.d}s` }}
        >
          {i % 2 === 0 ? (
            <Sparkles size={s.s} className="text-gold-light" />
          ) : (
            <Star size={s.s} className="text-gold fill-gold" />
          )}
        </span>
      ))}
    </div>
  );
};

/** Badge de % con estilo y conteo animado según nivel. */
export const TierBadge = ({ pct, isWinner, countDelay = 0 }) => {
  const tier = matchTier(pct);
  const display = useCountUp(pct, { delay: countDelay, enabled: tier !== 'low' });

  if (isWinner || tier === 'perfect') {
    return (
      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow match-badge-shine text-ink animate-badge-shine">
        {display}% match
      </div>
    );
  }
  if (tier === 'great') {
    return (
      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow bg-gold text-ink animate-glow-pulse">
        {display}% match
      </div>
    );
  }
  if (tier === 'good') {
    return (
      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow bg-emerald text-white">
        {display}% match
      </div>
    );
  }
  return (
    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow bg-black/50 text-white border border-white/20">
      {pct}% match
    </div>
  );
};
