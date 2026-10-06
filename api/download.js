/**
 * VEROX MEDIA DOWNLOADER - Serverless Stream Proxy
 * Fixes CORS "Failed to fetch" error on Vercel by streaming remote media chunks
 * server-side with attachment disposition headers.
 */

export default async function handler(req, res) {
  const { url, filename = `verox_media_${Date.now()}.mp4` } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing media URL parameter' });
  }

  try {
    const upstreamRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: `Remote media server returned HTTP ${upstreamRes.status}`
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstreamRes.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Stream response
    const arrayBuffer = await upstreamRes.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('[Download Proxy Error]:', error);
    return res.status(500).json({ error: 'Failed to stream media', details: error.message });
  }
}
