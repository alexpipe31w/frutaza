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

    console.log(`Ì∫Ä Ejecutando scraper semanal para @fruta.za...`);

    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profiles: ['@fruta.za'],
          resultsPerPage: 15,
          shouldDownloadVideos: false,
          shouldDownloadCovers: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('‚ùå Error Apify:', response.status, errorText);
      throw new Error(`Apify error: ${response.status}`);
    }

    const results = await response.json();
    console.log(`‚úÖ Obtenidos ${results.length} videos`);

    const videosWithMetadata = await Promise.all(
      results.slice(0, 15).map(async (item: any) => {
        const videoId = item.webVideoUrl?.split('/video/')[1] || '';
        
        let oembedData = null;
        try {
          const oembedResponse = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(item.webVideoUrl)}`
          );
          if (oembedResponse.ok) {
            oembedData = await oembedResponse.json();
          }
        } catch (err) {
          console.error('Error fetching oEmbed:', err);
        }

        return {
          id: videoId,
          url: item.webVideoUrl || '',
          title: item.text || 'Video de TikTok',
          thumbnail_url: oembedData?.thumbnail_url || item['authorMeta.avatar'] || '',
          author_name: item['authorMeta.name'] || 'Fruta.za',
          author_url: `https://www.tiktok.com/@${item['authorMeta.name'] || 'fruta.za'}`,
          embed_html: oembedData?.html || '',
          stats: {
            likes: item.diggCount || 0,
            comments: item.commentCount || 0,
            shares: item.shareCount || 0,
            views: item.playCount || 0,
          },
          created_at: item.createTimeISO || new Date().toISOString(),
        };
      })
    );

    const dataToSave = {
      videos: videosWithMetadata,
      fetched_at: new Date().toISOString(),
      total_videos: videosWithMetadata.length,
    };

    // Guardar en Edge Config v√≠a API de Vercel
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
      console.error('‚ùå Error guardando en Edge Config:', updateResponse.status, errorText);
      throw new Error(`Edge Config update error: ${updateResponse.status} - ${errorText}`);
    }

    console.log(`‚úÖ Videos guardados en Edge Config`);

    return NextResponse.json({
      success: true,
      message: 'Videos actualizados',
      total: videosWithMetadata.length,
      saved_at: dataToSave.fetched_at,
    });

  } catch (error) {
    console.error('Ì≤• Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    );
  }
}
