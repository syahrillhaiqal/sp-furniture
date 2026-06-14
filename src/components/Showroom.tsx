import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Shield, ThumbsUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const Showroom: React.FC = () => {
  const { products } = useAppContext();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Derive categories dynamically from current system products list
  const categories = ['All', 'Living Room', 'Dining Room', 'Bedroom', 'Office', 'Outdoor'];

  // Sorting and Filtering logic
  const filteredProducts = products
    .filter((prod) => {
      const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' ? true : prod.category === selectedCategory;
      const matchCustomizable = onlyCustomizable ? prod.customizable === true : true;
      return matchSearch && matchCategory && matchCustomizable;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Recommended (Featured first)
    });

  return (
    <div className="space-y-12">
      {/* 2.1 ELEGANT HERO BRAND BANNER */}
      <section className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 md:py-24 shadow-lg border border-white/5 mx-4 sm:mx-8 lg:mx-10 mt-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-800/20 border border-amber-800/40 px-3 py-1 rounded text-xs font-mono font-bold tracking-widest text-amber-200 uppercase">
            <span>Corporate Showroom Catalog</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-none text-stone-100">
            Handcrafted <br className="hidden sm:inline" />
            Bespoke Solid Wood Designs
          </h1>
          
          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-xl font-light font-sans leading-relaxed">
            Exquisite high-grade timber structures tailored by award-winning master carpenters. Select your custom wood finishes and luxury fabrics for direct home assembly.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-stone-200">
              <Shield size={16} className="text-amber-500 shrink-0" />
              <span>Sustainably Sourced Timber</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-200">
              <ThumbsUp size={16} className="text-amber-500 shrink-0" />
              <span>Showroom Craft Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 INTERACTIVE CATALOGUE CONTROL PANELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
          
          {/* A. Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search modern leather sofas, floating oak bed frames, walnut desks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-800/80 shadow-sm"
            />
          </div>

          {/* B. Sorting Dropdown and Customizable Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sorting */}
            <div className="relative inline-flex items-center border border-stone-200 rounded-xl px-3.5 bg-white shadow-sm shrink-0">
              <ArrowUpDown size={14} className="text-stone-400 mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold uppercase tracking-wider py-3.5 pr-8 bg-transparent outline-none cursor-pointer text-stone-700"
              >
                <option value="Recommended">Recommended</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Top Rated">Top Rated</option>
              </select>
            </div>

            {/* Custom choice filter toggle */}
            <label className="bg-white border border-stone-200 hover:border-stone-300 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="w-5 h-5 rounded text-amber-800 accent-amber-800"
              />
              <span className="text-stone-700">Customizable</span>
            </label>
          </div>
        </div>

        {/* C. Category Pills selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow shadow-amber-800/15'
                  : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2.3 PRODUCTS CATALOG LISTING STAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 max-w-xl mx-auto px-6">
            <SlidersHorizontal size={34} className="text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif font-black text-lg text-stone-800">No products match your parameters</h3>
            <p className="text-xs text-stone-500 mt-2">
              Try adjusting your search criteria, widening the price point, or selecting another category pill. All custom options remain registered in the system database.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setOnlyCustomizable(false);
              }}
              className="mt-6 px-4 py-2 bg-stone-900 text-white rounded text-xs tracking-wider uppercase font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
