'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll
      document.body.style.overflow = 'hidden';

      // Animación de entrada
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo(
          modalRef.current,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          }
        );
      });

      return () => {
        ctx.revert();
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      gsap.to(modalRef.current, {
        scale: 0,
        rotation: 180,
        duration: 0.4,
        ease: 'back.in(1.7)',
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          onClose();
        },
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje'),
    };

    console.log('Datos del formulario:', data);
    
    alert('¡Mensaje enviado! Nos pondremos en contacto pronto 🍊');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal - Responsive: círculo en desktop, más rectangular en mobile */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg my-8"
      >
        <div
          className="relative w-full aspect-square md:aspect-square overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #FFB627, #FF8C42, #FF6B35)',
            borderRadius: '50%',
            boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.5), inset 0 -20px 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Hojita decorativa */}
          <div
            className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 z-20"
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))',
            }}
          >
            <svg viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16 text-frutatza-verde-vivo" fill="currentColor">
              <path d="M86.1,46.7C87.9,43.2,89,39.2,89,35c0-13.8-11.2-25-25-25S39,21.2,39,35c0,0.6,0,1.2,0.1,1.7C26.2,41.1,17,53.2,17,67.5C17,85.4,31.6,100,49.5,100h27c15.2,0,27.5-12.3,27.5-27.5C104,60.7,96.5,50.6,86.1,46.7z"/>
            </svg>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group z-20"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Contenido scrollable */}
          <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
            <div className="min-h-full flex items-center justify-center p-6 md:p-12">
              <div className="w-full max-w-md">
                {/* Título */}
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
                    ¡Contáctanos!
                  </h2>
                  <p className="text-white/90 text-base md:text-lg drop-shadow">
                    Cuéntanos cómo podemos ayudarte
                  </p>
                </div>

                {/* Formulario */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* Nombre */}
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Tu nombre"
                      required
                      className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all duration-300 text-sm md:text-base"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Tu correo electrónico"
                      required
                      className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all duration-300 text-sm md:text-base"
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <textarea
                      name="mensaje"
                      placeholder="Tu mensaje"
                      rows={3}
                      required
                      className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-3xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all duration-300 resize-none text-sm md:text-base"
                    />
                  </div>

                  {/* Botón enviar */}
                  <button
                    type="submit"
                    className="w-full px-6 md:px-8 py-3 md:py-4 bg-frutatza-verde-oscuro hover:bg-frutatza-verde-vivo text-white rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    Enviar Mensaje
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform">
                      <rect x={3} y={5} width={18} height={14} rx={2} strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>

                {/* Redes sociales y contacto */}
                <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                  {/* Email directo */}
                  <div className="text-center">
                    <p className="text-white/90 text-xs md:text-sm mb-2">También puedes escribirnos a:</p>
                    <a 
                      href="mailto:Fruta.zaaa@gmail.com" 
                      className="inline-flex items-center gap-2 text-white hover:text-frutatza-amarillo transition-colors duration-300 font-semibold text-sm md:text-base"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0">
                        <rect x={3} y={5} width={18} height={14} rx={2} strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="break-all">Fruta.zaaa@gmail.com</span>
                    </a>
                  </div>

                  {/* Redes sociales */}
                  <div className="flex justify-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-white/20">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/fruta.za?igsh=Mjk5ZmlpbnQybXN5&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label="Instagram"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/share/1BZcpZd4AB/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label="Facebook"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/573041019119"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label="WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://tiktok.com/@fruta.za"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label="TikTok"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brillo de fruta */}
          <div className="absolute top-[15%] left-[20%] w-24 h-24 md:w-32 md:h-32 bg-white/30 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* CSS para ocultar scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
