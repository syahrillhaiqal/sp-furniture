import React, { useState, useRef } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Grid2x2, 
  Sofa, 
  UtensilsCrossed, 
  BedDouble, 
  BriefcaseBusiness, 
  Trees,
  X,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import { ProductCard } from './ProductCard';

export const Showroom: React.FC = () => {
  const { products } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Create a ref to anchor the scroll destination
  const productSectionRef = useRef<HTMLDivElement>(null);

  const categoryCards = [
    {
      name: 'Living Room',
      icon: Sofa,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
      blurb: 'Sofas, lounges, and sculptural display pieces.'
    },
    {
      name: 'Dining Room',
      icon: UtensilsCrossed,
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1200',
      blurb: 'Tables and seating built for daily ritual.'
    },
    {
      name: 'Bedroom',
      icon: BedDouble,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
      blurb: 'Pieces designed to soften the private suite.'
    },
    {
      name: 'Office',
      icon: BriefcaseBusiness,
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200',
      blurb: 'Desks with a composed, executive edge.'
    },
    {
      name: 'Outdoor',
      icon: Trees,
      image: 'https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      blurb: 'Pieces that extend home into open air.'
    }
  ];

  const categoryMeta = categoryCards.map((item) => ({
    ...item,
    count: products?.filter((product) => product.category === item.name).length || 0
  }));

  const filteredProducts = (products || [])
    .filter((prod) => {
      const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory ? prod.category === selectedCategory : true;
      const matchCustomizable = onlyCustomizable ? prod.customizable === true : true;
      return matchSearch && matchCategory && matchCustomizable;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  // Handle category selection with scroll and toggle functionality
  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      // Deselect if already active
      setSelectedCategory(null);
    } else {
      // Select new category and scroll smoothly
      setSelectedCategory(categoryName);
      
      // Small timeout allows React to render the new section before scrolling to it
      setTimeout(() => {
        productSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 50);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-16 bg-stone-50 min-h-screen pb-20 relative">
      
      {/* HEADER & CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-700">The Collection</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 leading-tight">
              Curate your space.
            </h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-stone-600">
              Select a room category to reveal our catalog. Refine your search by price, rating, and bespoke customizability.
            </p>
          </div>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
            >
              View all categories
            </button>
          )}
        </div>

        {/* CATEGORY GRID */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoryMeta.map((item) => {
            const Icon = item.icon;
            const isActive = selectedCategory === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleCategoryClick(item.name)}
                className={`group relative overflow-hidden rounded-[2rem] border text-left transition-all duration-500 cursor-pointer 
                  ${isActive 
                    ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500 scale-[1.02]' 
                    : 'border-stone-200 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300'}`}
              >
                <div className="absolute inset-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-stone-950/40' : 'bg-linear-to-t from-stone-950/90 via-stone-950/40 to-transparent'}`} />
                </div>
                
                <div className="relative flex h-64 sm:h-72 flex-col justify-between p-5 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md transition-colors ${isActive ? 'bg-amber-500/90 text-stone-950' : 'bg-white/10 text-white'}`}>
                      <Icon size={12} />
                      Category
                    </span>
                    <span className="rounded-full bg-stone-950/40 border border-white/10 px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.count} items
                    </span>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold drop-shadow-md">{item.name}</h2>
                    <p className={`mt-2 text-xs sm:text-sm leading-relaxed text-stone-200 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                      {item.blurb}
                    </p>
                  </div>
                </div>
                
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500 rounded-full blur-[50px] opacity-40 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* INVISIBLE SCROLL ANCHOR */}
      <div ref={productSectionRef} className="absolute -mt-10" aria-hidden="true" />

      {/* FILTER BAR */}
      {selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="rounded-3xl bg-white border border-stone-200 p-2 sm:p-3 shadow-sm flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 transition-colors group-focus-within:text-amber-600">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder={`Search in ${selectedCategory}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-transparent rounded-2xl pl-12 pr-10 py-3.5 text-sm transition-all focus:bg-white focus:outline-none focus:border-amber-200 focus:ring-4 focus:ring-amber-500/10 placeholder:text-stone-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              
              {/* Custom Sort Select */}
              <div className="relative flex-1 sm:flex-none min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl pl-4 pr-10 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-700 outline-none cursor-pointer transition-colors focus:border-amber-300"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Top Rated">Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setOnlyCustomizable(!onlyCustomizable)}
                className={`flex flex-1 sm:flex-none items-center justify-between sm:justify-start gap-3 rounded-2xl border px-5 py-3.5 transition-colors cursor-pointer ${onlyCustomizable ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className={onlyCustomizable ? 'text-amber-600' : 'text-stone-400'} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${onlyCustomizable ? 'text-amber-900' : 'text-stone-600'}`}>
                    Customizable
                  </span>
                </div>
                {/* Switch Graphic */}
                <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${onlyCustomizable ? 'bg-amber-500' : 'bg-stone-300'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${onlyCustomizable ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-end justify-between border-b border-stone-200 pb-4 pt-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">Browsing</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">{selectedCategory}</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
              <Grid2x2 size={14} />
              {filteredProducts.length} pieces found
            </div>
          </div>
        </section>
      )}

      {/* PRODUCT GRID / EMPTY STATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {!selectedCategory ? (
          <div className="rounded-[2.5rem] border border-dashed border-stone-300 bg-white/50 px-6 py-20 text-center shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mb-6">
                <Grid2x2 size={24} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">Catalogue locked</p>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900">Select a space to begin.</h3>
              <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-stone-500">
                Our collections are organized by environment. Choose a room category above to unlock tailored furniture selections and begin curating your home.
              </p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="transition-all duration-300 hover:-translate-y-2">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-24 bg-white rounded-[2.5rem] border border-dashed border-stone-300 shadow-sm max-w-2xl mx-auto px-6">
            <div className="mx-auto w-16 h-16 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mb-6">
              <SlidersHorizontal size={24} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">No pieces match your vision.</h3>
            <p className="text-sm sm:text-base text-stone-500 mt-3 max-w-md mx-auto leading-relaxed">
              We couldn't find any items matching your current filters. Try broadening your search or exploring standard configurations.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setOnlyCustomizable(false);
                setSortBy('Recommended');
              }}
              className="mt-8 px-6 py-3 bg-stone-900 text-white rounded-full text-xs tracking-wider uppercase font-bold hover:bg-stone-800 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <X size={14} />
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};