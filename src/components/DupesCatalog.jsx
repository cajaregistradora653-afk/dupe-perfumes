import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, ChevronRight, ChevronDown, SlidersHorizontal, MapPin, Eye, Droplets, Heart, Gem, FileText, Download, ShoppingCart, Info, Sparkles, Layers, ShieldCheck, Flame, Compass } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { dupes } from '../data/dupes';
import { socialLinks } from '../data/fragrances';
import CategoryBubbles from './CategoryBubbles';
import AddToCartButton from './AddToCartButton';
import { fromCatalogProduct } from '../lib/cart';
import { CinematicPageHeader } from './CinematicPageHeader';
import { ScentAmbient } from './ScentAmbient';
import { EASE_FLUID, SPRING_SOFT, SPRING_SNAPPY } from '../lib/motion';

/* ── colour tokens for accord pills ── */
const ACCORD_COLORS = {
  'avainillado': { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' },
  'atalcado': { bg: '#EFEBE9', text: '#4E342E', dot: '#8D6E63' },
  'almizclado': { bg: '#F5F5F5', text: '#424242', dot: '#9E9E9E' },
  'cítrico': { bg: '#FFFDE7', text: '#F57F17', dot: '#FFEB3B' },
  'fresco especiado': { bg: '#E3F2FD', text: '#1565C0', dot: '#42A5F5' },
  'verde': { bg: '#E8F5E9', text: '#2E7D32', dot: '#66BB6A' },
  'amaderado': { bg: '#FFF8E1', text: '#6D4C41', dot: '#A1887F' },
  'ámbar': { bg: '#FFF3E0', text: '#BF360C', dot: '#FF7043' },
  'dulce': { bg: '#FCE4EC', text: '#C2185B', dot: '#F06292' },
  'lavanda': { bg: '#F3E5F5', text: '#7B1FA2', dot: '#AB47BC' },
  'afrutados': { bg: '#FFEBEE', text: '#C62828', dot: '#EF5350' },
  'tropical': { bg: '#E0F7FA', text: '#00838F', dot: '#26C6DA' },
  'fresco': { bg: '#E1F5FE', text: '#0277BD', dot: '#29B6F6' },
  'metálico': { bg: '#ECEFF1', text: '#37474F', dot: '#78909C' },
  'floral blanco': { bg: '#FFF9F0', text: '#5D4037', dot: '#D7CCC8' },
  'rosas': { bg: '#FDE0DC', text: '#AD1457', dot: '#EC407A' },
  'pachuli': { bg: '#E0F2F1', text: '#00695C', dot: '#26A69A' },
  'cálido especiado': { bg: '#FBE9E7', text: '#BF360C', dot: '#FF8A65' },
  'nardos': { bg: '#F8E8F5', text: '#8E24AA', dot: '#CE93D8' },
  'champán': { bg: '#FFFDE7', text: '#9E9D24', dot: '#D4E157' },
  'coco': { bg: '#F5F0EB', text: '#5D4037', dot: '#BCAAA4' },
  'lactónico': { bg: '#F0F4F8', text: '#546E7A', dot: '#B0BEC5' },
  'canela': { bg: '#EFEBE9', text: '#4E342E', dot: '#D84315' },
  'balsámico': { bg: '#F3E5F5', text: '#6A1B9A', dot: '#9C27B0' },
  'mineral': { bg: '#ECEFF1', text: '#455A64', dot: '#78909C' },
  'ozónico': { bg: '#E8EAF6', text: '#283593', dot: '#5C6BC0' },
  'aromático': { bg: '#E8F5E9', text: '#1B5E20', dot: '#4CAF50' },
  'acuático': { bg: '#E0F7FA', text: '#006064', dot: '#00BCD4' },
  'salado': { bg: '#ECEFF1', text: '#37474F', dot: '#90A4AE' },
  'herbal': { bg: '#F1F8E9', text: '#33691E', dot: '#8BC34A' },
  'especiado suave': { bg: '#FFF3E0', text: '#E65100', dot: '#FFA726' },
  'aldehídico': { bg: '#E8EAF6', text: '#1A237E', dot: '#7986CB' },
  'florales': { bg: '#FCE4EC', text: '#880E4F', dot: '#F48FB1' },
};

const defaultAccord = { bg: '#F5F5F5', text: '#616161', dot: '#BDBDBD' };

/* ── etiquetas de presentaciones ── */
const SIZE_LABELS = {
  '5ml': '5 ml Decant',
  '10ml': '10 ml Decant',
  '100ml': '100 ml Completo',
  '8ml_lujo': '8 ml Lujo',
};

const priceNum = (p) => parseFloat((p || '').replace(/\./g, '')) || 0;

const AccordDot = ({ name }) => {
  const c = ACCORD_COLORS[name.toLowerCase()] || defaultAccord;
  return (
    <span
      title={name}
      className="inline-block w-3 h-3 rounded-full ring-2 ring-white shadow-sm shrink-0 transition-transform hover:scale-125"
      style={{ backgroundColor: c.dot }}
    />
  );
};

const AccordPill = ({ name }) => {
  const c = ACCORD_COLORS[name.toLowerCase()] || defaultAccord;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {name}
    </span>
  );
};

