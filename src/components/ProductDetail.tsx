import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, RefreshCw, Star, ShieldCheck, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { WOOD_FINISHES, FABRICS } from '../data';
import type { CartItem, CustomOption } from '../types';

export const ProductDetail: React.FC = () => {
  const { currentProductDetailId, products, inventory, addToCart, setRoute } = useAppContext();

  // Find the exact product
  const product = products.find((p) => p.id === currentProductDetailId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-800">Product not found</h2>
        <button
          onClick={() => setRoute('home')}
          className="mt-4 px-4 py-2 bg-stone-900 text-white rounded text-sm hover:bg-stone-800 cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Get current inventory levels
  const invRecord = inventory.find((inv) => inv.productId === product.id);
  const currentStock = invRecord ? invRecord.stockLevel : 10;
  const isOutOfStock = currentStock <= 0;

  // Customization choices state
  const [selectedFinish, setSelectedFinish] = useState<CustomOption>(WOOD_FINISHES[0]);
  const [selectedFabric, setSelectedFabric] = useState<CustomOption>(FABRICS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  // Style colors for circular rings
  const finishColorMap: Record<string, string> = {
    'nat-oak': 'bg-amber-100 border-amber-300',
    'dark-walnut': 'bg-[#4c3121] border-stone-800',
    'royal-teak': 'bg-[#8F5E23] border-amber-800',
    'charcoal-ash': 'bg-stone-700 border-stone-900',
  };

  const fabricColorMap: Record<string, string> = {
    'linen-cream': 'bg-[#F2EFE9] border-stone-300',
    'velvet-emerald': 'bg-[#0F5245] border-emerald-950',
    'leather-saddle': 'bg-[#8B4513] border-orange-950',
    'boucle-wheat': 'bg-[#DFD3C3] border-amber-200',
    'weave-grey': 'bg-[#708090] border-slate-600',
  };

  // Calculate live single and total price
  const basePriceValue = product.price;
  const finishMod = product.customizable ? selectedFinish.priceMod : 0;
  const fabricMod = (product.customizable && product.category !== 'Dining Room' && product.category !== 'Outdoor') ? selectedFabric.priceMod : 0;
  const singleItemPrice = basePriceValue + finishMod + fabricMod;
  const totalItemCost = singleItemPrice * quantity;

  // Quantity modifiers
  const decQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      setAlertMsg(null);
    }
  };

  const incQty = () => {
    if (quantity >= currentStock) {
      setAlertMsg(`Strict physical stock ceiling reached. Only ${currentStock} units available.`);
    } else {
      setQuantity((q) => q + 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > currentStock) {
      setAlertMsg(`Cannot add. Exceeds physical store availability of ${currentStock} units.`);
      return;
    }

    const cartInstance: CartItem = {
      id: `${product.id}-${selectedFinish.id}-${product.customizable ? selectedFabric.id : 'none'}-${Date.now()}`,
      product,
      quantity,
      selectedFinish: product.customizable ? selectedFinish : WOOD_FINISHES[0],
      selectedFabric: (product.customizable && product.category !== 'Dining Room' && product.category !== 'Outdoor') ? selectedFabric : undefined,
      totalPrice: totalItemCost
    };

    addToCart(cartInstance);
    setSuccessAnimation(true);
    setAlertMsg(null);

    // Timeout alert to clear animation or routing redirection
    setTimeout(() => {
      setSuccessAnimation(false);
      setRoute('cart'); // Go to cart right away to verify addition
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back to Catalog Anchor */}
      <button
        onClick={() => setRoute('home')}
        className="group flex items-center space-x-2 text-stone-600 hover:text-stone-900 text-sm font-medium mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog Browse</span>
      </button>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Hand Column: High-Res Frame Graphic */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative pt-[70%] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Visual Specs summary floating tag */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-stone-200/50 max-w-xs">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">Authentic Timber Finish</h4>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                {product.customizable
                  ? `Selected: ${selectedFinish.name} ${
                      product.category !== 'Dining Room' && product.category !== 'Outdoor'
                        ? `& ${selectedFabric.name}`
                        : ''
                    }`
                  : 'Genuine standard structural timber'}
              </p>
            </div>
          </div>

          {/* Expanded Quality Guarantee Badges */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-stone-200 rounded-xl p-4 text-center bg-white">
              <ShieldCheck className="mx-auto text-amber-800 mb-1" size={20} />
              <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider font-serif">100% Sourced Wood</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Responsibly certified</div>
            </div>
            <div className="border border-stone-200 rounded-xl p-4 text-center bg-white">
              <RefreshCw className="mx-auto text-stone-600 mb-1" size={20} />
              <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider font-serif">Flexible Return</div>
              <div className="text-[10px] text-stone-500 mt-0.5">30-day showroom guarantee</div>
            </div>
            <div className="border border-stone-200 rounded-xl p-4 text-center bg-white">
              <Star className="mx-auto text-amber-500 mb-1 fill-current" size={20} />
              <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider font-serif">{product.rating.toFixed(1)} Rating</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Customer verified build</div>
            </div>
          </div>
        </div>

        {/* Right Hand Column: Detailed Specifications and Customizer Modules */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs text-amber-900 font-bold uppercase tracking-widest font-mono">
                {product.category} Collection
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={`fill-current ${
                        i < Math.floor(product.rating) ? 'text-amber-500' : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500 font-bold">
                  {product.rating.toFixed(1)} (78 Verified Reviews)
                </span>
              </div>
            </div>

            {/* Price Module */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-500 font-sans">Calculated Custom Build Price</span>
                <span className="text-3xl font-bold text-stone-900 font-serif">
                  ${singleItemPrice.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Base product cost:</span>
                  <span className="font-semibold text-stone-700">${product.price.toLocaleString()}</span>
                </div>
                {product.customizable && (
                  <>
                    <div className="flex justify-between text-amber-950">
                      <span>Wood selection ({selectedFinish.name}):</span>
                      <span className="font-semibold">+${selectedFinish.priceMod}</span>
                    </div>
                    {product.category !== 'Dining Room' && product.category !== 'Outdoor' && (
                      <div className="flex justify-between text-amber-950">
                        <span>Fabric selection ({selectedFabric.name}):</span>
                        <span className="font-semibold">+${selectedFabric.priceMod}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Core Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-2">Description</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Customization controls if customizable */}
            {product.customizable ? (
              <div className="space-y-6 pt-4 border-t border-stone-200">
                {/* Finish Options */}
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">
                      Select Wood Finish
                    </h3>
                    <span className="text-xs text-stone-500 italic">
                      {selectedFinish.name} ({selectedFinish.priceMod === 0 ? 'Included' : `+$${selectedFinish.priceMod}`})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {WOOD_FINISHES.map((finish) => (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg border-2 text-left cursor-pointer transition-all ${
                          selectedFinish.id === finish.id
                            ? 'border-amber-800 bg-amber-50/10'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border shadow-sm ${finishColorMap[finish.id]}`} />
                        <span className="text-xs font-semibold text-stone-700">{finish.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Options if category supports fabric choice */}
                {product.category !== 'Dining Room' && product.category !== 'Outdoor' && (
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">
                        Select Custom Upholstery / Color fabric
                      </h3>
                      <span className="text-xs text-stone-500 italic">
                        {selectedFabric.name} ({selectedFabric.priceMod === 0 ? 'Included' : `+$${selectedFabric.priceMod}`})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {FABRICS.map((fabric) => (
                        <button
                          key={fabric.id}
                          type="button"
                          onClick={() => setSelectedFabric(fabric)}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg border-2 text-left cursor-pointer transition-all ${
                            selectedFabric.id === fabric.id
                              ? 'border-amber-800 bg-amber-50/10'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border shadow-inner shrink-0 ${fabricColorMap[fabric.id]}`} />
                          <div>
                            <div className="text-xs font-bold text-stone-800 leading-none">{fabric.name}</div>
                            <span className="text-[9px] text-stone-400 font-mono">
                              {fabric.priceMod === 0 ? 'Standard price' : `+$${fabric.priceMod}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-50/30 p-4 rounded-lg border border-amber-800/10 text-xs text-stone-600 leading-relaxed font-sans mt-4">
                💡 <strong>Pre-configured model:</strong> This model is shipped strictly with our premium signature timber selection. No modular finish customization available for this item.
              </div>
            )}

            {/* Product Tech specs */}
            <div className="pt-4 border-t border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-stone-500 font-mono uppercase text-[9px] tracking-wider">Dimensions</div>
                  <div className="text-stone-800 font-medium mt-0.5">{product.specs.dimensions}</div>
                </div>
                <div>
                  <div className="font-semibold text-stone-500 font-mono uppercase text-[9px] tracking-wider">Materials</div>
                  <div className="text-stone-800 font-medium mt-0.5 truncate" title={product.specs.material}>{product.specs.material}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-semibold text-stone-500 font-mono uppercase text-[9px] tracking-wider">Warranty</div>
                  <div className="text-stone-800 font-medium mt-0.5">{product.specs.warranty}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add To Cart & Quantity Selection Interface Controls */}
          <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
            {alertMsg && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-medium border border-red-100">
                ⚠️ {alertMsg}
              </div>
            )}

            <div className="flex items-center space-x-4">
              {/* Quantity Changer */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={decQty}
                  disabled={isOutOfStock}
                  className="px-3 py-3 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                >
                  <Minus size={15} />
                </button>
                <span className="font-mono text-sm px-4 font-bold text-stone-800 w-11 text-center">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  onClick={incQty}
                  disabled={isOutOfStock}
                  className="px-3 py-3 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || successAnimation}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm tracking-wide shadow flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    : successAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-800 hover:bg-amber-900 text-white hover:shadow-lg'
                }`}
              >
                <ShoppingCart size={16} />
                <span>
                  {isOutOfStock
                    ? 'Temporarily Out of Stock'
                    : successAnimation
                    ? 'Added to Your Cart!'
                    : `Add to Cart • $${totalItemCost.toLocaleString()}`}
                </span>
              </button>
            </div>

            <p className="text-center text-[10px] text-stone-400">
              ⚡ All custom creations require approximately 3-4 weeks for precision artisan manufacturing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
