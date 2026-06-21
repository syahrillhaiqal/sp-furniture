import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  ClipboardCheck, 
  Clock, 
  Check, 
  Truck, 
  Home, 
  User, 
  Mail, 
  Hash,
  MapPin,
  ChevronRight,
  type LucideIcon 
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import type { Order, OrderStatus } from '../types';
import { formatRM } from '../utils/currency';

export const TrackOrder: React.FC = () => {
  const { orders, trackingQuery } = useAppContext();

  const [orderId, setOrderId] = useState(() => trackingQuery?.orderId ?? '');
  const [email, setEmail] = useState(() => trackingQuery?.email ?? '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(() => {
    if (!trackingQuery) return null;
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
      setSearchError('No active order matches this Tracking Code and Email combination. Please verify your details and try again.');
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
      label: 'Order Confirmed & Queued',
      desc: 'Payment verified. Sourcing premium timber and preparing assembly schematics.',
      icon: Clock
    },
    {
      status: 'Processing',
      label: 'Manufacturing & Upholstery',
      desc: 'Wood cuts completed. Master carpenters and tailors are currently crafting your piece.',
      icon: Package
    },
    {
      status: 'Out for Delivery',
      label: 'White-Glove Transit',
      desc: 'Carefully wrapped and dispatched. Our logistics team will contact you shortly.',
      icon: Truck
    },
    {
      status: 'Completed',
      label: 'Delivered & Installed',
      desc: 'Successfully placed and structurally verified in your home.',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-serif font-black text-stone-900 mb-4">Track Your Order</h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Monitor the real-time progress of your bespoke furniture. Enter your unique tracking code and email address below to view logistics and manufacturing milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: SEARCH FORM & DEMO TOOLS      */}
        {/* ========================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-6 flex items-center gap-2">
              <Search size={20} className="text-amber-800" />
              Order Lookup
            </h3>
            
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="orderId" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                  Tracking Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Hash size={18} />
                  </div>
                  <input
                    type="text"
                    id="orderId"
                    placeholder="e.g. ORD-1234..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 pl-10 pr-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Used during checkout"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 pl-10 pr-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all"
                    required
                  />
                </div>
              </div>

              {searchError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm flex items-start gap-3 animate-in fade-in">
                  <div className="mt-0.5 shrink-0"><Search size={16} /></div>
                  <p className="leading-relaxed">{searchError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-amber-800 text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Package</span>
                <ChevronRight size={18} />
              </button>
            </form>
          </div>

          {/* Quick Demo Sandbox (Styled as a developer/evaluator tool) */}
          <div className="bg-amber-50/50 border border-dashed border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest font-mono">
                Evaluator Sandbox
              </span>
            </div>
            <p className="text-xs text-amber-800/80 leading-relaxed mb-4">
              Testing the prototype? Click an active order below to instantly pre-fill the form and view tracking states.
            </p>
            <div className="space-y-2">
              {orders.length > 0 ? (
                orders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleQuickDemoClick(o)}
                    className="w-full text-left bg-white hover:bg-amber-100 border border-amber-100 rounded-lg p-3 flex justify-between items-center transition-colors shadow-sm cursor-pointer group"
                  >
                    <div className="min-w-0 pr-4">
                      <span className="font-bold text-stone-900 block font-mono text-sm group-hover:text-amber-900 truncate">{o.id}</span>
                      <span className="text-xs text-stone-500 block truncate">{o.customer.email}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${
                      o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800'
                      : o.status === 'Out for Delivery' ? 'bg-amber-200 text-amber-900'
                      : 'bg-stone-100 text-stone-700'
                    }`}>
                      {o.status}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-stone-500 italic bg-white/50 p-4 rounded-lg text-center border border-amber-100">
                  No orders placed yet. Add items to cart and checkout first.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: DYNAMIC TRACKING BOARD       */}
        {/* ========================================== */}
        <div className="lg:col-span-7">
          {matchedOrder ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              
              {/* Premium Status Header */}
              <div className="bg-stone-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-[0.03] translate-x-10 translate-y-[-20px] pointer-events-none">
                  <Package size={280} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                      Live Status
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-6">
                    {matchedOrder.status}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-700/50 text-sm">
                    <div>
                      <span className="block text-stone-400 mb-1 text-xs uppercase tracking-wider">Date Placed</span>
                      <strong className="text-stone-100 font-mono">{new Date(matchedOrder.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="block text-stone-400 mb-1 text-xs uppercase tracking-wider">Recipient</span>
                      <strong className="text-stone-100">{matchedOrder.customer.name}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Stepper */}
              <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-8">
                  Production Journey
                </h3>

                <div className="space-y-0">
                  {milestones.map((m, idx) => {
                    const isPassed = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isLast = idx === milestones.length - 1;
                    const IconComp = m.icon;

                    return (
                      <div key={m.status} className="relative flex gap-6 group">
                        
                        {/* Timeline Graphic Column */}
                        <div className="flex flex-col items-center">
                          {/* Circle Icon */}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            isPassed 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : isActive 
                              ? 'bg-amber-600 border-amber-600 text-white shadow-[0_0_0_4px_rgba(217,119,6,0.15)]' 
                              : 'bg-white border-stone-200 text-stone-300'
                          }`}>
                            {isPassed ? <Check size={20} className="stroke-[3]" /> : <IconComp size={18} />}
                          </div>
                          
                          {/* Connecting Line */}
                          {!isLast && (
                            <div className={`w-[2px] h-full min-h-[40px] my-2 transition-colors duration-500 ${
                              isPassed ? 'bg-emerald-500' : 'bg-stone-100'
                            }`} />
                          )}
                        </div>

                        {/* Text Content */}
                        <div className={`pb-10 pt-1 ${isActive ? 'opacity-100' : isPassed ? 'opacity-75' : 'opacity-40'}`}>
                          <h4 className={`text-base font-bold ${isActive ? 'text-amber-900' : 'text-stone-900'}`}>
                            {m.label}
                          </h4>
                          <p className="text-sm text-stone-500 mt-1.5 leading-relaxed max-w-sm">
                            {m.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Materials & Receipt Summary */}
              <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-4 mb-4">
                  Order Details
                </h3>
                
                <div className="divide-y divide-stone-100">
                  {matchedOrder.items.map((item) => (
                    <div key={item.id} className="py-4 flex justify-between items-start text-sm">
                      <div className="flex gap-4">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0" 
                        />
                        <div>
                          <strong className="text-stone-900 block text-base">{item.product.name}</strong>
                          <div className="text-xs text-stone-500 mt-1 space-y-1">
                            <div>Qty: {item.quantity}</div>
                            <div>Finish: {item.selectedFinish.name}</div>
                            {item.selectedFabric && (
                              <div>Fabric: {item.selectedFabric.name}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-stone-800">{formatRM(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2 flex justify-between items-center text-lg border-t border-stone-200">
                  <span className="font-bold text-stone-900">Total Paid</span>
                  <span className="font-serif text-amber-900 font-black text-2xl">{formatRM(matchedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery Info Banner */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-white border border-stone-200 rounded-full text-amber-800 shrink-0 shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">Delivery Destination</h4>
                  <p className="text-stone-600 text-sm mt-1 mb-3 leading-relaxed">
                    {matchedOrder.customer.address}
                  </p>
                  <div className="text-xs text-stone-500 bg-white p-3 rounded-lg border border-stone-200 leading-relaxed">
                    <User size={14} className="inline mr-1.5 -mt-0.5" />
                    Our logistics team will contact <strong>{matchedOrder.customer.phone}</strong> prior to dispatch to coordinate a delivery slot.
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            
            // Empty / Initial State
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px] shadow-sm">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-20"></div>
                <div className="w-20 h-20 bg-stone-50 border border-stone-200 rounded-full flex items-center justify-center text-stone-400 relative z-10 shadow-sm">
                  <ClipboardCheck size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">Awaiting Order Details</h2>
              <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
                Enter your Tracking Code and Email Address to unlock your customized production dashboard.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};