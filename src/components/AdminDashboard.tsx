import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Boxes,
  ClipboardList,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  Send,
  LogOut,
  ChevronRight,
  Sparkles,
  BarChart3,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Tag
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Product, OrderStatus, Order, CustomOption } from '../types';
import { WOOD_FINISHES, FABRICS } from '../data';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    inventory,
    orders,
    adminTab,
    setAdminTab,
    addProduct,
    editProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    triggerEmailUpdate,
    logout,
    setRoute
  } = useAppContext();

  // Dialog & Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<'Living Room' | 'Dining Room' | 'Bedroom' | 'Office' | 'Outdoor'>('Living Room');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDim, setFormDim] = useState('W: 40" x D: 40" x H: 30"');
  const [formMat, setFormMat] = useState('Solid Oak Structure');
  const [formWarranty, setFormWarranty] = useState('5-Year Frame Warranty');
  const [formCustomizable, setFormCustomizable] = useState(true);

  // Status Email Simulated Alerts
  const [simulatedEmailAlert, setSimulatedEmailAlert] = useState<{ show: boolean; msg: string } | null>(null);

  // Handle Form Open for Add
  const openAddForm = () => {
    setEditingProductId(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Living Room');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=800');
    setFormDim('W: 40" x D: 40" x H: 30"');
    setFormMat('Genuine Oak Timber');
    setFormWarranty('5-Year Standard structural warranty');
    setFormCustomizable(true);
    setShowProductForm(true);
  };

  // Handle Form Open for Edit
  const openEditForm = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormPrice(prod.price.toString());
    setFormCategory(prod.category);
    setFormDescription(prod.description);
    setFormImage(prod.image);
    setFormDim(prod.specs.dimensions);
    setFormMat(prod.specs.material);
    setFormWarranty(prod.specs.warranty);
    setFormCustomizable(prod.customizable);
    setShowProductForm(true);
  };

  // Submit Product Form
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 0;

    const payload = {
      name: formName || 'Unnamed Custom Creation',
      price: priceNum,
      category: formCategory,
      description: formDescription || 'Genuine hand finished wood design.',
      image: formImage || 'https://picsum.photos/seed/oak/800/600',
      specs: {
        dimensions: formDim,
        material: formMat,
        warranty: formWarranty
      },
      customizable: formCustomizable
    };

    if (editingProductId) {
      editProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setShowProductForm(false);
    setEditingProductId(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"? This removes it from inventory & catalog views.`)) {
      deleteProduct(id);
    }
  };

  // Trigger Mock Email dispatch alert
  const handleEmailTrigger = (o: Order) => {
    triggerEmailUpdate(o.id);
    setSimulatedEmailAlert({
      show: true,
      msg: `Simulation Succeeded: Automated milestones email sent to ${o.customer.name} (${o.customer.email}) regarding Order ${o.id}! Status is currently "${o.status}".`
    });

    // Clear simulated alert automatically
    setTimeout(() => {
      setSimulatedEmailAlert(null);
    }, 4500);
  };

  // ----------------------------------------------------
  // Dynamic Business Reports Calculation Logic
  // ----------------------------------------------------
  const grossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const avgOrderValue = orders.length > 0 ? Math.round(grossSales / orders.length) : 0;
  
  // High stock warn list counts
  const lowStockProductsCount = inventory.filter((inv) => {
    const p = products.find((prod) => prod.id === inv.productId);
    return inv.stockLevel <= inv.reorderPoint;
  }).length;

  // Sells by Category calculations for analytics SVG
  const categorySalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const cat = item.product.category;
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.totalPrice;
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* simulated active alert at top level */}
      {simulatedEmailAlert && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-center justify-between shadow animate-bounce">
          <div className="flex items-center gap-2.5 text-xs font-semibold leading-relaxed">
            <Sparkles size={16} className="text-emerald-600 animate-pulse" />
            <span>{simulatedEmailAlert.msg}</span>
          </div>
          <button
            onClick={() => setSimulatedEmailAlert(null)}
            className="text-[10px] text-emerald-600 hover:text-emerald-950 underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Header Admin section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-red-50 text-red-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-red-100">
              Admin mode
            </span>
            <span className="text-xs text-stone-400 font-mono">ID: SPH-ENTERPRISE-TERM</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Executive Operations Terminal   
          </h1>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <button
            onClick={() => setRoute('home')}
            className="text-stone-500 hover:text-stone-800 hover:bg-stone-50 px-3.5 py-1.5 rounded-lg border border-stone-300 transition-colors text-xs font-semibold cursor-pointer"
          >
            Go to Customer Storefront
          </button>
          
          <button
            onClick={() => {
              logout();
              setRoute('home');
            }}
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Close Console</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Widgets Navigation */}
        <aside className="lg:col-span-3 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-stone-50 border-b border-stone-200 p-4">
                <span className="block text-serif font-serif font-black text-stone-900 text-sm">SP Home Executive HUD</span>
            <span className="block text-[10px] text-stone-400 uppercase font-mono tracking-wider mt-0.5">Control Categories</span>
          </div>

          <div className="p-2 space-y-1">
            {[
              { id: 'reports', label: 'Business Reports & Metrics', icon: BarChart3 },
              { id: 'products', label: 'Product Catalog Editor', icon: Tag },
              { id: 'inventory', label: 'Showroom Stock Levels', icon: Boxes },
              { id: 'orders', label: 'Customer Order Pipeline', icon: ClipboardList }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = adminTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`w-full text-left font-sans text-xs font-semibold uppercase tracking-wider py-3.5 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <TabIcon size={15} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight size={12} className={isActive ? 'opacity-100' : 'opacity-40'} />
                </button>
              );
            })}
          </div>

          {/* Quick Staff Checklist */}
          <div className="border-t border-stone-100 p-4 bg-stone-50/50 space-y-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
              Staff Task Checklist
            </span>
            <ul className="text-[11px] text-stone-500 space-y-2">
              <li className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-[8px] font-bold font-mono">✓</div>
                <span>Sync with timber suppliers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-250 flex items-center justify-center text-amber-800 text-[8px] font-bold font-mono">!</div>
                <span>Low stock audit: <strong className="text-amber-900">{lowStockProductsCount} items</strong></span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-400 font-medium">
                <div className="w-3.5 h-3.5 rounded border border-stone-300 flex items-center justify-center text-stone-400 text-[8px] font-mono"></div>
                <span>Draft custom catalogue</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Console Panel Stage View */}
        <div className="lg:col-span-9 bg-stone-50/40 rounded-xl space-y-6">
          
          {/* ==============================================
              TAB E1: BUSINESS REPORTS
             ============================================== */}
          {adminTab === 'reports' && (
            <div className="space-y-6">
              {/* Financial Dashboard HUD Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric Card 1: Gross Revenue */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Gross Sales Volume</span>
                    <DollarSign size={16} className="text-stone-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-stone-904">
                    ${grossSales.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    🚀 Fully calculated gross aggregate
                  </p>
                </div>

                {/* Metric Card 2: closed orders */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Closed Orders</span>
                    <ShoppingCart size={16} className="text-stone-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-stone-900">
                    {completedOrdersCount} / {orders.length}
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">
                    {pendingOrdersCount} orders pending assembly
                  </p>
                </div>

                {/* Metric Card 3: Stock warnings */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Low Stock Warnings</span>
                    <AlertTriangle size={16} className="text-amber-600" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-800">
                    {lowStockProductsCount} items
                  </div>
                  <p className="text-[10px] text-stone-400 font-semibold">
                    Requires timber restocking
                  </p>
                </div>

                {/* Metric Card 4: Average ticket order value */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Avg Order Value</span>
                    <TrendingUp size={16} className="text-stone-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-stone-900">
                    ${avgOrderValue.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    Consistent performance index
                  </p>
                </div>
              </div>

              {/* Dynamic SVG Sales Graph display */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Dynamic Category Performance Snapshot
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Visual representation of custom furniture orders calculated across registered clients:
                  </p>
                </div>

                {/* Simulated Gorgeous Bar Chart */}
                <div className="space-y-4">
                  {['Living Room', 'Dining Room', 'Bedroom', 'Office', 'Outdoor'].map((cat) => {
                    const salesAmount = categorySalesMap[cat] || 0;
                    // Max sales placeholder bound to scale bars nicely
                    const maxScaleVal = Math.max(...Object.values(categorySalesMap), 2000);
                    const percentage = maxScaleVal > 0 ? (salesAmount / maxScaleVal) * 100 : 0;

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-700">{cat} Collection</span>
                          <span className="font-mono font-bold text-stone-900">${salesAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-stone-100 h-6.5 rounded overflow-hidden flex items-center pr-2">
                          <div
                            style={{ width: `${Math.max(4, percentage)}%` }}
                            className="bg-amber-800 h-full transition-all duration-1000 flex items-center px-2.5"
                          >
                            {salesAmount > 0 && (
                              <span className="text-[10px] text-amber-100 font-mono font-black">
                                {Math.round(percentage)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Orders Snap Table */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <span className="block font-serif font-bold text-stone-850 text-base mb-3.5">Log of Live Order Registers</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-stone-200">
                    <thead>
                      <tr className="text-stone-400 font-mono tracking-wider text-[10px] uppercase">
                        <th className="pb-3 font-semibold">User ID</th>
                        <th className="pb-3 font-semibold">Client Name</th>
                        <th className="pb-3 font-semibold">Date Placed</th>
                        <th className="pb-3 font-semibold">Bill Sum</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 text-stone-605">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 font-mono font-bold text-amber-900 select-all">{o.id}</td>
                          <td className="py-2.5 font-semibold text-stone-800">{o.customer.name}</td>
                          <td className="py-2.5 font-mono text-stone-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 font-bold font-mono">${o.totalAmount.toLocaleString()}</td>
                          <td className="py-2.5 text-right font-medium text-stone-700">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800'
                                : o.status === 'Out for Delivery'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB E2: PRODUCT CATALOG EDITOR
             ============================================== */}
          {adminTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 border border-stone-200 rounded-xl shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Showroom Product Database
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Manage active furniture listings, pricing structures, customizable flags, and structural technical specifications.
                  </p>
                </div>
                <button
                  onClick={openAddForm}
                  className="bg-amber-800 hover:bg-amber-900 text-white rounded-md px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Furniture Listing</span>
                </button>
              </div>

              {/* Product list editor grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 hover:shadow transition-shadow">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-50"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold uppercase text-stone-400">ID: {prod.id}</span>
                          <span className="text-[9px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {prod.category}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-1" title={prod.name}>
                          {prod.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-amber-900 mt-1">
                          Base: ${prod.price.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{prod.description}</p>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100/50 mt-2">
                        <button
                          onClick={() => openEditForm(prod)}
                          className="p-1 px-2.5 border border-stone-200 hover:border-amber-800 rounded text-[10px] font-semibold text-stone-600 hover:text-amber-805 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 size={10} />
                          <span>Edit Details</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prod.id, prod.name)}
                          className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-[10px] text-red-750 font-semibold rounded hover:text-red-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRODUCT ADD/EDIT DRAWER OVERLAY */}
              {showProductForm && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-5">
                    <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
                      <h3 className="font-serif font-bold text-xl text-stone-900">
                        {editingProductId ? 'Edit Product Parameters' : 'Add Showroom Entry Product'}
                      </h3>
                      <button
                        onClick={() => setShowProductForm(false)}
                        className="text-stone-400 hover:text-stone-750 font-bold uppercase text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Product Name</label>
                          <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm"
                            required
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5 col-span-1">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Category</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as any)}
                            className="w-full rounded border border-stone-300 p-2 text-sm bg-white"
                          >
                            <option value="Living Room">Living Room</option>
                            <option value="Dining Room">Dining Room</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Office">Office</option>
                            <option value="Outdoor">Outdoor</option>
                          </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5 col-span-1">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Base Price ($)</label>
                          <input
                            type="number"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Detail Description</label>
                          <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded border border-stone-300 p-2 text-sm resize-none"
                            required
                          />
                        </div>

                        {/* Image URL placeholder */}
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Image Asset Link (Unsplash CDN recommendation)</label>
                          <input
                            type="text"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm font-mono"
                          />
                        </div>

                        {/* Technical Specs Dimensions */}
                        <div className="space-y-1.5">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Technical Dimensions</label>
                          <input
                            type="text"
                            value={formDim}
                            onChange={(e) => setFormDim(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm"
                          />
                        </div>

                        {/* Tech materials */}
                        <div className="space-y-1.5">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Structural Materials</label>
                          <input
                            type="text"
                            value={formMat}
                            onChange={(e) => setFormMat(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm"
                          />
                        </div>

                        {/* Warranty */}
                        <div className="space-y-1.5">
                          <label className="block font-bold text-stone-700 uppercase tracking-wider font-mono">Coverage Warranty</label>
                          <input
                            type="text"
                            value={formWarranty}
                            onChange={(e) => setFormWarranty(e.target.value)}
                            className="w-full rounded border border-stone-300 p-2 text-sm"
                          />
                        </div>

                        {/* Customizable finish */}
                        <div className="space-y-1.5 flex items-center col-span-1 pt-5">
                          <label className="flex items-center space-x-2.5 font-bold text-stone-700 uppercase tracking-wider font-mono cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formCustomizable}
                              onChange={(e) => setFormCustomizable(e.target.checked)}
                              className="w-4.5 h-4.5 rounded border-stone-300 text-amber-850 focus:ring-0"
                            />
                            <span>Enable Wood Customizing</span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowProductForm(false)}
                          className="px-4 py-2 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 cursor-pointer font-medium"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 cursor-pointer font-bold"
                        >
                          Commit Entry
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================
              TAB E3: SHOWROOM STOCK LEVELS
             ============================================== */}
          {adminTab === 'inventory' && (
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Showroom Inventory & Reorder Management
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  Adjust active stock count metrics directly. If stock level is less than or equal to safety reorder markers, warning highlights are triggered automatically.
                </p>
              </div>

              {/* Interactive inventory table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left divide-y divide-stone-200">
                  <thead>
                    <tr className="text-stone-400 font-mono text-[10px] uppercase tracking-wider">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3 text-center">In-Stock Count</th>
                      <th className="pb-3 text-center">Safety Reorder Marker</th>
                      <th className="pb-3 text-right">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {inventory.map((inv) => {
                      const p = products.find((prod) => prod.id === inv.productId);
                      if (!p) return null;

                      const isAtRisk = inv.stockLevel <= inv.reorderPoint;
                      const isOutOfStock = inv.stockLevel === 0;

                      return (
                        <tr key={inv.productId} className="hover:bg-stone-50/50">
                          <td className="py-4 font-serif font-semibold text-stone-800">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 object-cover rounded border"
                              />
                              <div>
                                <span className="block font-medium text-stone-850 truncate max-w-[250px]">{p.name}</span>
                                <span className="block text-[10px] font-mono text-stone-400">ID: {inv.productId}</span>
                              </div>
                            </div>
                          </td>

                          {/* Stock adjusting controllers */}
                          <td className="py-4 text-center">
                            <div className="inline-flex items-center space-x-2 border rounded border-stone-250 bg-stone-50 overflow-hidden">
                              <button
                                onClick={() => updateStock(inv.productId, inv.stockLevel - 1)}
                                className="px-2.5 py-1 text-stone-500 hover:bg-stone-150 font-bold transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-stone-800 px-3 w-8 inline-block select-all text-center">
                                {inv.stockLevel}
                              </span>
                              <button
                                onClick={() => updateStock(inv.productId, inv.stockLevel + 1)}
                                className="px-2.5 py-1 text-stone-500 hover:bg-stone-150 font-bold transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-4 text-center font-mono font-semibold text-stone-500">
                            {inv.reorderPoint} units
                          </td>

                          <td className="py-4 text-right">
                            {isOutOfStock ? (
                              <span className="bg-red-100 text-red-900 border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                OOS - Core Blocked
                              </span>
                            ) : isAtRisk ? (
                              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                Sourcing Needed
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-950 border border-emerald-250 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                Healthy Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB E4: CUSTOMER ORDER PIPELINE
             ============================================== */}
          {adminTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-sm">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Artisan Commission Ordering Pipeline
                </h3>
                <p className="text-stone-500 text-xs mt-1">
                  Review and dispatch orders, alter carpentry milestone states (Pending → Processing → Out for Delivery → Completed), and simulate electronic client notification routines.
                </p>
              </div>

              {/* Order pipeline listings */}
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-stone-100 pb-3 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm text-amber-900 select-all">{o.id}</span>
                          <span className="text-[10px] text-stone-400 font-mono">• {new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5 font-medium">
                          Placed by <strong className="text-stone-700">{o.customer.name}</strong> ({o.customer.email})
                        </span>
                      </div>

                      {/* Status selectors dropdown */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Stage:</span>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="rounded border border-stone-300 text-xs font-semibold py-1 px-2.5 bg-stone-50 hover:bg-white text-stone-850 outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending Planning</option>
                          <option value="Processing">Processing Milling</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed Installation</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer details body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-stone-400 font-mono uppercase text-[9px] block">Customer Logistics</span>
                        <p className="text-stone-700 font-medium mt-1">{o.customer.name}</p>
                        <p className="text-stone-500 mt-0.5">{o.customer.phone}</p>
                        <p className="text-stone-500 font-sans mt-0.5">{o.customer.address}</p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-400 font-mono uppercase text-[9px] block">Item Commission Breakdown</span>
                        <div className="mt-1 space-y-1.5">
                          {o.items.map((item) => (
                            <div key={item.id} className="text-stone-700 font-medium leading-normal">
                              {item.product.name} × {item.quantity}
                              <span className="block text-[10px] text-stone-400 font-semibold font-mono">
                                ↳ {item.selectedFinish.name} {item.selectedFabric ? ` / ${item.selectedFabric.name}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-stone-50 rounded-lg p-3 border flex flex-col justify-between h-full">
                        <div>
                          <span className="font-bold text-stone-400 font-mono uppercase text-[9px] block">Finance Snap</span>
                          <span className="font-serif font-black text-stone-900 text-base mt-0.5 block">
                            ${o.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-500 italic block mt-0.5">Paid via {o.customer.paymentMethod}</span>
                        </div>

                        {/* Simulate notify email trigger */}
                        <div className="pt-2 border-t border-stone-200 mt-2 flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => handleEmailTrigger(o)}
                            className="bg-stone-900 hover:bg-amber-800 text-white font-bold py-1.5 px-3 rounded text-[10px] flex items-center space-x-1.5 cursor-pointer ml-auto transition-colors"
                          >
                            <Send size={10} />
                            <span>Notify Client Email</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
