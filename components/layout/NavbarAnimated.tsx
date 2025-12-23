'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useContactModal } from '@/hooks/useContactModal';

export function NavbarAnimated() {
  const { open } = useContactModal();
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const totalItems = cart?.totalQuantity || 0;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-horizontal.png"
              alt="Frutaza - Frutas Salvajes, Dulzura Natural"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300"
            >
              Inicio
            </Link>
            <Link
              href="/products"
              className="text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300"
            >
              Productos
            </Link>
            <Link
              href="/blog"
              className="text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300"
            >
              Blog
            </Link>
            <button
              onClick={open}
              className="text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo transition-colors duration-300 font-semibold"
            >
              Contacto
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative group"
              aria-label="Carrito de compras"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-8 h-8 text-frutaza-verde-oscuro group-hover:text-frutaza-verde-vivo transition-colors duration-300"
              >
                <circle cx={9} cy={21} r={1} fill="currentColor" />
                <circle cx={20} cy={21} r={1} fill="currentColor" />
                <path
                  d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-frutaza-amarillo text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                  {totalItems}
                </div>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo transition-colors duration-300"
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-8 h-8"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-8 h-8"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300 py-2"
            >
              Inicio
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300 py-2"
            >
              Productos
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo font-semibold transition-colors duration-300 py-2"
            >
              Blog
            </Link>
            <button
              onClick={() => {
                open();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-frutaza-verde-oscuro hover:text-frutaza-verde-vivo transition-colors duration-300 font-semibold py-2"
            >
              Contacto
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
