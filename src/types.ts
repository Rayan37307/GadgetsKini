/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecItem {
  key: string;
  value: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[]; // 5 images including main, placeholder based on picsum
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku: string;
  shortFeatures: string[];
  description: string[]; // multi-paragraphs
  specifications: SpecItem[];
  inTheBox: string[];
  isHotDeal?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  shippingAddress: SavedAddress;
  shippingMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  rewardPoints: number;
}
