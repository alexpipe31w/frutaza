'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollTrigger() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: 'top center',
        end: 'bottom center',
        markers: false,
        onEnter: () => console.log('Element entered'),
        onLeave: () => console.log('Element left'),
      });
    });

    return () => ctx.revert();
  }, []);

  return elementRef;
}
