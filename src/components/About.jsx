import { motion } from 'framer-motion';
import { Leaf, Droplets, Sun } from 'lucide-react';

const About = () => {
  return (
    <section id="nosotros" className="py-14 md:py-20 bg-linen relative overflow-hidden">
      
      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-10 text-moss/10"
      >
        <Leaf size={120} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
        
        {/* Visual Composition (Asymmetric) */}
        <div className="lg:col-span-6 relative order-2 lg:order-1 mt-8 md:mt-0">
          <div className="relative w-[65%] md:w-full mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-organic overflow-hidden aspect-[4/5] relative z-20 shadow-2xl border-4 md:border-8 border-white"
            >
              <img src="/Images/category_women.webp" alt="Artesanía" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -bottom-6 -right-3 md:-bottom-20 md:-right-20 w-1/2 md:w-3/4 rounded-organic overflow-hidden aspect-square z-10 shadow-xl border-4 md:border-8 border-shine"
            >
              <img src="/Images/category_men.webp" alt="Ingredientes" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          
          <div className="absolute top-[20%] lg:top-1/2 left-0 -translate-x-2 md:-translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-48 md:h-48 bg-emerald rounded-full flex items-center justify-center shadow-2xl z-30">
            <div className="text-center text-shine">
              <span className="block text-2xl md:text-4xl font-serif italic mb-0 md:mb-1">B</span>
              <span className="block text-[6px] md:text-[8px] uppercase tracking-[0.3em] font-bold">Artesanal</span>
            </div>
          </div>
        </div>

        {/* Narrative Content */}
        <div className="lg:col-span-6 space-y-8 md:space-y-12 order-1 lg:order-2">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 md:gap-4 text-moss mb-4 md:mb-6">
              <span className="h-px w-8 md:w-12 bg-moss/30"></span>
              <span className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[11px] md:text-xs font-bold">Nuestra Historia</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 md:mb-10 leading-none tracking-tight">
              <span className="font-elegant text-emerald block mb-1 md:mb-2">Magia</span>
              <span className="font-cursive text-moss text-3xl md:text-5xl lg:text-6xl xl:text-7xl block ml-8 md:ml-12 lg:ml-20">Natural</span>
            </h2>
            
            <div className="space-y-4 md:space-y-8 text-base md:text-xl text-stone leading-relaxed font-elegant">
              <p>
                Diseñamos cada fragancia como un viaje sensorial, contando la historia de cada aroma y sus ingredientes a través de una narrativa visual evocadora.
              </p>
              <p>
                Nuestra conexión con la naturaleza se refleja en la sofisticación del musgo profundo y la calidez del lino, creando una sensación de confort inigualable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-8 pt-4 md:pt-8">
            <div className="space-y-2 md:space-y-3 p-3 md:p-6 bg-shine/50 rounded-artisanal border border-chestnut/5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald flex items-center justify-center text-shine mb-1">
                <Leaf size={16} className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="block text-[8px] md:text-xs font-bold uppercase tracking-widest text-emerald/60">Botánico</span>
            </div>
            <div className="space-y-2 md:space-y-3 p-3 md:p-6 bg-shine/50 rounded-artisanal border border-chestnut/5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald flex items-center justify-center text-shine mb-1">
                <Droplets size={16} className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="block text-[8px] md:text-xs font-bold uppercase tracking-widest text-emerald/60">Puro</span>
            </div>
            <div className="space-y-2 md:space-y-3 p-3 md:p-6 bg-shine/50 rounded-artisanal border border-chestnut/5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald flex items-center justify-center text-shine mb-1">
                <Sun size={16} className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="block text-[8px] md:text-xs font-bold uppercase tracking-widest text-emerald/60">Brillo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
