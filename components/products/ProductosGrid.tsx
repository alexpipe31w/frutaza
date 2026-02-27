'use client';

import { ProductosEnRamas } from './ProductosEnRamas';
import type { Product } from '@/lib/stockup/types'; // ← ÚNICO CAMBIO
import { useCart } from '@/hooks/useCart';

type Props = {
  products: Product[];
};

export function ProductosGrid({ products }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (variantId: string) => {
    addToCart(variantId, 1);
  };

  return <ProductosEnRamas products={products} onAddToCart={handleAddToCart} />;
}
