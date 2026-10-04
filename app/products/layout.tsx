import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestros Productos | Frutatza',
  description: 'Mermeladas artesanales elaboradas con las mejores frutas del Caquetá',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Nuestros Productos | Frutatza',
    description: 'Mermeladas artesanales elaboradas con las mejores frutas del Caquetá',
    url: '/products',
    siteName: 'Frutatza',
    type: 'website',
    locale: 'es_CO',
    images: ['/images/banner-frutatza.png'],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
