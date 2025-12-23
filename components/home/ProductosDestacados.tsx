'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductosEnRamas } from '@/components/products/ProductosEnRamas';
import type { Product } from '@/lib/shopify/types';
import shopifyFetch from '@/lib/shopify/client';
import { GET_FEATURED_PRODUCTS_QUERY } from '@/lib/shopify/queries';
import { useCart } from '@/hooks/useCart';

interface CapaSelvaConfig {
  opacity?: number;
  scale?: number;
  objectPosition?: string;
}

// ✨ CONFIGURACIÓN DE LA CAPA DECORATIVA AL FRENTE
const capaConfig: CapaSelvaConfig = {
  opacity: 1,
  scale: 0.6,
  objectPosition: 'bottom center',
};

type FeaturedResponse = {
  collection: {
    id: string;
    handle: string;
    title: string;
    products: {
      edges: Array<{ node: Product }>;
    };
  } | null;
};

export function ProductosDestacados() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await shopifyFetch<FeaturedResponse>({
          query: GET_FEATURED_PRODUCTS_QUERY,
          variables: {
            handle: 'productos-destacados', // 👈 handle de la colección en Shopify
            first: 10,
          },
        });

        const nodes = data.collection
          ? data.collection.products.edges.map(({ node }) => node)
          : [];

        setProducts(nodes);
      } catch (error) {
        console.error('Error fetching featured products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleAddToCart = (variantId: string) => {
    addToCart(variantId, 1);
  };

  return (
    <section className="relative py-20 bg-frutaza-crema overflow-visible">
      {/* ========== CAPA 2: CONTENIDO (ATRÁS) ========== */}
      <div className="relative z-[1]">
        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-frutaza-verde-oscuro mb-4">
            Productos destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Descubre nuestras mermeladas artesanales elaboradas con frutas amazónicas
          </p>
          <div className="w-24 h-1 bg-frutaza-amarillo mx-auto rounded-full" />
        </div>

        {/* Productos en ramas */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-frutaza-verde-vivo" />
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductosEnRamas products={products} onAddToCart={handleAddToCart} />
        ) : (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">🎋</span>
            <p className="text-xl text-gray-600 mb-8">
              Próximamente tendremos productos disponibles
            </p>
            <p className="text-gray-500">
              Estamos preparando nuestras deliciosas mermeladas para ti
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="container mx-auto px-4 text-center mt-16 mr-auto mb-10">
          <Link href="/products">
            <Button size="lg" variant="primary">
              Ver Todos Los Productos 🛒
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
