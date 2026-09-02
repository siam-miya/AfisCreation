import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      shippingMethod: 'inside', 

      addToCart: (product) => set((state) => {
        const productId = product._id || product.id;
        const existingItem = state.cart.find((item) => (item._id || item.id) === productId);
        
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              (item._id || item.id) === productId ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: product.quantity || 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => (item._id || item.id) !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      setShippingMethod: (method) => set({ shippingMethod: method }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'classybazar-shopping-cart', 
    }
  )
);