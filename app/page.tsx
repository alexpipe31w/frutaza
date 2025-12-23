import { HeroSection } from '@/components/home/HeroSection';
import { HistoriaSection } from '@/components/home/HistoriaSection';
import { CaquetaSection } from '@/components/home/CaquetaSection';
import { SelloSection } from '@/components/home/SelloSection';
import { ProductosDestacados } from '@/components/home/ProductosDestacados';
import { MisionSection } from '@/components/home/MisionSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HistoriaSection />
      <ProductosDestacados />
      <MisionSection />
      <CaquetaSection />
      <SelloSection />
    </>
  );
}
