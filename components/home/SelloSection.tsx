'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Array con las 8 hojas disponibles
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

const valores = [
  {
  icon: (
    <svg viewBox="0 0 52 64" className="w-16 h-16">
      {/* Tallo */}
      <path 
        d="M26,0h0a2,2,0,0,1,2,2V18a0,0,0,0,1,0,0H24a0,0,0,0,1,0,0V2A2,2,0,0,1,26,0Z" 
        fill="currentColor"
        className="text-yellow-800"
      />
      {/* Hoja derecha */}
      <path 
        d="M26,14h0A13.45,13.45,0,0,1,36.19,1L40,0,39,3.81A13.45,13.45,0,0,1,26,14Z" 
        fill="currentColor"
        className="text-frutaza-verde-vivo"
      />
      {/* Hoja izquierda */}
      <path 
        d="M26,14h0A13.45,13.45,0,0,0,15.81,1L12,0l1,3.81A13.45,13.45,0,0,0,26,14Z" 
        fill="currentColor"
        className="text-frutaza-verde-vivo"
      />
      {/* Naranja */}
      <circle 
        cx="26" 
        cy="38" 
        r="26" 
        fill="currentColor"
        className="text-frutaza-amarillo"
      />
    </svg>
  ),
  title: '100% Fruta Amazónica',
  description: 'Sin aditivos ni conservantes, solo el sabor real de la selva',
},

  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-16 h-16">
        {/* Icono de Corazón */}
        <path 
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
          fill="currentColor" 
          opacity={0.2}
        />
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Comercio Justo',
    description: 'Apoyamos a las comunidades locales, asegurando un impacto positivo en nuestra tierra',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-16 h-16">
        {/* Icono de Canasta */}
        <path 
          d="M5.5 8L8 3M18.5 8L16 3M3 8h18l-1.5 13H4.5L3 8z" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M4.5 21h15L21 8H3L4.5 21z" 
          fill="currentColor" 
          opacity={0.2}
        />
        <path d="M9 11v6M12 11v6M15 11v6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Proceso Artesanal',
    description: 'Cada frasco de mermelada se elabora con cuidado, preservando la tradición y calidad que nos define',
  },
];

export function SelloSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const hojasContainerRef = useRef<HTMLDivElement>(null);
  const luciernagasRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);
  const [luciernagasData, setLuciernagasData] = useState<LuciernagaData[]>([]);

  useEffect(() => {
    setHojasData(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 100 + 190,
        image: HOJAS_IMAGES[Math.floor(Math.random() * HOJAS_IMAGES.length)],
        rotationStart: Math.random() * 360,
      }))
    );

    setLuciernagasData(
      Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }))
    );

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.valor-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      // HOJAS CAYENDO CON BALANCEO REALISTA
      const hojas = hojasContainerRef.current?.querySelectorAll('.hoja-sello');
      hojas?.forEach((hoja, index) => {
        const duration = gsap.utils.random(12, 20);
        const swingAmount = gsap.utils.random(60, 120);

        gsap.to(hoja, {
          y: '120vh',
          duration: duration,
          repeat: -1,
          delay: index * 0.8,
          ease: 'none',
        });

        gsap.to(hoja, {
          x: `+=${swingAmount}`,
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });

        gsap.to(hoja, {
          rotation: '+=30',
          duration: gsap.utils.random(2.5, 4.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to(hoja, {
          rotationY: 180,
          duration: gsap.utils.random(3, 5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      const luciernagas = luciernagasRef.current?.querySelectorAll('.luciernaga-sello');
      luciernagas?.forEach((luciernaga, index) => {
        gsap.to(luciernaga, {
          x: `+=${gsap.utils.random(-150, 150)}`,
          y: `+=${gsap.utils.random(-150, 150)}`,
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });

        gsap.to(luciernaga, {
          opacity: 0.2,
          duration: gsap.utils.random(0.5, 1.5),
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        });

        gsap.to(luciernaga, {
          scale: 1.5,
          duration: gsap.utils.random(1, 2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    });

    return () => ctx.revert();
  }, [mounted]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-frutaza-verde-oscuro overflow-hidden"
    >
      {/* ONDA SUPERIOR - Separa de la sección de arriba */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[150px] md:h-[200px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* ONDA INFERIOR - Separa de la sección de abajo con color amarillo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-[80px] md:h-[120px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-frutaza-amarillo"
          />
        </svg>
      </div>

      {/* HOJAS CAYENDO */}
      {mounted && (
        <div
          ref={hojasContainerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 15 }}
        >
          {hojasData.map((hoja, i) => (
            <div
              key={`hoja-sello-${i}`}
              className="hoja-sello absolute"
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

      {/* LUCIÉRNAGAS */}
      {mounted && (
        <div
          ref={luciernagasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 16 }}
        >
          {luciernagasData.map((luciernaga, i) => (
            <div
              key={`luciernaga-sello-${i}`}
              className="luciernaga-sello absolute rounded-full"
              style={{
                left: luciernaga.left,
                top: luciernaga.top,
                width: '8px',
                height: '8px',
                backgroundColor: '#FFE135',
                boxShadow:
                  '0 0 20px 6px rgba(255, 225, 53, 0.9), 0 0 40px 10px rgba(255, 225, 53, 0.5)',
                opacity: 1,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            El Sello Frutaza
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Nuestro compromiso con la calidad, sostenibilidad y preservación del patrimonio
            amazónico
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {valores.map((valor, index) => (
            <div
              key={index}
              className="valor-card group bg-frutaza-verde-oscuro/60 backdrop-blur-sm border-2 border-frutaza-verde-vivo/30 rounded-3xl p-8 transition-all duration-500 hover:border-frutaza-verde-vivo hover:transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-frutaza-verde-vivo/30 to-frutaza-amarillo/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-frutaza-amarillo group-hover:text-frutaza-verde-vivo transition-colors duration-300">
                  {valor.icon}
                </div>
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-4">{valor.title}</h3>
              <p className="text-lg text-white/80 leading-relaxed">{valor.description}</p>

              <div className="w-full h-1 bg-gradient-to-r from-frutaza-verde-vivo to-frutaza-amarillo rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
