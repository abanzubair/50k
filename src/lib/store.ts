import type { Product, Category, Order, OrderStatus, AdminUser, Activity } from '@/types';

// Initial Products
export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Banarasi Crimson Gold',
    description: 'A stunning Banarasi silk saree in deep crimson red with intricate gold zari work. Handwoven by master artisans in Varanasi, this saree features traditional floral buta motifs and a rich pallu.',
    price: 12999,
    compareAtPrice: 15999,
    image: '/images/saree-banarasi-red.jpg',
    category: 'Banarasi Silk',
    material: 'Pure Silk',
    stock: 12,
    status: 'active',
    sku: 'TAV-BSR-001',
    createdAt: '2025-01-10',
  },
  {
    id: '2',
    name: 'Kanjeevaram Royal Blue',
    description: 'An exquisite Kanjeevaram silk saree in royal blue with traditional temple border design. The contrasting pallu features peacock motifs in gold zari.',
    price: 15499,
    image: '/images/saree-kanjeevaram-blue.jpg',
    category: 'Kanjeevaram',
    material: 'Pure Silk',
    stock: 8,
    status: 'active',
    sku: 'TAV-KJV-002',
    createdAt: '2025-01-12',
  },
  {
    id: '3',
    name: 'Linen Natural Beige',
    description: 'A handloom linen saree in natural beige with subtle texture and minimal design. Perfect for summer occasions and everyday elegance.',
    price: 3499,
    compareAtPrice: 4499,
    image: '/images/saree-linen-beige.jpg',
    category: 'Linen',
    material: 'Pure Linen',
    stock: 25,
    status: 'active',
    sku: 'TAV-LIN-003',
    createdAt: '2025-01-15',
  },
  {
    id: '4',
    name: 'Cotton Forest Floral',
    description: 'A block-printed cotton saree in forest green with white floral motifs. Handcrafted using traditional Indian handblock printing techniques.',
    price: 2799,
    image: '/images/saree-cotton-green.jpg',
    category: 'Cotton',
    material: 'Pure Cotton',
    stock: 18,
    status: 'active',
    sku: 'TAV-COT-004',
    createdAt: '2025-01-18',
  },
  {
    id: '5',
    name: 'Designer Blush Geometric',
    description: 'A contemporary designer saree in blush pink with modern geometric embroidery in gold and silver thread. Perfect for the modern Indian woman.',
    price: 18999,
    compareAtPrice: 22999,
    image: '/images/saree-designer-pink.jpg',
    category: 'Designer',
    material: 'Georgette',
    stock: 6,
    status: 'active',
    sku: 'TAV-DSG-005',
    createdAt: '2025-01-20',
  },
  {
    id: '6',
    name: 'Festive Golden Peacock',
    description: 'A festive silk saree in golden yellow with heavy zari work featuring peacock and paisley motifs. The perfect choice for weddings and celebrations.',
    price: 22499,
    image: '/images/saree-festive-gold.jpg',
    category: 'Festive',
    material: 'Pure Silk',
    stock: 4,
    status: 'active',
    sku: 'TAV-FST-006',
    createdAt: '2025-01-22',
  },
  {
    id: '7',
    name: 'Chikankari White Blue',
    description: 'A white cotton saree with delicate blue chikankari embroidery. The ethereal Lucknowi craft creates an airy, elegant look.',
    price: 4599,
    image: '/images/saree-cotton-white.jpg',
    category: 'Cotton',
    material: 'Cotton',
    stock: 15,
    status: 'active',
    sku: 'TAV-CHK-007',
    createdAt: '2025-01-25',
  },
  {
    id: '8',
    name: 'Banarasi Plum Silver',
    description: 'A Banarasi silk saree in deep plum purple with silver zari border and intricate floral buta work. Luxurious and regal.',
    price: 14499,
    image: '/images/saree-banarasi-purple.jpg',
    category: 'Banarasi Silk',
    material: 'Pure Silk',
    stock: 9,
    status: 'active',
    sku: 'TAV-BSR-008',
    createdAt: '2025-02-01',
  },
  {
    id: '9',
    name: 'Tussar Tribal Art',
    description: 'A Tussar silk saree in burnt orange with tribal Madhubani prints in black and white. Unique artisanal piece for the art lover.',
    price: 6799,
    image: '/images/saree-1.jpg',
    category: 'Designer',
    material: 'Tussar Silk',
    stock: 11,
    status: 'active',
    sku: 'TAV-TSS-009',
    createdAt: '2025-02-05',
  },
  {
    id: '10',
    name: 'Organza Mint Floral',
    description: 'An organza silk saree in pastel mint green with delicate floral digital print. Sheer, lightweight, and perfect for spring occasions.',
    price: 8299,
    image: '/images/saree-2.jpg',
    category: 'Designer',
    material: 'Organza Silk',
    stock: 14,
    status: 'active',
    sku: 'TAV-ORG-010',
    createdAt: '2025-02-08',
  },
  {
    id: '11',
    name: 'Paithani Peacock Green',
    description: 'A Paithani silk saree in deep peacock green with rich gold border and traditional peacock motif on the pallu. Maharashtrian heritage at its finest.',
    price: 19999,
    compareAtPrice: 24999,
    image: '/images/saree-3.jpg',
    category: 'Festive',
    material: 'Pure Silk',
    stock: 5,
    status: 'active',
    sku: 'TAV-PTH-011',
    createdAt: '2025-02-10',
  },
  {
    id: '12',
    name: 'Kota Doria Coral',
    description: 'A Kota Doria cotton saree in soft coral pink with traditional checkered weave pattern. Lightweight and airy from Rajasthan.',
    price: 3199,
    image: '/images/saree-4.jpg',
    category: 'Cotton',
    material: 'Cotton',
    stock: 22,
    status: 'active',
    sku: 'TAV-KOT-012',
    createdAt: '2025-02-12',
  },
  {
    id: '13',
    name: 'Chanderi Ivory Gold',
    description: 'A Chanderi silk saree in ivory white with subtle gold zari checks and delicate motifs. Sheer elegance for special occasions.',
    price: 7499,
    image: '/images/saree-5.jpg',
    category: 'Banarasi Silk',
    material: 'Chanderi Silk',
    stock: 10,
    status: 'active',
    sku: 'TAV-CHN-013',
    createdAt: '2025-02-15',
  },
  {
    id: '14',
    name: 'Mysore Ruby Gold',
    description: 'A Mysore silk saree in deep ruby red with traditional gold border. Simple yet elegant, this pure silk piece is a timeless classic.',
    price: 11299,
    image: '/images/saree-6.jpg',
    category: 'Kanjeevaram',
    material: 'Pure Silk',
    stock: 7,
    status: 'active',
    sku: 'TAV-MYS-014',
    createdAt: '2025-02-18',
  },
];

