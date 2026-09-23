export const SIZE_LABELS = {
  '5ml': '5 ml Decant',
  '10ml': '10 ml Decant',
  '100ml': '100 ml Completo',
  '8ml_lujo': '8 ml Lujo',
};

export const CART_STORAGE_KEY = 'dupe-cart-v1';

export const priceNum = (p) => {
  if (typeof p === 'number') return p;
  return parseFloat(String(p || '').replace(/\./g, '').replace(',', '.')) || 0;
};

export const formatCOP = (n) =>
  `$${Math.round(n || 0).toLocaleString('es-CO')}`;

export const cheapestSize = (precios) => {
  const entries = Object.entries(precios || {});
  if (!entries.length) return null;
  return entries.sort((a, b) => priceNum(a[1]) - priceNum(b[1]))[0][0];
};

export const catalogKey = (codigo, size) => `${codigo}__${size}`;

export const customKey = ({ name, linea, tamano, extraGramos = 0, extraFeromona = 0, extraFijador = 0 }) => {
  const slug = String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40);
  return `custom__${slug}__${linea}__${tamano}ml__g${extraGramos}f${extraFeromona}j${extraFijador}`;
};

export const fromCatalogProduct = (product, size) => {
  const sizeKey = size || cheapestSize(product.precios);
  const unitPrice = priceNum(product.precios?.[sizeKey]);
  return {
    key: catalogKey(product.codigo, sizeKey),
    kind: 'catalog',
    codigo: product.codigo,
    name: product.dupe,
    size: sizeKey,
    sizeLabel: SIZE_LABELS[sizeKey] || sizeKey,
    unitPrice,
    image: product.bottleImage || '/Images/perfume_isolated.webp',
    meta: { genero: product.genero, categoria: product.categoria },
  };
};

export const fromCustomDecant = ({ name, linea, lineaLabel, tamano, baseGrams, extraGramos = 0, extraFeromona = 0, extraFijador = 0, totalPrecio }) => ({
  key: customKey({ name, linea, tamano, extraGramos, extraFeromona, extraFijador }),
  kind: 'custom',
  codigo: null,
  name: `Decant ${name} · ${tamano}ml`,
  size: `${tamano}ml`,
  sizeLabel: `${tamano} ml Personalizado (${lineaLabel || linea})`,
  unitPrice: totalPrecio,
  image: '/Images/perfume_isolated.webp',
  meta: { linea, baseGrams, extraGramos, extraFeromona, extraFijador },
});

export const cartCount = (items) =>
  items.reduce((acc, it) => acc + (it.qty || 0), 0);

export const cartSubtotal = (items) =>
  items.reduce((acc, it) => acc + (it.unitPrice || 0) * (it.qty || 0), 0);

const EMOJI_NUM = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export const buildWhatsAppOrder = (items) => {
  const lines = [
    `✨ *Nuevo Pedido — Dupé (${cartCount(items)} producto${cartCount(items) !== 1 ? 's' : ''})*`,
    '———————————',
  ];
  items.forEach((it, i) => {
    const num = EMOJI_NUM[Math.min(i, 9)];
    const lineTotal = (it.unitPrice || 0) * (it.qty || 0);
    lines.push(`${num} *${it.name}* — ${it.sizeLabel}`);
    const code = it.codigo ? `🆔 ${it.codigo} | ` : '';
    lines.push(`   ${code}x${it.qty} | ${formatCOP(lineTotal)}`);
  });
  lines.push('———————————');
  lines.push(`💰 *Total: ${formatCOP(cartSubtotal(items))}*`);
  lines.push('');
  lines.push('¡Hola! Quiero confirmar este pedido. ¿Me confirman disponibilidad y envío?');
  return encodeURIComponent(lines.join('\n'));
};
