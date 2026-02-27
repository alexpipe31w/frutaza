// lib/stockup/types.ts
// Mantiene la misma forma que lib/shopify/types.ts para no romper componentes.
// Los adaptadores (toShopifyProduct, etc.) convierten la respuesta de StockUp a estos tipos.

// ─── Tipos internos de StockUp (lo que devuelve la API) ───────────────────────

export type StockUpVariant = {
  id: string;
  name: string;
  sku: string;
  price: number | null;       // Decimal como número
  stock: number;
  attributes: Record<string, string>; // { "color": "Verde", "peso": "250g" }
  image: string | null;
  weight: number | null;
  isActive: boolean;
};

export type StockUpProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;              // Decimal como número
  sku: string | null;
  stock: number;
  images: string[];           // Array de URLs directas
  weight: number | null;
  shippingEnabled: boolean;
  shippingStandard: number;
  shippingExpress: number;
  isActive: boolean;
  hasVariants: boolean;
  variants: StockUpVariant[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  checkout_url: string;       // Ya viene construida desde la API de StockUp
};

export type StockUpCartItem = {
  id: string;                 // ID del CartItem
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  variant: {
    id: string;
    name: string;
  } | null;
};

export type StockUpCart = {
  id: string;                 // ID del Cart
  sessionId: string;
  items: StockUpCartItem[];
  totalValue: number;
  itemCount: number;
};

// ─── Tipos compatibles con Shopify (lo que usan los componentes) ──────────────
// Mantenemos los mismos nombres/formas para no cambiar los componentes.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: Money;
  compareAtPrice?: Money;
};

export type Product = {
  id: string;
  handle: string;             // En StockUp = id (no hay handle/slug en productos)
  title: string;              // Mapeado desde name
  description: string;
  descriptionHtml: string;    // Igual que description (StockUp no tiene HTML)
  availableForSale: boolean;  // stock > 0
  tags: string[];             // Siempre [] (StockUp no tiene tags)
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: {
    edges: Array<{
      node: Image;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      featuredImage: Image;
    };
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;        // Construida como /checkout/frutaza/[productId]
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
};