// Initial Categories
export const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Banarasi Silk',
    description: 'Luxurious silk sarees from Varanasi with intricate zari work',
    image: '/images/category-banarasi.jpg',
    slug: 'banarasi-silk',
    productCount: 3,
  },
  {
    id: '2',
    name: 'Kanjeevaram',
    description: 'Vibrant South Indian silk sarees with temple borders',
    image: '/images/category-kanjeevaram.jpg',
    slug: 'kanjeevaram',
    productCount: 2,
  },
  {
    id: '3',
    name: 'Linen',
    description: 'Lightweight handloom linen sarees for everyday elegance',
    image: '/images/category-linen.jpg',
    slug: 'linen',
    productCount: 1,
  },
  {
    id: '4',
    name: 'Cotton',
    description: 'Comfortable cotton sarees with traditional prints',
    image: '/images/category-cotton.jpg',
    slug: 'cotton',
    productCount: 4,
  },
  {
    id: '5',
    name: 'Designer',
    description: 'Contemporary designer sarees with modern aesthetics',
    image: '/images/saree-designer-pink.jpg',
    slug: 'designer',
    productCount: 3,
  },
  {
    id: '6',
    name: 'Festive',
    description: 'Heavy silk sarees perfect for weddings and celebrations',
    image: '/images/saree-festive-gold.jpg',
    slug: 'festive',
    productCount: 2,
  },
];

