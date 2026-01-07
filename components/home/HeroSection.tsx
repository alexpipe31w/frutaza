'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { AnimalFlotante } from '@/components/animations/AnimalFlotante';
import { GuacamayaAnimated } from '@/components/animations/GuacamayaAnimated';
import { TucanVolador } from '@/components/animations/TucanVolador';
import { EfectosSelva } from '@/components/animations/EfectosSelva';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const capa1Ref = useRef<HTMLDivElement>(null);
  const capa2Ref = useRef<HTMLDivElement>(null);
  const capa3Ref = useRef<HTMLDivElement>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Interacción inicial - Desactivada en móvil
  useEffect(() => {
    if (isMobile) {
      setHasInteracted(true);
      return;
    }

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        gsap.fromTo(
          contentBoxRef.current,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
          }
        );
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, isMobile]);

  // Animaciones GSAP - Solo en desktop
  useEffect(() => {
    if (!hasInteracted || isMobile) return;

    const ctx = gsap.context(() => {
      // Timeline de texto - SOLO DESKTOP
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .from(titleRef.current, {
          y: 100,
          opacity: 0,
          duration: 1,
          delay: 0.2,
        })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          buttonsRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        );

      // Parallax fade out - SOLO DESKTOP
      gsap.to(contentWrapperRef.current, {
        opacity: 0,
        y: -100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax capas - SOLO DESKTOP
      gsap.to(capa1Ref.current, {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(capa2Ref.current, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to(capa3Ref.current, {
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 3,
        },
      });
    });

    return () => ctx.revert();
  }, [hasInteracted, isMobile]);

  const animalProps = (
    desktopX: number,
    desktopY: number,
    desktopSize: number
  ) => {
    if (!isMobile) {
      return { x: desktopX, y: desktopY, size: desktopSize };
    }
    const x = clamp(desktopX, 10, 90);
    const y = clamp(desktopY, 15, 80);
    const size = Math.min(desktopSize * 0.35, 260);
    return { x, y, size };
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div ref={contentWrapperRef} className="absolute inset-0">
        {/* CAPA 1 - FONDO */}
        <div
          ref={capa1Ref}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/backgrounds/selva-home-capa3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            willChange: isMobile ? 'auto' : 'transform',
          }}
        />

        {/* CAPA 2 - MEDIO */}
        <div
          ref={capa2Ref}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/backgrounds/selva-home-capa2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2,
            willChange: isMobile ? 'auto' : 'transform',
          }}
        />

        {/* CAPA 3 - FRENTE */}
        <div
          ref={capa3Ref}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/backgrounds/selva-home-capa1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 3,
            willChange: isMobile ? 'auto' : 'transform',
          }}
        />

        {/* Overlay oscuro */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25"
          style={{ zIndex: 5 }}
        />

        {/* AVES VOLADORAS - Siempre visibles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <GuacamayaAnimated />
          <TucanVolador />
        </div>

        {/* EFECTOS DE SELVA - Solo en desktop */}
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 15 }}
          >
            <EfectosSelva />
          </div>
        )}

        {/* ANIMALES - Solo en desktop */}
        {!isMobile && (
          <>
            {/* Mariposas */}
            {(() => {
              const a = animalProps(12, 20, 200);
              return (
                <AnimalFlotante
                  src="/images/animals/mariposa.svg"
                  alt="Mariposa"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={4}
                  delay={0}
                  zIndex={2}
                />
              );
            })()}
            {(() => {
              const a = animalProps(88, 30, 200);
              return (
                <AnimalFlotante
                  src="/images/animals/mariposa.svg"
                  alt="Mariposa"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={5}
                  delay={1}
                  zIndex={2}
                />
              );
            })()}
            {(() => {
              const a = animalProps(25, 75, 300);
              return (
                <AnimalFlotante
                  src="/images/animals/mariposa.svg"
                  alt="Mariposa"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="bounce"
                  duration={3.5}
                  delay={2}
                  zIndex={2}
                />
              );
            })()}
            {(() => {
              const a = animalProps(75, 70, 250);
              return (
                <AnimalFlotante
                  src="/images/animals/mariposa.svg"
                  alt="Mariposa"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={4.5}
                  delay={0.5}
                  zIndex={2}
                />
              );
            })()}

            {/* Mono */}
            {(() => {
              const a = animalProps(5, 20, 300);
              return (
                <AnimalFlotante
                  src="/images/animals/mono.svg"
                  alt="Mono"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="swing"
                  duration={7}
                  delay={2}
                  zIndex={2}
                />
              );
            })()}

            {/* Capibara */}
            {(() => {
              const a = animalProps(62, 50, 805);
              return (
                <AnimalFlotante
                  src="/images/animals/capibara.svg"
                  alt="Capibara"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={6.5}
                  delay={0}
                  zIndex={2}
                />
              );
            })()}

            {/* Jaguar */}
            {(() => {
              const a = animalProps(20, 20, 800);
              return (
                <AnimalFlotante
                  src="/images/animals/jaguar.svg"
                  alt="Jaguar"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={8}
                  delay={1.5}
                  zIndex={2}
                />
              );
            })()}

            {/* Tigrillo */}
            {(() => {
              const a = animalProps(-10, 60, 450);
              return (
                <AnimalFlotante
                  src="/images/animals/tigrillo.svg"
                  alt="Tigrillo"
                  initialX={a.x}
                  initialY={a.y}
                  size={a.size}
                  animationType="float"
                  duration={7}
                  delay={1}
                  zIndex={2}
                />
              );
            })()}
          </>
        )}
      </div>

      {/* CONTENIDO HERO - Visible directo en móvil */}
      {hasInteracted && (
        <div
          ref={contentBoxRef}
          className={`relative z-20 text-center px-4 max-w-5xl mx-auto ${
            isMobile ? 'opacity-100' : ''
          }`}
        >
          <div className="rounded-3xl p-8 md:p-12">
            <div ref={titleRef} className="mb-6 w-full flex justify-center">
              <div className="relative w-full max-w-[150px] md:max-w-[220px] lg:max-w-[300px] group">
                <Image
                  src="/images/logo-fondo-oscuro.png"
                  alt="Frutaza - Frutas Salvajes, Dulzura Natural"
                  width={1200}
                  height={400}
                  quality={100}
                  priority
                  unoptimized
                  className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] 
                         transition-all duration-500 
                         group-hover:scale-105 
                         group-hover:drop-shadow-[0_12px_24px_rgba(255,182,39,0.6)]"
                />
              </div>
            </div>

            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Mermeladas del Caquetá hechas con frutas amazónicas
              100% naturales
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/products"
                className="group px-8 py-4 bg-frutaza-verde-vivo hover:bg-frutaza-verde-oscuro text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                Ver Productos
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link
                href="#historia"
                className="px-8 py-4 bg-white/90 hover:bg-white text-frutaza-verde-oscuro rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm flex items-center gap-2"
              >
                Nuestra Esencia
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
