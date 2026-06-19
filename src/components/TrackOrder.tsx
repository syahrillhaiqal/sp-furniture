import React, { useState } from 'react';
import { Package, Search, ClipboardCheck, Clock, Check, Truck, Home, User, type LucideIcon } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import type { Order, OrderStatus } from '../types';
import { formatRM } from '../utils/currency';

export const TrackOrder: React.FC = () => {
  const { orders, trackingQuery } = useAppContext();

  const [orderId, setOrderId] = useState(() => trackingQuery?.orderId ?? '');
  const [email, setEmail] = useState(() => trackingQuery?.email ?? '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(() => {
    if (!trackingQuery) {
      return null;
    }

    return orders.find(
      (o) => o.id.toLowerCase() === trackingQuery.orderId.toLowerCase() &&
             o.customer.email.toLowerCase() === trackingQuery.email.toLowerCase()
    ) ?? null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setMatchedOrder(null);

    const match = orders.find(
      (o) => o.id.trim().toLowerCase() === orderId.trim().toLowerCase() &&
             o.customer.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (match) {
      setMatchedOrder(match);
    } else {
      setSearchError('No active furniture order matches the specified tracking code and e-mail address combination. Please check your spelling.');
    }
  };

  const handleQuickDemoClick = (demoOrder: Order) => {
    setOrderId(demoOrder.id);
    setEmail(demoOrder.customer.email);
    setMatchedOrder(demoOrder);
    setSearchError(null);
  };

  // Milestone mapping configuration
  const milestones: { status: OrderStatus; label: string; desc: string; icon: LucideIcon }[] = [
    {
      status: 'Pending',
      label: 'Artisan Carpentry Planning',
      desc: 'Sourcing timber timbers and formulating frame assembly guides.',
      icon: Clock
    },
    {
      status: 'Processing',
      label: 'Timber Milling & Custom Upholstery',
      desc: 'Wood cuts complete, custom upholstery is being stitched by our master carpenters.',
      icon: Package
    },
    {
      status: 'Out for Delivery',
      label: 'White-Glove Van Transit',
      desc: 'Carefully wrapped furniture dispatched in secure logistics vehicle with delivery technicians.',
      icon: Truck
    },
    {
      status: 'Completed',
      label: 'Delivered & Installed',
      desc: 'Fully placed, structural verification signed, feedback recorded.',
      icon: Home
    }
  ];

  const getMilestoneIndex = (status: OrderStatus) => {
    if (status === 'Pending') return 0;
    if (status === 'Processing') return 1;
    if (status === 'Out for Delivery') return 2;
    return 3; // Completed
  };

  const activeIndex = matchedOrder ? getMilestoneIndex(matchedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Order Tracking Portal</h1>
        <p className="text-stone-500 text-sm mt-2">
          Verify carpentry, tailoring, transit, and installation details for your high-quality bespoke furniture builds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Search Input Controller Column */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-200 pb-2">
            Search Spec Parameters
          </h3>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="orderId" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider font-mono">
                Order Tracking Code
              </label>
              <input
                type="text"
                id="orderId"
                placeholder="e.g. ORD-5542"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm bg-stone-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider font-mono">
                Customer Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="e.g. aidan.g@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm bg-stone-50/50 focus:bg-white"
                required
              />
            </div>

            {searchError && (
              <p className="text-[11px] text-red-600 font-medium leading-relaxed bg-red-50 p-2.5 rounded border border-red-100">
                {searchError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2.5 px-4 rounded-md text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Search size={14} />
              <span>Validate Logistics</span>
            </button>
          </form>

          {/* Quick Demo Selector for frictionless testing */}
          <div className="pt-4 border-t border-stone-200 space-y-2.5">
            <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
              Frictionless Testing Sandbox
            </span>
            <p className="text-[11px] text-stone-500 leading-normal">
              Click any sample order currently registered in the database to load interactive trackers instantly:
            </p>
            <div className="space-y-1.5">
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => handleQuickDemoClick(o)}
                  className="w-full text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-amber-800/35 rounded px-3 py-2 text-xs flex justify-between items-center transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-stone-700 block font-mono">{o.id}</span>
                    <span className="text-[10px] text-stone-400 block truncate max-w-[150px]">{o.customer.name}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    o.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800'
                      : o.status === 'Out for Delivery'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {o.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Display Board Column */}
        <div className="lg:col-span-7">
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Main status header banner */}
              <div className="bg-amber-900 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 translate-x-5 translate-y-[-5px]">
                  <Package size={200} />
                </div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-200 block">
                  SP Enterprise Logistics Track
                </span>
                <h2 className="text-2xl font-serif font-bold mt-1">Status: {matchedOrder.status}</h2>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-amber-100">
                  <div>
                    <span>Order Date:</span> <strong className="text-white font-mono">{new Date(matchedOrder.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span>Destined for:</span> <strong className="text-white">{matchedOrder.customer.name}</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Stepper */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="font-serif font-bold text-base text-stone-800">
                  Artisan Commission Milestones
                </h3>

                <div className="relative pl-8 space-y-8 before:absolute before:top-2 before:left-[11px] before:bottom-2 before:w-[2px] before:bg-stone-200">
                  {milestones.map((m, idx) => {
                    const isPassed = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const IconComp = m.icon;

                    return (
                      <div key={m.status} className="relative group">
                        {/* Bullet indicators */}
                        <div className={`absolute left-[-29px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isPassed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isActive
                            ? 'bg-amber-800 border-amber-800 text-white shadow-md shadow-amber-800/10'
                            : 'bg-white border-stone-300 text-stone-400'
                        }`}>
                          {isPassed ? <Check size={12} className="stroke-[3]" /> : <IconComp size={10} />}
                        </div>

                        {/* Text descriptions */}
                        <div className={isActive ? 'p-1' : 'opacity-80'}>
                          <h4 className={`text-sm font-bold ${
                            isActive ? 'text-amber-900 font-serif' : isPassed ? 'text-stone-800' : 'text-stone-400'
                          }`}>
                            {m.label}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                            {m.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item Specifications Summary list */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-200/60 pb-2">
                  Materials Summary Specifications
                </h3>
                <div className="divide-y divide-stone-200">
                  {matchedOrder.items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between text-xs">
                      <div>
                        <strong className="text-stone-800 block text-xs">{item.product.name} × {item.quantity}</strong>
                        <div className="text-[10px] text-stone-500 space-y-0.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-400 uppercase font-mono text-[9px]">Finish:</span>
                            <span>{item.selectedFinish.name}</span>
                          </div>
                          {item.selectedFabric && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-stone-400 uppercase font-mono text-[9px]">Fabric:</span>
                              <span>{item.selectedFabric.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-stone-700 shrink-0 select-all">{formatRM(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between text-sm font-bold text-stone-800 border-t border-stone-200">
                  <span>Grand Total Bill</span>
                  <span className="font-serif text-amber-900 font-black">{formatRM(matchedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* White Glove Info Card */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white flex items-start space-x-3 text-xs leading-normal">
                <div className="p-2 bg-amber-50 rounded-full text-amber-800 shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">White-Glove In-Home Courier Delivery</h4>
                  <p className="text-stone-500 mt-1">
                    Your shipment is fully guarded during transit. Our premium courier service will contact you at <strong>{matchedOrder.customer.phone}</strong> approximately 24 hours prior to dispatch to log your residential delivery coordinates and book slot times.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 bg-white border border-stone-250/60 shadow-sm rounded-full flex items-center justify-center text-stone-400 mb-4 animate-bounce">
                <ClipboardCheck size={26} />
              </div>
              <h2 className="text-lg font-serif font-black text-stone-800">Ready to trace logistics</h2>
              <p className="text-stone-500 text-xs mt-2 max-w-sm">
                Supply your unique order tracking code and contact email address in the left-hand console panel to check timber milling progress and transit slot reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
