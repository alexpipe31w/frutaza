// lib/stockup/queries.ts
// La API de StockUp devuelve: { success: true, data: [...], meta: { page, limit, total, totalPages } }
// stockupFetch hace `return json.data`, por lo que recibimos el array de productos directamente.

import stockupFetch from './client';
import { adaptProducts, adaptProduct } from './adapters';
import type { StockUpProduct } from './types';
import type { Product } from './types';

type GetProductsParams = {
  limit?: number;
  page?: number;
  categoryId?: string;
  search?: string;
};

// ─── Productos ───────────────────────────────────────────────────────────────

export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  // stockupFetch retorna json.data = array de productos directamente
  const products = await stockupFetch<StockUpProduct[]>('/products', {
    searchParams: {
      limit: params.limit || 20,
      page: params.page || 1,
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.search && { search: params.search }),
      isActive: true,
    },
    revalidate: 60,
  });

  return adaptProducts(Array.isArray(products) ? products : []);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await stockupFetch<StockUpProduct>(`/products/${id}`, {
      revalidate: 30,
    });
    return adaptProduct(product);
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(params: {
  categorySlug?: string;
  limit?: number;
} = {}): Promise<Product[]> {
  const products = await stockupFetch<StockUpProduct[]>('/products', {
    searchParams: {
      limit: params.limit || 10,
      isActive: true,
      ...(params.categorySlug && { categorySlug: params.categorySlug }),
    },
    revalidate: 60,
  });

  return adaptProducts(Array.isArray(products) ? products : []);
}

// ─── Cupones ─────────────────────────────────────────────────────────────────

type ValidateCouponParams = {
  code: string;
  subtotal: number;
  productIds?: string[];
};

type CouponValidationResult = {
  valid: boolean;
  code?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  discountAmount?: number;
  totalAfterDiscount?: number;
  description?: string;
  reason?: string;
};

export async function validateCoupon(
  params: ValidateCouponParams
): Promise<CouponValidationResult> {
  return stockupFetch<CouponValidationResult>('/products/coupons/validate', {
    method: 'POST',
    body: {
      code: params.code,
      subtotal: params.subtotal,
      productIds: params.productIds || [],
    },
    revalidate: 0,
  });
}
