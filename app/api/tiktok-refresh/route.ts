import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'GdWCkxBtKWOsKjdch';
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

// Handle de TikTok. Configurable por env para poder cambiarlo sin desplegar codigo
// (el perfil se renombro y el scraper estuvo semanas devolviendo "profile does not exist").
const TIKTOK_PROFILE = process.env.TIKTOK_PROFILE || '@fruta.za';

type ApifyItem = {
  error?: string;
  errorCode?: string;
  webVideoUrl?: string;
  text?: string;
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
  playCount?: number;
  createTimeISO?: string;
  authorMeta?: { name?: string };
  'authorMeta.name'?: string;
};

export async function GET() {
  try {
    if (!APIFY_API_TOKEN || !EDGE_CONFIG_ID || !VERCEL_TOKEN) {
      throw new Error('Missing environment variables');
    }

    console.log(`[tiktok-refresh] Ejecutando scraper para ${TIKTOK_PROFILE}...`);

    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profiles: [TIKTOK_PROFILE],
          resultsPerPage: 9,
          shouldDownloadVideos: false,
          shouldDownloadCovers: false,
        }),
        signal: AbortSignal.timeout(280_000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[tiktok-refresh] Error Apify:', response.status, errorText);
      throw new Error(`Apify error: ${response.status}`);
    }

    const results: ApifyItem[] = await response.json();
    console.log(`[tiktok-refresh] Apify devolvio ${results.length} items`);

    // Apify responde 200 con un item {error, errorCode} cuando el perfil no existe.
    // Sin esta comprobacion ese item se guardaba como "video" vacio y machacaba
    // los videos buenos que ya estaban en Edge Config.
    const apifyError = results.find((item) => item?.error);
    if (apifyError) {
      console.error(
        `[tiktok-refresh] Apify error para ${TIKTOK_PROFILE}: ${apifyError.error} (${apifyError.errorCode ?? 'sin codigo'})`
      );
      return NextResponse.json(
        {
          success: false,
          error: `Apify: ${apifyError.error}`,
          profile: TIKTOK_PROFILE,
          note: 'Edge Config NO modificado: se conservan los videos anteriores.',
        },
        { status: 502 }
      );
    }

    const videosWithMetadata = results
      .map((item) => {
        const videoId = item.webVideoUrl?.split('/video/')[1]?.split('?')[0] || '';
        const authorName =
          item.authorMeta?.name || item['authorMeta.name'] || TIKTOK_PROFILE.replace('@', '');

        return {
          id: videoId,
          url: item.webVideoUrl || '',
          title: item.text || 'Video de TikTok',
          // NO guardamos thumbnail_url: las URLs de TikTok CDN caducan.
          // El endpoint /api/tiktok-thumb?url=... las obtiene frescas con cache CDN.
          author_name: authorName,
          author_url: `https://www.tiktok.com/@${authorName}`,
          stats: {
            likes: item.diggCount || 0,
            comments: item.commentCount || 0,
            shares: item.shareCount || 0,
            views: item.playCount || 0,
          },
          created_at: item.createTimeISO || new Date().toISOString(),
        };
      })
      // Un video sin id o sin url no se puede ni enlazar ni miniaturizar: fuera.
      .filter((v) => v.id && v.url)
      .slice(0, 9);

    // Fail-closed: nunca sobreescribir datos buenos con una respuesta vacia.
    if (videosWithMetadata.length === 0) {
      console.error('[tiktok-refresh] 0 videos validos; no se escribe en Edge Config');
      return NextResponse.json(
        {
          success: false,
          error: 'El scraper no devolvio ningun video valido',
          profile: TIKTOK_PROFILE,
          note: 'Edge Config NO modificado: se conservan los videos anteriores.',
        },
        { status: 502 }
      );
    }

    const dataToSave = {
      videos: videosWithMetadata,
      fetched_at: new Date().toISOString(),
      total_videos: videosWithMetadata.length,
    };

    const updateResponse = await fetch(
      `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: 'tiktok-videos',
              value: dataToSave,
            },
          ],
        }),
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error(
        '[tiktok-refresh] Error guardando en Edge Config:',
        updateResponse.status,
        errorText
      );
      throw new Error(`Edge Config update error: ${updateResponse.status}`);
    }

    console.log(`[tiktok-refresh] ${videosWithMetadata.length} videos guardados en Edge Config`);

    return NextResponse.json({
      success: true,
      message: 'Videos actualizados',
      profile: TIKTOK_PROFILE,
      total: videosWithMetadata.length,
      saved_at: dataToSave.fetched_at,
    });

  } catch (error) {
    console.error('[tiktok-refresh] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    );
  }
}
