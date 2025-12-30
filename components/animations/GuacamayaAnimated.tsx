'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export function GuacamayaAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const wingLeftRef = useRef<HTMLDivElement>(null);
  const wingRightRef = useRef<HTMLDivElement>(null);

  const config = {
    containerWidth: 500,
    containerHeight: 300,
    cuerpoWidth: 300,
    cuerpoHeight: 200,
    alaWidth: 200,
    alaHeight: 110,
    alaLeft: 178,
    alaTop: '40%',
    velocidad: 20,
    aleteoVelocidad: 0.35,
    aleteoAngulo: 20,
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { x: '-200px' },
        {
          x: '110vw',
          duration: config.velocidad,
          repeat: -1,
          ease: 'none',
          delay: 1,
        }
      );

      gsap.to(cuerpoRef.current, {
        scale: 1.08,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      gsap.to(containerRef.current, {
        y: '-=30',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Ala izquierda
      const timelineLeft = gsap.timeline({ repeat: -1 });

      timelineLeft.to(wingLeftRef.current, {
        rotation: config.aleteoAngulo,
        scaleY: -1,
        duration: config.aleteoVelocidad,
        ease: 'power2.out',
      });

      timelineLeft.to(wingLeftRef.current, {
        rotation: -config.aleteoAngulo * 0.3,
        scaleY: 1,
        duration: config.aleteoVelocidad,
        ease: 'power2.in',
      });

      // Ala derecha (SIN delay, misma animación)
      const timelineRight = gsap.timeline({ repeat: -1 });
      //                        ↑ aquí solo quitamos el delay

      timelineRight.to(wingRightRef.current, {
        rotation: config.aleteoAngulo,
        scaleY: -1,
        duration: config.aleteoVelocidad,
        ease: 'power2.out',
      });

      timelineRight.to(wingRightRef.current, {
        rotation: -config.aleteoAngulo * 0.3,
        scaleY: 1,
        duration: config.aleteoVelocidad,
        ease: 'power2.in',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-24 left-0 z-50 pointer-events-none"
      style={{ width: `${config.containerWidth}px`, height: `${config.containerHeight}px` }}
    >
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        {/* Ala Izquierda (atrás) */}
        <div
          ref={wingLeftRef}
          className="absolute z-10"
          style={{
            left: `${config.alaLeft}px`,
            top: config.alaTop,
            width: `${config.alaWidth}px`,
            height: `${config.alaHeight}px`,
            transformOrigin: 'left center',
            transform: 'translateY(-50%)',
          }}
        >
          <Image
            src="/images/animals/guacamaya/guacamaya-ala-izquierda.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Cuerpo */}
        <div
          ref={cuerpoRef}
          className="absolute z-20"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${config.cuerpoWidth}px`,
            height: `${config.cuerpoHeight}px`,
          }}
        >
          <Image
            src="/images/animals/guacamaya/guacamaya-cuerpo.svg"
            alt="Guacamaya"
            fill
            className="object-contain"
          />
        </div>

        {/* Ala Derecha (adelante) */}
        <div
          ref={wingRightRef}
          className="absolute z-30"
          style={{
            left: `${config.alaLeft}px`,
            top: config.alaTop,
            width: `${config.alaWidth}px`,
            height: `${config.alaHeight}px`,
            transformOrigin: 'left center',
            transform: 'translateY(-50%)',
          }}
        >
          <Image
            src="/images/animals/guacamaya/guacamaya-ala-derecha.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
