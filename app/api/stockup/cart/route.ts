// app/api/stockup/cart/route.ts
// Route Handler que actúa como proxy entre el browser y StockUp.
// NUNCA expone la API Key al browser — todas las llamadas van por aquí.
//
// Operaciones soportadas:
//   GET    ?sessionId=xxx           → obtener carrito
//   POST   { action, sessionId, ... } → crear/agregar/actualizar/eliminar

import { NextRequest, NextResponse } from 'next/server';
import { stockupConfig } from '@/lib/stockup/config';
import { adaptCart } from '@/lib/stockup/adapters';
import type { StockUpCart } from '@/lib/stockup/types';

const STOCKUP_API = `${stockupConfig.apiUrl}/api`;
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': stockupConfig.apiKey,
};

async function stockupCartFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${STOCKUP_API}${endpoint}`, {
    ...options,
    headers: { ...HEADERS, ...(options.headers || {}) },
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `StockUp cart error: ${res.status}`);
  }

  return json.data as T;
}

// ─── GET — Obtener carrito por sessionId ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requerido' }, { status: 400 });
  }

  try {
    const cart = await stockupCartFetch<StockUpCart>(`/cart?sessionId=${sessionId}`);
    return NextResponse.json({ success: true, data: adaptCart(cart) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ─── POST — Operaciones del carrito ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, ...rest } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requerido' }, { status: 400 });
    }

    let cart: StockUpCart;

    switch (action) {
      // Agregar item al carrito
      case 'add': {
        const { productId, variantId, quantity = 1 } = rest;
        cart = await stockupCartFetch<StockUpCart>('/cart', {
          method: 'POST',
          body: JSON.stringify({ sessionId, productId, variantId, quantity }),
        });
        break;
      }

      // Actualizar cantidad de un item
      case 'update': {
        const { cartItemId, quantity } = rest;
        cart = await stockupCartFetch<StockUpCart>('/cart', {
          method: 'PUT',
          body: JSON.stringify({ sessionId, cartItemId, quantity }),
        });
        break;
      }

      // Eliminar item del carrito
      case 'remove': {
        const { cartItemId } = rest;
        cart = await stockupCartFetch<StockUpCart>('/cart', {
          method: 'DELETE',
          body: JSON.stringify({ sessionId, cartItemId }),
        });
        break;
      }

      default:
        return NextResponse.json({ error: `Acción desconocida: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: adaptCart(cart) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}