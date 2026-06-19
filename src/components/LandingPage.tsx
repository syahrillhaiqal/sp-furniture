import React from 'react';
import { 
  ArrowRight, 
  BadgeCheck, 
  Truck, 
  Sparkles, 
  Ruler, 
  Sofa, 
  ShieldCheck, 
  Leaf, 
  ArrowUpRight,
  PackageCheck
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import { formatRM } from '../utils/currency';

const featuredScenes = [
  {
    title: 'Warm Modern Living',
    subtitle: 'Textured fabrics & oak finishes',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Editorial Dining',
    subtitle: 'Sculptural forms & marble accents',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Refined Workspaces',
    subtitle: 'Ergonomic & minimalist design',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200',
  },
];

export const LandingPage: React.FC = () => {
  const { setRoute, products } = useAppContext();

  // Safeguard in case products is empty or undefined
  const featuredProducts = products?.filter((product) => product.featured).slice(0, 3) || [];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 sm:pb-20 bg-stone-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative mx-3 sm:mx-6 lg:mx-10 mt-4 sm:mt-6 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-stone-200 bg-stone-950 text-white shadow-2xl">
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(28,25,23,0.95)_0%,rgba(28,25,23,0.85)_40%,rgba(28,25,23,0.60)_70%,rgba(28,25,23,0.40)_100%)] lg:bg-[linear-gradient(90deg,rgba(28,25,23,0.95)_0%,rgba(28,25,23,0.88)_40%,rgba(28,25,23,0.40)_70%,rgba(28,25,23,0.05)_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1600')" }}
        />
        <div className="absolute inset-y-0 right-0 z-10 hidden w-2/5 bg-linear-to-l from-stone-950 via-stone-950/70 to-transparent lg:block" />

        <div className="relative z-20 grid gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-16 lg:py-24 items-center">
          
          {/* Hero Content */}
          <div className="max-w-2xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-stone-100 backdrop-blur-md">
              <Sofa size={14} className="text-amber-400" />
              SP Furniture Home
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="font-serif text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl drop-shadow-lg">
                Furniture designed to feel <span className="text-amber-200/90 italic">calm</span>, considered, and complete.
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base lg:text-lg font-light">
                Discover premium home pieces shaped for modern living. From sculptural lounges to dining statements, SP Furniture Home brings together craftsmanship, material warmth, and a refined visual language.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm">
                <BadgeCheck size={16} className="text-amber-400 shrink-0" />
                Crafted for comfort
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm">
                <Truck size={16} className="text-amber-400 shrink-0" />
                White-glove delivery
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm">
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                Custom finishes
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setRoute('showroom')}
                className="group inline-flex justify-center items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer w-full sm:w-auto"
              >
                Explore showroom
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => setRoute('track')}
                className="inline-flex justify-center items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 cursor-pointer w-full sm:w-auto"
              >
                Track an order
              </button>
            </div>
          </div>

          {/* Hero Featured Products */}
          <div className="grid gap-4 self-center lg:self-end mt-4 lg:mt-0">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-amber-400">Signature experience</p>
                  <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-white">Curated Collection</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 p-2 sm:p-3 text-amber-300 hidden sm:block">
                  <Ruler size={22} />
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:gap-3">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => setRoute('showroom')}
                      className="group flex cursor-pointer items-center gap-3 sm:gap-4 rounded-2xl bg-stone-950/40 p-2 sm:p-3 transition-colors hover:bg-white/10"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover shadow-md" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-serif text-base sm:text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">{product.name}</h3>
                        <p className="text-[11px] sm:text-xs text-stone-400">Starting from {formatRM(product.price)}</p>
                      </div>
                      <ArrowUpRight size={18} className="text-stone-500 opacity-0 transition-opacity group-hover:opacity-100 mr-1 sm:mr-2 hidden sm:block" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-400 italic py-4">Loading featured pieces...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 py-4 sm:py-6 border-y border-stone-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-600 text-center sm:text-left">
            <ShieldCheck size={24} className="text-amber-600 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">10-Year Warranty</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-600 text-center sm:text-left">
            <Leaf size={24} className="text-amber-600 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Sustainable Wood</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-600 text-center sm:text-left">
            <PackageCheck size={24} className="text-amber-600 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Secure Packaging</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-600 text-center sm:text-left">
            <BadgeCheck size={24} className="text-amber-600 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Artisan Crafted</span>
          </div>
        </div>
      </section>

      {/* INFO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-700">Home essentials</p>
            <h2 className="mt-3 sm:mt-4 font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">Pieces that balance warmth & structure.</h2>
            <p className="mt-3 sm:mt-4 text-sm leading-relaxed text-stone-600">
              SP Furniture Home is built around calm materials, tactile finishes, and a catalogue that feels edited rather than crowded.
            </p>
          </div>
          
          <div className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500/10 rounded-full blur-3xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10" />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400 relative z-10">Why SP Home</p>
            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-sm text-stone-300 relative z-10">
              <li className="flex items-start gap-3">
                <Sofa size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Handpicked furniture for living, dining, work, and rest.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Premium materials with bespoke finish options available.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Clean showroom navigation for seamless discovery.</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-[2rem] border border-stone-200 bg-amber-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-700">Visit next</p>
              <h2 className="mt-3 sm:mt-4 font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">Open the showroom when you are ready.</h2>
            </div>
            <button
              type="button"
              onClick={() => setRoute('showroom')}
              className="group mt-5 sm:mt-6 inline-flex w-full sm:w-fit justify-center items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 cursor-pointer shadow-lg shadow-stone-900/20"
            >
              Browse the catalogue
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* SCENES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Spaces to inspire</h2>
            <p className="mt-1 sm:mt-2 text-sm text-stone-500">Curated looks featuring our signature pieces.</p>
          </div>
        </div>
        
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {featuredScenes.map((scene) => (
            <article key={scene.title} className="group relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm cursor-pointer">
              <div className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] overflow-hidden">
                <img 
                  src={scene.image} 
                  alt={scene.title} 
                  referrerPolicy="no-referrer" 
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/20 to-transparent transition-opacity duration-500 sm:opacity-100 lg:opacity-100 lg:group-hover:opacity-90" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 sm:translate-y-4 transition duration-500 sm:group-hover:translate-y-0">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400 sm:opacity-0 transition duration-500 sm:group-hover:opacity-100 mb-1 sm:mb-2">
                    Studio Inspiration
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">{scene.title}</h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-stone-300 sm:opacity-0 transition duration-500 delay-100 sm:group-hover:opacity-100">
                    {scene.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};