'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { stockupConfig } from '@/lib/stockup/config';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateLine, removeLine } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animación GSAP — sin cambios
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, display: 'block', duration: 0.3 });
      gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power2.in' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  // ── CAMBIO: subtotal calculado igual — cart.cost.subtotalAmount.amount
  // sigue siendo string Money gracias al adapter
  const subtotal = cart?.cost.subtotalAmount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;

  // ── CAMBIO: checkoutUrl — el adapter construye /checkout/frutaza/[productId]
  // Si el carrito tiene múltiples productos, redirigir al primer producto.
  // StockUp maneja el carrito completo por sessionId en su checkout.
  const handleCheckout = () => {
    if (!cart?.checkoutUrl) return;
    window.location.href = cart.checkoutUrl;
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 transform translate-x-full"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-frutaza-verde-oscuro text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <h2 className="text-2xl font-display font-bold">Mi Carrito</h2>
            </div>
            <button
              onClick={closeCart}
              className="text-white hover:text-frutaza-amarillo transition-colors duration-300 text-3xl"
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {!cart || cart.lines.edges.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-8xl mb-4">🍃</span>
                <p className="text-xl text-gray-500 mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">¡Agrega deliciosas mermeladas!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.lines.edges.map(({ node: line }) => (
                  <div key={line.id} className="flex gap-4 bg-frutaza-crema p-4 rounded-lg">
                    {/* Imagen */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {/* ── CAMBIO: featuredImage.url viene del adapter (images[0] del producto) */}
                      {line.merchandise.product.featuredImage?.url ? (
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
                      {/* ── CAMBIO: product.title mapeado desde name en el adapter */}
                      <h3 className="font-semibold text-frutaza-verde-oscuro">
                        {line.merchandise.product.title}
                      </h3>
                      {/* ── CAMBIO: merchandise.title = variant.name o 'Único' */}
                      <p className="text-sm text-gray-600">{line.merchandise.title}</p>

                      <div className="flex items-center justify-between mt-3 gap-3">
                        {/* Controles cantidad */}
                        <div className="flex items-center gap-2">
                          <button
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold text-frutaza-verde-oscuro disabled:opacity-40"
                            disabled={line.quantity <= 1}
                            onClick={() => updateLine(line.id, line.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] text-center">{line.quantity}</span>
                          <button
                            className="w-7 h-7 rounded-full bg-frutaza-verde-vivo text-white flex items-center justify-center text-sm font-bold hover:bg-frutaza-verde-oscuro"
                            onClick={() => updateLine(line.id, line.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            className="ml-3 text-xs text-red-500 hover:underline"
                            onClick={() => removeLine(line.id)}
                          >
                            Eliminar
                          </button>
                        </div>

                        {/* ── CAMBIO: totalAmount.amount sigue siendo string Money — sin cambios en JSX */}
                        <span className="font-bold text-frutaza-verde-oscuro">
                          ${parseFloat(line.cost.totalAmount.amount).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.lines.edges.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                <span className="text-2xl font-bold text-frutaza-verde-oscuro">
                  ${subtotal.toLocaleString('es-CO')} COP
                </span>
              </div>

              {/* ── CAMBIO: handleCheckout usa cart.checkoutUrl construida por el adapter */}
              <button
                onClick={handleCheckout}
                disabled={!cart.checkoutUrl}
                className="w-full bg-frutaza-verde-vivo hover:bg-frutaza-verde-oscuro text-white py-4 rounded-full font-bold text-lg transition-colors duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Pagar</span>
                <span className="text-2xl">💳</span>
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">
                Envío calculado al finalizar la compra
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
