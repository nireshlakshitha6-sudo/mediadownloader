import { NextResponse } from 'next/server';

/**
 * CRITICAL CORS FIX: Stream Proxy Endpoint
 * Bypasses all browser CORS blocks by streaming remote media chunks
 * server-side directly to the client with forced attachment headers.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || `verox_media_${Date.now()}.mp4`;

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Missing media URL parameter' }, { status: 400 });
  }

  try {
    // Perform server-side fetch without any browser CORS restrictions
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      // If remote returned an error, return informative status
      return NextResponse.json(
        { error: `Upstream media server returned HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    // Create stream headers with attachment disposition
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Stream the body directly to the client
    return new Response(response.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('[CORS Stream Proxy Error]:', error);
    return NextResponse.json(
      { error: 'Failed to stream media from remote server', details: error.message },
      { status: 500 }
    );
  }
}
