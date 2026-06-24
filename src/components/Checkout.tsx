import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  ShoppingCart
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import type { CustomerDetails, Order } from '../types';
import { formatRM } from '../utils/currency';

export const Checkout: React.FC = () => {
  const { cart, createOrder, setRoute } = useAppContext();

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
    if (!formData.name.trim()) newErrors.name = 'Full legal name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid e-mail structure.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Mobile/Contact number is required.';
    if (!formData.address.trim()) newErrors.address = 'Full physical delivery address is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderObj = createOrder(formData);
    setConfirmedOrder(orderObj);
  };

  const handleCopyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Payment Options Configuration with Logos
  const paymentOptions = [
    {
      id: 'Credit/Debit Card',
      title: 'Credit / Debit Card',
      desc: 'Securely processed via Stripe',
      logos: (
        <div className="flex items-center gap-1.5">
          {/* Visa Logo */}
          <div className="bg-white border border-stone-200 px-1.5 py-1 rounded flex items-center justify-center h-6 w-10 shadow-sm">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/020/975/570/small/visa-logo-visa-icon-transparent-free-png.png" 
              alt="Visa" 
              className="object-contain" 
            />
          </div>
          {/* Mastercard Logo */}
          <div className="bg-white border border-stone-200 px-1.5 py-1 rounded flex items-center justify-center h-6 w-10 shadow-sm">
            <img 
              src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" 
              alt="Mastercard" 
              className="object-contain" 
            />
          </div>
        </div>
      )
    },
    {
      id: 'Bank Transfer',
      title: 'Online Banking (FPX)',
      desc: 'Direct transfer from local banks',
      logos: (
        <div className="bg-white border border-stone-200 px-2 py-1 rounded flex items-center justify-center h-6 shadow-sm">
          {/* FPX Logo simulation */}
          <span className="font-black italic text-blue-600 text-[11px] tracking-tight flex items-center">
            FPX
          </span>
        </div>
      )
    }
  ];

  // ==========================================
  // VIEW: ORDER CONFIRMATION
  // ==========================================
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xl p-8 sm:p-12 text-center relative">
          
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 to-amber-900"></div>

          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 text-emerald-600 shadow-sm">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-serif font-black text-stone-900">Order Confirmed</h1>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              Thank you for choosing SP Home. Our master carpenters have been notified and are queueing your materials.
            </p>
          </div>

          {/* Golden Highlight Order Voucher */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl max-w-sm mx-auto text-center space-y-4 mb-8">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest font-mono">
              Official Tracking Code
            </span>
            <div className="flex items-center justify-center space-x-2 bg-white px-4 py-3 rounded-lg border border-amber-200 shadow-sm">
              <span className="font-mono text-xl font-bold text-stone-800 tracking-wider">
                {confirmedOrder.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopyToClipboard(confirmedOrder.id)}
                className="text-stone-400 hover:text-stone-800 p-1.5 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copiedId ? (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">Copied</span>
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="text-xs text-amber-800/80 leading-normal">
              A receipt has been sent to <strong>{confirmedOrder.customer.email}</strong>
            </p>
          </div>

          {/* Receipt Breakdown */}
          <div className="border-t border-dashed border-stone-300 pt-6 max-w-md mx-auto text-left space-y-4">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <FileText size={14} />
              <span>Purchase Summary</span>
            </h4>
            
            <div className="divide-y divide-stone-100">
              {confirmedOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-start text-sm">
                  <div>
                    <span className="font-semibold text-stone-800">{item.product.name} × {item.quantity}</span>
                    <div className="text-[11px] text-stone-500 mt-1 space-x-1.5">
                      <span>Finish: {item.selectedFinish.name}</span>
                      {item.selectedFabric && <span>• Fabric: {item.selectedFabric.name}</span>}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-700">{formatRM(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-baseline text-base font-bold text-stone-900 border-t border-stone-200">
              <span>Total Paid</span>
              <span className="font-serif font-black text-amber-900 text-lg">{formatRM(confirmedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="pt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setRoute('track')}
              className="px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Track Your Order</span>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setRoute('showroom')}
              className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-sm transition-all cursor-pointer"
            >
              Back to Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: EMPTY CART FALLBACK
  // ==========================================
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
          <ShoppingCart size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-stone-900">Your cart is empty</h2>
          <p className="text-stone-500 mt-2 text-sm">Add some beautiful pieces to your cart before proceeding to checkout.</p>
        </div>
        <button
          onClick={() => setRoute('showroom')}
          className="mt-6 px-8 py-3 bg-stone-900 text-white font-bold rounded-lg text-sm cursor-pointer hover:bg-amber-800 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Return to Showroom
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN CHECKOUT FORM
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Navigation */}
      <button
        onClick={() => setRoute('cart')}
        className="group flex items-center space-x-2 text-stone-500 hover:text-stone-900 text-sm font-semibold mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Cart</span>
      </button>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-serif font-black text-stone-900">Secure Checkout</h1>
        <ShieldCheck size={28} className="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: FORM DETAILS                  */}
        {/* ========================================== */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Section 1: Customer Logistics */}
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">1</span>
                Delivery Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all ${errors.name ? 'border-red-400 focus:ring-red-500' : 'border-stone-300'}`}
                  />
                  {errors.name && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all ${errors.email ? 'border-red-400 focus:ring-red-500' : 'border-stone-300'}`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="phone" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g. +60 12-345 6789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all ${errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-stone-300'}`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="address" className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                    Physical Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Street address, unit, city, state, postal code"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all resize-none ${errors.address ? 'border-red-400 focus:ring-red-500' : 'border-stone-300'}`}
                  />
                  {errors.address && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Section 2: Payment Details */}
            <div>
              <div className="flex justify-between items-end mb-5">
                <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">2</span>
                  Payment Method
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <Lock size={12} /> 256-bit Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map((pay) => (
                  <label
                    key={pay.id}
                    className={`border-2 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                      formData.paymentMethod === pay.id
                        ? 'border-amber-800 bg-amber-50/30'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="block text-sm font-bold text-stone-900">{pay.title}</span>
                        <span className="block text-xs text-stone-500 mt-0.5">{pay.desc}</span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pay.id}
                        checked={formData.paymentMethod === pay.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-800 mt-1 cursor-pointer"
                      />
                    </div>
                    {/* Render specific logos for the payment method */}
                    <div className="mt-2">
                      {pay.logos}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 bg-stone-50 rounded-lg p-4 border border-stone-200 text-xs text-stone-500 leading-relaxed flex gap-3">
                <ShieldCheck size={20} className="text-stone-400 shrink-0" />
                <p>
                  <strong>Prototype Simulation Note:</strong> Submission generates a real transaction simulation in the system registers. No actual charges will occur, but inventory levels will decrease dynamically.
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-amber-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-base tracking-wide"
              >
                <Lock size={18} />
                <span>Confirm Purchase • {formatRM(orderTotal)}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: STICKY ORDER SUMMARY         */}
        {/* ========================================== */}
        <div className="lg:col-span-5 relative">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 lg:p-8 sticky top-24 shadow-sm">
            
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-6 flex items-center justify-between">
              Order Summary
              <span className="bg-stone-200 text-stone-700 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                {cart.length} item{cart.length !== 1 ? 's' : ''}
              </span>
            </h3>

            {/* Items List */}
            <div className="max-h-[40vh] overflow-y-auto divide-y divide-stone-200 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 flex gap-4">
                  <div className="w-16 h-16 rounded-lg border border-stone-200 overflow-hidden shrink-0 bg-white">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="block text-sm font-bold text-stone-900 truncate">{item.product.name}</span>
                    <div className="text-xs text-stone-500 mt-1">
                      Qty: {item.quantity} • {item.selectedFinish.name}
                      {item.selectedFabric && <span> • {item.selectedFabric.name}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right flex flex-col justify-center">
                    <span className="block font-mono text-sm font-bold text-stone-900">
                      {formatRM(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-stone-200 pt-5 mt-2 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-semibold">{formatRM(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping & Handling</span>
                {estShipping === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                    Free Standard
                  </span>
                ) : (
                  <span className="font-mono text-stone-900 font-semibold">{formatRM(estShipping)}</span>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <span className="text-base font-bold text-stone-900">Total</span>
                <span className="font-serif text-2xl font-black text-amber-900">
                  {formatRM(orderTotal)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};