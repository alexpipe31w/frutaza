import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { NavbarAnimated } from '@/components/layout/NavbarAnimated';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ContactModalProvider } from '@/components/providers/ContactModalProvider';
import { EfectosSelva } from '@/components/animations/EfectosSelva';
import ChatbotWidget from './components/ChatbotWidget';
import { SITE_URL } from '@/lib/site';




const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Frutatza - Frutas Salvajes, Dulzura Natural',
  description: 'Mermeladas artesanales del Caquetá con frutas amazónicas 100% naturales',
  keywords: 'mermeladas, frutas amazónicas, Caquetá, Colombia, artesanal, natural',
  authors: [{ name: 'Frutatza' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Frutatza - Frutas Salvajes, Dulzura Natural',
    description: 'Mermeladas artesanales del Caquetá con frutas amazónicas',
    url: '/',
    siteName: 'Frutatza',
    type: 'website',
    locale: 'es_CO',
    images: ['/images/banner-frutatza.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-frutatza-crema antialiased`}>
        <NavbarAnimated />
        <EfectosSelva />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ContactModalProvider />
        <ChatbotWidget />
      </body>
    </html>
  );
}
