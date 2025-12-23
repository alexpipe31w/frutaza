'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  size?: number;
  animationType?: 'float' | 'bounce' | 'swing';
  duration?: number;
  delay?: number;
};

export function AnimalFlotante({
  src,
  alt,
  initialX,
  initialY,
  size = 80,
  animationType = 'float',
  duration = 6,
  delay = 0,
}: Props) {
  const animalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = animalRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      // Timeline para agrupar animaciones (mejor performance)
      const tl = gsap.timeline({ delay });

      // Animación principal según tipo
      switch (animationType) {
        case 'float':
          tl.to(element, {
            y: -15,
            duration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
          break;

        case 'bounce':
          tl.to(element, {
            y: -25,
            duration: duration * 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          });
          break;

        case 'swing':
          tl.to(element, {
            rotation: 6,
            duration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'center bottom',
          });
          break;
      }

      // Movimiento horizontal suave (solo si no es swing)
      if (animationType !== 'swing') {
        gsap.to(element, {
          x: gsap.utils.random(-10, 10),
          duration: duration * 1.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay * 0.5,
        });
      }

      // Parallax con scroll (optimizado)
      gsap.to(element, {
        y: 40,
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          invalidateOnRefresh: true, // Mejor performance en resize
        },
      });
    });

    return () => ctx.revert();
  }, [animationType, duration, delay]);

  return (
    <div
      ref={animalRef}
      className="absolute pointer-events-none z-20"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: `${size}px`,
        height: `${size}px`,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        willChange: 'transform', // Optimización GPU
      }}
    >
      <div className="relative w-full h-full">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-contain"
          loading="lazy" // Carga diferida
        />
      </div>
    </div>
  );
}
