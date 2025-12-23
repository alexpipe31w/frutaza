'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/lib/shopify/types';
import shopifyFetch from '@/lib/shopify/client';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from '@/lib/shopify/mutations';

type CartStore = {
  cart: Cart | null;
  isOpen: boolean;
  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // 👉 Crear carrito o agregar línea
      addToCart: async (variantId, quantity = 1) => {
        const currentCart = get().cart;

        try {
          if (!currentCart) {
            const data = await shopifyFetch<{
              cartCreate: { cart: Cart; userErrors: any[] };
            }>({
              query: CREATE_CART_MUTATION,
              variables: {
                input: {
                  lines: [{ merchandiseId: variantId, quantity }],
                },
              },
            });

            if (data.cartCreate.userErrors?.length) {
              console.error('cartCreate errors', data.cartCreate.userErrors);
              return;
            }

            set({ cart: data.cartCreate.cart, isOpen: true });
          } else {
            const data = await shopifyFetch<{
              cartLinesAdd: { cart: Cart; userErrors: any[] };
            }>({
              query: ADD_TO_CART_MUTATION,
              variables: {
                cartId: currentCart.id,
                lines: [{ merchandiseId: variantId, quantity }],
              },
            });

            if (data.cartLinesAdd.userErrors?.length) {
              console.error('cartLinesAdd errors', data.cartLinesAdd.userErrors);
              return;
            }

            set({ cart: data.cartLinesAdd.cart, isOpen: true });
          }
        } catch (error) {
          console.error('Error addToCart', error);
        }
      },

      // 👉 Cambiar cantidad
      updateLine: async (lineId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        try {
          const data = await shopifyFetch<{
            cartLinesUpdate: { cart: Cart; userErrors: any[] };
          }>({
            query: UPDATE_CART_MUTATION,
            variables: {
              cartId: currentCart.id,
              lines: [{ id: lineId, quantity }],
            },
          });

          if (data.cartLinesUpdate.userErrors?.length) {
            console.error('cartLinesUpdate errors', data.cartLinesUpdate.userErrors);
            return;
          }

          set({ cart: data.cartLinesUpdate.cart });
        } catch (error) {
          console.error('Error updateLine', error);
        }
      },

      // 👉 Eliminar línea
      removeLine: async (lineId) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        try {
          const data = await shopifyFetch<{
            cartLinesRemove: { cart: Cart; userErrors: any[] };
          }>({
            query: REMOVE_FROM_CART_MUTATION,
            variables: {
              cartId: currentCart.id,
              lineIds: [lineId],
            },
          });

          if (data.cartLinesRemove.userErrors?.length) {
            console.error('cartLinesRemove errors', data.cartLinesRemove.userErrors);
            return;
          }

          set({ cart: data.cartLinesRemove.cart });
        } catch (error) {
          console.error('Error removeLine', error);
        }
      },
    }),
    {
      name: 'frutaza-cart',
      partialize: (state) => ({ cart: state.cart }), // lo que se guarda en localStorage
    }
  )
);
