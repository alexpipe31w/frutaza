// Dominio canónico del sitio. Lo usan metadata (canonical/OG), sitemap y robots.
// Si NEXT_PUBLIC_SITE_URL no está definida, cae al dominio de producción.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.frutatza.com').replace(/\/+$/, '');
