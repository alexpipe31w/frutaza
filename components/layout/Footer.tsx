import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/banner-frutatza.png)',
          backgroundPosition: 'center center',
        }}
      />
      
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Contenido */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4 backdrop-blur-md bg-black/20 rounded-2xl p-4 border border-white/20">
                <img
                  src="/images/logo-circular.png"
                  alt="Frutatza"
                  className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg"
                />
                <h3 className="text-2xl font-display font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Frutatza
                </h3>
              </div>
              <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 border border-white/20">
                <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
                  Mermeladas artesanales del Caquetá con frutas amazónicas. 100% natural, sin
                  conservantes ni aditivos artificiales.
                </p>
                <p className="text-sm text-frutatza-amarillo italic font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  "Frutas Salvajes, Dulzura Natural"
                </p>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 border border-white/20">
              <h4 className="font-display font-bold text-lg mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Enlaces
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-white hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-white hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contacto"
                    className="text-white hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 border border-white/20">
              <h4 className="font-display font-bold text-lg mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Contacto
              </h4>
              <ul className="space-y-2 text-white">
                <li className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-frutatza-amarillo flex-shrink-0 drop-shadow-lg"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Caquetá, Colombia</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5 text-frutatza-amarillo flex-shrink-0 drop-shadow-lg"
                  >
                    <rect
                      x={3}
                      y={5}
                      width={18}
                      height={14}
                      rx={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Fruta.zaaa@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-frutatza-amarillo flex-shrink-0 drop-shadow-lg"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">+57 304 101 9119</span>
                </li>
              </ul>

              {/* Redes sociales */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://www.facebook.com/share/1BZcpZd4AB/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white group-hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-lg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/fruta.za?igsh=Mjk5ZmlpbnQybXN5&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white group-hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-lg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://wa.me/573041019119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="WhatsApp"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white group-hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-lg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                <a
                  href="https://tiktok.com/@fruta.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="TikTok"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white group-hover:text-frutatza-amarillo transition-colors duration-300 drop-shadow-lg"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className=" bg-black/ rounded-2xl p-6 border border-white/20 mt-8">
            <div className="text-center text-sm text-white">
              <p className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                © {new Date().getFullYear()} Frutatza. Todos los derechos reservados.
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Hecho con</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-frutatza-verde-vivo animate-pulse drop-shadow-lg"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">en el Caquetá, Colombia</span>
              </div>
                  <div className="text-center text-sm text-white/80 mt-4">
                    <p className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Diseñado y desarrollado por{' '}
                      <a 
                        href="https://alex-rodriguez-portfol.vercel.app" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frutatza-verde-vivo hover:text-frutatza-amarillo transition-colors duration-300 font-semibold"
                      >
                        Alex Rodríguez
                      </a>
                    </p>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
