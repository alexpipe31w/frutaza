'use client';

import { ProductosEnRamas } from './ProductosEnRamas';
import type { Product } from '@/lib/stockup/types';
import { useCart } from '@/hooks/useCart';

type Props = {
  products: Product[];
};

export function ProductosGrid({ products }: Props) {
  const { addToCart } = useCart();

  // ── CAMBIO: recibe price y lo pasa a addToCart
  const handleAddToCart = (variantId: string, quantity: number, price: number) => {
    addToCart(variantId, quantity, price);
  };

  return <ProductosEnRamas products={products} onAddToCart={handleAddToCart} />;
}
