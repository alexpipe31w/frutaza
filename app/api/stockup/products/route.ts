// app/api/stockup/products/route.ts
// Route Handler para obtener productos de StockUp desde el cliente.
// Los componentes 'use client' llaman a /api/stockup/products en lugar de Shopify directamente.

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getFeaturedProducts } from '@/lib/stockup/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const categorySlug = searchParams.get('categorySlug') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') === 'true';

  try {
    const products = featured
      ? await getFeaturedProducts({ categorySlug, limit })
      : await getProducts({ limit, page, search });

    return NextResponse.json(
      { success: true, data: products },
      {
        headers: {
          // Cache de 60s en el edge para no saturar StockUp
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[/api/stockup/products]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}