// lib/stockup/adapters.ts
// Convierte respuestas reales de la API de StockUp al formato compatible con Shopify.
// Estructura real confirmada:
// { id, name, description, price (number), images (string[]), variants (null | array), ... }

import type {
  StockUpProduct,
  StockUpVariant,
  StockUpCart,
  StockUpCartItem,
  Product,
  ProductVariant,
  Cart,
  CartLine,
  Money,
  Image,
} from './types';
import { stockupConfig } from './config';

const CURRENCY = 'COP';
const PLACEHOLDER_IMAGE = '/images/logo-redondo.png';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toMoney(amount: number | null | undefined): Money {
  return {
    amount: String(amount ?? 0),
    currencyCode: CURRENCY,
  };
}

function toImage(url: string | null | undefined, altText?: string | null): Image {
  return {
    url: url || PLACEHOLDER_IMAGE,
    altText: altText || null,
    width: 600,
    height: 600,
  };
}

function extractVariantLabel(name: string): string {
  const match = name.match(/[-\s](\d+\s*(?:GR|G|ML|KG|L))\s*[✨\s]*$/i);
  if (match) return match[1].toUpperCase();
  return name.replace(/✨/g, '').replace(/\s+/g, ' ').trim();
}

// ─── Variante ────────────────────────────────────────────────────────────────

export function adaptVariant(v: StockUpVariant, productPrice: number): ProductVariant {
  const attributes = v.attributes || {};

  const selectedOptions =
    Object.keys(attributes).length > 0
      ? Object.entries(attributes).map(([name, value]) => ({
          name,
          value: String(value),
        }))
      : [{ name: 'Presentación', value: extractVariantLabel(v.name) }];

  return {
    id: v.id,
    title: extractVariantLabel(v.name),
    availableForSale: v.stock > 0,
    selectedOptions,
    price: toMoney(v.price ?? productPrice),
    image: v.image || null,
  };
}

// ─── Producto ────────────────────────────────────────────────────────────────

export function adaptProduct(p: StockUpProduct): Product {
  const imageEdges = (p.images || []).map((url) => ({
    node: toImage(url, p.name),
  }));

  if (imageEdges.length === 0) {
    imageEdges.push({ node: toImage(null, p.name) });
  }

  const rawVariants = Array.isArray(p.variants) ? p.variants : [];
  const variantEdges = rawVariants
    .filter((v) => v.isActive !== false) // defensivo: incluye si isActive es true o undefined
    .map((v) => ({ node: adaptVariant(v, p.price) }));

  if (variantEdges.length === 0) {
    variantEdges.push({
      node: {
        id: `${p.id}-default`,
        title: 'Único',
        availableForSale: p.stock > 0,
        selectedOptions: [{ name: 'Presentación', value: 'Único' }],
        price: toMoney(p.price),
      },
    });
  }

  const prices = variantEdges.map((v) => parseFloat(v.node.price.amount));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    id: p.id,
    handle: p.id,
    title: p.name,
    description: p.description || '',
    descriptionHtml: p.description || '',
    availableForSale: p.stock > 0 || variantEdges.some((v) => v.node.availableForSale),
    tags: [],
    priceRange: {
      minVariantPrice: toMoney(minPrice),
      maxVariantPrice: toMoney(maxPrice),
    },
    images: { edges: imageEdges },
    variants: { edges: variantEdges },
  };
}

export function adaptProducts(products: StockUpProduct[]): Product[] {
  return (products || []).map(adaptProduct);
}

// ─── Carrito ─────────────────────────────────────────────────────────────────

function adaptCartItem(item: StockUpCartItem): CartLine {
  const itemTotal = item.price * item.quantity;
  const productImage = item.variant?.image || item.product?.images?.[0] || null;

  return {
    id: item.id,
    quantity: item.quantity,
    merchandise: {
      id: item.variantId || item.productId,
      title: item.variant?.name ? extractVariantLabel(item.variant.name) : 'Único',
      product: {
        title: item.product?.name || '',
        featuredImage: toImage(productImage, item.product?.name),
      },
      price: toMoney(item.price),
    },
    cost: {
      totalAmount: toMoney(itemTotal),
    },
  };
}

export function adaptCart(
  stockupCart: StockUpCart,
  tenantSlug: string = stockupConfig.tenantSlug
): Cart {
  const lines = (stockupCart.items || []).map(adaptCartItem);

  const subtotal = lines.reduce(
    (acc, l) => acc + parseFloat(l.cost.totalAmount.amount),
    0
  );

  const firstProductId = stockupCart.items?.[0]?.productId || '';

  // FIX: usar solo cartSessionId=stockupCart.sessionId (el frutaza-session-id).
  // NO incluir sessionId=stockupCart.id (el UUID interno del carrito en BD),
  // porque el CheckoutPage de StockUp solo lee cartSessionId en searchParams.
  const checkoutUrl = firstProductId && stockupCart.sessionId
    ? `${stockupConfig.apiUrl}/checkout/${tenantSlug}/${firstProductId}?cartSessionId=${stockupCart.sessionId}`
    : firstProductId
    ? `${stockupConfig.apiUrl}/checkout/${tenantSlug}/${firstProductId}`
    : '';

  return {
    id: stockupCart.id,
    checkoutUrl,
    totalQuantity: stockupCart.itemCount || lines.reduce((acc, l) => acc + l.quantity, 0),
    cost: {
      subtotalAmount: toMoney(subtotal),
      totalAmount: toMoney(subtotal),
    },
    lines: {
      edges: lines.map((node) => ({ node })),
    },
  };
}