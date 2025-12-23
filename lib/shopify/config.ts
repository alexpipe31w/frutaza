export const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
  apiVersion: '2024-10',
};

// Validar que las variables estén configuradas
if (!shopifyConfig.domain || !shopifyConfig.storefrontAccessToken) {
  throw new Error(
    'Faltan variables de entorno de Shopify. Verifica tu .env.local'
  );
}
