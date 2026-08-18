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

export function HistoriaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hojasContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);

  // Generar datos solo en el cliente
  useEffect(() => {
    setHojasData(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 150 + 200,
        image: HOJAS_IMAGES[Math.floor(Math.random() * HOJAS_IMAGES.length)],
        rotationStart: Math.random() * 360,
      }))
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
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

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );

      // HOJAS CAYENDO CON BALANCEO REALISTA
      const hojas = hojasContainerRef.current?.querySelectorAll('.hoja-historia');
      hojas?.forEach((hoja, index) => {
        const duration = gsap.utils.random(12, 20);
        const swingAmount = gsap.utils.random(60, 120);

        // Caída vertical
        gsap.to(hoja, {
          y: '120vh',
          duration: duration,
          repeat: -1,
          delay: index * 0.8,
          ease: 'none',
        });

        // Balanceo horizontal (como péndulo)
        gsap.to(hoja, {
          x: `+=${swingAmount}`,
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });

        // Rotación pendular (balanceo)
        gsap.to(hoja, {
          rotation: '+=30',
          duration: gsap.utils.random(2.5, 4.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Rotación en el eje Y (efecto 3D de volteo)
        gsap.to(hoja, {
          rotationY: 180,
          duration: gsap.utils.random(3, 5),
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
      id="historia"
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-frutatza-verde-oscuro overflow-hidden"
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
            className="fill-frutatza-amarillo"
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
        <div ref={hojasContainerRef} className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
          {hojasData.map((hoja, i) => (
            <div
              key={`hoja-historia-${i}`}
              className="hoja-historia absolute"
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

      {/* CONTENIDO */}
      <div ref={contentRef} className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Contenido de texto - Izquierda */}
          <div className="text-white space-y-6">
            <h2 ref={titleRef} className="text-5xl md:text-6xl font-display font-bold mb-8 mt-[60px]">
              Nuestra Esencia
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed">
              Más que mermeladas, somos el{' '}
              <span className="text-frutatza-verde-vivo font-semibold">
                latido del corazón de Caquetá
              </span>
              .
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/90">
              Transformamos frutas silvestres en sabores que cuentan historias de una tierra de belleza 
              indómita, celebrando la vida, la naturaleza y nuestro{' '}
              <span className="text-frutatza-amarillo font-semibold">legado amazónico</span>.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/90">
              Cada frasco lleva la esencia de la selva tropical, la dedicación de nuestros agricultores, y el 
              compromiso de preservar los tesoros de nuestra tierra para las futuras generaciones.
            </p>
            <div className="w-32 h-1 bg-frutatza-amarillo rounded-full mt-8" />
          </div>

          {/* Imagen - Derecha */}
          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-frutatza-verde-vivo/30 shadow-2xl">
              <img
                src="/images/nuestra-escencia-mapa.png"
                alt="Mapa de Caquetá con frutas y animales"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-frutatza-verde-oscuro/20 to-transparent" />
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-frutatza-amarillo/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-frutatza-verde-vivo/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
