// lib/stockup/types.ts

// ─── Tipos internos de StockUp (lo que devuelve la API) ───────────────────────

export type StockUpVariant = {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  attributes: Record<string, string>;
  image: string | null;
  weight: number | null;
  isActive: boolean;
};

export type StockUpProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number;
  images: string[];
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
  checkout_url: string;
};

export type StockUpCartItem = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
  } | null;
  variant: {
    id: string;
    name: string;
    image: string | null;   // ← FIX: agregado
    price: number | null;   // ← FIX: agregado
  } | null;
};

export type StockUpCart = {
  id: string;
  sessionId: string;
  items: StockUpCartItem[];
  totalValue: number;
  itemCount: number;
};

// ─── Tipos compatibles con Shopify (lo que usan los componentes) ──────────────

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
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
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
  checkoutUrl: string;
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