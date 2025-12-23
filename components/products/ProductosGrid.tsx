'use client';

import { ProductosEnRamas } from './ProductosEnRamas';
import type { Product } from '@/lib/shopify/types';
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
