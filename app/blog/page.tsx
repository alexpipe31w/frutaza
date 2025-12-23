'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

// ========== INTERFACES ==========
interface HojaData {
  left: string;
  top: string;
  size: number;
  image: string;
  rotationStart: number;
}

// ✨ NUEVA INTERFACE PARA VIDEOS DE TIKTOK
interface TikTokVideo {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
  author_name: string;
  author_url: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  created_at: string;
}

// ========== ARRAYS DE DATOS ==========
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

const socialMedia = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/fruta.za',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@fruta.za',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/573041019119',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
];

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);
  const [hojasData, setHojasData] = useState<HojaData[]>([]);
  
  // ✨ NUEVOS ESTADOS PARA TIKTOK
  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const hojasContainerRef = useRef<HTMLDivElement>(null);

  // ✨ NUEVO: Fetch de videos de TikTok
  useEffect(() => {
    async function fetchTikTokVideos() {
      try {
        setLoading(true);
        const response = await fetch('/api/tiktok-auto');
        const data = await response.json();
        
        if (data.success && data.videos) {
          setTiktokVideos(data.videos);
        }
      } catch (error) {
        console.error('Error fetching TikTok videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTikTokVideos();
  }, []);

  useEffect(() => {
    setHojasData(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}%`,
        size: Math.random() * 80 + 100,
        image: HOJAS_IMAGES[Math.floor(Math.random() * HOJAS_IMAGES.length)],
        rotationStart: Math.random() * 360,
      }))
    );

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const hojas = hojasContainerRef.current?.querySelectorAll('.hoja-blog');
      hojas?.forEach((hoja, index) => {
        const duration = gsap.utils.random(12, 20);
        const swingAmount = gsap.utils.random(60, 120);

        gsap.to(hoja, {
          y: '120vh',
          duration,
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
    });

    return () => ctx.revert();
  }, [mounted]);

  return (
    <div className="relative min-h-screen pt-32 pb-0 bg-frutaza-crema overflow-x-hidden">
      {/* HOJAS CAYENDO */}
      {mounted && (
        <div
          ref={hojasContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 5 }}
        >
          {hojasData.map((hoja, i) => (
            <div
              key={`hoja-blog-${i}`}
              className="hoja-blog absolute"
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
      <div className="relative z-[1] container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2} 
            className="w-16 h-16 text-frutaza-verde-oscuro mx-auto hover:text-frutaza-verde-vivo transition-colors duration-300 mb-4"
          >
            <path 
              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
              fill="currentColor"
              opacity={0.2}
            />
            <path 
              d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
              fill="currentColor"
              opacity={0.2}
            />
            <path 
              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M12 3v18"
              className="text-frutaza-amarillo"
              strokeWidth={1.5}
            />
          </svg>
          <h1 className="text-5xl font-display font-bold text-frutaza-verde-oscuro mb-4">
            Nuestro Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Historias, recetas y todo sobre las frutas amazónicas
          </p>
          <div className="w-24 h-1 bg-frutaza-amarillo mx-auto rounded-full mt-6" />
        </div>

        {/* ✨ VIDEOS DE TIKTOK - AUTOMÁTICOS */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-frutaza-verde-oscuro mb-4">
              Síguenos en TikTok
            </h2>
            <p className="text-lg text-gray-600">
              Mira nuestro proceso artesanal y descubre el sabor del Amazonas 🎵
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-frutaza-verde-vivo border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Cargando videos...</p>
            </div>
          ) : tiktokVideos.length > 0 ? (
            /* VIDEOS CARGADOS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {tiktokVideos.slice(0, 9).map((video, index) => (
                <div
                  key={video.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="aspect-[9/16] relative">
                      {video.thumbnail_url ? (
                        <Image
                          src={video.thumbnail_url}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-frutaza-verde-vivo/20 to-frutaza-amarillo/20 flex items-center justify-center">
                          <span className="text-7xl">🎬</span>
                        </div>
                      )}
                      
                      {/* Overlay con info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-lg line-clamp-2 mb-2">
                          {video.title}
                        </p>
                        <p className="text-white/80 text-sm">
                          {video.author_name}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-2 text-white/90 text-xs">
                          <span>❤️ {(video.stats.likes / 1000).toFixed(1)}K</span>
                          <span>💬 {video.stats.comments}</span>
                          <span>👁️ {(video.stats.views / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                      
                      {/* Play icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-frutaza-verde-oscuro ml-1">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            /* NO HAY VIDEOS */
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
              <p className="text-gray-600 mb-4">No hay videos disponibles por el momento.</p>
              <p className="text-sm text-gray-500">Los videos se actualizan automáticamente cada hora.</p>
            </div>
          )}
        </div>

        {/* REDES SOCIALES */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-frutaza-verde-oscuro mb-4">
              Conéctate con Nosotros
            </h2>
            <p className="text-lg text-gray-600">
              Síguenos en redes sociales y únete a la comunidad Frutaza 🌿
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
              >
                <div className="text-frutaza-verde-oscuro group-hover:text-frutaza-verde-vivo transition-colors duration-300">
                  {social.icon}
                </div>
                <span className="text-sm font-semibold text-frutaza-verde-oscuro group-hover:text-frutaza-verde-vivo transition-colors duration-300">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Contenido del blog */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-frutaza-verde-oscuro mb-4">
              Más contenido próximamente
            </h2>
            <p className="text-gray-600">
              Aquí compartiremos artículos, recetas y tips sobre nuestras frutas y productos amazónicos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
