/**
 * VEROX MEDIA DOWNLOADER - Serverless Extraction Proxy
 * Queries Cobalt API cluster server-side with automatic failover.
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url, quality = '1080', format = 'mp4', isAudioOnly = false, bitrate = '128' } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  let lastError = null;

  for (const instance of COBALT_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      // Try Cobalt v10
      const v10Res = await fetch(`${instance}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'VEROX-Engine/3.0'
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
          return res.status(200).json({ success: true, instance, ...data });
        }
      }

      // Try Cobalt v7
      const v7Controller = new AbortController();
      const v7Timeout = setTimeout(() => v7Controller.abort(), 12000);

      const v7Res = await fetch(`${instance}/api/json`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'VEROX-Engine/3.0'
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
          return res.status(200).json({ success: true, instance, ...data });
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  return res.status(502).json({
    error: 'All extraction clusters are currently busy. Please verify the URL or try again in a few moments.',
    details: lastError?.message
  });
}
