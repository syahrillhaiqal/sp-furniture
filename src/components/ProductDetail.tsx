import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  RefreshCw, 
  Star, 
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import { WOOD_FINISHES, FABRICS } from '../data';
import type { CartItem, CustomOption } from '../types';
import { formatRM } from '../utils/currency';

export const ProductDetail: React.FC = () => {
  const { currentProductDetailId, products, inventory, addToCart, setRoute } = useAppContext();
  const [selectedFinish, setSelectedFinish] = useState<CustomOption>(WOOD_FINISHES[0]);
  const [selectedFabric, setSelectedFabric] = useState<CustomOption>(FABRICS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = products?.find((p) => p.id === currentProductDetailId);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-stone-200 text-stone-400 rounded-full flex items-center justify-center mb-6">
          <Info size={24} />
        </div>
        <h2 className="text-2xl font-black font-serif text-stone-900">Piece not found</h2>
        <p className="mt-2 text-stone-500 mb-8">This item may have been removed or is currently unavailable.</p>
        <button
          onClick={() => setRoute('home')}
          className="px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  // Inventory logic
  const invRecord = inventory?.find((inv) => inv.productId === product.id);
  const currentStock = invRecord ? invRecord.stockLevel : 10;
  const isOutOfStock = currentStock <= 0;

  // Swatch styling
  const finishColorMap: Record<string, string> = {
    'nat-oak': 'bg-amber-100 border-amber-300',
    'dark-walnut': 'bg-[#4c3121] border-[#362115]',
    'royal-teak': 'bg-[#8F5E23] border-[#6b4518]',
    'charcoal-ash': 'bg-[#2c2c2c] border-[#1a1a1a]',
  };

  const fabricColorMap: Record<string, string> = {
    'linen-cream': 'bg-[#F5F2EB] border-[#e3dac9]',
    'velvet-emerald': 'bg-[#0F5245] border-[#0a382f]',
    'leather-saddle': 'bg-[#8B4513] border-[#5e2f0d]',
    'boucle-wheat': 'bg-[#DFD3C3] border-[#c2b29f]',
    'weave-grey': 'bg-[#708090] border-[#4a5560]',
  };

  // Pricing math
  const basePriceValue = product.price;
  const finishMod = product.customizable ? selectedFinish.priceMod : 0;
  const fabricMod = (product.customizable && product.category !== 'Dining Room' && product.category !== 'Outdoor') ? selectedFabric.priceMod : 0;
  const singleItemPrice = basePriceValue + finishMod + fabricMod;
  const totalItemCost = singleItemPrice * quantity;

  // Handlers
  const decQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      setAlertMsg(null);
    }
  };

  const incQty = () => {
    if (quantity >= currentStock) {
      setAlertMsg(`Limit reached: Only ${currentStock} units currently available.`);
    } else {
      setQuantity((q) => q + 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > currentStock) {
      setAlertMsg(`Cannot add. Exceeds availability of ${currentStock} units.`);
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

    setTimeout(() => {
      setSuccessAnimation(false);
      setRoute('cart');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button
          onClick={() => setRoute('showroom')}
          className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors mb-8 sm:mb-10 cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Showroom</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
          
          {/* LEFT COLUMN: Media & Trust */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square sm:aspect-[4/5] bg-stone-200 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-xl group">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Floating Material Tag */}
              <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-2xl border border-white/40 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700 mb-1.5">Material Profile</h4>
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {product.customizable
                    ? `Crafted with ${selectedFinish.name} ${
                        product.category !== 'Dining Room' && product.category !== 'Outdoor'
                          ? `& upholstered in ${selectedFabric.name}`
                          : ''
                      }`
                    : 'Crafted from our signature standard structural timber'}
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 text-center bg-white shadow-sm transition-shadow hover:shadow-md">
                <ShieldCheck className="mx-auto text-amber-600 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6" />
                <div className="text-[9px] sm:text-[10px] font-bold text-stone-800 uppercase tracking-[0.2em] mb-1">Sourced Wood</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Responsibly certified</div>
              </div>
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 text-center bg-white shadow-sm transition-shadow hover:shadow-md">
                <RefreshCw className="mx-auto text-stone-400 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6" />
                <div className="text-[9px] sm:text-[10px] font-bold text-stone-800 uppercase tracking-[0.2em] mb-1">Flexible Return</div>
                <div className="text-[10px] sm:text-xs text-stone-500">30-day guarantee</div>
              </div>
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 text-center bg-white shadow-sm transition-shadow hover:shadow-md">
                <Star className="mx-auto text-amber-400 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
                <div className="text-[9px] sm:text-[10px] font-bold text-stone-800 uppercase tracking-[0.2em] mb-1">{product.rating.toFixed(1)} Rating</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Verified owners</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Configurator */}
          <div className="flex flex-col lg:py-4">
            
            {/* Header & Title */}
            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-700 mb-3">
                {product.category} Collection
              </p>
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-stone-900 leading-[1.1] mb-4">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-[11px] font-bold text-stone-800">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium border-l border-stone-300 pl-3">
                  78 Verified Reviews
                </span>
                {product.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border-l border-stone-300 ml-1">
                    Showroom Featured
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Interactive Customizer */}
            {product.customizable ? (
              <div className="space-y-8 mb-8 border-y border-stone-200 py-8">
                
                {/* Wood Selector */}
                <div>
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900">
                      1. Frame Finish
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      {selectedFinish.name} <span className="text-amber-700 ml-1">{selectedFinish.priceMod === 0 ? '(Included)' : `+${formatRM(selectedFinish.priceMod)}`}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {WOOD_FINISHES.map((finish) => (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedFinish.id === finish.id
                            ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-500/10'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full border shadow-sm ${finishColorMap[finish.id]}`} />
                        <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider text-center">{finish.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Selector */}
                {product.category !== 'Dining Room' && product.category !== 'Outdoor' && (
                  <div>
                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900">
                        2. Upholstery
                      </h3>
                      <span className="text-xs text-stone-500 font-medium">
                        {selectedFabric.name} <span className="text-amber-700 ml-1">{selectedFabric.priceMod === 0 ? '(Included)' : `+${formatRM(selectedFabric.priceMod)}`}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FABRICS.map((fabric) => (
                        <button
                          key={fabric.id}
                          type="button"
                          onClick={() => setSelectedFabric(fabric)}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                            selectedFabric.id === fabric.id
                              ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-500/10'
                              : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-full border shadow-inner shrink-0 ${fabricColorMap[fabric.id]}`} />
                          <div>
                            <div className="text-xs font-bold text-stone-900 mb-0.5">{fabric.name}</div>
                            <div className="text-[10px] text-stone-500 font-medium">
                              {fabric.priceMod === 0 ? 'Standard inclusion' : `Premium +${formatRM(fabric.priceMod)}`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 p-5 bg-stone-100 rounded-2xl border border-stone-200 text-sm text-stone-600 leading-relaxed flex gap-4">
                <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-stone-900 block mb-1">Signature Edition</strong>
                  This piece is shipped strictly with our premium standard structural timber and finishes. Modular customization is not available for this specific design.
                </p>
              </div>
            )}

            {/* Specs Grid */}
            <div className="mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-white border border-stone-200 rounded-[2rem] p-6 shadow-sm">
                <div className="pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r border-stone-100 sm:pr-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Dimensions</div>
                  <div className="text-stone-800 font-medium">{product.specs.dimensions}</div>
                </div>
                <div className="pb-4 border-b border-stone-100 sm:pb-0 sm:border-0 sm:pl-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Materials</div>
                  <div className="text-stone-800 font-medium truncate" title={product.specs.material}>{product.specs.material}</div>
                </div>
                <div className="pt-0 sm:pt-4 sm:col-span-2 sm:border-t border-stone-100">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Warranty</div>
                  <div className="text-stone-800 font-medium">{product.specs.warranty}</div>
                </div>
              </div>
            </div>

            {/* Pricing & Checkout Block */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200 shadow-xl mt-auto">
              {/* Itemized Receipt Look */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-stone-500 font-medium">Base piece</span>
                  <span className="font-bold text-stone-900">{formatRM(basePriceValue)}</span>
                </div>
                {product.customizable && finishMod > 0 && (
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-stone-500 font-medium">Wood: {selectedFinish.name}</span>
                    <span className="font-bold text-amber-700">+{formatRM(finishMod)}</span>
                  </div>
                )}
                {product.customizable && fabricMod > 0 && (
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-stone-500 font-medium">Fabric: {selectedFabric.name}</span>
                    <span className="font-bold text-amber-700">+{formatRM(fabricMod)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-5 border-t border-dashed border-stone-300 mb-6 sm:mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Build Price</span>
                <span className="text-3xl sm:text-4xl font-black font-serif text-stone-900">
                  {formatRM(singleItemPrice)}
                </span>
              </div>

              {alertMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-medium border border-red-100 flex gap-3 items-center">
                  <span className="text-lg">⚠️</span> {alertMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border-2 border-stone-200 rounded-2xl bg-white overflow-hidden sm:w-32 shrink-0">
                  <button
                    type="button"
                    onClick={decQty}
                    disabled={isOutOfStock}
                    className="w-10 h-12 sm:h-14 flex items-center justify-center hover:bg-stone-50 text-stone-500 disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-stone-900 text-sm">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incQty}
                    disabled={isOutOfStock}
                    className="w-10 h-12 sm:h-14 flex items-center justify-center hover:bg-stone-50 text-stone-500 disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || successAnimation}
                  className={`flex-1 h-12 sm:h-14 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                      : successAnimation
                      ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-stone-900 text-white hover:bg-stone-800 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {isOutOfStock ? (
                    'Out of Stock'
                  ) : successAnimation ? (
                    <>
                      <Check size={18} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add {quantity > 1 ? `${quantity} items ` : ''}to Cart
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-center text-[10px] text-stone-400 mt-6 font-medium tracking-wide">
                ⚡ All custom creations require approx. 3-4 weeks for artisan manufacturing.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};