const PriceLabel = ({ size, price }) => {
  const sizeLabels = {
    '5ml': '5 ml Decant',
    '10ml': '10 ml Decant',
    '100ml': '100 ml Completo',
    '8ml_lujo': '8 ml Lujo',
  };
  return (
    <div className="text-center p-2 rounded-xl bg-linen/40 border border-moss/5">
      <span className="block text-[9px] uppercase tracking-widest font-bold text-moss/50">{sizeLabels[size] || size}</span>
      <span className="block text-sm font-bold text-emerald">${price}</span>
    </div>
  );
};

/* ── Notes Pyramid Section ── */
const NotesPyramid = ({ salida, corazon, base }) => {
  const hasAny = salida?.length || corazon?.length || base?.length;
  if (!hasAny) return null;

  const rows = [
    { label: 'Salida', icon: <Droplets size={12} />, notes: salida, color: '#E0F7FA' },
    { label: 'Corazón', icon: <Heart size={12} />, notes: corazon, color: '#FCE4EC' },
    { label: 'Base', icon: <Gem size={12} />, notes: base, color: '#FFF8E1' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-moss/40 mb-2">Pirámide Olfativa</h4>
      {rows.map(r => r.notes?.length > 0 && (
        <div key={r.label} className="flex items-start gap-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-moss/50 w-16 shrink-0 flex items-center gap-1 pt-0.5">
            {r.icon} {r.label}
          </span>
          <div className="flex flex-wrap gap-1">
            {r.notes.map((n, i) => (
              <span
                key={i}
                className="text-xs text-moss/80 bg-white/80 border border-moss/10 px-2 py-0.5 rounded-md font-sans"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN DUPES CATALOG COMPONENT
   ════════════════════════════════════════════ */
const DupesCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [generoFilter, setGeneroFilter] = useState('Todos');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredCode, setHoveredCode] = useState(null);
  const [sortBy, setSortBy] = useState('destacados');
  const [selPres, setSelPres] = useState(null);
  // Mobile-first: en táctil no hay hover → sin overlay, sin layout animado
  const [isCoarse] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia &&
    (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches)
  );
  // Render progresivo: monta 18 tarjetas, el resto con "Ver más"
  const PAGE_SIZE = 18;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Bottom sheet de filtros en móvil
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Presentaciones ordenadas + selección actual (estilo PDP) */
  const presSorted = selectedItem
    ? Object.entries(selectedItem.precios || {}).sort((a, b) => priceNum(a[1]) - priceNum(b[1]))
    : [];
  const curPres = selPres && selectedItem?.precios?.[selPres] ? selPres : presSorted[0]?.[0];

  const perfumeParam = searchParams.get('perfume');
  const tipoParam = searchParams.get('tipo');

  // Handle URL parameters for global search or category links.
  // Sin ?tipo= en la URL, el filtro arranca limpio en "todos".
  useEffect(() => {
    if (perfumeParam) {
      const item = dupes.find(d => d.codigo === perfumeParam);
      if (item) {
        setSelectedItem(item);
      }
    }
    if (tipoParam) {
      setTipoFilter(tipoParam);
    } else {
      setTipoFilter('todos');
    }
  }, [perfumeParam, tipoParam]);

  // Resetear presentación seleccionada al cambiar de producto
  useEffect(() => {
    setSelPres(null);
  }, [selectedItem?.codigo]);

  // Al cambiar filtros se reinicia la paginación y se cierra el sheet
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, tipoFilter, generoFilter, categoriaFilter, sortBy]);

  // Ficha abierta: lock robusto (body fixed preserva scrollY en iOS/Android)
  // + Lenis detenido. El panel lleva data-lenis-prevent para su scroll interno.
  useEffect(() => {
    if (!selectedItem) return;
    const y = window.scrollY;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    try { window.__lenis?.stop(); } catch { /* noop */ }
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, y);
      document.removeEventListener('keydown', onKey);
      try { window.__lenis?.start(); } catch { /* noop */ }
    };
  }, [selectedItem]);

  // Sheet de filtros abierto: también detiene Lenis en móvil
  useEffect(() => {
    if (!filtersOpen) return;
    try { window.__lenis?.stop(); } catch { /* noop */ }
    return () => { try { window.__lenis?.start(); } catch { /* noop */ } };
  }, [filtersOpen]);

  const clearFilters = () => {
    setSearchQuery('');
    setTipoFilter('todos');
    setGeneroFilter('Todos');
    setCategoriaFilter('Todas');
    setPrecioMin(0);
    setPrecioMax(1000000);
  };

  const filteredDupes = dupes.filter(dupe => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      dupe.dupe?.toLowerCase().includes(q) ||
      dupe.codigo?.toLowerCase().includes(q) ||
      dupe.descripcion?.toLowerCase().includes(q) ||
      dupe.acordes_principales?.some(a => a.toLowerCase().includes(q)) ||
      dupe.notas_salida?.some(n => n.toLowerCase().includes(q)) ||
      dupe.corazon?.some(n => n.toLowerCase().includes(q)) ||
      dupe.base?.some(n => n.toLowerCase().includes(q))
    );

    /* Filtro por línea de producto (clasificación original por código:
       original = código 0R/ORO, decant = tiene 5ml/10ml,
       inspiración = todo, temporada = familia Frutal/Dulce) */
    const matchesTipo = (() => {
      if (tipoFilter === 'todos') return true;
      if (tipoFilter === 'decant') return !!dupe.precios?.['5ml'] || !!dupe.precios?.['10ml'];
      if (tipoFilter === 'original') return dupe.codigo?.startsWith('0R') || dupe.codigo?.startsWith('ORO');
      if (tipoFilter === 'inspiracion') return true;
      if (tipoFilter === 'temporada') return dupe.categoria === 'Frutal' || dupe.categoria === 'Dulce';
      return true;
    })();

    const matchesGenero = generoFilter === 'Todos' || dupe.genero === generoFilter;
    const matchesCategoria = categoriaFilter === 'Todas' || dupe.categoria === categoriaFilter;
    const precio100ml = parseFloat(dupe.precios?.['100ml']?.replace(/\./g, '').replace(',', '.')) || 0;
    const matchesPrecio = precio100ml >= precioMin && precio100ml <= precioMax;
    return matchesSearch && matchesTipo && matchesGenero && matchesCategoria && matchesPrecio;
  });

  const categorias = ['Todas', ...new Set(dupes.map(d => d.categoria).filter(Boolean))];
  const generos = ['Todos', 'Hombres', 'Dama', 'Unisex'];

  const minPrice = (dupe) => {
    const vals = Object.values(dupe.precios || {}).map(p => parseFloat(p.replace(/\./g, '')) || 0);
    return vals.length ? Math.min(...vals) : 0;
  };

  const sortedDupes = [...filteredDupes].sort((a, b) => {
    if (sortBy === 'menor') return minPrice(a) - minPrice(b);
    if (sortBy === 'mayor') return minPrice(b) - minPrice(a);
    if (sortBy === 'nombre') return (a.dupe || '').localeCompare(b.dupe || '', 'es');
    return 0;
  });

  /* Conteo por línea de producto (misma clasificación original por código) */
  const countForTipo = (id) => {
    if (id === 'todos') return dupes.length;
    if (id === 'decant') return dupes.filter(d => !!d.precios?.['5ml'] || !!d.precios?.['10ml']).length;
    if (id === 'original') return dupes.filter(d => d.codigo?.startsWith('0R') || d.codigo?.startsWith('ORO')).length;
    if (id === 'inspiracion') return dupes.length;
    if (id === 'temporada') return dupes.filter(d => d.categoria === 'Frutal' || d.categoria === 'Dulce').length;
    return dupes.length;
  };
  const tiposProducto = [
    { id: 'todos', label: 'Todos los Productos', icon: <Layers size={13} /> },
    { id: 'inspiracion', label: 'Inspiraciones 1.1', icon: <Sparkles size={13} /> },
    { id: 'original', label: 'Originales', icon: <ShieldCheck size={13} /> },
    { id: 'decant', label: 'Decants (5ml / 10ml)', icon: <Droplets size={13} /> },
    { id: 'temporada', label: 'Temporada & Splash', icon: <Flame size={13} /> },
  ];

  // Contador de filtros activos para el badge del botón móvil
  const activeFilterCount =
    (tipoFilter !== 'todos' ? 1 : 0) +
    (generoFilter !== 'Todos' ? 1 : 0) +
    (categoriaFilter !== 'Todas' ? 1 : 0) +
    (sortBy !== 'destacados' ? 1 : 0);

  const genderStyle = (g) => {    if (g === 'Hombres') return 'bg-sky-50 text-sky-700 border-sky-200';
    if (g === 'Dama') return 'bg-rose-50 text-rose-600 border-rose-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };
  const reduce = useReducedMotion();

  return (
    <section id="dupes" className="py-12 md:py-20 bg-white relative overflow-hidden">
      <ScentAmbient variant="light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header cinematográfico ── */}
        <CinematicPageHeader
          eyebrow="Catálogo Oficial Dupé"
          title={<>Fragancias de <span className="font-cursive font-normal text-emerald text-3xl sm:text-5xl">Alta Gama</span></>}
          description="Explora nuestras inspiraciones de lujo 1.1, frascos sellados, decants fraccionados y creaciones formuladas con esencias importadas."
        />

        {/* ── Visual Circular Category Bubbles ── */}
        <div className="mb-6 bg-[#F6F6F5] rounded-3xl p-4 sm:p-6 border border-ink/10">
          <CategoryBubbles
            activeFilter={tipoFilter}
            onSelectCategory={(type) => setTipoFilter(type)}
          />
        </div>

        {/* ── Barra de filtros sticky ── */}
        <div className="sticky top-[100px] md:top-[140px] z-30 bg-white/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 pt-2 pb-3 border-b border-ink/10 mb-6">
        {/* ── Type Filter Tabs (pill con layoutId fluido) ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-x pb-2 mb-4">
          {tiposProducto.map(tp => {
            const active = tipoFilter === tp.id;
            return (
            <button
              key={tp.id}
              onClick={() => setTipoFilter(tp.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors border ${
                active
                  ? 'text-white border-ink'
                  : 'bg-white text-ink/70 border-ink/15 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {active && !reduce && (
                <motion.span
                  layoutId="tipo-pill"
                  transition={SPRING_SNAPPY}
                  className="absolute inset-0 bg-ink rounded-full shadow-md"
                />
              )}
              {active && reduce && (
                <span className="absolute inset-0 bg-ink rounded-full shadow-md" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tp.icon}
                {tp.label}
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-ink/10 text-ink/60'
                }`}>
                  {countForTipo(tp.id)}
                </span>
              </span>
            </button>
            );
          })}
        </div>

        {/* ── Secondary Filters row ── */}
        <div className="flex flex-col lg:flex-row gap-3 bg-[#F6F6F5] p-3 rounded-2xl border border-ink/10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-moss/30" size={18} />
            <input
              type="text"
              placeholder="Buscar por fragancia, código, nota (ej. Vainilla)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-linen/40 border border-moss/10 rounded-xl py-2.5 pl-11 pr-10 text-xs sm:text-sm text-moss placeholder:text-moss/35 font-sans outline-none focus:ring-2 focus:ring-emerald/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-moss/30 hover:text-moss">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Botón Filtros (solo móvil → abre bottom sheet) */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-moss/15 rounded-xl py-2.5 min-h-[48px] text-xs font-bold uppercase tracking-widest text-moss active:bg-moss/5 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filtros
              {activeFilterCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-emerald text-white text-[10px] font-extrabold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {(searchQuery || tipoFilter !== 'todos' || generoFilter !== 'Todos' || categoriaFilter !== 'Todas') && (
              <button
                onClick={clearFilters}
                aria-label="Limpiar filtros"
                className="w-12 h-12 min-h-[48px] rounded-xl bg-shine border border-gold/30 text-moss/70 flex items-center justify-center shrink-0 active:bg-gold/30 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Backdrop del sheet (solo móvil) */}
          {filtersOpen && (
            <div
              onClick={() => setFiltersOpen(false)}
              className="lg:hidden fixed inset-0 z-[84] bg-moss/60"
            />
          )}

          {/* ── Cuerpo de filtros: bottom sheet en móvil, fila inline en desktop ── */}
          <div
            data-lenis-prevent
            className={`${filtersOpen ? 'flex' : 'hidden'} lg:flex fixed lg:static inset-x-0 bottom-0 lg:inset-auto z-[85] lg:z-auto flex-col lg:flex-row lg:items-center gap-3 bg-white lg:bg-transparent p-4 lg:p-0 pt-3 lg:pt-0 rounded-t-3xl lg:rounded-none border border-ink/10 lg:border-0 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] lg:shadow-none max-h-[72dvh] lg:max-h-none overflow-y-auto lg:overflow-visible overscroll-contain pb-safe lg:pb-0`}
          >
            {/* Grabber + header del sheet (solo móvil) */}
            <div className="lg:hidden flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md py-1 -mt-1">
              <span className="text-xs font-bold uppercase tracking-widest text-moss/60">Filtros</span>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Cerrar filtros"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-moss/5 text-moss active:bg-moss/15 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="lg:hidden mx-auto -order-1 w-10 h-1 rounded-full bg-ink/15 shrink-0" />

          {/* Gender pills */}
          <div className="flex gap-1.5 items-center overflow-x-auto no-scrollbar">
            {generos.map(g => (
              <button
                key={g}
                onClick={() => setGeneroFilter(g)}
                className={`px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold tracking-wider transition-all border shrink-0 ${
                  generoFilter === g
                    ? 'bg-moss text-white border-moss shadow-sm'
                    : 'bg-white text-moss/60 border-moss/10 hover:text-moss'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="bg-white border border-moss/10 rounded-xl px-3 py-2 min-h-[48px] text-xs sm:text-sm text-moss outline-none focus:ring-2 focus:ring-emerald/20 cursor-pointer font-medium"
          >
            {categorias.map(c => <option key={c} value={c}>Familia: {c}</option>)}
          </select>

          {/* Reset Filters button */}
          {(searchQuery || tipoFilter !== 'todos' || generoFilter !== 'Todos' || categoriaFilter !== 'Todas') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 min-h-[44px] bg-shine text-xs font-bold text-moss/70 rounded-xl border border-gold/30 hover:bg-gold hover:text-emerald-950 transition-colors flex items-center gap-1.5 self-center"
            >
              <X size={14} /> Limpiar filtros
            </button>
          )}

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-moss/10 rounded-xl px-3 py-2 min-h-[48px] text-xs sm:text-sm text-moss outline-none focus:ring-2 focus:ring-emerald/20 cursor-pointer font-medium"
          >
            <option value="destacados">Ordenar: Destacados</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
          {/* Ver resultados (solo móvil: cierra el sheet) */}
          <button
            onClick={() => setFiltersOpen(false)}
            className="lg:hidden w-full py-3.5 min-h-[52px] bg-emerald text-white rounded-xl font-bold text-xs uppercase tracking-widest active:bg-moss transition-colors"
          >
            Ver {sortedDupes.length} resultado{sortedDupes.length !== 1 ? 's' : ''}
          </button>
          </div>{/* /sheet body */}
        </div>{/* /secondary row */}
        </div>{/* /sticky wrapper */}
        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6 px-1 gap-3">
          <span className="text-xs text-moss/60 font-bold uppercase tracking-widest">
            {sortedDupes.length} fragancia{sortedDupes.length !== 1 ? 's' : ''} disponible{sortedDupes.length !== 1 ? 's' : ''}
          </span>
          <span className="hidden [@media(hover:hover)]:flex text-[11px] text-gold font-semibold items-center gap-1">
            <Sparkles size={12} /> Pasa el mouse para vista rápida de notas
          </span>
          <span className="[@media(hover:hover)]:hidden text-[11px] text-gold font-semibold shrink-0">
            Toca para ver la ficha
          </span>
        </div>

        {/* ── Card Grid (1-col móvil, progresivo, sin layout animado en táctil) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode={isCoarse ? 'sync' : 'popLayout'}>
            {sortedDupes.slice(0, visibleCount).map((item, index) => {
              const isHovered = !isCoarse && hoveredCode === item.codigo;
              const hasDecant = !!item.precios?.['5ml'] || !!item.precios?.['10ml'];

              return (
                <motion.article
                  key={item.codigo}
                  layout={!isCoarse}
                  initial={reduce || isCoarse ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={reduce || isCoarse ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduce || isCoarse ? { opacity: 0 } : { opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: EASE_FLUID }}
                  whileHover={!isCoarse && !reduce ? { y: -6, transition: SPRING_SOFT } : undefined}
                  onMouseEnter={() => {
                    if (isCoarse) return;
                    setHoveredCode(item.codigo);
                    if (item.image) new Image().src = item.image;
                    if (item.bottleImage) new Image().src = item.bottleImage;
                  }}
                  onMouseLeave={() => { if (!isCoarse) setHoveredCode(null); }}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white rounded-3xl border border-moss/[0.08] overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover hover:border-gold/40 flex flex-col relative will-change-transform"
                >
                  {/* Top Badges */}
                  <div className="relative bg-[#F4F4F4] p-6 pb-2 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20">
                      {/* Product Type Badge */}
                      <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald text-white shadow-sm flex items-center gap-1 border border-gold/30">
                        <Sparkles size={10} className="text-gold" /> Inspiración 1.1
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Discount Badge (estilo referencia, solo si hay dato) */}
                        {item.descuento && (
                          <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[#E91E8C] text-white shadow-sm">
                            {item.descuento}
                          </span>
                        )}
                        {/* Gender Badge */}
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${genderStyle(item.genero)}`}>
                          {item.genero}
                        </span>
                      </div>
                    </div>

                    {/* Bottle Image with smooth zoom */}
                    <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center my-2">
                      <img
                        src={item.bottleImage || "/Images/perfume_isolated.webp"}
                        alt={item.dupe}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* HOVER QUICK-PREVIEW OVERLAY (solo puntero fino) */}
                    <div className={`absolute inset-0 bg-emerald/95 backdrop-blur-md p-6 hidden [@media(hover:hover)]:flex flex-col justify-between text-white transition-all duration-300 z-30 ${
                      isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}>
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">
                              Notas & Acordes
                            </span>
                            <h4 className="text-lg font-serif font-bold text-white line-clamp-1">
                              {item.dupe}
                            </h4>
                          </div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={`Ficha ${item.dupe}`}
                              className="w-11 h-14 object-cover rounded-lg border border-white/30 shadow-md shrink-0"
                              loading="lazy"
                            />
                          )}
                        </div>

                        {/* Notas de salida */}
                        {item.notas_salida?.length > 0 && (
                          <div className="mb-2">
                            <span className="text-[10px] text-linen/70 uppercase tracking-wider font-bold block">Salida:</span>
                            <p className="text-xs text-linen line-clamp-1 font-sans">
                              {item.notas_salida.join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Notas de corazón */}
                        {item.corazon?.length > 0 && (
                          <div className="mb-2">
                            <span className="text-[10px] text-linen/70 uppercase tracking-wider font-bold block">Corazón:</span>
                            <p className="text-xs text-linen line-clamp-1 font-sans">
                              {item.corazon.join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Notas base */}
                        {item.base?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-[10px] text-linen/70 uppercase tracking-wider font-bold block">Fondo:</span>
                            <p className="text-xs text-linen line-clamp-1 font-sans">
                              {item.base.join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Acordes Pills */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.acordes_principales?.slice(0, 4).map(a => (
                            <span key={a} className="text-[9px] bg-white/15 px-2 py-0.5 rounded-full text-linen font-medium uppercase tracking-wider">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/20 space-y-2.5">
                        {/* Presentaciones & precio rápido */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-linen/70 font-bold">
                            {Object.keys(item.precios || {}).length} presentaciones
                          </span>
                          <span className="text-sm font-bold text-gold font-sans">
                            Desde ${Object.values(item.precios || {}).sort((a, b) => parseFloat(a.replace(/\./g, '')) - parseFloat(b.replace(/\./g, '')))[0]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gold flex items-center gap-1">
                            <Eye size={14} /> Ver Ficha Completa
                          </span>
                          {hasDecant && (
                            <span className="text-[9px] bg-gold/20 text-gold-light px-2 py-0.5 rounded-full font-bold">
                              Decant Disponible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 pt-3 flex flex-col flex-grow bg-white">
                    {/* Category / Family */}
                    <span className="text-[10px] uppercase tracking-widest font-bold text-moss/40 mb-1">
                      Familia {item.categoria}
                    </span>

                    {/* Name */}
                    <h3 className="text-xl font-serif font-bold text-ink leading-snug mb-1 group-hover:text-emerald transition-colors line-clamp-2 min-h-[3.5rem]">
                      {item.dupe}
                    </h3>

                    {/* Accord dots */}
                    <div className="flex items-center gap-1.5 mb-4">
                      {item.acordes_principales?.slice(0, 5).map(a => (
                        <AccordDot key={a} name={a} />
                      ))}
                      {item.acordes_principales?.length > 5 && (
                        <span className="text-[9px] text-moss/40 font-bold ml-1">+{item.acordes_principales.length - 5}</span>
                      )}
                    </div>

                    {/* Price / Action Row */}
                    <div className="mt-auto pt-3 border-t border-moss/[0.08] flex items-end justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-moss/40 block">Desde</span>
                        <span className="text-2xl font-bold text-ink leading-none">
                          ${Object.values(item.precios).sort((a, b) => {
                            const pa = parseFloat(a.replace(/\./g, ''));
                            const pb = parseFloat(b.replace(/\./g, ''));
                            return pa - pb;
                          })[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald font-bold text-xs group-hover:translate-x-1 transition-transform">
                        <span>Detalles</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Ver más (paginación progresiva) ── */}
        {visibleCount < sortedDupes.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[52px] bg-white border border-moss/20 rounded-full text-xs font-bold uppercase tracking-widest text-moss hover:border-emerald hover:text-emerald active:bg-moss/5 transition-all shadow-card"
            >
              Ver más ({sortedDupes.length - visibleCount} restantes)
              <ChevronDown size={15} />
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {sortedDupes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-emerald/5 flex items-center justify-center text-emerald mx-auto mb-5">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-elegant text-moss mb-2">Sin resultados</h3>
            <p className="text-sm text-stone font-elegant mb-6">No encontramos fragancias con esos filtros.</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-emerald text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors">
              Restablecer filtros
            </button>
          </motion.div>
        )}

        {/* ── Reorganized Catalog PDFs (Client Review Fix) ── */}
        <div className="mt-16 pt-10 border-t border-moss/[0.08]">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-moss/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-moss/45">Catálogos Alternativos en PDF</span>
            </div>
            <h3 className="text-xl font-elegant text-moss mb-2">¿Prefieres la versión física o impresa?</h3>
            <p className="text-xs text-stone font-elegant leading-relaxed">
              Nuestra tienda interactiva arriba es la forma más rápida y actualizada de buscar referencias y notas. Sin embargo, si deseas descargar, compartir o imprimir el catálogo completo en formato PDF, tienes las versiones oficiales a tu disposición:
            </p>
          </div>

          {/* Barcelona catalogs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/Fragances/CARTA NICHO ACTUALIZADA POR CASA.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-white border border-moss/[0.06] rounded-2xl p-5 group hover:shadow-lg hover:shadow-emerald/[0.05] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/5 flex items-center justify-center text-emerald shrink-0 group-hover:bg-emerald group-hover:text-white transition-all">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-moss mb-0.5 group-hover:text-emerald transition-colors">Carta Nicho</h4>
                <p className="text-[11px] text-moss/40">Colección exclusiva de fragancias</p>
              </div>
              <Download size={16} className="text-moss/20 group-hover:text-emerald shrink-0 transition-colors" />
            </a>
            <a
              href="/Fragances/CARTA BARCELONA WEB (1).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-white border border-moss/[0.06] rounded-2xl p-5 group hover:shadow-lg hover:shadow-emerald/[0.05] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/5 flex items-center justify-center text-emerald shrink-0 group-hover:bg-emerald group-hover:text-white transition-all">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-moss mb-0.5 group-hover:text-emerald transition-colors">Carta Barcelona — Acordes</h4>
                <p className="text-[11px] text-moss/40">Catálogo con notas y acordes principales</p>
              </div>
              <Download size={16} className="text-moss/20 group-hover:text-emerald shrink-0 transition-colors" />
            </a>
            <a
              href="/Fragances/CARTA BARCELONA WEB.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-white border border-moss/[0.06] rounded-2xl p-5 group hover:shadow-lg hover:shadow-emerald/[0.05] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/5 flex items-center justify-center text-emerald shrink-0 group-hover:bg-emerald group-hover:text-white transition-all">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-moss mb-0.5 group-hover:text-emerald transition-colors">Carta Barcelona — General</h4>
                <p className="text-[11px] text-moss/40">Listado completo de fragancias disponibles</p>
              </div>
              <Download size={16} className="text-moss/20 group-hover:text-emerald shrink-0 transition-colors" />
            </a>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════
          DETAIL PANEL (slide-over vía portal: fuera de
          animaciones de página/filtros → fixed fiable)
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedItem && (
          <div key="dupe-detail" style={{ display: 'contents' }}>
          {createPortal(
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_FLUID }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-[90] bg-moss/60"
            />

            {/* Panel */}
            <motion.div
              data-lenis-prevent
              initial={reduce ? { opacity: 0 } : { x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: '100%', opacity: 0.5 }}
              transition={reduce ? { duration: 0.2 } : { type: 'tween', duration: 0.3, ease: EASE_FLUID }}
              className="fixed top-0 right-0 z-[100] h-full h-dvh w-full max-w-lg bg-white shadow-2xl overflow-y-auto overscroll-contain pb-safe"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              {/* Sticky header for premium slide-over look and feel */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-moss/5 z-20">
                <span className="text-xs font-bold uppercase tracking-widest text-moss/50">Detalle de Fragancia</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  aria-label="Cerrar detalle"
                  className="w-11 h-11 rounded-xl bg-moss/5 hover:bg-moss/10 active:bg-moss/15 flex items-center justify-center text-moss transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Grabber visual (sheet móvil) */}
              <div aria-hidden className="sm:hidden flex justify-center pt-2.5 bg-white">
                <span className="w-10 h-1 rounded-full bg-ink/15" />
              </div>

              {/* Spacing and layout (centered, aspect-ratio controlled, elegant margins) */}
              <div className="p-6 md:p-8 pb-16 space-y-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink/40">
                  <span>Inicio</span><span className="text-ink/20">/</span><span>Catálogo</span><span className="text-ink/20">/</span>
                  <span className="text-ink truncate">{selectedItem.dupe}</span>
                </nav>
                
                {/* Bottle Image (Centered, controlled container) */}
                {selectedItem.bottleImage && (
                  <div className="flex items-center justify-center bg-gradient-to-b from-shine/80 to-white rounded-2xl p-6 max-w-[280px] sm:max-w-xs mx-auto aspect-square overflow-hidden border border-moss/5 shadow-inner">
                    <img
                      src={selectedItem.bottleImage}
                      alt={selectedItem.dupe}
                      className="max-h-full max-w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Category & Gender */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-moss/40">{selectedItem.categoria}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border" style={{
                    ...(selectedItem.genero === 'Hombres' ? { background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' } :
                      selectedItem.genero === 'Dama' ? { background: '#FFF1F2', color: '#E11D48', borderColor: '#FECDD3' } :
                        { background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' })
                  }}>
                    {selectedItem.genero}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-3xl md:text-4xl font-elegant text-moss leading-tight">
                  {selectedItem.dupe}
                </h2>

                {/* Code */}
                <span className="text-xs font-mono text-moss/40 block">Cód. {selectedItem.codigo}</span>

                {/* Price block PDP */}
                <div className="bg-[#F6F6F5] border border-ink/10 rounded-2xl p-5">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/45 block mb-1">
                    {SIZE_LABELS[curPres] || 'Presentación'}
                  </span>
                  <span className="text-4xl font-bold text-ink block mb-4">
                    ${selectedItem.precios?.[curPres]}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presSorted.map(([size, price]) => (
                      <button
                        key={size}
                        onClick={() => setSelPres(size)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${curPres === size ? 'bg-ink text-white border-ink' : 'bg-white text-ink/60 border-ink/15 hover:border-ink/40'}`}
                      >
                        {SIZE_LABELS[size] || size} · ${price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inspiration Warning Note Box (Clarifies original vs inspiration) */}
                <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gold mb-1">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Inspiración Olfativa Premium</span>
                  </div>
                  <p className="text-[11px] text-stone font-elegant leading-relaxed">
                    Esta fragancia es un <strong>contratipo premium</strong> inspirado en la marca <strong>{selectedItem.dupe}</strong>. Elaborado con esencias de alta concentración para asegurar una proyección y duración excepcionales.
                  </p>
                </div>

                {/* Description Text Box (Fixed margins and elegant layout) */}
                <div className="bg-linen/60 border border-chestnut/5 rounded-2xl p-5">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-moss/45 mb-2">Recomendación de Uso</h4>
                  <p className="text-sm text-stone font-elegant leading-relaxed">
                    {selectedItem.descripcion}
                  </p>
                </div>

                {/* Accords */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-moss/40 mb-3">Acordes Principales</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.acordes_principales?.map(a => (
                      <AccordPill key={a} name={a} />
                    ))}
                  </div>
                </div>

                {/* Notes Pyramid */}
                <div>
                  <NotesPyramid
                    salida={selectedItem.notas_salida}
                    corazon={selectedItem.corazon}
                    base={selectedItem.base}
                  />
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-moss/50 text-xs py-2 border-t border-b border-moss/5">
                  <MapPin size={14} />
                  <span className="font-bold uppercase tracking-widest text-[9px]">Disponible en Plaza Barcelona — Sogamoso</span>
                </div>

                {/* Catalog Page Image (Centered, controlled aspect ratio aspect-[3/4]) */}
                {selectedItem.image && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-moss/40 mb-3 text-center">Ficha del Catálogo Impreso</h4>
                    <div className="rounded-2xl overflow-hidden border border-moss/10 shadow-md max-w-[280px] sm:max-w-xs mx-auto aspect-[3/4] flex items-center justify-center bg-linen mb-10">
                      <img
                        src={selectedItem.image}
                        alt={`Catálogo — ${selectedItem.dupe}`}
                        className="max-h-full max-w-full object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}

                {/* CTA Buttons — fijos abajo para no deslizar hasta el final */}
                <div className="sticky bottom-0 -mx-6 md:-mx-8 px-6 md:px-8 pt-3 pb-safe bg-gradient-to-t from-white via-white to-transparent">
                  <div className="flex flex-col gap-3 pt-3 border-t border-moss/5 w-full bg-white">
                    <a
                      href={`${socialLinks.whatsapp}?text=${encodeURIComponent(`✨ *Consulta de Disponibilidad — Dupé*\n\n¡Hola! Me interesa esta fragancia del catálogo:\n\n🏆 *${selectedItem.dupe}*\n🆔 Código: ${selectedItem.codigo}\n📦 Presentación: ${SIZE_LABELS[curPres] || curPres} ($${selectedItem.precios?.[curPres]})\n\n¿La tienen disponible en tienda?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-center gap-2 w-full py-4 px-4 bg-emerald text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest hover:bg-moss active:scale-[0.98] transition-all shadow-lg shadow-emerald/20"
                    >
                      <span>Consultar Disponibilidad (WhatsApp)</span>
                      <ChevronRight size={16} className="shrink-0" />
                    </a>
                    <AddToCartButton
                      item={selectedItem && curPres ? fromCatalogProduct(selectedItem, curPres) : null}
                      label={`Agregar (${SIZE_LABELS[curPres] || curPres})`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
          , document.body)}
        </div>
        )}
      </AnimatePresence>
      </ScentAmbient>
    </section>
  );
};

export default DupesCatalog;