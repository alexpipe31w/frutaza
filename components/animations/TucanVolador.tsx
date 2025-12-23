'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export function TucanVolador() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const wingLeftRef = useRef<HTMLDivElement>(null);
  const wingRightRef = useRef<HTMLDivElement>(null);

  // ⚙️ CONFIGURACIÓN DE TAMAÑOS Y POSICIONES
  const config = {
    // Tamaño del contenedor
    containerWidth: 300,
    containerHeight: 200,
    
    // Tamaño del cuerpo
    cuerpoWidth: 200,
    cuerpoHeight: 160,
    
    // Tamaño de las alas
    alaWidth: 150,
    alaHeight: 130,
    
    // Posición de las alas
    alaLeft: 87,
    alaTop: '43%',
    
    // Animación
    velocidad: 25,
    aleteoVelocidad: 0.35,
    aleteoAngulo: 20,
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Colocar el tucán fuera de la pantalla a la derecha
      gsap.set(containerRef.current, { x: window.innerWidth + 200, y: 100 });

      // Vuelo horizontal de derecha a izquierda
      gsap.to(containerRef.current, {
        x: -300,
        duration: config.velocidad,
        repeat: -1,
        ease: 'none',
        delay: 3,
      });

      // Efecto BOUNCE en el cuerpo (se achica y agranda)
      gsap.to(cuerpoRef.current, {
        scale: 1.08,
        duration: 0.45,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Movimiento vertical ondulante
      gsap.to(containerRef.current, {
        y: '+=40',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ✨ ANIMACIÓN DE ALETEO REALISTA - Ala Izquierda (atrás)
      const timelineLeft = gsap.timeline({ repeat: -1 });
      
      // Ala izquierda sube (se voltea hacia arriba)
      timelineLeft.to(wingLeftRef.current, {
        rotation: -config.aleteoAngulo,
        scaleY: -1, // Voltea verticalmente
        duration: config.aleteoVelocidad,
        ease: 'power2.out',
      });
      
      // Ala izquierda baja (vuelve a posición normal)
      timelineLeft.to(wingLeftRef.current, {
        rotation: config.aleteoAngulo * 0.3,
        scaleY: 1, // Vuelve a normal
        duration: config.aleteoVelocidad,
        ease: 'power2.in',
      });

      // ✨ ANIMACIÓN DE ALETEO REALISTA - Ala Derecha (adelante)
      // Empieza con delay para efecto alternado
      const timelineRight = gsap.timeline({ repeat: -1, delay: config.aleteoVelocidad * 0.5 });
      
      // Ala derecha sube (se voltea hacia arriba)
      timelineRight.to(wingRightRef.current, {
        rotation: -config.aleteoAngulo,
        scaleY: -1, // Voltea verticalmente
        duration: config.aleteoVelocidad,
        ease: 'power2.out',
      });
      
      // Ala derecha baja (vuelve a posición normal)
      timelineRight.to(wingRightRef.current, {
        rotation: config.aleteoAngulo * 0.3,
        scaleY: 1, // Vuelve a normal
        duration: config.aleteoVelocidad,
        ease: 'power2.in',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-40 left-0 z-50 pointer-events-none"
      style={{ width: `${config.containerWidth}px`, height: `${config.containerHeight}px` }}
    >
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        {/* Ala izquierda (ATRÁS del cuerpo - z-index más bajo) */}
        <div
          ref={wingLeftRef}
          className="absolute z-10"
          style={{ 
            left: `${config.alaLeft}px`,
            top: config.alaTop,
            width: `${config.alaWidth}px`,
            height: `${config.alaHeight}px`,
            transformOrigin: 'right center',
            transform: 'translateY(-50%)',
          }}
        >
          <Image 
            src="/images/animals/tucan/tucan-ala-izquierda.svg" 
            alt="" 
            fill 
            className="object-contain"
          />
        </div>
        
        {/* Cuerpo del tucán (EN MEDIO con efecto bounce) */}
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
            src="/images/animals/tucan/tucan-cuerpo.svg" 
            alt="Tucán" 
            fill 
            className="object-contain"
          />
        </div>
        
        {/* Ala derecha (ADELANTE del cuerpo - z-index más alto) */}
        <div
          ref={wingRightRef}
          className="absolute z-30"
          style={{ 
            left: `${config.alaLeft}px`,
            top: config.alaTop,
            width: `${config.alaWidth}px`,
            height: `${config.alaHeight}px`,
            transformOrigin: 'right center',
            transform: 'translateY(-50%)',
          }}
        >
          <Image 
            src="/images/animals/tucan/tucan-ala-derecha.svg" 
            alt="" 
            fill 
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
