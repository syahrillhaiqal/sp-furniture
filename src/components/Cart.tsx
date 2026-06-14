import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQty, setRoute } = useAppContext();

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const estShipping = subtotal > 1500 ? 0 : 120; // free delivery above $1500
  const orderTotal = subtotal + estShipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
          <ShoppingCart size={36} className="text-stone-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-800">Your shopping cart is empty</h2>
        <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
          Add some handcrafted artisan furniture items to customize your workspace or residential living rooms.
        </p>
        <button
          onClick={() => setRoute('home')}
          className="mt-8 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-sm transition-all shadow cursor-pointer"
        >
          Browse Our Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List of items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-200">
            {cart.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                {/* Item Image */}
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and modifiers */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer" onClick={() => setRoute('detail', { productId: item.product.id })}>
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-stone-500 mt-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-400 font-mono">Wood Finish:</span> 
                          <span className="text-stone-700">{item.selectedFinish.name}</span>
                        </div>
                        {item.selectedFabric && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-400 font-mono">Fabric / Color:</span> 
                            <span className="text-stone-700">{item.selectedFabric.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-sm text-stone-400 block font-mono h-4">Subtotal</span>
                      <span className="text-base font-bold text-stone-900 font-serif">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        (${(item.totalPrice / item.quantity).toLocaleString()} / unit)
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    {/* Quantity modifier */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="p-1 px-2.5 hover:bg-stone-200 text-stone-600 font-bold transition-colors cursor-pointer text-sm"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs px-3 font-bold text-stone-800 w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="p-1 px-2.5 hover:bg-stone-200 text-stone-600 font-bold transition-colors cursor-pointer text-sm"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Trash Button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer text-xs font-semibold"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Delete Item</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setRoute('home')}
            className="inline-flex items-center space-x-2 text-stone-500 hover:text-stone-800 text-xs font-bold uppercase tracking-widest cursor-pointer mt-4"
          >
            <ArrowLeft size={14} />
            <span>Keep Shopping</span>
          </button>
        </div>

        {/* Right Column: Order Summary Pricing Card */}
        <div className="lg:col-span-4">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 sticky top-28 space-y-5 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-stone-600 border-b border-stone-200 pb-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-stone-900">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tailored Artisan Courier Fee</span>
                {estShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider text-xs">FREE</span>
                ) : (
                  <span className="font-mono text-stone-900">${estShipping.toLocaleString()}</span>
                )}
              </div>
              {estShipping > 0 && (
                <p className="text-[10px] text-stone-400 italic">
                  💡 Get free gourmet delivery by adding ${(1500 - subtotal).toLocaleString()} more value to your build!
                </p>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-sans font-bold text-stone-800">Total Bill</span>
              <span className="font-serif text-2xl font-black text-stone-900">
                ${orderTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setRoute('checkout')}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <span>Proceed to Assembly Details</span>
              <ArrowRight size={15} />
            </button>

            <div className="p-3.5 bg-yellow-50/50 border border-yellow-200/50 rounded-lg text-[10px] text-stone-500 leading-normal">
              🔒 <strong>Corporate Guarantee:</strong> Your SP Home order is fully insured during transit and backed by our master carpentry workmanship certificates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
