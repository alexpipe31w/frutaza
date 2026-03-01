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
  // FIX: nueva firma con productId explícito y variantId nullable
  onAddToCart: (productId: string, variantId: string | null, quantity: number, price: number) => void;
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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


  // Imagen dinámica: usa imagen de la variante si existe, sino la del producto
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

  // FIX: determinar si la variante seleccionada es "default" (producto sin variantes reales)
  const isDefaultVariant = selectedVariantId === `${product.id}-default`;

  return (
    <div className="relative flex items-center justify-center px-4 py-10">
      <div
        ref={productoRef}
        className={`
          relative z-10 max-w-md w-full cursor-pointer transition-all duration-300
          ${isMobile ? 'opacity-100' : 'opacity-0'}
          ${isOpen ? 'bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl' : 'bg-transparent'}
        `}
        style={{ willChange: isMobile ? 'auto' : 'transform, opacity' }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {/* Nube + producto */}
        <div className="relative w-full h-64 mb-4 flex items-center justify-center">
          {!isOpen && (
            <div className="relative translate-y-24 md:translate-y-24 w-full max-w-[1200px] z-0">
              <Image
                src="/images/backgrounds/nube33.png"
                alt="Nube arbusto"
                width={1200}
                height={900}
                className="w-full h-auto object-contain pointer-events-none select-none"
                priority={index < 3}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
          )}

          {imagenUrl ? (
            <div className="absolute bottom-2 z-10 w-[60%] max-w-sm">
              <Image
                src={imagenUrl.url}
                alt={imagenUrl.altText || product.title}
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority={index < 3}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
          ) : (
            <div className="absolute bottom-2 z-10 w-[60%] max-w-sm bg-gradient-to-br from-frutaza-amarillo to-frutaza-verde-vivo rounded-3xl" />
          )}
        </div>

        {/* Contenido expandido */}
        {isOpen && (
          <div className="mt-2">
            <h3 className="text-2xl font-display font-bold text-frutaza-verde-oscuro mb-2">
              {product.title}
            </h3>

            <div className="text-gray-600 text-sm mb-4 space-y-3">
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

            {/* Precio + botón */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-frutaza-amarillo">
                ${precioNumerico.toLocaleString('es-CO')}
                <span className="text-sm ml-1">{precio.currencyCode}</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedVariant) {
                    // FIX: pasar productId explícito + variantId null si es default
                    onAddToCart(
                      product.id,
                      isDefaultVariant ? null : selectedVariant.id,
                      1,
                      precioNumerico
                    );
                  }
                }}
                disabled={!selectedVariant}
                className="bg-frutaza-verde-vivo hover:bg-frutaza-verde-oscuro text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 bg-frutaza-crema px-4 py-2 rounded-full">
              <span className="text-xl">🌿</span>
              <span className="text-sm font-semibold text-frutaza-verde-oscuro">
                100% Natural
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
