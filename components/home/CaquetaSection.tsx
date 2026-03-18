'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 14 slides con tus fotos del carrusel
const slides = [
  {
    title: 'Elaboradas a Mano',
    description: 'Métodos tradicionales que preservan los sabores auténticos de la selva amazónica',
    icon: '🍯',
    image: '/images/carrusel/foto1.PNG',
  },
  {
    title: 'Sostenibilidad y Comunidad',
    description: 'Comercio directo con agricultores locales, asegurando salarios justos y prácticas sostenibles',
    icon: '🤝',
    image: '/images/carrusel/foto2.jpg',
  },
  {
    title: 'El Verdadero Caquetá',
    description: 'Tierra de extraordinaria biodiversidad y cultura rica comprometida con compartir los dones del Amazonas',
    icon: '📍',
    image: '/images/carrusel/foto3.jpg',
  },
  {
    title: 'Frutas Amazónicas',
    description: 'Descubre los sabores únicos de las frutas nativas del Amazonas colombiano',
    icon: '🌿',
    image: '/images/carrusel/foto4.jpg',
  },
  {
    title: 'Sabores Auténticos',
    description: 'Sin conservantes ni aditivos, solo el verdadero sabor de la naturaleza',
    icon: '✨',
    image: '/images/carrusel/foto6.jpg',
  },
  {
    title: 'Nuestra Tierra',
    description: 'El Caquetá nos regala los mejores frutos de la selva',
    icon: '🌳',
    image: '/images/carrusel/foto7.jpg',
  },
  {
    title: 'Producción Local',
    description: 'Apoyamos a las familias campesinas de nuestra región',
    icon: '👨‍🌾',
    image: '/images/carrusel/foto8.jpg',
  },
  {
    title: 'Calidad Premium',
    description: 'Seleccionamos solo las mejores frutas para nuestras mermeladas',
    icon: '⭐',
    image: '/images/carrusel/foto9.PNG',
  },
  {
    title: 'Tradición Familiar',
    description: 'Recetas transmitidas de generación en generación',
    icon: '👪',
    image: '/images/carrusel/foto10.jpg',
  },
  {
    title: 'Biodiversidad',
    description: 'Protegiendo y celebrando la riqueza natural del Amazonas',
    icon: '🦜',
    image: '/images/carrusel/foto11.jpg',
  },
  {
    title: 'Compromiso Verde',
    description: 'Prácticas sostenibles que cuidan nuestro planeta',
    icon: '🌍',
    image: '/images/carrusel/foto12.jpg',
  },
  {
    title: 'Sabor Natural',
    description: 'El dulce regalo de la naturaleza en cada cucharada',
    icon: '🍓',
    image: '/images/carrusel/foto13.jpg',
  },
  {
    title: 'Orgullo Caqueteño',
    description: 'Llevando lo mejor de nuestra región a tu mesa',
    icon: '❤️',
    image: '/images/carrusel/foto14.jpg',
  },
];

export function CaquetaSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Auto-play opcional
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-b from-frutaza-crema to-white"
    >
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-frutaza-verde-oscuro mb-6">
            Caquetá: Tierra de Sabores
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Redefiniendo la percepción de nuestra región amazónica a través de sabores auténticos y prácticas sostenibles
          </p>
        </div>

        {/* Carrusel */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen con controles */}
            <div className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                />
              </div>

              {/* Controles */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-frutaza-verde-oscuro/80 hover:bg-frutaza-verde-oscuro text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-frutaza-verde-oscuro/80 hover:bg-frutaza-verde-oscuro text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Contador de slides */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              {/* Slide actual destacado */}
              <div className="transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-frutaza-verde-vivo/20 to-frutaza-amarillo/20 rounded-2xl flex items-center justify-center text-3xl">
                    {slides[currentSlide].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-frutaza-verde-oscuro mb-3">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicadores */}
              <div className="flex flex-wrap gap-2 pt-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-12 bg-frutaza-amarillo'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
