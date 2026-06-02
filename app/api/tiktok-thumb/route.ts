import { NextRequest, NextResponse } from 'next/server';

// Las URLs de TikTok CDN caducan. Este proxy obtiene el thumbnail fresco
// a partir de la URL estable del video (via oEmbed), y Vercel CDN lo cachea 24h.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const videoUrl = request.nextUrl.searchParams.get('url');

  if (!videoUrl) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // oEmbed siempre devuelve una URL de thumbnail fresca (no guardamos la URL, siempre la pedimos)
    const oembedRes = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!oembedRes.ok) throw new Error('oEmbed failed');

    const oembed = await oembedRes.json();
    const thumbnailUrl: string = oembed.thumbnail_url;

    if (!thumbnailUrl) throw new Error('No thumbnail URL in oEmbed');

    // Descargamos la imagen y la devolvemos nosotros (evita CORS y restricciones de dominio)
    const imgRes = await fetch(thumbnailUrl, { signal: AbortSignal.timeout(8000) });
    if (!imgRes.ok) throw new Error('Image download failed');

    const imageBuffer = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        // CDN de Vercel cachea 24h, browser 1h
        'Cache-Control': 'public, s-maxage=86400, max-age=3600, stale-while-revalidate=3600',
      },
    });
  } catch {
    // Si falla, redirige a placeholder
    return new NextResponse(null, { status: 404 });
  }
}
