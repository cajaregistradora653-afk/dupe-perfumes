// Fondo ambiental ligero (sin WebGL): glows + grano + partículas CSS.
// Variante "dark" para kiosco/hero, "light" para páginas claras.
export const ScentAmbient = ({ variant = 'light', children, className = '' }) => {
  const dark = variant === 'dark';
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {dark ? (
          <>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-emerald/25 blur-[130px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[420px] h-[420px] bg-gold/15 blur-[120px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald/[0.05] rounded-full blur-[120px]" />
            <div className="absolute -right-24 bottom-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          </>
        )}
        <div className="hero-grain absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        {!dark && (
          <div className="absolute left-0 top-10 w-1/3 h-64 opacity-[0.06] bg-[radial-gradient(#1E5144_1px,transparent_1px)] [background-size:18px_18px]" />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
