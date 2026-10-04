import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestro Blog | Frutatza',
  description: 'Historias, recetas y todo sobre las frutas amazónicas',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Nuestro Blog | Frutatza',
    description: 'Historias, recetas y todo sobre las frutas amazónicas',
    url: '/blog',
    siteName: 'Frutatza',
    type: 'website',
    locale: 'es_CO',
    images: ['/images/banner-frutatza.png'],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
