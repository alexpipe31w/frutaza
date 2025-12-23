'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateLine, removeLine } = useCart(); // 👈 usar acciones

  const subtotal = cart?.cost.subtotalAmount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <span className="text-9xl mb-4 block">🛒</span>
            <h1 className="text-4xl font-display font-bold text-frutaza-verde-oscuro mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              ¡Agrega deliciosas mermeladas a tu carrito!
            </p>
            <Link href="/products">
              <Button size="lg">Ver Productos 🍊</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-frutaza-crema">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold text-frutaza-verde-oscuro mb-8">
          Mi Carrito 🛒
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.lines.edges.map(({ node: line }) => (
              <div
                key={line.id}
                className="bg-white rounded-xl shadow-lg p-6 flex gap-6"
              >
                {/* Imagen */}
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  {line.merchandise.product.featuredImage ? (
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-frutaza-amarillo to-frutaza-verde-vivo" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-frutaza-verde-oscuro mb-2">
                    {line.merchandise.product.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{line.merchandise.title}</p>

                  <div className="flex items-center justify-between gap-4">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-frutaza-verde-oscuro disabled:opacity-40"
                        disabled={line.quantity <= 1}
                        onClick={() =>
                          updateLine(line.id, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center">
                        {line.quantity}
                      </span>
                      <button
                        className="w-8 h-8 rounded-full bg-frutaza-verde-vivo text-white flex items-center justify-center text-lg font-bold hover:bg-frutaza-verde-oscuro"
                        onClick={() =>
                          updateLine(line.id, line.quantity + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        className="ml-4 text-sm text-red-500 hover:underline"
                        onClick={() => removeLine(line.id)}
                      >
                        Eliminar
                      </button>
                    </div>

                    <span className="text-2xl font-bold text-frutaza-verde-oscuro">
                      $
                      {parseFloat(
                        line.cost.totalAmount.amount
                      ).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-frutaza-verde-oscuro mb-6">
                Resumen
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span>Calculado en checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-frutaza-verde-oscuro">
                  <span>Total:</span>
                  <span>${subtotal.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!cart.checkoutUrl}
                    onClick={() => {
                      if (cart.checkoutUrl) {
                        window.location.href = cart.checkoutUrl;
                      }
                    }}
                  >
                    Pagar
                  </Button>
              <Link href="/products" className="block mt-4">
                <Button size="md" variant="outline" className="w-full">
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
