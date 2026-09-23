export const NOTAS_SALIDA = [
  { name: 'Bergamota', dot: '#FFD54F', emoji: '🍋' },
  { name: 'Limón', dot: '#FFEE58', emoji: '🍋' },
  { name: 'Naranja', dot: '#FFB74D', emoji: '🍊' },
  { name: 'Menta', dot: '#81C784', emoji: '🌿' },
  { name: 'Toronja', dot: '#FF8A65', emoji: '🍊' },
  { name: 'Lavanda', dot: '#BA68C8', emoji: '💜' },
  { name: 'Pimienta Rosa', dot: '#F48FB1', emoji: '🌸' },
  { name: 'Jengibre', dot: '#FFD54F', emoji: '🫚' },
];
export const NOTAS_CORAZON = [
  { name: 'Rosa', dot: '#F06292', emoji: '🌹' },
  { name: 'Jazmín', dot: '#FFF176', emoji: '🌼' },
  { name: 'Canela', dot: '#A1887F', emoji: '🫘' },
  { name: 'Geranio', dot: '#AED581', emoji: '🌺' },
  { name: 'Ylang-ylang', dot: '#FFD54F', emoji: '🌸' },
  { name: 'Cardamomo', dot: '#66BB6A', emoji: '🫛' },
  { name: 'Nardos', dot: '#EC407A', emoji: '💐' },
  { name: 'Orquídea', dot: '#7986CB', emoji: '🪻' },
];
export const NOTAS_FONDO = [
  { name: 'Vainilla', dot: '#FFE082', emoji: '🍦' },
  { name: 'Sándalo', dot: '#BCAAA4', emoji: '🪵' },
  { name: 'Pachulí', dot: '#4DB6AC', emoji: '🍃' },
  { name: 'Almizcle', dot: '#BDBDBD', emoji: '🤍' },
  { name: 'Ámbar', dot: '#FFB74D', emoji: '🔶' },
  { name: 'Cedro', dot: '#8D6E63', emoji: '🌲' },
  { name: 'Vetiver', dot: '#66BB6A', emoji: '🌾' },
  { name: 'Haba Tonka', dot: '#D7CCC8', emoji: '🫘' },
];

export const LINEAS_FRAGANCIA = [
  { id: 'disenador', label: 'Beniet Diseñador', desc: 'Inspiración en diseñador' },
  { id: 'nicho', label: 'Beniet Nicho', desc: 'Exclusivos y complejos' }
];

export const DECANT_PRICING = {
  disenador: {
    sizes: [
      { ml: 30, baseGrams: 13, price: 20000, desc: 'Incluye 13g + 3 gotas feromona/fijador' },
      { ml: 50, baseGrams: 20, price: 30000, desc: 'Incluye 20g + 3 gotas feromona/fijador' },
      { ml: 60, baseGrams: 30, price: 40000, desc: 'Incluye 30g + gotas base' },
      { ml: 100, baseGrams: 40, price: 53000, desc: 'Incluye 40g + gotas base' },
    ],
    extras: {
      gramo: 1500,
      feromona: 500,
      fijador: 1000
    }
  },
  nicho: {
    sizes: [
      { ml: 30, baseGrams: 13, price: 23400, desc: 'Incluye 13g' },
      { ml: 50, baseGrams: 20, price: 36000, desc: 'Incluye 20g' },
      { ml: 60, baseGrams: 30, price: 54000, desc: 'Incluye 30g' },
      { ml: 100, baseGrams: 40, price: 72000, desc: 'Incluye 40g' },
    ],
    extras: {
      gramo: 1800,
      feromona: 500,
      fijador: 1000
    }
  }
};
