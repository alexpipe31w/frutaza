'use client';

import { ProductoEnRama } from './ProductoEnRama';
import type { Product } from '@/lib/shopify/types';

type Props = {
  products: Product[];
  onAddToCart: (variantId: string) => void;
};

export function ProductosEnRamas({ products, onAddToCart }: Props) {
  // Partir productos en filas de 2
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(products.slice(i, i + 2));
  }

  return (
    <div className="relative py-12 md:py-20 px-2 md:px-4">
      {/* Productos en ramas */}
      <div className="relative z-10 space-y-12 md:space-y-16">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 items-center"
          >
            {/* Columna izquierda */}
            {row[0] && (
              <div className="flex justify-center md:justify-end">
                <ProductoEnRama
                  product={row[0]}
                  index={rowIndex * 2}
                  onAddToCart={onAddToCart}
                />
              </div>
            )}

            {/* Columna derecha */}
            {row[1] && (
              <div className="flex justify-center md:justify-start">
                <ProductoEnRama
                  product={row[1]}
                  index={rowIndex * 2 + 1}
                  onAddToCart={onAddToCart}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
