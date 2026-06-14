import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Order, InventoryItem, CartItem, CustomerDetails, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY, INITIAL_ORDERS } from '../data';

const getRouteFromPathname = (pathname: string) => {
  if (pathname === '/admin') {
    return 'admin-login';
  }

  if (pathname === '/admin/dashboard') {
    return 'admin-dashboard';
  }

  return 'home';
};

const getPathnameFromRoute = (route: string) => {
  if (route === 'admin-login') {
    return '/admin';
  }

  if (route === 'admin-dashboard') {
    return '/admin/dashboard';
  }

  return '/';
};

interface AppContextType {
  products: Product[];
  inventory: InventoryItem[];
  orders: Order[];
  cart: CartItem[];
  currentRoute: string; // 'home' | 'detail' | 'cart' | 'checkout' | 'track' | 'admin-login' | 'admin-dashboard'
  currentProductDetailId: string | null;
  adminTab: 'products' | 'inventory' | 'orders' | 'reports';
  adminLoggedIn: boolean;
  trackingQuery: { orderId: string; email: string } | null;
  
  // Navigation
  setRoute: (route: string, details?: { productId?: string }) => void;
  setAdminTab: (tab: 'products' | 'inventory' | 'orders' | 'reports') => void;
  
  // Product Operations
  addProduct: (product: Omit<Product, 'id' | 'rating'>) => void;
  editProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Inventory Operations
  updateStock: (productId: string, stockLevel: number) => void;
  
  // Cart Operations
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  
  // Order Operations
  createOrder: (customer: CustomerDetails) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  triggerEmailUpdate: (orderId: string) => void;
  
  // Auth
  login: (pw: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial state or fallback to defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sph_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('sph_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sph_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>(() => getRouteFromPathname(window.location.pathname));
  const [currentProductDetailId, setCurrentProductDetailId] = useState<string | null>(null);
  const [adminTab, setAdminTabState] = useState<'products' | 'inventory' | 'orders' | 'reports'>('reports');
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [trackingQuery, setTrackingQuery] = useState<{ orderId: string; email: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sph_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sph_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('sph_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromPathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation controller
  const setRoute = (route: string, details?: { productId?: string }) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', getPathnameFromRoute(route));
    if (details?.productId) {
      setCurrentProductDetailId(details.productId);
    }
  };

  const setAdminTab = (tab: 'products' | 'inventory' | 'orders' | 'reports') => {
    setAdminTabState(tab);
  };

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id' | 'rating'>) => {
    const newId = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id: newId,
      rating: 5.0,
      featured: false
    };
    setProducts((prev) => [product, ...prev]);
    // Also establish inventory line for the newly added product
    setInventory((prev) => [...prev, { productId: newId, stockLevel: 10, reorderPoint: 3 }]);
  };

  const editProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((inv) => inv.productId !== id));
    // Remove if there were items in current cart matching this product
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Inventory Level Handlers
  const updateStock = (productId: string, stockLevel: number) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.productId === productId ? { ...inv, stockLevel: Math.max(0, stockLevel) } : inv
      )
    );
  };

  // Cart Handlers
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Find if an identical item exists (same product AND same customization choices)
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.selectedFinish.id === newItem.selectedFinish.id &&
          item.selectedFabric?.id === newItem.selectedFabric?.id
      );

      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                totalPrice: item.totalPrice + newItem.totalPrice
              }
            : item
        );
      } else {
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQty = (cartItemId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const singleItemPrice = item.totalPrice / item.quantity;
          const adjustedQty = Math.max(1, qty);
          return {
            ...item,
            quantity: adjustedQty,
            totalPrice: singleItemPrice * adjustedQty
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // Orders Management
  const createOrder = (customer: CustomerDetails) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomNum}`;
    
    // Calculate total order amount
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder: Order = {
      id: orderId,
      customer,
      items: [...cart],
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      emailSent: false
    };

    // Deduct stock levels for purchased products inside order
    setInventory((prev) =>
      prev.map((inv) => {
        const boughtQty = cart
          .filter((c) => c.product.id === inv.productId)
          .reduce((sum, item) => sum + item.quantity, 0);
        
        if (boughtQty > 0) {
          return {
            ...inv,
            stockLevel: Math.max(0, inv.stockLevel - boughtQty)
          };
        }
        return inv;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingQuery({ orderId: newOrder.id, email: customer.email });
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const triggerEmailUpdate = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, emailSent: true } : o))
    );
  };

  // Simple hardcoded auth pw is "admin123" or similar
  const login = (pw: string) => {
    if (pw === 'sphome123' || pw === 'admin') {
      setAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminLoggedIn(false);
    setAdminTabState('reports');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        inventory,
        orders,
        cart,
        currentRoute,
        currentProductDetailId,
        adminTab,
        adminLoggedIn,
        trackingQuery,
        setRoute,
        setAdminTab,
        addProduct,
        editProduct,
        deleteProduct,
        updateStock,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        createOrder,
        updateOrderStatus,
        triggerEmailUpdate,
        login,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
