'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { Product } from '@/lib/stockup/types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  product: Product;
  index: number;
  onAddToCart: (productId: string, variantId: string | null, quantity: number, price: number) => void;
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const SIZE_OPTION_NAMES = [
  'size', 'peso', 'presentacion', 'presentation', 'capacidad', 'volumen', 'tamano',
];

export function ProductoEnRama({ product, index, onAddToCart }: Props) {
  const productoRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const variants = product.variants?.edges || [];

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.node.id ?? ''
  );

  useEffect(() => {
    if (variants.length > 0 && !variants.find((v) => v.node.id === selectedVariantId)) {
      setSelectedVariantId(variants[0].node.id);
    }
  }, [variants, selectedVariantId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.node.id === selectedVariantId)?.node,
    [variants, selectedVariantId]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!productoRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        productoRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productoRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [isMobile]);

  const imagenUrl = useMemo(() => {
    if (selectedVariant?.image) {
      return { url: selectedVariant.image, altText: selectedVariant.title };
    }
    return product.images.edges[0]?.node;
  }, [selectedVariant, product.images]);

  const precio = selectedVariant
    ? selectedVariant.price
    : product.priceRange.minVariantPrice;

  const precioNumerico = parseFloat(precio.amount);

  const hasRealVariants =
    variants.length > 1 ||
    (variants.length === 1 && variants[0].node.id !== `${product.id}-default`);

  const isDefaultVariant = selectedVariantId === `${product.id}-default`;

  return (
    <div
      ref={productoRef}
      className={`w-full max-w-sm cursor-pointer transition-all duration-300 ${isMobile ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: isMobile ? 'auto' : 'transform, opacity' }}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {/* Imagen sobre la nube */}
      <div className="relative h-44 flex items-end justify-center">
        {/* Nube de fondo */}
        <div className="absolute inset-x-0 bottom-0 z-0 translate-y-6">
          <Image
            src="/images/backgrounds/nube33.png"
            alt="Nube"
            width={600}
            height={450}
            className="w-full h-auto object-contain pointer-events-none select-none"
            priority={index < 3}
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </div>

        {/* Imagen del producto */}
        {imagenUrl ? (
          <div className="relative z-10 w-[52%] mb-8">
            <Image
              src={imagenUrl.url}
              alt={imagenUrl.altText || product.title}
              width={400}
              height={400}
              className="w-full h-auto object-contain"
              priority={index < 3}
              loading={index < 3 ? 'eager' : 'lazy'}
            />
          </div>
        ) : (
          <div className="relative z-10 w-[52%] mb-8 aspect-square bg-gradient-to-br from-frutaza-amarillo to-frutaza-verde-vivo rounded-3xl" />
        )}
      </div>

      {/* Preview siempre visible: título + precio */}
      <div className="text-center px-3 pt-5 pb-1">
        <h3 className="text-base font-display font-bold text-frutaza-verde-oscuro leading-tight mb-1">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-frutaza-amarillo">
          ${precioNumerico.toLocaleString('es-CO')}
          <span className="text-xs font-normal text-gray-500 ml-1">{precio.currencyCode}</span>
        </p>
        <span className="text-xs text-gray-400 mt-1 inline-block select-none">
          {isOpen ? '▲ Ocultar' : '▼ Ver detalles'}
        </span>
      </div>

      {/* Contenido expandido al hacer click */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-xl p-4">
          <div className="text-gray-600 text-sm mb-4 space-y-2">
            {product.description
              .split(/(\*[^*]+\*)/g)
              .filter((line) => line.trim())
              .map((line, i) => {
                const isBold = line.startsWith('*') && line.endsWith('*');
                return (
                  <p
                    key={i}
                    className={
                      isBold
                        ? 'font-semibold text-frutaza-verde-oscuro'
                        : 'leading-relaxed'
                    }
                  >
                    {isBold ? line.replace(/\*/g, '') : line.trim()}
                  </p>
                );
              })}
          </div>

          {/* Selector de variantes */}
          {hasRealVariants && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Presentación:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map(({ node }) => {
                  const options = node.selectedOptions || [];
                  const sizeOption = options.find((opt) =>
                    SIZE_OPTION_NAMES.includes(normalize(opt.name))
                  );
                  const label = sizeOption ? sizeOption.value : node.title;
                  const active = node.id === selectedVariantId;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantId(node.id);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        active
                          ? 'bg-frutaza-verde-vivo text-white border-frutaza-verde-vivo'
                          : 'bg-white text-frutaza-verde-oscuro border-gray-300 hover:border-frutaza-verde-vivo'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Precio + botón agregar */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-frutaza-amarillo">
              ${precioNumerico.toLocaleString('es-CO')}
              <span className="text-xs ml-1 font-normal text-gray-500">{precio.currencyCode}</span>
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedVariant) {
                  onAddToCart(
                    product.id,
                    isDefaultVariant ? null : selectedVariant.id,
                    1,
                    precioNumerico
                  );
                }
              }}
              disabled={!selectedVariant}
              className="bg-frutaza-verde-vivo hover:bg-frutaza-verde-oscuro text-white px-5 py-2.5 rounded-full font-semibold transition-colors duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              Agregar
            </button>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 bg-frutaza-crema px-3 py-1.5 rounded-full">
            <span className="text-base">🌿</span>
            <span className="text-xs font-semibold text-frutaza-verde-oscuro">100% Natural</span>
          </div>
        </div>
      )}
    </div>
  );
}
