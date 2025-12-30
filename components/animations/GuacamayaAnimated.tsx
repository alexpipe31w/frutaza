'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export function GuacamayaAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const wingLeftRef = useRef<HTMLDivElement>(null);
  const wingRightRef = useRef<HTMLDivElement>(null);

  // ⚙️ CONFIGURACIÓN
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
    aleteoAngulo: 22, // un poco más marcado, pero igual en ambas
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Vuelo horizontal de izquierda a derecha
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

      // Efecto BOUNCE en el cuerpo
      gsap.to(cuerpoRef.current, {
        scale: 1.08,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Movimiento vertical suave
      gsap.to(containerRef.current, {
        y: '-=30',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 🪽 ALETEO SINCRONIZADO (UNA SOLA TIMELINE PARA AMBAS ALAS)
      const flapTl = gsap.timeline({ repeat: -1, yoyo: true });

      flapTl.to(
        [wingLeftRef.current, wingRightRef.current],
        {
          rotation: config.aleteoAngulo,
          duration: config.aleteoVelocidad,
          ease: 'power2.inOut',
        }
      ).to(
        [wingLeftRef.current, wingRightRef.current],
        {
          rotation: -config.aleteoAngulo,
          duration: config.aleteoVelocidad,
          ease: 'power2.inOut',
        }
      );
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
            transformOrigin: 'left center', // mismo origen en ambas
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
            transformOrigin: 'left center', // exactamente igual
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
