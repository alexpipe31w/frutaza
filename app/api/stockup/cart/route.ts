// app/api/stockup/cart/route.ts (en Frutaza)
// Proxy entre Frutaza y el endpoint público del carrito de StockUp.
// StockUp endpoint: /api/public/v1/cart (GET, POST, PATCH)

import { NextRequest, NextResponse } from 'next/server';
import { stockupConfig } from '@/lib/stockup/config';

const CART_URL = `${stockupConfig.apiUrl}/api/public/v1/cart`;
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': stockupConfig.apiKey,
};

// ─── Adaptador: respuesta pública del carrito → Cart compatible con Shopify ──
// FIX: ahora recibe sessionId (el frutaza-session-id) para construir checkoutUrl correcta
function adaptCart(data: any, sessionId?: string) {
  if (!data) return null;

  const lines = (data.items || []).map((item: any) => {
    const productImage = item.variant?.image || item.product?.images?.[0] || null;
    const unitPrice = Number(item.price ?? 0);
    const totalAmount = unitPrice * item.quantity;

    return {
      node: {
        id: item.id,
        quantity: item.quantity,
        merchandise: {
          id: item.variantId || item.productId,
          title: item.variant?.name || 'Único',
          product: {
            title: item.product?.name || '',
            featuredImage: {
              url: productImage || '/images/logo-redondo.png',
              altText: item.product?.name || null,
              width: 600,
              height: 600,
            },
          },
          price: {
            amount: String(unitPrice),
            currencyCode: 'COP',
          },
        },
        cost: {
          totalAmount: {
            amount: String(totalAmount),
            currencyCode: 'COP',
          },
        },
      },
    };
  });

  const subtotal = Number(data.totalValue ?? 0);
  const firstItem = data.items?.[0];

  // FIX PRINCIPAL: usar data.sessionId (el frutaza-session-id guardado en StockUp)
  // como cartSessionId. El parámetro sessionId que llega aquí ES ese valor
  // porque el POST lo manda desde useCart → cartFetch → body.sessionId
  const cartSessionId = data.sessionId || sessionId;

  const checkoutUrl =
    firstItem && cartSessionId
      ? `${stockupConfig.apiUrl}/checkout/${stockupConfig.tenantSlug}/${firstItem.productId}?cartSessionId=${cartSessionId}`
      : firstItem
      ? `${stockupConfig.apiUrl}/checkout/${stockupConfig.tenantSlug}/${firstItem.productId}`
      : '';

  return {
    id: data.id,
    checkoutUrl,
    totalQuantity: data.itemCount ?? 0,
    cost: {
      subtotalAmount: { amount: String(subtotal), currencyCode: 'COP' },
      totalAmount: { amount: String(subtotal), currencyCode: 'COP' },
    },
    lines: { edges: lines },
  };
}

// ─── GET — Obtener carrito ────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requerido' }, { status: 400 });
  }

  try {
    const res = await fetch(`${CART_URL}?sessionId=${sessionId}`, {
      headers: HEADERS,
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || `Error ${res.status}`);
    }

    // FIX: pasar sessionId para que adaptCart construya checkoutUrl correcta
    return NextResponse.json({ success: true, data: adaptCart(json.data, sessionId) });
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

    let json: any;

    switch (action) {

      // ── Agregar item ────────────────────────────────────────────────────────
      case 'add': {
        const { productId, variantId, quantity = 1, price } = rest;

        if (!productId || price === undefined) {
          return NextResponse.json(
            { error: 'productId y price son requeridos' },
            { status: 400 }
          );
        }

        const res = await fetch(CART_URL, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({
            sessionId,
            productId,
            variantId: variantId || null,
            quantity,
            price,
          }),
          cache: 'no-store',
        });

        const text = await res.text();
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta inválida de StockUp: ${text.slice(0, 200)}`);
        }

        if (!res.ok || !json.success) {
          throw new Error(json.error || `Error ${res.status} al agregar`);
        }
        break;
      }

      // ── Actualizar cantidad ─────────────────────────────────────────────────
      case 'update': {
        const { cartItemId, quantity, cartId } = rest;

        const res = await fetch(CART_URL, {
          method: 'PATCH',
          headers: HEADERS,
          body: JSON.stringify({ cartId, itemId: cartItemId, quantity }),
          cache: 'no-store',
        });

        const text = await res.text();
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta inválida de StockUp: ${text.slice(0, 200)}`);
        }

        if (!res.ok || !json.success) {
          throw new Error(json.error || `Error ${res.status} al actualizar`);
        }
        break;
      }

      // ── Eliminar item (quantity = 0) ────────────────────────────────────────
      case 'remove': {
        const { cartItemId, cartId } = rest;

        const res = await fetch(CART_URL, {
          method: 'PATCH',
          headers: HEADERS,
          body: JSON.stringify({ cartId, itemId: cartItemId, quantity: 0 }),
          cache: 'no-store',
        });

        const text = await res.text();
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta inválida de StockUp: ${text.slice(0, 200)}`);
        }

        if (!res.ok || !json.success) {
          throw new Error(json.error || `Error ${res.status} al eliminar`);
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: `Acción desconocida: ${action}` },
          { status: 400 }
        );
    }

    // FIX: pasar sessionId para que adaptCart construya checkoutUrl correcta
    return NextResponse.json({ success: true, data: adaptCart(json.data, sessionId) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[/api/stockup/cart POST]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}