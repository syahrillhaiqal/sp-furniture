import React from 'react';
import { Star, Layers, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setRoute, inventory } = useAppContext();

  // Find related stock level
  const stockItem = inventory.find((inv) => inv.productId === product.id);
  const stockLevel = stockItem ? stockItem.stockLevel : 10;
  const isOutOfStock = stockLevel <= 0;
  const isLowStock = stockLevel > 0 && stockLevel <= (stockItem?.reorderPoint || 3);

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full">
      {/* Product Image Stage */}
      <div className="relative pt-[75%] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-stone-700 shadow-sm border border-stone-200/50">
          {product.category}
        </div>

        {/* Stock Badges */}
        {isOutOfStock ? (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 right-3 bg-amber-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-sm">
            Low Stock: Only {stockLevel} left!
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
            In Stock
          </div>
        )}

        {/* Customization Support Indicator */}
        {product.customizable && (
          <div className="absolute bottom-3 left-3 bg-amber-800 text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Layers size={10} />
            Customizable Finish
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-amber-500">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-bold ml-1 text-stone-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] font-mono text-stone-400">ID: {product.id}</span>
          </div>

          <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1.5 mb-4 line-clamp-2 h-8 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specifications Detail */}
          <div className="bg-stone-50 rounded-lg p-2.5 my-3 border border-stone-100">
            <div className="text-[10px] text-stone-600 flex justify-between gap-1">
              <span className="text-stone-400 font-mono">Dims:</span>
              <span className="font-medium text-stone-700 truncate max-w-[150px]">{product.specs.dimensions}</span>
            </div>
            <div className="text-[10px] text-stone-600 flex justify-between gap-1 mt-1">
              <span className="text-stone-400 font-mono">Warr:</span>
              <span className="font-medium text-stone-800">{product.specs.warranty}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-stone-400 block font-mono">Starting At</span>
            <span className="text-lg font-bold text-stone-900 font-serif">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setRoute('detail', { productId: product.id })}
            className="bg-stone-900 hover:bg-amber-800 text-white rounded-md px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 transition-all group-hover:gap-2 shadow-sm cursor-pointer"
          >
            <Eye size={13} />
            <span>View & Build</span>
          </button>
        </div>
      </div>
    </div>
  );
};
