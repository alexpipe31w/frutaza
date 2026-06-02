'use client';

import { ProductoEnRama } from './ProductoEnRama';
import type { Product } from '@/lib/stockup/types';

type Props = {
  products: Product[];
  onAddToCart: (productId: string, variantId: string | null, quantity: number, price: number) => void;
};

export function ProductosEnRamas({ products, onAddToCart }: Props) {
  return (
    <div className="relative py-6 md:py-8 px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex justify-center">
            <ProductoEnRama
              product={product}
              index={index}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
