import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

// Los videos solo cambian una vez por semana (cron de /api/tiktok-refresh), asi que
// NO se lee Edge Config en cada visita al blog: la respuesta se cachea 6h en el CDN
// de Vercel via s-maxage. Antes no habia Cache-Control => 1 lectura de Edge Config
// por cada visita al blog.
// El SDK de Edge Config lee con no-store, asi que la ruta es dinamica por narices:
// quien ahorra las lecturas es el CDN, no el cache de datos de Next.
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
};

export async function GET() {
  try {
    const data = await get('tiktok-videos');

    if (!data) {
      return NextResponse.json(
        { error: 'No hay videos disponibles', videos: [], success: false },
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    const parsed = data as {
      videos?: Array<{ id?: string; url?: string }>;
      fetched_at?: string;
      total_videos?: number;
    };

    // Defensa en profundidad: si en Edge Config quedan videos sin id/url (los escribia
    // el refresh antiguo cuando Apify fallaba), no los servimos al blog.
    const videos = (parsed.videos || []).filter((v) => v?.id && v?.url);

    return NextResponse.json(
      {
        videos,
        success: true,
        fetched_at: parsed.fetched_at,
        total_videos: videos.length,
      },
      { headers: CACHE_HEADERS }
    );

  } catch (error) {
    console.error('Error leyendo Edge Config:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos', videos: [], success: false },
      { status: 500 }
    );
  }
}
