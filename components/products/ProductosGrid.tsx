'use client';

import { ProductosEnRamas } from './ProductosEnRamas';
import type { Product } from '@/lib/stockup/types';
import { useCart } from '@/hooks/useCart';

type Props = {
  products: Product[];
};

export function ProductosGrid({ products }: Props) {
  const { addToCart } = useCart();

  // FIX: nueva firma recibe productId explícito
  const handleAddToCart = (productId: string, variantId: string | null, quantity: number, price: number) => {
    addToCart(productId, variantId, quantity, price);
  };

  return <ProductosEnRamas products={products} onAddToCart={handleAddToCart} />;
}
