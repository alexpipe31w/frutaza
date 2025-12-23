'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  speed?: number;
  className?: string;
  disabled?: boolean; // 🆕 Para desactivar en móviles
};

export function SectionParallaxWrapper({ 
  children, 
  speed = 0.5, 
  className = '',
  disabled = false,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || disabled) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // Más responsive que 'true'
          invalidateOnRefresh: true, // Recalcula en resize
        },
      });
    });

    return () => ctx.revert();
  }, [speed, disabled]);

  return (
    <div 
      ref={sectionRef} 
      className={className}
      style={{
        willChange: disabled ? 'auto' : 'transform', // GPU acceleration solo si está activo
      }}
    >
      {children}
    </div>
  );
}
