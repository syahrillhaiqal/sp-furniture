export interface ProductSpecs {
  dimensions: string;
  material: string;
  warranty: string;
}

export interface CustomOption {
  id: string;
  name: string;
  priceMod: number; // e.g. +80
}

export interface CustomizationOptions {
  finishes: CustomOption[];
  fabrics?: CustomOption[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Living Room' | 'Dining Room' | 'Bedroom' | 'Office' | 'Outdoor';
  price: number;
  description: string;
  image: string;
  specs: ProductSpecs;
  customizable: boolean;
  rating: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique ID representing this specific customized product instance
  product: Product;
  quantity: number;
  selectedFinish: CustomOption;
  selectedFabric?: CustomOption;
  totalPrice: number; // price per unit with custom modifiers * quantity
}

export type OrderStatus = 'Pending' | 'Processing' | 'Out for Delivery' | 'Completed';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'Credit/Debit Card' | 'Bank Transfer' | 'Installment Plan';
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  emailSent?: boolean;
}

export interface InventoryItem {
  productId: string;
  stockLevel: number;
  reorderPoint: number;
}
