import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, FileText, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import type { CustomerDetails, Order } from '../types';
import { formatRM } from '../utils/currency';

export const Checkout: React.FC = () => {
  const { cart, createOrder, setRoute } = useAppContext();

  // Selected state for placement
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Credit/Debit Card'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const estShipping = subtotal > 1500 ? 0 : 120;
  const orderTotal = subtotal + estShipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors as user typse
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your full legal name.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid e-mail structure.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Supply a primary voice/mobile callback number.';
    if (!formData.address.trim()) newErrors.address = 'Full physical delivery destination street address is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Trigger context handler which yields randomized order sequence and saves it
    const orderObj = createOrder(formData);
    setConfirmedOrder(orderObj);
  };

  const handleCopyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // If order is successfully generated & stored, render Order Confirmation stage
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 text-emerald-600">
            <CheckCircle2 size={38} />
          </div>

          <div>
            <h1 className="text-3xl font-serif font-black text-stone-900">Order Confirmed!</h1>
            <p className="text-stone-500 text-sm mt-2">
              Thank you for choosing SP Home Furniture Enterprise. Our master carpenters have queued your materials.
            </p>
          </div>

          {/* Golden Highlight Order Voucher */}
          <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-800/15 max-w-md mx-auto text-center space-y-3">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest font-mono">
              Unique Tracking Code
            </span>
            <div className="flex items-center justify-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-amber-800/10 shadow-sm">
              <span className="font-mono text-xl font-bold text-stone-800 tracking-wider">
                {confirmedOrder.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopyToClipboard(confirmedOrder.id)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copiedId ? (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Copied!</span>
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 leading-normal">
              Copy this tracking code or check your inbox <strong>({confirmedOrder.customer.email})</strong> to view real-time production milestone progress.
            </p>
          </div>

          {/* Quick Summary of Invoice Details */}
          <div className="border-t border-b border-stone-100 py-6 max-w-lg mx-auto text-left space-y-4">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <FileText size={13} />
              <span>Assembly Snapshot</span>
            </h4>
            
            <div className="divide-y divide-stone-100">
              {confirmedOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-start text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">{item.product.name} × {item.quantity}</span>
                    <div className="text-[10px] text-stone-400 mt-0.5 space-x-1.5">
                      <span>{item.selectedFinish.name}</span>
                      {item.selectedFabric && <span>• {item.selectedFabric.name}</span>}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-700">{formatRM(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-baseline text-sm font-semibold text-stone-800 border-t border-stone-100">
              <span>Total Bill (Incl. Shipping)</span>
              <span className="font-serif font-black text-amber-900">{formatRM(confirmedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setRoute('track')}
              className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-sm transition-all shadow hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Track Production Milestone</span>
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => setRoute('showroom')}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-sm transition-all cursor-pointer"
            >
              Back to Showroom Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If looking at checkout before putting anything in cart
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-800">Your cart has no active items</h2>
        <button
          onClick={() => setRoute('showroom')}
          className="mt-4 px-4 py-2 bg-stone-950 text-white rounded text-sm cursor-pointer hover:bg-stone-800"
        >
          Return to Showroom
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => setRoute('cart')}
        className="group flex items-center space-x-2 text-stone-500 hover:text-stone-800 text-sm font-medium mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Cart Checklist</span>
      </button>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Delivery & Production Specs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-stone-800 border-b border-stone-100 pb-3">
            Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label htmlFor="name" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Robert Downey Jr."
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
              {errors.name && <p className="text-[11px] text-red-600 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. rob@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus:bg-white"
              />
              {errors.email && <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2 col-span-2">
              <label htmlFor="phone" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Primary Callback/Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="e.g. +1 555-0199"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus:bg-white"
              />
              {errors.phone && <p className="text-[11px] text-red-600 font-medium">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2 col-span-2">
              <label htmlFor="address" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Physical Delivery Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                placeholder="Street address, apartment, suite, city, state, postal code"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus:bg-white resize-none"
              />
              {errors.address && <p className="text-[11px] text-red-600 font-medium">{errors.address}</p>}
            </div>
          </div>

          <h3 className="font-serif font-bold text-lg text-stone-800 border-t border-stone-100 pt-6 pb-3">
            Payment Selection
          </h3>

          {/* Payment Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'Credit/Debit Card', title: 'Credit / Debit Card', desc: 'Secure merchant checkout' },
              { id: 'Bank Transfer', title: 'Bank Direct Wire', desc: 'Pre-production invoice routing' },
              { id: 'Installment Plan', title: '3x Installment plan', desc: 'Interest free modular payment' }
            ].map((pay) => (
              <label
                key={pay.id}
                className={`border-2 rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === pay.id
                    ? 'border-amber-800 bg-amber-50/10'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-800">{pay.title}</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pay.id}
                    checked={formData.paymentMethod === pay.id}
                    onChange={handleInputChange}
                    className="accent-amber-800"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5">{pay.desc}</span>
              </label>
            ))}
          </div>

          <div className="bg-amber-50/30 rounded-lg p-4 border border-amber-800/10 text-[11px] text-stone-600 leading-normal">
            ⚙️ <strong>Prototype Simulation Note:</strong> Submission generates a real transaction simulation in local system registers. No cold, mock charges will occur; stock levels decrease immediately to maintain active tracking metrics.
          </div>

          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-amber-800 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow transition-all duration-300 cursor-pointer text-sm tracking-wide"
          >
            <span>Lock Build Order • {formatRM(orderTotal)}</span>
          </button>
        </form>

        {/* Right Column: Mini Bill Panel */}
        <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-6 h-fit space-y-5">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-200 pb-3 flex items-center justify-between">
            <span>Assembly Checklist</span>
            <span className="text-xs bg-stone-200 px-2 py-0.5 rounded font-mono font-bold text-stone-600">{cart.length} unique</span>
          </h3>

          <div className="max-h-72 overflow-y-auto divide-y divide-stone-200 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-stone-800 truncate">{item.product.name}</span>
                  <span className="block text-[10px] text-stone-400 italic font-mono truncate">
                    {item.quantity} × {item.selectedFinish.name}
                  </span>
                  {item.selectedFabric && (
                    <span className="block text-[10px] text-stone-400 font-medium truncate">
                      ↳ Fabric: {item.selectedFabric.name}
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <span className="block font-mono text-xs font-bold text-stone-900">
                    {formatRM(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-stone-200 pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-mono text-stone-800 font-semibold">{formatRM(subtotal)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Premium Furniture Carriage</span>
              {estShipping === 0 ? (
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Free Delivery</span>
              ) : (
                <span className="font-mono text-stone-800 font-semibold">{formatRM(estShipping)}</span>
              )}
            </div>
            <div className="flex justify-between pt-3 font-serif text-base font-black text-stone-900">
              <span>Total Price</span>
              <span>{formatRM(orderTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
