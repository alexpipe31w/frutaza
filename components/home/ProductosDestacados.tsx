'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductosEnRamas } from '@/components/products/ProductosEnRamas';
import type { Product } from '@/lib/stockup/types';
import { useCart } from '@/hooks/useCart';

export function ProductosDestacados() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/stockup/products?featured=true&limit=10');
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (error) {
        console.error('[ProductosDestacados] Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // ── CAMBIO: recibe price y lo pasa a addToCart
const handleAddToCart = (productId: string, variantId: string | null, quantity: number, price: number) => {
  addToCart(productId, variantId, quantity, price);
};

  return (
    <section className="relative py-20 bg-frutatza-crema overflow-visible">
      <div className="relative z-[1]">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-frutatza-verde-oscuro mb-4">
            Productos destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Descubre nuestras mermeladas artesanales elaboradas con frutas amazónicas
          </p>
          <div className="w-24 h-1 bg-frutatza-amarillo mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-frutatza-verde-vivo" />
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductosEnRamas products={products} onAddToCart={handleAddToCart} />
        ) : (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">🎋</span>
            <p className="text-xl text-gray-600 mb-8">Próximamente tendremos productos disponibles</p>
            <p className="text-gray-500">Estamos preparando nuestras deliciosas mermeladas para ti</p>
          </div>
        )}

        <div className="container mx-auto px-4 text-center mt-16 mr-auto mb-10">
          <Link href="/products">
            <Button size="lg" variant="primary">Ver Todos Los Productos 🛒</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
