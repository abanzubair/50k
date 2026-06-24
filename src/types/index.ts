export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  material: string;
  stock: number;
  status: 'active' | 'draft';
  sku: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  parentId?: string;
  productCount: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  role: string;
}

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'order' | 'product' | 'system';
}
