import { NextResponse } from 'next/server';

/**
 * Server-Side Extraction Route
 * Eliminates browser CORS blocks by requesting Cobalt API clusters server-side.
 */
const COBALT_INSTANCES = [
  'https://cobalt-api.kwiatekm.tokyo',
  'https://api.cobalt.tools',
  'https://dl.khann.me',
  'https://cobalt.bowser65.dev',
  'https://cobalt.api.scipnet.cloud',
  'https://cobalt.canine.tools',
  'https://cobalt.slay.sh',
  'https://api.v001.me'
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, quality = '1080', format = 'mp4', isAudioOnly = false, bitrate = '128' } = body;

    if (!url) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    let lastError = null;

    // Try Cobalt nodes sequentially with server-side failover
    for (const instance of COBALT_INSTANCES) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        // Cobalt v10 protocol
        const v10Res = await fetch(`${instance}/`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VEROX-Downloader-Engine/3.0'
          },
          body: JSON.stringify({
            url,
            videoQuality: quality === 'max' ? '1080' : quality,
            audioFormat: format === 'mp3' ? 'mp3' : 'best',
            audioBitrate: bitrate,
            downloadMode: isAudioOnly ? 'audio' : 'auto',
            youtubeVideoCodec: 'h264'
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeout);

        if (v10Res && v10Res.ok) {
          const data = await v10Res.json();
          if (data.url || data.picker) {
            return NextResponse.json({ success: true, instance, ...data });
          }
        }

        // Cobalt v7 protocol fallback
        const v7Controller = new AbortController();
        const v7Timeout = setTimeout(() => v7Controller.abort(), 12000);

        const v7Res = await fetch(`${instance}/api/json`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VEROX-Downloader-Engine/3.0'
          },
          body: JSON.stringify({
            url,
            vQuality: quality === 'max' ? '1080' : quality,
            aFormat: format === 'mp3' ? 'mp3' : 'best',
            isAudioOnly,
            vCodec: 'h264'
          }),
          signal: v7Controller.signal
        }).catch(() => null);

        clearTimeout(v7Timeout);

        if (v7Res && v7Res.ok) {
          const data = await v7Res.json();
          if (data.url || data.picker) {
            return NextResponse.json({ success: true, instance, ...data });
          }
        }
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json(
      {
        error: 'All extraction clusters are currently busy. Please check the URL or try again in a few moments.',
        details: lastError?.message
      },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
