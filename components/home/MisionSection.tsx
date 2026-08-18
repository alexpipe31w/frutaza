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

const misionCards = [
  {
    emoji: '',
    title: '¿Qué buscamos?',
    subtitle: 'Dulzura natural',
    description: 'Compartir la dulzura natural de la Amazonía.',
    details: 'Mermeladas artesanales hechas con frutas salvajes del Caquetá.',
    position: 'left',
    decoration: '/images/vegetacion/heliconia1.svg',
  },
  {
    emoji: '',
    title: '¿Cómo surgió?',
    subtitle: 'Raíces en la selva',
    description: 'Nacimos en la selva caqueteña.',
    details: 'De recetas familiares y frutos amazónicos, creamos sabores auténticos y locales.',
    position: 'right',
    decoration: '/images/vegetacion/heliconia2.svg',
  },
];

export function MisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const hojasContainerRef = useRef<HTMLDivElement>(null);
  const luciernagasRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);
  const [luciernagasData, setLuciernagasData] = useState<LuciernagaData[]>([]);

  // Generar datos solo en el cliente
  useEffect(() => {
    setHojasData(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 100 + 150,
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
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end: 'top 85%',
            scrub: 1,
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.mision-card');
      cards?.forEach((card, index) => {
        gsap.to(card, {
          y: -15,
          repeat: -1,
          yoyo: true,
          duration: 3 + index * 0.5,
          ease: 'sine.inOut',
        });

        gsap.to(card, {
          x: index % 2 === 0 ? 10 : -10,
          repeat: -1,
          yoyo: true,
          duration: 4 + index * 0.3,
          ease: 'sine.inOut',
        });

        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.3,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      // HOJAS CAYENDO CON BALANCEO REALISTA
      const hojas = hojasContainerRef.current?.querySelectorAll('.hoja-mision');
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

      // LUCIÉRNAGAS
      const luciernagas = luciernagasRef.current?.querySelectorAll('.luciernaga-mision');
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
      className="relative py-16 md:py-24 bg-gradient-to-b from-frutatza-verde-oscuro via-frutatza-verde-oscuro/95 to-frutatza-verde-oscuro overflow-hidden"
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
            className="fill-frutatza-crema"
          />
        </svg>
      </div>

      {/* ONDA INFERIOR - Separa de la sección de abajo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-[80px] md:h-[120px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-frutatza-crema"
          />
        </svg>
      </div>

      {/* HOJAS CAYENDO */}
      {mounted && (
        <div 
          ref={hojasContainerRef} 
          className="absolute inset-0 pointer-events-none overflow-hidden" 
          style={{ zIndex: 15 }}
        >
          {hojasData.map((hoja, i) => (
            <div
              key={`hoja-mision-${i}`}
              className="hoja-mision absolute"
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
          className="absolute inset-0 pointer-events-none overflow-hidden" 
          style={{ zIndex: 16 }}
        >
          {luciernagasData.map((luciernaga, i) => (
            <div
              key={`luciernaga-mision-${i}`}
              className="luciernaga-mision absolute rounded-full"
              style={{
                left: luciernaga.left,
                top: luciernaga.top,
                width: '8px',
                height: '8px',
                backgroundColor: '#FFE135',
                boxShadow: '0 0 20px 6px rgba(255, 225, 53, 0.9), 0 0 40px 10px rgba(255, 225, 53, 0.5)',
                opacity: 1,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 mt-[60px]">
            Un poco más sobre nosotros
          </h2>
          <div className="w-24 h-1 bg-frutatza-amarillo mx-auto rounded-full" />
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto"
        >
          {misionCards.map((card, index) => (
            <div
              key={index}
              className={`mision-card relative ${
                card.position === 'left' ? 'md:mt-0' : 'md:mt-20'
              }`}
            >
              <div className="absolute -top-40 -right-60 w-200 h-200 pointer-events-none select-none transform rotate-12">
                <Image
                  src={card.decoration}
                  alt="Heliconia"
                  width={90}
                  height={90}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/30 hover:border-white/50 transition-all duration-500 hover:shadow-frutatza-amarillo/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl flex-shrink-0">{card.emoji}</div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-frutatza-amarillo/80 italic">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed">
                    {card.description}
                  </p>
                  <p className="text-base md:text-lg text-white/80 leading-relaxed">
                    {card.details}
                  </p>
                </div>

                <div className="mt-6 w-full h-1 bg-gradient-to-r from-frutatza-verde-vivo/50 via-frutatza-amarillo/50 to-transparent rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 group hover:border-white/40 transition-all duration-300">
            <svg viewBox="0 0 128 128" className="w-8 h-8 text-frutatza-verde-vivo group-hover:scale-110 transition-transform" fill="currentColor">
              <path d="M86.1,46.7C87.9,43.2,89,39.2,89,35c0-13.8-11.2-25-25-25S39,21.2,39,35c0,0.6,0,1.2,0.1,1.7C26.2,41.1,17,53.2,17,67.5C17,85.4,31.6,100,49.5,100h27c15.2,0,27.5-12.3,27.5-27.5C104,60.7,96.5,50.6,86.1,46.7z"/>
              <path d="M60.5,125.5c0.8,0,1.5-0.7,1.5-1.5v-22.5h14.5c16,0,29-13,29-29c0-11.5-6.9-22-17.4-26.6c1.5-3.4,2.4-7.2,2.4-10.9C90.5,20.4,78.6,8.5,64,8.5S37.5,20.4,37.5,35c0,0.2,0,0.5,0,0.7c-13.2,5-22,17.6-22,31.8c0,18.7,15.3,34,34,34H59V124C59,124.8,59.7,125.5,60.5,125.5z M49.5,98.5c-17.1,0-31-13.9-31-31c0-13.3,8.5-25.1,21-29.4c0.6-0.2,1.1-0.8,1-1.5c0-0.5-0.1-1.1-0.1-1.6C40.5,22,51,11.5,64,11.5S87.5,22,87.5,35c0,3.8-0.9,7.6-2.7,11c-0.2,0.4-0.2,0.8-0.1,1.2c0.2,0.4,0.5,0.7,0.9,0.9c10.1,3.8,16.9,13.6,16.9,24.4c0,14.3-11.7,26-26,26H62v-9.9L81.2,79c0.7-0.4,1-1.3,0.7-2c-0.4-0.7-1.3-1-2-0.7L62,85.2V45c0-0.8-0.7-1.5-1.5-1.5S59,44.2,59,45v20.2l-17.8-8.9c-0.7-0.4-1.6-0.1-2,0.7c-0.4,0.7-0.1,1.6,0.7,2L59,68.6v29.9H49.5z" opacity="0.3"/>
            </svg>
            
            <span className="text-white/90 font-medium text-sm md:text-base">Del Amazonas con amor</span>
            
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-frutatza-amarillo group-hover:text-red-500 group-hover:scale-110 transition-all duration-300">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-frutatza-verde-vivo/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-frutatza-amarillo/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
