'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface HojaData {
  left: string;
  top: string;
  size: number;
  image: string;
  rotationStart: number;
}

interface LuciernagaData {
  left: string;
  top: string;
}

// Array con las hojas disponibles
const HOJAS_IMAGES = [
  '/images/vegetacion/hoja1.svg',
  '/images/vegetacion/hoja2.svg',
  '/images/vegetacion/hoja3.svg',
  '/images/vegetacion/hoja4.svg',
  '/images/vegetacion/hoja5.svg',
  '/images/vegetacion/hoja6.svg',
  '/images/vegetacion/hoja7.svg',
];

export function EfectosSelva() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);
  const [luciernagasData, setLuciernagasData] = useState<LuciernagaData[]>([]);

  // Generar datos solo en el cliente
  useEffect(() => {
    // 10 hojas cayendo
    setHojasData(
      Array.from({ length: 10 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 80 + 100, // 100-180px
        image: HOJAS_IMAGES[Math.floor(Math.random() * HOJAS_IMAGES.length)],
        rotationStart: Math.random() * 360,
      }))
    );

    // 🆕 Solo 8 luciérnagas (reducido de 20)
    setLuciernagasData(
      Array.from({ length: 8 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }))
    );

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const ctx = gsap.context(() => {
      // HOJAS CAYENDO
      const hojas = containerRef.current?.querySelectorAll('.hoja-cayendo');
      hojas?.forEach((hoja, index) => {
        const duration = gsap.utils.random(12, 20);
        const swingAmount = gsap.utils.random(60, 120);

        // Caída vertical
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

        // Rotación pendular
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

      // LUCIÉRNAGAS (optimizado)
      const luciernagas = containerRef.current?.querySelectorAll('.luciernaga');
      luciernagas?.forEach((luciernaga, index) => {
        // Movimiento flotante
        gsap.to(luciernaga, {
          x: `+=${gsap.utils.random(-100, 100)}`,
          y: `+=${gsap.utils.random(-100, 100)}`,
          duration: gsap.utils.random(4, 7),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.4,
        });

        // Parpadeo
        gsap.to(luciernaga, {
          opacity: 0.3,
          duration: gsap.utils.random(0.8, 1.8),
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        });

        // Pulsación de tamaño
        gsap.to(luciernaga, {
          scale: 1.3,
          duration: gsap.utils.random(1.2, 2.2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    });

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* HOJAS CAYENDO */}
      {hojasData.map((hoja, i) => (
        <div
          key={`hoja-${i}`}
          className="hoja-cayendo absolute"
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

      {/* LUCIÉRNAGAS (reducidas) */}
      {luciernagasData.map((luciernaga, i) => (
        <div
          key={`luciernaga-${i}`}
          className="luciernaga absolute rounded-full"
          style={{
            left: luciernaga.left,
            top: luciernaga.top,
            width: '8px',
            height: '8px',
            backgroundColor: '#FFE135',
            boxShadow: '0 0 20px 6px rgba(255, 225, 53, 0.8), 0 0 40px 10px rgba(255, 225, 53, 0.4)',
            opacity: 1,
          }}
        />
      ))}
    </div>
  );
}