// Initial Orders
export const initialOrders: Order[] = [
  {
    id: '1',
    orderId: 'TAV-2025-001',
    customer: {
      name: 'Ananya Sharma',
      email: 'ananya@email.com',
      phone: '+91 98765 43210',
      address: '42, Rose Garden, Koramangala, Bangalore - 560034',
    },
    items: [
      { productId: '1', productName: 'Banarasi Crimson Gold', productImage: '/images/saree-banarasi-red.jpg', quantity: 1, price: 12999 },
    ],
    status: 'confirmed',
    subtotal: 12999,
    shipping: 0,
    tax: 2340,
    total: 15339,
    createdAt: '2025-06-15',
    updatedAt: '2025-06-16',
    timeline: [
      { status: 'pending', label: 'Order Placed', date: '2025-06-15', completed: true },
      { status: 'confirmed', label: 'Confirmed', date: '2025-06-16', completed: true },
      { status: 'shipped', label: 'Shipped', date: '', completed: false },
      { status: 'delivered', label: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: '2',
    orderId: 'TAV-2025-002',
    customer: {
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '+91 98765 12345',
      address: '15, Lotus Enclave, Vasant Kunj, Delhi - 110070',
    },
    items: [
      { productId: '2', productName: 'Kanjeevaram Royal Blue', productImage: '/images/saree-kanjeevaram-blue.jpg', quantity: 1, price: 15499 },
      { productId: '3', productName: 'Linen Natural Beige', productImage: '/images/saree-linen-beige.jpg', quantity: 1, price: 3499 },
    ],
    status: 'shipped',
    subtotal: 18998,
    shipping: 0,
    tax: 3420,
    total: 22418,
    createdAt: '2025-06-14',
    updatedAt: '2025-06-17',
    timeline: [
      { status: 'pending', label: 'Order Placed', date: '2025-06-14', completed: true },
      { status: 'confirmed', label: 'Confirmed', date: '2025-06-14', completed: true },
      { status: 'shipped', label: 'Shipped', date: '2025-06-17', completed: true },
      { status: 'delivered', label: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: '3',
    orderId: 'TAV-2025-003',
    customer: {
      name: 'Meera Reddy',
      email: 'meera@email.com',
      phone: '+91 98765 67890',
      address: '8, Jasmine Apartments, Jubilee Hills, Hyderabad - 500033',
    },
    items: [
      { productId: '6', productName: 'Festive Golden Peacock', productImage: '/images/saree-festive-gold.jpg', quantity: 1, price: 22499 },
    ],
    status: 'delivered',
    subtotal: 22499,
    shipping: 0,
    tax: 4050,
    total: 26549,
    createdAt: '2025-06-10',
    updatedAt: '2025-06-14',
    timeline: [
      { status: 'pending', label: 'Order Placed', date: '2025-06-10', completed: true },
      { status: 'confirmed', label: 'Confirmed', date: '2025-06-10', completed: true },
      { status: 'shipped', label: 'Shipped', date: '2025-06-12', completed: true },
      { status: 'delivered', label: 'Delivered', date: '2025-06-14', completed: true },
    ],
  },
  {
    id: '4',
    orderId: 'TAV-2025-004',
    customer: {
      name: 'Sneha Gupta',
      email: 'sneha@email.com',
      phone: '+91 98765 98765',
      address: '23, Maple Residency, Bandra West, Mumbai - 400050',
    },
    items: [
      { productId: '5', productName: 'Designer Blush Geometric', productImage: '/images/saree-designer-pink.jpg', quantity: 1, price: 18999 },
    ],
    status: 'pending',
    subtotal: 18999,
    shipping: 0,
    tax: 3420,
    total: 22419,
    createdAt: '2025-06-18',
    updatedAt: '2025-06-18',
    timeline: [
      { status: 'pending', label: 'Order Placed', date: '2025-06-18', completed: true },
      { status: 'confirmed', label: 'Confirmed', date: '', completed: false },
      { status: 'shipped', label: 'Shipped', date: '', completed: false },
      { status: 'delivered', label: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: '5',
    orderId: 'TAV-2025-005',
    customer: {
      name: 'Lakshmi Iyer',
      email: 'lakshmi@email.com',
      phone: '+91 98765 34567',
      address: '7, Coconut Grove, Alwarpet, Chennai - 600018',
    },
    items: [
      { productId: '8', productName: 'Banarasi Plum Silver', productImage: '/images/saree-banarasi-purple.jpg', quantity: 1, price: 14499 },
      { productId: '4', productName: 'Cotton Forest Floral', productImage: '/images/saree-cotton-green.jpg', quantity: 2, price: 5598 },
    ],
    status: 'confirmed',
    subtotal: 20097,
    shipping: 0,
    tax: 3617,
    total: 23714,
    createdAt: '2025-06-17',
    updatedAt: '2025-06-18',
    timeline: [
      { status: 'pending', label: 'Order Placed', date: '2025-06-17', completed: true },
      { status: 'confirmed', label: 'Confirmed', date: '2025-06-18', completed: true },
      { status: 'shipped', label: 'Shipped', date: '', completed: false },
      { status: 'delivered', label: 'Delivered', date: '', completed: false },
    ],
  },
];

// Initial Admin User
export const initialAdminUser: AdminUser = {
  id: '1',
  name: 'Priya Sharma',
  email: 'priya@tavishisarees.com',
  phone: '+91 98765 43210',
  bio: 'Passionate about Indian textiles and preserving our weaving heritage. Managing Tavishi Sarees with love and dedication.',
  avatar: '',
  role: 'Administrator',
};

// Initial Activities
export const initialActivities: Activity[] = [
  { id: '1', text: 'New order #TAV-2025-004 received', timestamp: '2025-06-18T10:30:00', type: 'order' },
  { id: '2', text: 'Product "Banarasi Crimson Gold" stock updated', timestamp: '2025-06-18T09:15:00', type: 'product' },
  { id: '3', text: 'Order #TAV-2025-003 marked as delivered', timestamp: '2025-06-14T16:45:00', type: 'order' },
  { id: '4', text: 'New product "Chanderi Ivory Gold" added', timestamp: '2025-06-14T11:20:00', type: 'product' },
  { id: '5', text: 'Order #TAV-2025-002 has been shipped', timestamp: '2025-06-13T14:00:00', type: 'order' },
];

// Store state (mutable for CRUD operations)
let products = [...initialProducts];
let categories = [...initialCategories];
let orders = [...initialOrders];
let adminUser = { ...initialAdminUser };
let activities = [...initialActivities];
let isAuthenticated = false;

// Auth
export const auth = {
  login: (email: string, password: string): boolean => {
    if (email === 'admin@tavishisarees.com' && password === 'admin123') {
      isAuthenticated = true;
      return true;
    }
    return false;
  },
  logout: () => {
    isAuthenticated = false;
  },
  isAuthenticated: () => isAuthenticated,
};

// Product CRUD
export const productStore = {
  getAll: () => products,
  getById: (id: string) => products.find((p) => p.id === id),
  getByCategory: (category: string) =>
    category === 'All' ? products : products.filter((p) => p.category === category),
  add: (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    products = [...products, newProduct];
    return newProduct;
  },
  update: (id: string, updates: Partial<Product>) => {
    products = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    return products.find((p) => p.id === id);
  },
  delete: (id: string) => {
    products = products.filter((p) => p.id !== id);
  },
};

// Category CRUD
export const categoryStore = {
  getAll: () => categories,
  getById: (id: string) => categories.find((c) => c.id === id),
  add: (category: Omit<Category, 'id' | 'productCount'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      productCount: 0,
    };
    categories = [...categories, newCategory];
    return newCategory;
  },
  update: (id: string, updates: Partial<Category>) => {
    categories = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
  },
  delete: (id: string) => {
    categories = categories.filter((c) => c.id !== id);
  },
};

// Order CRUD
export const orderStore = {
  getAll: () => orders,
  getById: (id: string) => orders.find((o) => o.id === id),
  getByOrderId: (orderId: string) => orders.find((o) => o.orderId === orderId),
  updateStatus: (id: string, status: OrderStatus) => {
    orders = orders.map((o) => {
      if (o.id === id) {
        const timeline = o.timeline.map((t) => ({
          ...t,
          completed: t.status === status || t.completed,
          date: t.status === status && !t.date ? new Date().toISOString().split('T')[0] : t.date,
        }));
        return { ...o, status, timeline, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return o;
    });
    return orders.find((o) => o.id === id);
  },
};

// Admin Profile
export const adminStore = {
  getUser: () => adminUser,
  updateUser: (updates: Partial<AdminUser>) => {
    adminUser = { ...adminUser, ...updates };
    return adminUser;
  },
};

// Activity
export const activityStore = {
  getAll: () => activities,
  add: (text: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      type,
    };
    activities = [newActivity, ...activities];
  },
};
