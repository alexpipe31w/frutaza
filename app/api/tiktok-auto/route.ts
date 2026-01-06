import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const revalidate = 3600; // 1 hora (porque ya no cambia seguido)

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'tiktok.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      videos: data.videos || [],
      success: true,
      fetched_at: data.fetched_at,
      total_videos: data.total_videos,
    });

  } catch (error) {
    console.error('Error leyendo tiktok.json:', error);
    
    return NextResponse.json(
      {
        error: 'No hay videos disponibles',
        videos: [],
        success: false,
      },
      { status: 500 }
    );
  }
}
