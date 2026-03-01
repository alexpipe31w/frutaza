'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/lib/stockup/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Store ───────────────────────────────────────────────────────────────────

type CartStore = {
  cart: Cart | null;
  isOpen: boolean;
  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // addToCart recibe variantId (puede ser "productId-default") y el precio unitario
  addToCart: (variantId: string, quantity?: number, price?: number) => Promise<void>;
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

      // ── Agregar al carrito ──────────────────────────────────────────────
      // variantId viene del adapter: UUID real de variante, o "${productId}-default"
      // price viene del componente ProductoEnRama (precio de la variante seleccionada)
      addToCart: async (variantId, quantity = 1, price) => {
        const sessionId = getOrCreateSessionId();

        try {
          const isDefaultVariant = variantId.endsWith('-default');
          const productId = isDefaultVariant
            ? variantId.replace('-default', '')
            : null;

          // Si no se pasa price, intentar obtenerlo del carrito actual
          // (no debería pasar si ProductoEnRama lo pasa correctamente)
          const unitPrice = price ?? 0;

          const cart = await cartFetch({
            action: 'add',
            sessionId,
            productId: productId || undefined,
            variantId: isDefaultVariant ? undefined : variantId,
            quantity,
            price: unitPrice,
          });

          set({ cart, isOpen: true });
        } catch (error) {
          console.error('[useCart] addToCart error:', error);
        }
      },

      // ── Actualizar cantidad ─────────────────────────────────────────────
      // StockUp necesita cartId además de cartItemId
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

      // ── Eliminar del carrito ────────────────────────────────────────────
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