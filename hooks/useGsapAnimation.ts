'use client';

import { useEffect, useRef, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimationOptions = {
  from?: gsap.TweenVars;
  to: gsap.TweenVars;
  scrollTrigger?: ScrollTrigger.Vars;
};

export function useGsapAnimation<T extends HTMLElement>(
  options: AnimationOptions
): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      if (!ref.current) return;

      if (options.scrollTrigger) {
        gsap.fromTo(ref.current, options.from || {}, {
          ...options.to,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...options.scrollTrigger,
          },
        });
      } else {
        gsap.fromTo(ref.current, options.from || {}, options.to);
      }
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}
