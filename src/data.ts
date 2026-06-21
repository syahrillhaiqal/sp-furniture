import type { Product, Order, InventoryItem, CustomOption } from './types';

// Customization presets
export const WOOD_FINISHES: CustomOption[] = [
  { id: 'nat-oak', name: 'Natural Honey Oak', priceMod: 0 },
  { id: 'dark-walnut', name: 'Classic Dark Walnut', priceMod: 120 },
  { id: 'royal-teak', name: 'Premium Aged Teak', priceMod: 190 },
  { id: 'charcoal-ash', name: 'Charcoal Colored Ash', priceMod: 80 }
];

export const FABRICS: CustomOption[] = [
  { id: 'linen-cream', name: 'Crisp Cream Linen', priceMod: 0 },
  { id: 'velvet-emerald', name: 'Luxe Emerald Velvet', priceMod: 90 },
  { id: 'leather-saddle', name: 'Full-Grain Saddle Leather', priceMod: 220 },
  { id: 'boucle-wheat', name: 'Cozy Wheat Bouclé', priceMod: 70 },
  { id: 'weave-grey', name: 'Herringbone Slate Grey Weave', priceMod: 40 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sofa',
    name: 'Aura Mid-Century Velvet Sofa',
    category: 'Living Room',
    price: 1249,
    description: 'Elevate your living room aesthetics with our signature mid-century sofa. Featuring flared walnut legs, high-density foam cushioning, and deep tufted backrest details that offer unparalleled support and iconic style.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 88" x D: 36" x H: 34"',
      material: 'Kiln-dried Hardwood Frame, Premium Velvet / Leather upholstery',
      warranty: '10-Year Frame & Support Warranty'
    },
    customizable: true,
    rating: 4.8,
    featured: true
  },
  {
    id: 'prod-dining',
    name: 'Heritage Solid Wood Dining Table',
    category: 'Dining Room',
    price: 980,
    description: 'A masterpiece of joinery and natural beauty. Crafted to highlight the rich timber grains, this solid wood dining table accommodates up to eight guests and is built to serve family gatherings for generations.',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 76" x D: 38" x H: 30"',
      material: '100% Solid Selected Timber (finished as customized)',
      warranty: '5-Year Structural Wood Warranty'
    },
    customizable: true,
    rating: 4.9,
    featured: true
  },
  {
    id: 'prod-chair',
    name: 'Soren Minimalist Lounge Chair',
    category: 'Living Room',
    price: 420,
    description: 'Designed around ergonomic principles, the Soren lounge chair mimics the natural contours of the spine. Its ash-wood frame exudes lightweight Scandinavian charm suitable for reading corners or fireside chats.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 28" x D: 31" x H: 36"',
      material: 'Curved Ply Ash Frame, Upholstered Inner Layer',
      warranty: '3-Year Premium Structural Warranty'
    },
    customizable: true,
    rating: 4.7,
    featured: false
  },
  {
    id: 'prod-bed',
    name: 'Nirvana Floating Platform Bed Frame',
    category: 'Bedroom',
    price: 1350,
    description: 'Create an oasis of deep rest. The Nirvana bed frame features an elegant floating silhouette, integrated bedside table platforms, and a padded upholstered headboard tailored for ultimate reading comfort.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 82" x D: 94" x H: 40" (Queen size)',
      material: 'Steel Reinforcement Core, Solid Wood Perimeter, Bouclé Wrap',
      warranty: '10-year Structural Frame Sleep System Warranty'
    },
    customizable: true,
    rating: 4.9,
    featured: true
  },
  {
    id: 'prod-bookshelf',
    name: 'Arcadia Modular Oak Bookcase',
    category: 'Living Room',
    price: 680,
    description: 'A striking statement piece for showcasing literature, art, and plant life. With staggered, structural shelf panels, the Arcadia offers multiple height configurations to personalize your organization layout.',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 52" x D: 14" x H: 72"',
      material: 'Genuine European White Oak Veneer, Engineered Core',
      warranty: '3-Year Furniture Panel Warranty'
    },
    customizable: false,
    rating: 4.6,
    featured: false
  },
  {
    id: 'prod-desk',
    name: 'Metropolis Floating Executive Desk',
    category: 'Office',
    price: 850,
    description: 'The definitive executive workplace workspace. Streamlined with built-in hidden wire channeling rails, non-marring drawer guides, and a sleek modern chassis designed to maximize surface work area and floor clearance.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    specs: {
      dimensions: 'W: 60" x D: 28" x H: 30"',
      material: 'Industrial Sintered Steel Framework, Handcrafted Timber Top',
      warranty: '5-Year Business-Class Frame Warranty'
    },
    customizable: true,
    rating: 4.8,
    featured: false
  },
  {
    id: 'prod-patio',
    name: 'Breeze All-Weather Teak Patio Dining Set',
    category: 'Outdoor',
    price: 1890,
    description: 'Dine under open air. Handcrafted in sustainably certified high-oil aged teakwood, this dining collection handles heavy downpours or blistering ultraviolet sun rays to age into a beautiful silver-grey patina.',
    image: 'https://images.unsplash.com/photo-1768527341685-0bbc641ccb9b?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    specs: {
      dimensions: 'Table - W: 72" x D: 36" x H: 30"; Chairs (4x) Included',
      material: 'Marine Grade Sustainably Sourced High-Oil Teak',
      warranty: '8-Year Weatherproof Exterior Warranty'
    },
    customizable: false,
    rating: 4.5,
    featured: true
  },
  {
    id: 'prod-sectional',
    name: 'Calm Horizon Modular Sectional',
    category: 'Living Room',
    price: 1890,
    description: 'A generous modular lounge system with deep feather-topped seating, concealed connectors, and a low profile silhouette for modern family spaces.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000&h=1200',
    specs: {
      dimensions: 'W: 126" x D: 82" x H: 32"',
      material: 'Solid hardwood frame, high-resilience foam, performance upholstery',
      warranty: '10-Year Frame Warranty'
    },
    customizable: true,
    rating: 4.9,
    featured: true
  },
  {
    id: 'prod-sideboard',
    name: 'Noir Arc Walnut Sideboard',
    category: 'Dining Room',
    price: 1190,
    description: 'A long, streamlined storage piece with soft-close doors and balanced proportions for dining or gallery-style living spaces.',
    image: 'https://plus.unsplash.com/premium_photo-1683141318297-75a3d8e86476?q=80&w=782&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    specs: {
      dimensions: 'W: 68" x D: 18" x H: 31"',
      material: 'American walnut veneer, engineered core, brushed brass pulls',
      warranty: '5-Year Cabinet Warranty'
    },
    customizable: true,
    rating: 4.7,
    featured: false
  },
  {
    id: 'prod-nightstand',
    name: 'Luna Floating Nightstand',
    category: 'Bedroom',
    price: 320,
    description: 'Compact bedside storage with a floating frame and integrated cable opening for minimalist bedroom arrangements.',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
    specs: {
      dimensions: 'W: 22" x D: 16" x H: 10"',
      material: 'Oak veneer, powder-coated steel bracket, soft-close drawer',
      warranty: '3-Year Furniture Warranty'
    },
    customizable: false,
    rating: 4.6,
    featured: false
  },
  {
    id: 'prod-lounge-chair',
    name: 'Harbor Sling Accent Chair',
    category: 'Living Room',
    price: 560,
    description: 'A relaxed accent chair with a tailored sling seat, curved wood frame, and a low lounge posture.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1000',
    specs: {
      dimensions: 'W: 30" x D: 33" x H: 31"',
      material: 'Bent ash frame, removable upholstery cover, dense seat cushion',
      warranty: '4-Year Frame Warranty'
    },
    customizable: true,
    rating: 4.8,
    featured: false
  },
  {
    id: 'prod-desk-chair',
    name: 'Vertex Ergonomic Office Chair',
    category: 'Office',
    price: 690,
    description: 'Designed for long sessions at the desk, this task chair blends mesh support, padded comfort, and a refined silhouette.',
    image: 'https://images.unsplash.com/photo-1750306957820-f778b67c4e13?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    specs: {
      dimensions: 'W: 28" x D: 27" x H: 45"',
      material: 'Breathable mesh, aluminum base, molded lumbar support',
      warranty: '5-Year Mechanism Warranty'
    },
    customizable: false,
    rating: 4.7,
    featured: true
  },
  {
    id: 'prod-outdoor-lounge',
    name: 'Terra Open-Air Lounge Set',
    category: 'Outdoor',
    price: 2240,
    description: 'A weather-ready lounge group with modular seats, teak accents, and durable outdoor cushions for terraces and patios.',
    image: 'https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    specs: {
      dimensions: 'Modular set: 2 seat units + corner + coffee table',
      material: 'Powder-coated aluminum, teak details, UV-resistant fabric',
      warranty: '6-Year Outdoor Warranty'
    },
    customizable: true,
    rating: 4.8,
    featured: false
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { productId: 'prod-sofa', stockLevel: 14, reorderPoint: 5 },
  { productId: 'prod-dining', stockLevel: 8, reorderPoint: 3 },
  { productId: 'prod-chair', stockLevel: 35, reorderPoint: 10 },
  { productId: 'prod-bed', stockLevel: 4, reorderPoint: 2 },
  { productId: 'prod-bookshelf', stockLevel: 22, reorderPoint: 8 },
  { productId: 'prod-desk', stockLevel: 11, reorderPoint: 4 },
  { productId: 'prod-patio', stockLevel: 3, reorderPoint: 2 },
  { productId: 'prod-sectional', stockLevel: 6, reorderPoint: 2 },
  { productId: 'prod-sideboard', stockLevel: 9, reorderPoint: 3 },
  { productId: 'prod-nightstand', stockLevel: 18, reorderPoint: 6 },
  { productId: 'prod-lounge-chair', stockLevel: 15, reorderPoint: 5 },
  { productId: 'prod-desk-chair', stockLevel: 12, reorderPoint: 4 },
  { productId: 'prod-outdoor-lounge', stockLevel: 5, reorderPoint: 2 }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9831',
    customer: {
      name: 'Jamal Abdillah',
      email: 'eleanor@example.com',
      phone: '+60 12 3456 789',
      address: 'No. 12, Jalan Merpati 3, Taman Meru Jaya, 30020 Ipoh, Perak, Malaysia',
      paymentMethod: 'Credit/Debit Card'
    },
    items: [
      {
        id: 'cart-sofa-1',
        product: INITIAL_PRODUCTS[0], // Sofa
        quantity: 1,
        selectedFinish: WOOD_FINISHES[1], // Classic Dark Walnut
        selectedFabric: FABRICS[1], // Luxe Emerald Velvet
        totalPrice: 1459 // 1249 + 120 + 90
      }
    ],
    totalAmount: 1459,
    status: 'Completed',
    createdAt: '2026-06-01T14:32:00Z',
    emailSent: true
  },
  {
    id: 'ORD-5542',
    customer: {
      name: 'Pakcik Mat',
      email: 'aidan.g@example.com',
      phone: '+60 11 7654 241',
      address: 'No. 45, Jalan Setia 2/8, Taman Setia Indah, 81100 Johor Bahru, Johor, Malaysia',
      paymentMethod: 'Bank Transfer'
    },
    items: [
      {
        id: 'cart-dining-1',
        product: INITIAL_PRODUCTS[1], // Dining Table
        quantity: 1,
        selectedFinish: WOOD_FINISHES[2], // Premium Aged Teak
        totalPrice: 1170 // 980 + 190
      }
    ],
    totalAmount: 1170,
    status: 'Out for Delivery',
    createdAt: '2026-06-11T09:15:00Z',
    emailSent: true
  },
  {
    id: 'ORD-2109',
    customer: {
      name: 'Munir Albakri',
      email: 'marcus@example.com',
      phone: '+60 19 7744 111',
      address: 'No. 8, Lorong Bukit Indah 5, Taman Bukit Indah, 43000 Kajang, Selangor, Malaysia',
      paymentMethod: 'Installment Plan'
    },
    items: [
      {
        id: 'cart-chair-1',
        product: INITIAL_PRODUCTS[2], // Soren Lounge Chair
        quantity: 2,
        selectedFinish: WOOD_FINISHES[0], // Honey Oak
        selectedFabric: FABRICS[4], // Grey Weave
        totalPrice: 920 // (420 + 0 + 40) * 2
      }
    ],
    totalAmount: 920,
    status: 'Processing',
    createdAt: '2026-06-12T16:45:00Z',
    emailSent: false
  },
  {
    id: 'ORD-1087',
    customer: {
      name: 'Sofia Alovera',
      email: 'sofia.alvarez@example.com',
      phone: '+60 14 1554 941',
      address: 'No. 101, Jalan Bayan Baru 1, 11950 Bayan Lepas, Pulau Pinang, Malaysia',
      paymentMethod: 'Credit/Debit Card'
    },
    items: [
      {
        id: 'cart-bookshelf-1',
        product: INITIAL_PRODUCTS[4], // Bookcase (not customizable)
        quantity: 1,
        selectedFinish: WOOD_FINISHES[0],
        totalPrice: 680
      }
    ],
    totalAmount: 680,
    status: 'Pending',
    createdAt: '2026-06-13T07:10:00Z',
    emailSent: false
  }
];
