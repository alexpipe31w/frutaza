'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/lib/stockup/types';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem('frutaza-session-id');
  if (existing) return existing;
  const newId = crypto.randomUUID();
  localStorage.setItem('frutaza-session-id', newId);
  return newId;
}

async function cartFetch(body: Record<string, unknown>): Promise<Cart> {
  const res = await fetch('/api/stockup/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Respuesta inválida del carrito: ${text.slice(0, 100)}`);
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error en operación del carrito');
  }

  return json.data as Cart;
}

type CartStore = {
  cart: Cart | null;
  isOpen: boolean;
  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // FIX: ahora recibe productId explícito además de variantId
  addToCart: (productId: string, variantId: string | null, quantity?: number, price?: number) => Promise<void>;
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

      // FIX: productId siempre llega explícito desde el componente
      // variantId es null si es producto sin variantes (default)
      addToCart: async (productId, variantId, quantity = 1, price = 0) => {
        const sessionId = getOrCreateSessionId();

        try {
          const cart = await cartFetch({
            action: 'add',
            sessionId,
            productId,
            variantId: variantId || null,
            quantity,
            price,
          });

          set({ cart, isOpen: true });
        } catch (error) {
          console.error('[useCart] addToCart error:', error);
        }
      },

      updateLine: async (lineId, quantity) => {
        const sessionId = getOrCreateSessionId();
        const cartId = get().cart?.id;

        try {
          const cart = await cartFetch({
            action: 'update',
            sessionId,
            cartItemId: lineId,
            cartId,
            quantity,
          });

          set({ cart });
        } catch (error) {
          console.error('[useCart] updateLine error:', error);
        }
      },

      removeLine: async (lineId) => {
        const sessionId = getOrCreateSessionId();
        const cartId = get().cart?.id;

        try {
          const cart = await cartFetch({
            action: 'remove',
            sessionId,
            cartItemId: lineId,
            cartId,
          });

          set({ cart });
        } catch (error) {
          console.error('[useCart] removeLine error:', error);
        }
      },
    }),
    {
      name: 'frutaza-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);