// Contenido editorial propio de respaldo para la sección de Noticias.
// Se muestra cuando el proxy /api/news no está disponible (p. ej. en
// Firebase Hosting, que es 100% estático y no ejecuta api/news.js de Vercel).
// Usa solo imágenes locales: cero dependencias externas, la página nunca falla.
export const FALLBACK_ARTICLES = [
  {
    title: 'Notas olfativas: aprende a leer un perfume como un experto',
    category: 'Guía Dupé',
    date: 'Guía permanente',
    image: '/Images/perfume_refined.webp',
    description: 'Salida, corazón y fondo: entiende la pirámide olfativa y elige tu próxima fragancia con criterio.',
    link: '/experiencia?tab=quiz',
  },
  {
    title: '¿Cuánto dura un perfume? Fijación y proyección explicadas',
    category: 'Guía Dupé',
    date: 'Guía permanente',
    image: '/Images/botanical.webp',
    description: 'Por qué algunos aromas duran horas y otros se desvanecen: concentración, piel y aplicación.',
    link: '/catalogo?tipo=inspiracion',
  },
  {
    title: 'Decants de 5ml y 10ml: prueba antes de comprometerte',
    category: 'Guía Dupé',
    date: 'Guía permanente',
    image: '/Images/perfume_isolated.webp',
    description: 'La forma inteligente de descubrir tu aroma ideal sin pagar el frasco completo.',
    link: '/catalogo?tipo=decant',
  },
  {
    title: 'Inspiraciones 1.1: lujo accesible con esencias importadas',
    category: 'Colección',
    date: 'Colección Barcelona',
    image: '/Images/category_men.webp',
    description: 'Dupes de alta gama formulados con esencias importadas: misma estela, precio justo.',
    link: '/catalogo?tipo=inspiracion',
  },
  {
    title: 'Cómo aplicar tu fragancia para que dure todo el día',
    category: 'Guía Dupé',
    date: 'Guía permanente',
    image: '/Images/category_women.webp',
    description: 'Puntos de pulso, hidratación y el error más común al atomizar que acorta la duración.',
    link: '/catalogo',
  },
  {
    title: 'Arma tu decant personalizado en el laboratorio Dupé',
    category: 'Experiencia',
    date: 'Sogamoso',
    image: '/Images/hero.webp',
    description: 'Elige línea, tamaño y extras, o haz el test olfativo y encuentra tu match sensorial.',
    link: '/experiencia?tab=crea',
  },
];
