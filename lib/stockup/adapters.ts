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

// ─── Variante ────────────────────────────────────────────────────────────────

export function adaptVariant(v: StockUpVariant, productPrice: number): ProductVariant {
  const attributes = v.attributes || {};
  const selectedOptions = Object.entries(attributes).map(([name, value]) => ({
    name,
    value: String(value),
  }));

  if (selectedOptions.length === 0) {
    selectedOptions.push({ name: 'Presentación', value: v.name });
  }

  return {
    id: v.id,
    title: v.name,
    availableForSale: v.stock > 0,
    selectedOptions,
    price: toMoney(v.price ?? productPrice),
  };
}

// ─── Producto ────────────────────────────────────────────────────────────────

export function adaptProduct(p: StockUpProduct): Product {
  // Imágenes: array de strings URL → edges con node Image
  const imageEdges = (p.images || []).map((url) => ({
    node: toImage(url, p.name),
  }));

  if (imageEdges.length === 0) {
    imageEdges.push({ node: toImage(null, p.name) });
  }

  // Variantes: la API devuelve null cuando no hay variantes reales
  const rawVariants = Array.isArray(p.variants) ? p.variants : [];
  const variantEdges = rawVariants
    .filter((v) => v.isActive)
    .map((v) => ({ node: adaptVariant(v, p.price) }));

  // Sin variantes reales → crear variante "default" con el precio base del producto
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
  const productImage = item.product?.images?.[0] || null;

  return {
    id: item.id,
    quantity: item.quantity,
    merchandise: {
      id: item.variantId || item.productId,
      title: item.variant?.name || 'Único',
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
  const checkoutUrl = firstProductId
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
