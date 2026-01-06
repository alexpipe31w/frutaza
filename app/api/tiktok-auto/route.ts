import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Primero solo intenta conectar
    const data = await get('tiktok-videos');
    
    return NextResponse.json({
      success: true,
      hasData: !!data,
      dataType: typeof data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
