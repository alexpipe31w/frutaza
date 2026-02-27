'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/lib/stockup/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Genera un sessionId único si no existe en localStorage */
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

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error en operación del carrito');
  }

  return json.data as Cart;
}

// ─── Store ───────────────────────────────────────────────────────────────────

type CartStore = {
  cart: Cart | null;
  isOpen: boolean;

  // UI
  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Operaciones — misma firma que antes para no romper componentes
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cart: null,
      isOpen: false,

      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ── Agregar al carrito ──────────────────────────────────────────────
      // Firma idéntica a Shopify: addToCart(variantId, quantity)
      // En StockUp: variantId puede ser el ID de variante O el ID de producto
      // (cuando el producto no tiene variantes, usamos el productId directamente)
      addToCart: async (variantId, quantity = 1) => {
        const sessionId = getOrCreateSessionId();

        try {
          // variantId puede venir como "productId-default" (variante sintética del adapter)
          // o como un UUID real de variante.
          // Si termina en "-default", es un producto sin variantes reales.
          const isDefaultVariant = variantId.endsWith('-default');
          const productId = isDefaultVariant
            ? variantId.replace('-default', '')
            : null;

          const cart = await cartFetch({
            action: 'add',
            sessionId,
            // Si es variante real, pasar variantId. Si es default, pasar solo productId.
            productId: productId || undefined,
            variantId: isDefaultVariant ? undefined : variantId,
            quantity,
          });

          set({ cart, isOpen: true });
        } catch (error) {
          console.error('[useCart] addToCart error:', error);
        }
      },

      // ── Actualizar cantidad ─────────────────────────────────────────────
      // lineId = cartItem.id (equivalente al line.id de Shopify)
      updateLine: async (lineId, quantity) => {
        const sessionId = getOrCreateSessionId();

        try {
          const cart = await cartFetch({
            action: 'update',
            sessionId,
            cartItemId: lineId,
            quantity,
          });

          set({ cart });
        } catch (error) {
          console.error('[useCart] updateLine error:', error);
        }
      },

      // ── Eliminar del carrito ────────────────────────────────────────────
      // lineId = cartItem.id
      removeLine: async (lineId) => {
        const sessionId = getOrCreateSessionId();

        try {
          const cart = await cartFetch({
            action: 'remove',
            sessionId,
            cartItemId: lineId,
          });

          set({ cart });
        } catch (error) {
          console.error('[useCart] removeLine error:', error);
        }
      },
    }),
    {
      name: 'frutaza-cart',                          // misma key de localStorage que antes
      partialize: (state) => ({ cart: state.cart }), // solo persistir el carrito
    }
  )
);