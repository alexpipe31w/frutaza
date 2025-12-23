'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ProductosGrid } from '@/components/products/ProductosGrid';
import type { Product } from '@/lib/shopify/types';
import shopifyFetch from '@/lib/shopify/client'; // 👈 añadido

// Hojas disponibles
const HOJAS_IMAGES = [
  '/images/vegetacion/hoja1.svg',
  '/images/vegetacion/hoja2.svg',
  '/images/vegetacion/hoja3.svg',
  '/images/vegetacion/hoja4.svg',
  '/images/vegetacion/hoja5.svg',
  '/images/vegetacion/hoja6.svg',
  '/images/vegetacion/hoja7.svg',
  '/images/vegetacion/hoja8.svg',
];

interface HojaData {
  left: string;
  top: string;
  size: number;
  image: string;
  rotationStart: number;
}

// 👇 query para traer productos (solo lo necesario para la grid)
const GET_PRODUCTS = `
  query getProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;


type ProductsResponse = {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
};

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);
  const hojasContainerRef = useRef<HTMLDivElement>(null);

  // ✅ estado real de productos
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch productos desde Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await shopifyFetch<ProductsResponse>({
          query: GET_PRODUCTS,
        });

        const nodes = data.products.edges.map(({ node }) => node);
        setProducts(nodes);
      } catch (error) {
        console.error('Error fetching products from Shopify:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Generar hojas al montar
  useEffect(() => {
    setHojasData(
      Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 80 + 100,
        image: HOJAS_IMAGES[Math.floor(Math.random() * HOJAS_IMAGES.length)],
        rotationStart: Math.random() * 360,
      }))
    );
    setMounted(true);
  }, []);

  // Animaciones GSAP
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const hojas =
        hojasContainerRef.current?.querySelectorAll('.hoja-productos');
      hojas?.forEach((hoja, index) => {
        const duration = gsap.utils.random(12, 20);
        const swingAmount = gsap.utils.random(60, 120);

        // Caída
        gsap.to(hoja, {
          y: '120vh',
          duration,
          repeat: -1,
          delay: index * 0.8,
          ease: 'none',
        });

        // Balanceo horizontal
        gsap.to(hoja, {
          x: `+=${swingAmount}`,
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });

        // Rotación
        gsap.to(hoja, {
          rotation: '+=30',
          duration: gsap.utils.random(2.5, 4.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Rotación 3D
        gsap.to(hoja, {
          rotationY: 180,
          duration: gsap.utils.random(3, 5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    });

    return () => ctx.revert();
  }, [mounted]);

  return (
    <div className="relative min-h-screen pt-32 pb-20 bg-frutaza-crema overflow-hidden">
      {/* ========== HOJAS CAYENDO ========== */}
      {mounted && (
        <div
          ref={hojasContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          {hojasData.map((hoja, i) => (
            <div
              key={`hoja-productos-${i}`}
              className="hoja-productos absolute"
              style={{
                left: hoja.left,
                top: hoja.top,
                width: `${hoja.size}px`,
                height: `${hoja.size}px`,
                transform: `rotate(${hoja.rotationStart}deg)`,
                opacity: 0.6,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              }}
            >
              <Image
                src={hoja.image}
                alt="Hoja"
                width={hoja.size}
                height={hoja.size}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* ========== CONTENIDO ========== */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <img
            src="/images/logo-redondo.png"
            alt="Frutaza"
            className="w-12 h-12 md:w-16 md:h-16 flex mx-auto mb-4"
          />
          <h1 className="text-5xl font-display font-bold text-frutaza-verde-oscuro mb-4">
            Nuestros Productos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mermeladas artesanales elaboradas con las mejores frutas del Caquetá
          </p>
        </div>

        {/* Productos */}
        {loadingProducts ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductosGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">🌳</span>
            <p className="text-xl text-gray-600 mb-4">
              Estamos preparando nuestros productos
            </p>
            <p className="text-gray-500">
              Pronto podrás disfrutar de nuestras deliciosas mermeladas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
