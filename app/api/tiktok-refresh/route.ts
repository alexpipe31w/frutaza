import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'GdWCkxBtKWOsKjdch';
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

export async function GET() {
  try {
    if (!APIFY_API_TOKEN || !EDGE_CONFIG_ID || !VERCEL_TOKEN) {
      throw new Error('Missing environment variables');
    }

    console.log('Ejecutando scraper semanal para @fruta.za...');

    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profiles: ['@fruta.za'],
          resultsPerPage: 9,
          shouldDownloadVideos: false,
          shouldDownloadCovers: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Apify:', response.status, errorText);
      throw new Error(`Apify error: ${response.status}`);
    }

    const results = await response.json();
    console.log(`Obtenidos ${results.length} videos`);

    const videosWithMetadata = results.slice(0, 9).map((item: any) => {
      const videoId = item.webVideoUrl?.split('/video/')[1]?.split('?')[0] || '';
      const authorName = item.authorMeta?.name || item['authorMeta.name'] || 'fruta.za';

      return {
        id: videoId,
        url: item.webVideoUrl || '',
        title: item.text || 'Video de TikTok',
        // NO guardamos thumbnail_url: las URLs de TikTok CDN caducan.
        // El endpoint /api/tiktok-thumb?url=... las obtiene frescas con caché CDN.
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
    });

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
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Error guardando en Edge Config:', updateResponse.status, errorText);
      throw new Error(`Edge Config update error: ${updateResponse.status}`);
    }

    console.log('Videos guardados en Edge Config');

    return NextResponse.json({
      success: true,
      message: 'Videos actualizados',
      total: videosWithMetadata.length,
      saved_at: dataToSave.fetched_at,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    );
  }
}
