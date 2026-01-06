import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const dynamic = 'force-dynamic'; // ⬅️ AGREGA ESTA LÍNEA
export const revalidate = 3600; // 1 hora

export async function GET() {
  try {
    const data = await get('tiktok_videos');

    if (!data) {
      return NextResponse.json(
        { error: 'No hay videos disponibles', videos: [], success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      videos: (data as any).videos || [],
      success: true,
      fetched_at: (data as any).fetched_at,
      total_videos: (data as any).total_videos,
    });

  } catch (error) {
    console.error('Error leyendo Edge Config:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos', videos: [], success: false },
      { status: 500 }
    );
  }
}
