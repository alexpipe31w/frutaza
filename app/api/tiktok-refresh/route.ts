import { NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'GdWCkxBtKWOsKjdch';

export async function GET() {
  try {
    if (!APIFY_API_TOKEN) {
      throw new Error('APIFY_API_TOKEN is missing');
    }

    console.log(`🚀 Ejecutando scraper semanal para @fruta.za...`);

    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('❌ Error:', response.status, errorText);
      throw new Error(`Apify error: ${response.status}`);
    }

    const results = await response.json();
    console.log(`✅ Obtenidos ${results.length} videos de @fruta.za`);

    // Enriquecer con oEmbed
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

    // 📝 Guardar en JSON
    const dataToSave = {
      videos: videosWithMetadata,
      fetched_at: new Date().toISOString(),
      total_videos: videosWithMetadata.length,
    };

    const filePath = join(process.cwd(), 'public', 'data', 'tiktok.json');
    writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');

    console.log(`💾 Videos guardados en ${filePath}`);

    return NextResponse.json({
      success: true,
      message: 'Videos actualizados',
      total: videosWithMetadata.length,
      saved_at: dataToSave.fetched_at,
    });

  } catch (error) {
    console.error('💥 Error completo:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
