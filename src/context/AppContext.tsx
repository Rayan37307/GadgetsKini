/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, SavedAddress, Order, Toast, UserProfile } from '../types';
import { MOCK_PRODUCTS } from '../data';

interface AppContextType {
  currentView: string;
  selectedProductId: string | null;
  recentlyViewed: Product[];
  comparisonList: Product[];
  cart: CartItem[];
  wishlist: string[];
  couponCode: string | null;
  couponDiscount: number;
  searchQuery: string;
  selectedCategory: string | null;
  userProfile: UserProfile | null;
  orders: Order[];
  toasts: Toast[];
  quickViewProduct: Product | null;
  gridLayout: boolean;
  
  // Actions
  navigateTo: (view: string, params?: Record<string, string>) => void;
  addToCart: (product: Product, quantity?: number, color?: string, storage?: string) => void;
  removeFromCart: (productId: string, color?: string, storage?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, storage?: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleWishlist: (productId: string) => void;
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  loginUser: (name: string, email: string) => void;
  logoutUser: () => void;
  addOrder: (order: Order) => void;
  triggerToast: (message: string, type?: 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setGridLayout: (grid: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Saved Address Preset
export const DEMO_ADDRESS: SavedAddress = {
  id: 'addr1',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+1 800-555-0199',
  email: 'r11137307@gmail.com',
  addressLine1: '1600 Amphitheatre Parkway',
  addressLine2: 'Rm 4A102',
  city: 'Mountain View',
  state: 'CA',
  zip: '94043',
  country: 'United States',
  isDefault: true,
};

const INITIAL_PROFILE: UserProfile = {
  name: 'Jane Doe',
  email: 'r11137307@gmail.com',
  phone: '+1 800-555-0199',
  rewardPoints: 240,
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation & Routing States
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cart & Wishlist with localStorage hydration
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('gk_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gk_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gk_recent');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Product comparison state
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // User & order accounts
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('gk_profile');
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('gk_orders');
      if (stored) return JSON.parse(stored);
    } catch {}
    
    // Add 1 default historic order
    const defaultOrder: Order = {
      id: 'GK-918237',
      date: '2026-05-18',
      items: [
        {
          productId: '3',
          name: 'StreamHub 4K Smart TV Stick',
          price: 49,
          quantity: 1,
          image: 'https://picsum.photos/seed/xiaomi_tv/600/600',
          variant: 'Cosmic Slate',
        }
      ],
      subtotal: 49,
      discount: 0,
      shippingCharge: 9.99,
      tax: 4.72,
      total: 63.71,
      shippingAddress: DEMO_ADDRESS,
      shippingMethod: 'Express ($9.99, 2-3 days)',
      status: 'Delivered',
    } as Order;
    return [defaultOrder];
  });

  // Global UI States
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [gridLayout, setGridLayout] = useState<boolean>(true);

  // Sync state modifications back to physical cache
  useEffect(() => {
    localStorage.setItem('gk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('gk_recent', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('gk_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('gk_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('gk_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync hash changes directly with page routing
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash || '#home';
      const [path, queryString] = hash.split('?');
      
      // Parse parameters
      const params: Record<string, string> = {};
      if (queryString) {
        queryString.split('&').forEach(item => {
          const [k, v] = item.split('=');
          if (k) params[k] = decodeURIComponent(v || '');
        });
      }

      // Route lookup table
      if (path === '#shop') {
        setCurrentView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#product' && params.id) {
        setCurrentView('product-detail');
        setSelectedProductId(params.id);
        
        // Push to recently viewed list
        setRecentlyViewedIds(prev => {
          const filtered = prev.filter(x => x !== params.id);
          return [params.id, ...filtered].slice(0, 4);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#cart') {
        setCurrentView('cart');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#checkout') {
        setCurrentView('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#order-confirmation') {
        setCurrentView('order-confirmation');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#login' || path === '#register') {
        setCurrentView('login-register');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#account') {
        setCurrentView('my-account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#about' || path === '#about-us') {
        setCurrentView('about-us');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#contact') {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#faq') {
        setCurrentView('faq');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#brands') {
        setCurrentView('brands');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '#home' || path === '#') {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('404');
      }
    };

    window.addEventListener('hashchange', parseHash);
    parseHash(); // Execute initially on asset load

    return () => {
      window.removeEventListener('hashchange', parseHash);
    };
  }, []);

  // Action methods
  const navigateTo = (view: string, params?: Record<string, string>) => {
    let hashStr = `#${view}`;
    if (params) {
      const q = Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      hashStr += `?${q}`;
    }
    window.location.hash = hashStr;
  };

  const triggerToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, color?: string, storage?: string) => {
    setCart(prev => {
      // Look for identical SKU and variant attributes to aggregate quantities
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedStorage === storage
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      return [...prev, { product, quantity, selectedColor: color, selectedStorage: storage }];
    });
    
    triggerToast(`✓ Added ${product.name} to polar cart`, 'success');
  };

  const removeFromCart = (productId: string, color?: string, storage?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedColor === color && 
        item.selectedStorage === storage)
    ));
    triggerToast('✗ Removed item from cart', 'warning');
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, storage?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, storage);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && 
          item.selectedColor === color && 
          item.selectedStorage === storage) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const applyCoupon = (code: string): boolean => {
    const sanitize = code.trim().toUpperCase();
    if (sanitize === 'TECH10') {
      setCouponCode('TECH10');
      setCouponDiscount(0.10);
      triggerToast('✓ Coupon Applied! Saved 10% on products', 'success');
      return true;
    } else {
      triggerToast('✗ Invalid coupon code. Try TECH10', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
    triggerToast('Coupon removed from sequence', 'warning');
  };

  const toggleWishlist = (productId: string) => {
    let isAdded = false;
    setWishlist(prev => {
      if (prev.includes(productId)) {
        isAdded = false;
        return prev.filter(id => id !== productId);
      } else {
        isAdded = true;
        return [...prev, productId];
      }
    });

    const targetProduct = MOCK_PRODUCTS.find(p => p.id === productId);
    const prodName = targetProduct ? targetProduct.name : 'Item';

    if (isAdded) {
      triggerToast(`♡ Added ${prodName} to wishlist`, 'success');
    } else {
      triggerToast(`✗ Removed ${prodName} from wishlist`, 'warning');
    }
  };

  const addToComparison = (product: Product) => {
    setComparisonList(prev => {
      if (prev.find(p => p.id === product.id)) {
        triggerToast('Already in comparison board', 'warning');
        return prev;
      }
      if (prev.length >= 3) {
        triggerToast('Comparison limited to 3 gadgets', 'error');
        return prev;
      }
      triggerToast(`Added ${product.name} to specs comparison`, 'success');
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
    triggerToast('Removed from specs comparison', 'warning');
  };

  const clearComparison = () => {
    setComparisonList([]);
    triggerToast('Specs comparison cleared', 'warning');
  };

  const loginUser = (name: string, email: string) => {
    const updated = {
      name,
      email,
      phone: '+1 800-GADGETS',
      rewardPoints: 100,
    };
    setUserProfile(updated);
    triggerToast(`Welcome back, ${name}! 🎉`, 'success');
  };

  const logoutUser = () => {
    setUserProfile(null);
    triggerToast('Logged out successfully', 'warning');
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    
    // Add reward points for mock order!
    if (userProfile) {
      const earned = Math.floor(order.total / 10);
      setUserProfile({
        ...userProfile,
        rewardPoints: userProfile.rewardPoints + earned
      });
    }

    // Empty cart and coupon
    setCart([]);
    setCouponCode(null);
    setCouponDiscount(0);
    
    triggerToast('Order captured successfully! 🚀', 'success');
  };

  // Derived values
  const recentlyViewed: Product[] = recentlyViewedIds
    .map(id => MOCK_PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedProductId,
        recentlyViewed,
        comparisonList,
        cart,
        wishlist,
        couponCode,
        couponDiscount,
        searchQuery,
        selectedCategory,
        userProfile,
        orders,
        toasts,
        quickViewProduct,
        gridLayout,
        navigateTo,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        addToComparison,
        removeFromComparison,
        clearComparison,
        loginUser,
        logoutUser,
        addOrder,
        triggerToast,
        dismissToast,
        setQuickViewProduct,
        setGridLayout,
        setSearchQuery,
        setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider template');
  }
  return context;
}
