import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Boxes,
  ClipboardList,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Send,
  LogOut,
  ChevronRight,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Tag,
  CheckCircle2,
  PackageSearch,
  LayoutDashboard,
  Check,
  X
} from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import type { Product, OrderStatus, Order } from '../types';
import { formatRM } from '../utils/currency';

type AdminFormCategory = 'Living Room' | 'Dining Room' | 'Bedroom' | 'Office' | 'Outdoor';

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

  const adminTabs = [
    { id: 'reports', label: 'Business Analytics', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: Tag },
    { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
    { id: 'orders', label: 'Customer Orders', icon: ClipboardList }
  ] as const;

  // Dialog & Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<AdminFormCategory>('Living Room');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDim, setFormDim] = useState('W: 40" x D: 40" x H: 30"');
  const [formMat, setFormMat] = useState('Solid Oak Structure');
  const [formWarranty, setFormWarranty] = useState('5-Year Frame Warranty');
  const [formCustomizable, setFormCustomizable] = useState(true);

  // Status Email Simulated Alerts
  const [simulatedEmailAlert, setSimulatedEmailAlert] = useState<{ show: boolean; msg: string } | null>(null);

  // NEW: Inventory Draft State
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});

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
    if (confirm(`Are you sure you want to permanently delete "${name}"? This updates the catalog immediately.`)) {
      deleteProduct(id);
    }
  };

  // Trigger Mock Email dispatch alert (Workflow Step 7)
  const handleEmailTrigger = (o: Order) => {
    triggerEmailUpdate(o.id);
    setSimulatedEmailAlert({
      show: true,
      msg: `Automated dispatch: Tracking email sent to ${o.customer.email}. Status registered as [${o.status}].`
    });

    setTimeout(() => {
      setSimulatedEmailAlert(null);
    }, 4500);
  };

  // --- Inventory Draft Handlers ---
  const handleDraftChange = (productId: string, newValue: number) => {
    setStockDrafts((prev) => ({
      ...prev,
      [productId]: Math.max(0, newValue) // Prevent negative stock
    }));
  };

  const commitStock = (productId: string) => {
    const draftValue = stockDrafts[productId];
    if (draftValue !== undefined) {
      updateStock(productId, draftValue);
      setStockDrafts((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  const discardStock = (productId: string) => {
    setStockDrafts((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  // ----------------------------------------------------
  // Dynamic Business Reports Calculation Logic (Workflow Step 8)
  // ----------------------------------------------------
  const grossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const avgOrderValue = orders.length > 0 ? Math.round(grossSales / orders.length) : 0;
  
  const lowStockProductsCount = inventory.filter((inv) => inv.stockLevel <= inv.reorderPoint).length;

  // Calculate Popular Products and Category Sales
  const { categorySalesMap, popularProducts } = useMemo(() => {
    const catMap: Record<string, number> = {};
    const prodCountMap: Record<string, { name: string; count: number; revenue: number }> = {};

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.product.category;
        const prodId = item.product.id;
        
        catMap[cat] = (catMap[cat] || 0) + item.totalPrice;
        
        if (!prodCountMap[prodId]) {
          prodCountMap[prodId] = { name: item.product.name, count: 0, revenue: 0 };
        }
        prodCountMap[prodId].count += item.quantity;
        prodCountMap[prodId].revenue += item.totalPrice;
      });
    });

    const topProducts = Object.values(prodCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return { categorySalesMap: catMap, popularProducts: topProducts };
  }, [orders]);

  const maxCategorySales = Math.max(...Object.values(categorySalesMap), 1000);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* ==============================================
        SIDEBAR NAVIGATION (Classic Admin Layout)
        ============================================== 
      */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <Boxes size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">SP HOME ADMIN</h1>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Operations Portal</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = adminTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md font-medium'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TabIcon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </div>
                {isActive && <ChevronRight size={14} opacity={0.8} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => {
              logout();
              setRoute('home');
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ==============================================
        MAIN CONTENT AREA
        ============================================== 
      */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Live Environment
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          
          {/* Notification Banner */}
          {simulatedEmailAlert && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-900">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>{simulatedEmailAlert.msg}</span>
              </div>
              <button onClick={() => setSimulatedEmailAlert(null)} className="text-xs text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-wider cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* ==============================================
              TAB 1: BUSINESS REPORTS
             ============================================== */}
          {adminTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900">Business Analytics Overview</h2>
                <p className="text-slate-500 text-sm mt-1">Real-time metrics, product performance, and sales data.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign size={18} /></div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{formatRM(grossSales)}</div>
                  <p className="text-xs text-slate-500 mt-2">Lifetime aggregate</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider">Orders Processed</span>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShoppingCart size={18} /></div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
                  <p className="text-xs text-slate-500 mt-2">
                    <span className="text-emerald-600 font-medium">{completedOrdersCount} completed</span> / {pendingOrdersCount} pending
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider">Inventory Alerts</span>
                    <div className={`p-2 rounded-lg ${lowStockProductsCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                      <AlertTriangle size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{lowStockProductsCount}</div>
                  <p className="text-xs text-slate-500 mt-2">Products at or below reorder point</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><TrendingUp size={18} /></div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{formatRM(avgOrderValue)}</div>
                  <p className="text-xs text-slate-500 mt-2">Per transaction average</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CSS Bar Chart - Sales by Category */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">Revenue by Category</h3>
                  
                  <div className="flex items-end h-64 gap-4 px-2 select-none">
                    {['Living Room', 'Dining Room', 'Bedroom', 'Office', 'Outdoor'].map((cat) => {
                    const amount = categorySalesMap[cat] || 0;
                    const heightPercent = maxCategorySales > 0 ? (amount / maxCategorySales) * 100 : 0;
                    
                    return (
                        <div key={cat} className="flex-1 flex flex-col justify-end h-full group">
                        
                        {/* Tooltip / Hover value info */}
                        <div className="text-center text-[10px] font-bold text-slate-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {formatRM(amount)}
                        </div>
                        
                        {/* The Actual Graphic Bar */}
                        <div 
                            className="bg-amber-600 hover:bg-amber-500 w-full rounded-t-md transition-all duration-500"
                            style={{ height: `${Math.max(4, heightPercent)}%` }} 
                        />
                        
                        {/* Label text */}
                        <div className="mt-4 text-center text-xs font-medium text-slate-500 border-t border-slate-100 pt-3 shrink-0">
                            {cat.split(' ')[0]}
                        </div>
                        </div>
                    );
                    })}
                  </div>
                </div>

                {/* Popular Products List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center justify-between">
                    Top Performing Items
                    <BarChart3 size={18} className="text-slate-400" />
                  </h3>
                  
                  {popularProducts.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {popularProducts.map((prod, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate" title={prod.name}>{prod.name}</p>
                            <p className="text-xs text-slate-500">{prod.count} units sold</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-900 text-sm">{formatRM(prod.revenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
                      <PackageSearch size={32} className="mb-2 opacity-20" />
                      No sales data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 2: PRODUCT MANAGEMENT
             ============================================== */}
          {adminTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Product Catalog Management</h2>
                  <p className="text-slate-500 text-sm mt-1">Add new furniture items, edit details, or remove discontinued lines.</p>
                </div>
                <button
                  onClick={openAddForm}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center space-x-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add New Furniture</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Product Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Base Price</th>
                        <th className="px-6 py-4">Customizable</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                              <div>
                                <div className="font-bold text-slate-900">{prod.name}</div>
                                <div className="text-xs text-slate-500 font-mono">ID: {prod.id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                              {prod.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {formatRM(prod.price)}
                          </td>
                          <td className="px-6 py-4">
                            {prod.customizable ? (
                              <span className="text-emerald-600 flex items-center gap-1.5 text-xs font-semibold">
                                <CheckCircle2 size={14} /> Yes
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-medium">No</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditForm(prod)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" title="Edit Product">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteClick(prod.id, prod.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Product">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PRODUCT FORM MODAL */}
              {showProductForm && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-900">
                        {editingProductId ? 'Edit Product Details' : 'Add New Furniture Entry'}
                      </h3>
                      <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-900 font-medium text-sm">
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-5 text-sm">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-slate-700">Product Name</label>
                          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" required />
                        </div>
                        <div className="space-y-1.5 col-span-1">
                          <label className="block font-bold text-slate-700">Category</label>
                          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as AdminFormCategory)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none bg-white">
                            <option value="Living Room">Living Room</option>
                            <option value="Dining Room">Dining Room</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Office">Office</option>
                            <option value="Outdoor">Outdoor</option>
                          </select>
                        </div>
                        <div className="space-y-1.5 col-span-1">
                          <label className="block font-bold text-slate-700">Base Price (RM)</label>
                          <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none" required />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-slate-700">Detailed Description</label>
                          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 p-2.5 resize-none outline-none" required />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="block font-bold text-slate-700">Image Asset URL</label>
                          <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none font-mono text-xs" required />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-700">Dimensions</label>
                          <input type="text" value={formDim} onChange={(e) => setFormDim(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-700">Material Structure</label>
                          <input type="text" value={formMat} onChange={(e) => setFormMat(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-700">Warranty Coverage</label>
                          <input type="text" value={formWarranty} onChange={(e) => setFormWarranty(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none" />
                        </div>
                        <div className="space-y-1.5 flex items-center col-span-1 pt-6">
                          <label className="flex items-center space-x-3 font-bold text-slate-700 cursor-pointer select-none">
                            <input type="checkbox" checked={formCustomizable} onChange={(e) => setFormCustomizable(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer" />
                            <span>Allow Customer Customization</span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end space-x-3">
                        <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold cursor-pointer shadow-sm">
                          {editingProductId ? 'Save Changes' : 'Create Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================
              TAB 3: INVENTORY MANAGEMENT
             ============================================== */}
          {adminTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
                <p className="text-slate-500 text-sm mt-1">Audit stock quantities and manage reorder thresholds safely using draft controls.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4 text-center w-64">In-Stock Count</th>
                      <th className="px-6 py-4 text-center">Reorder Threshold</th>
                      <th className="px-6 py-4 text-right">Status Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((inv) => {
                      const p = products.find((prod) => prod.id === inv.productId);
                      if (!p) return null;

                      const isAtRisk = inv.stockLevel <= inv.reorderPoint;
                      const isOutOfStock = inv.stockLevel === 0;

                      // Calculate current view state
                      const currentStock = inv.stockLevel;
                      const draftStock = stockDrafts[inv.productId];
                      const isEditing = draftStock !== undefined && draftStock !== currentStock;
                      const displayValue = draftStock !== undefined ? draftStock : currentStock;

                      return (
                        <tr key={inv.productId} className="hover:bg-slate-50 transition-colors h-24">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded border border-slate-200" />
                              <span className="font-bold text-slate-900">{p.name}</span>
                            </div>
                          </td>

                          {/* Upgraded Stock Adjuster */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className={`inline-flex items-center border rounded-lg bg-white overflow-hidden transition-all ${
                                isEditing ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm' : 'border-slate-200 shadow-sm'
                              }`}>
                                <button
                                  onClick={() => handleDraftChange(inv.productId, displayValue - 1)}
                                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-bold transition-colors cursor-pointer outline-none"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={displayValue}
                                  onChange={(e) => handleDraftChange(inv.productId, parseInt(e.target.value) || 0)}
                                  className={`w-14 text-center font-bold text-slate-900 border-x border-slate-100 py-1.5 text-sm outline-none appearance-none ${
                                    isEditing ? 'bg-amber-50' : 'bg-white'
                                  }`}
                                />
                                <button
                                  onClick={() => handleDraftChange(inv.productId, displayValue + 1)}
                                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-bold transition-colors cursor-pointer outline-none"
                                >
                                  +
                                </button>
                              </div>

                              {/* Confirmation Action Buttons */}
                              {isEditing && (
                                <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                  <button 
                                    onClick={() => discardStock(inv.productId)}
                                    className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 p-1 rounded transition-colors cursor-pointer"
                                    title="Discard Changes"
                                  >
                                    <X size={14} strokeWidth={3} />
                                  </button>
                                  <button 
                                    onClick={() => commitStock(inv.productId)}
                                    className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded transition-colors shadow-sm cursor-pointer"
                                  >
                                    <Check size={12} strokeWidth={3} />
                                    Save
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center text-slate-500 font-medium">
                            {inv.reorderPoint}
                          </td>

                          <td className="px-6 py-4 text-right">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                              </span>
                            ) : isAtRisk ? (
                              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy
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
              TAB 4: CUSTOMER ORDERS
             ============================================== */}
          {adminTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Customer Order Pipeline</h2>
                <p className="text-slate-500 text-sm mt-1">Verify payments, process logistics, and dispatch tracking emails.</p>
              </div>

              <div className="space-y-6">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-slate-100 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                          <PackageSearch size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">Order #{o.id.substring(0, 8).toUpperCase()}</h4>
                          <span className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-2">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="rounded-lg border border-slate-300 text-sm font-semibold py-2 px-3 bg-white text-slate-900 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500 transition-shadow"
                        >
                          <option value="Pending">Pending (Payment Verification)</option>
                          <option value="Processing">Processing / Manufacturing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Order Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3 text-sm">
                        <h5 className="font-bold text-slate-400 uppercase tracking-wider text-xs">Customer Details</h5>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{o.customer.name}</p>
                          <p className="text-slate-600 mt-1">{o.customer.email}</p>
                          <p className="text-slate-600">{o.customer.phone}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600 leading-relaxed mt-2">
                          {o.customer.address}
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <h5 className="font-bold text-slate-400 uppercase tracking-wider text-xs">Order Items</h5>
                        <ul className="space-y-4 mt-2">
                          {o.items.map((item) => (
                            <li key={item.id} className="flex gap-3">
                              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded h-fit">{item.quantity}x</span> 
                              <div>
                                <span className="font-bold text-slate-800 block">{item.product.name}</span>
                                <span className="text-xs text-slate-500 block mt-1">
                                  Finish: {item.selectedFinish.name}
                                </span>
                                {item.selectedFabric && (
                                  <span className="text-xs text-slate-500 block">
                                    Fabric: {item.selectedFabric.name}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-xs">Payment Verification</h5>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                              <CheckCircle2 size={14} /> Verified
                            </span>
                          </div>
                          <div className="text-3xl font-bold text-slate-900 my-2">
                            {formatRM(o.totalAmount)}
                          </div>
                          <div className="text-sm font-medium text-slate-600">
                            Via <span className="capitalize text-slate-900">{o.customer.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="pt-5 mt-4 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleEmailTrigger(o)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg text-sm flex justify-center items-center gap-2 cursor-pointer transition-colors shadow-sm"
                          >
                            <Send size={16} />
                            <span>Dispatch Status Email</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="text-center py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <ClipboardList size={48} className="mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-500">No customer orders active.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};