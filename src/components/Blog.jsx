import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CinematicPageHeader } from './CinematicPageHeader';
import { ScentAmbient } from './ScentAmbient';
import { Reveal } from './motion-primitives';

const Blog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiKey = 'f287c9ed00464977a308728ab4d884ef';
        const query = encodeURIComponent('"perfume" OR "fragancia" OR "eau de parfum" OR "eau de toilette" OR "nota olfativa" OR "perfumería"');
        const excludeDomains = 'kotaku.com,ign.com,gamespot.com,polygon.com,tmz.com,marca.com,as.com,sport.es,mundodeportivo.com';
        const localUrl = `https://newsapi.org/v2/everything?q=${query}&language=es&sortBy=publishedAt&excludeDomains=${excludeDomains}&apiKey=${apiKey}`;

        // En localhost llamamos directo a NewsAPI (está permitido)
        // En producción usamos nuestro proxy /api/news para saltar el bloqueo
        const response = await fetch(isLocal ? localUrl : '/api/news');

        if (!response.ok) {
          throw new Error('Error al cargar las noticias');
        }
        const data = await response.json();

        // Palabras que DEBEN estar en el artículo (al menos una)
        const mustHave = ['perfume', 'fragancia', 'eau de', 'nota olfativa', 'perfumería', 'aroma', 'loción', 'cosmético', 'cosmética', 'olor corporal'];
        // Palabras que INVALIDAN el artículo (falsos positivos comunes)
        const blacklist = ['gol', 'futbol', 'protesta', 'protestas', 'fútbol', 'balonmano', 'final four', 'champions', 'liga', 'tiroteo', 'asesinato', 'homicidio', 'detención', 'detenido', 'policía', 'policial', 'videojuego', 'playstation', 'xbox', 'nintendo', 'ocupación', 'vecinos', 'alcaldía', 'liceo', 'barça', 'barcelona fc'];

        const relevantArticles = (data.articles || []).filter(a => {
          const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
          const hasRelevant = mustHave.some(kw => text.includes(kw));
          const hasBlacklisted = blacklist.some(kw => text.includes(kw));
          return hasRelevant && !hasBlacklisted;
        });

        const filteredArticles = relevantArticles.slice(0, 6).map(article => ({
          title: article.title,
          category: 'Perfumería',
          date: new Date(article.publishedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
          image: article.urlToImage || '/Images/default-article.png',
          description: article.description || 'Lee más sobre tendencias en perfumería.',
          link: article.url
        }));
        setProducts(filteredArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="pt-16 md:pt-24 pb-8 md:pb-12 bg-linen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <div className="shimmer-skeleton h-3 w-40 rounded-full mb-4" />
            <div className="shimmer-skeleton h-10 w-3/4 rounded-xl mb-3" />
            <div className="shimmer-skeleton h-4 w-1/2 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="shimmer-skeleton rounded-artisanal aspect-[16/10] mb-6" />
                <div className="shimmer-skeleton h-3 w-1/3 rounded-full mb-3" />
                <div className="shimmer-skeleton h-6 w-full rounded-lg mb-2" />
                <div className="shimmer-skeleton h-4 w-2/3 rounded-lg" />
              </div>
            ))}
          </div>
          <p className="text-moss/60 mt-8 text-sm">Cargando noticias de belleza...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="pt-16 md:pt-24 pb-8 md:pb-12 bg-linen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-moss/60">Error al cargar las noticias: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="pt-16 md:pt-24 pb-8 md:pb-12 bg-linen relative overflow-hidden">
      <ScentAmbient variant="light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-12 mb-10 md:mb-20">
          <CinematicPageHeader
            eyebrow="Recomendaciones"
            title={<>Noticias de <span className="font-cursive font-normal text-emerald">Belleza</span></>}
            description="Artículos recientes sobre perfumes, fragancias y cuidado personal."
          />
          <Reveal delay={0.15} className="shrink-0">
          <button className="flex items-center gap-2 md:gap-3 text-emerald font-bold uppercase tracking-widest text-xs md:text-sm hover:translate-x-2 transition-transform">
            Ver más noticias <ArrowRight size={16} className="md:w-5 md:h-5" />
          </button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.map((product, idx) => (
            <motion.article
              key={product.link || idx}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: Math.min(idx * 0.07, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: -5, transition: { type: 'spring', stiffness: 260, damping: 28 } }}
              className="group cursor-pointer will-change-transform"
            >
              <div className="rounded-artisanal overflow-hidden aspect-[16/10] md:aspect-video mb-6 md:mb-8 relative">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => e.target.src = '/Images/default-product.png'} />
                <div className="absolute inset-0 bg-emerald/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {product.link && (
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 bg-emerald text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-chestnut">
                  <BookOpen size={12} className="md:w-[14px] md:h-[14px]" />
                  {product.category} • {product.date}
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-emerald group-hover:text-moss transition-colors">{product.title}</h3>
                <p className="text-moss/50 text-xs md:text-sm leading-relaxed">{product.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      </ScentAmbient>
    </section>
  );
};

export default Blog;
