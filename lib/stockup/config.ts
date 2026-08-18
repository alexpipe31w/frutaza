// lib/stockup/config.ts
// Equivalente a lib/shopify/config.ts

export const stockupConfig = {
  // URL base de la plataforma StockUp
  apiUrl: process.env.NEXT_PUBLIC_STOCKUP_API_URL || 'https://stock-up-ashy.vercel.app',

  // Slug del tenant en StockUp. OJO: sigue siendo 'frutaza' (identificador interno de
  // StockUp, no marca visible). Solo se cambia aqui DESPUES de renombrarlo en StockUp.
  tenantSlug: process.env.NEXT_PUBLIC_STOCKUP_TENANT_SLUG || 'frutaza',

  // IMPORTANTE: La API Key NO debe ser NEXT_PUBLIC_ para no exponerse en el browser.
  // Las llamadas a StockUp se hacen desde Route Handlers de Next.js (server-side).
  // Solo se usa en /app/api/stockup/* (ver client.ts)
  apiKey: process.env.STOCKUP_API_KEY || '',
};

if (!stockupConfig.apiKey) {
  // Solo lanzar error en server-side, no en el browser
  if (typeof window === 'undefined') {
    console.warn('[StockUp] STOCKUP_API_KEY no está configurada en .env.local');
  }
}