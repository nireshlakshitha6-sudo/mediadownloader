/**
 * VEROX MEDIA DOWNLOADER - Core Extraction & API Engine
 * Handles metadata resolution (oEmbed, Noembed, YouTube direct)
 * and download stream generation via resilient Cobalt.tools instances (v7 & v10 protocols)
 */

class VeroxApiEngine {
  constructor() {
    // Curated high-reputation public Cobalt instances with CORS support
    this.defaultInstances = [
      'https://cobalt-api.kwiatekm.tokyo',
      'https://api.cobalt.tools',
      'https://dl.khann.me',
      'https://cobalt.bowser65.dev',
      'https://cobalt.api.scipnet.cloud',
      'https://cobalt.canine.tools',
      'https://cobalt.slay.sh',
      'https://api.v001.me'
    ];

    this.activeInstance = this.loadPreferredInstance();
    this.statusListeners = [];
  }

  loadPreferredInstance() {
    try {
      const saved = localStorage.getItem('verox_custom_instance');
      if (saved && saved.startsWith('http')) return saved.replace(/\/+$/, '');
    } catch (e) {
      console.warn('LocalStorage unavailable for custom instance:', e);
    }
    return this.defaultInstances[0];
  }

  savePreferredInstance(url) {
    try {
      if (url) {
        localStorage.setItem('verox_custom_instance', url.replace(/\/+$/, ''));
        this.activeInstance = url.replace(/\/+$/, '');
      } else {
        localStorage.removeItem('verox_custom_instance');
        this.activeInstance = this.defaultInstances[0];
      }
    } catch (e) {
      console.warn(e);
    }
  }

  onStatusChange(callback) {
    if (typeof callback === 'function') {
      this.statusListeners.push(callback);
    }
  }

  notifyStatus(step, message, percent = null) {
    this.statusListeners.forEach(cb => cb({ step, message, percent }));
  }

  /**
   * Fetch rich metadata (Title, Thumbnail, Author) without waiting for Cobalt
   */
  async fetchMetadata(url, platform) {
    this.notifyStatus(1, 'Analyzing URL & detecting platform...', 15);

    const result = {
      url,
      title: 'Social Media Media',
      author: 'Unknown Author',
      thumbnail: null,
      platform: platform ? platform.name : 'Universal',
      platformId: platform ? platform.id : 'generic',
      duration: null
    };

    // 1. YouTube specialized high-speed resolution
    if (platform && platform.id === 'youtube') {
      const videoId = platform.extractId(url);
      if (videoId) {
        result.thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        result.highResThumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      }
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          result.title = data.title || result.title;
          result.author = data.author_name || result.author;
          if (data.thumbnail_url) result.thumbnail = data.thumbnail_url;
          return result;
        }
      } catch (err) {
        console.warn('YouTube oEmbed error, trying fallback:', err);
      }
    }

    // 2. TikTok specialized resolution
    if (platform && platform.id === 'tiktok') {
      try {
        const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          result.title = data.title || 'TikTok Video';
          result.author = data.author_name || 'TikTok Creator';
          result.thumbnail = data.thumbnail_url || null;
          return result;
        }
      } catch (err) {
        console.warn('TikTok oEmbed fallback:', err);
      }
    }

    // 3. Universal Noembed Fallback (Supports Vimeo, SoundCloud, Reddit, etc.)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const noembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (noembedRes.ok) {
        const data = await noembedRes.json();
        if (data.title) result.title = data.title;
        if (data.author_name) result.author = data.author_name;
        if (data.thumbnail_url) result.thumbnail = data.thumbnail_url;
        return result;
      }
    } catch (err) {
      console.warn('Noembed query timed out or failed:', err);
    }

    // Default title based on URL if no metadata provider responded
    try {
      const urlObj = new URL(url);
      result.title = `${platform ? platform.name : 'Media'} (${urlObj.hostname})`;
    } catch (e) {
      result.title = 'Media Stream';
    }

    return result;
  }

  /**
   * Request media download stream from Cobalt engine with automatic multi-instance failover
   */
  async requestDownload(options) {
    const {
      url,
      format = 'mp4',
      quality = '1080',
      isAudioOnly = false,
      isMuted = false,
      bitrate = '320'
    } = options;

    this.notifyStatus(2, 'Connecting to high-speed extraction engine...', 40);

    // Build instance rotation list: custom first, then prioritized defaults
    const candidateInstances = [
      this.activeInstance,
      ...this.defaultInstances.filter(inst => inst !== this.activeInstance)
    ];

    let lastError = null;

    for (let i = 0; i < candidateInstances.length; i++) {
      const instance = candidateInstances[i];
      try {
        this.notifyStatus(
          3,
          `Processing stream via node ${i + 1}/${candidateInstances.length}...`,
          60 + Math.floor((i / candidateInstances.length) * 25)
        );

        const downloadData = await this.tryCobaltRequest(instance, {
          url,
          format,
          quality,
          isAudioOnly,
          isMuted,
          bitrate
        });

        if (downloadData && (downloadData.url || downloadData.picker || downloadData.status === 'stream' || downloadData.status === 'redirect')) {
          this.activeInstance = instance; // Remember functional instance
          this.notifyStatus(4, 'Stream extraction complete! Preparing download...', 100);
          return {
            success: true,
            instanceUsed: instance,
            ...downloadData
          };
        }
      } catch (err) {
        console.warn(`Instance failed [${instance}]:`, err.message || err);
        lastError = err;
        // Continue to next instance in chain
      }
    }

    // If all public instances failed, throw detailed diagnostic error
    throw new Error(
      lastError?.message ||
      'All extraction nodes are currently busy or the URL is restricted/private. Please verify the URL or try an alternative instance in Settings.'
    );
  }

  /**
   * Attempt request to a single Cobalt instance (supports both v10 and v7 specs)
   */
  async tryCobaltRequest(instance, params) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000); // 16s per instance timeout

    // Normalize quality for Cobalt
    let cobaltQuality = params.quality;
    if (cobaltQuality === 'max' || !cobaltQuality) cobaltQuality = '1080';

    // 1. First attempt: Cobalt Protocol v10 (Modern standard)
    const v10Payload = {
      url: params.url,
      videoQuality: cobaltQuality,
      audioFormat: params.format === 'mp3' ? 'mp3' : 'best',
      audioBitrate: params.bitrate || '320',
      downloadMode: params.isAudioOnly ? 'audio' : (params.isMuted ? 'mute' : 'auto'),
      youtubeVideoCodec: 'h264'
    };

    try {
      const v10Response = await fetch(`${instance}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(v10Payload),
        signal: controller.signal
      });

      if (v10Response.ok) {
        clearTimeout(timeoutId);
        const json = await v10Response.json();
        return this.parseCobaltResponse(json);
      }
    } catch (e) {
      // v10 request failed, fallback to v7 below
    }

    // 2. Second attempt: Cobalt Protocol v7 (/api/json endpoint)
    const v7Payload = {
      url: params.url,
      vQuality: cobaltQuality,
      vCodec: 'h264',
      aFormat: params.format === 'mp3' ? 'mp3' : 'best',
      isAudioOnly: params.isAudioOnly,
      isAudioMuted: params.isMuted,
      dubLang: false,
      disableMetadata: false,
      twitterGif: true,
      tiktokFullAudio: true
    };

    try {
      const v7Response = await fetch(`${instance}/api/json`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(v7Payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (v7Response.ok) {
        const json = await v7Response.json();
        return this.parseCobaltResponse(json);
      } else {
        const errorJson = await v7Response.json().catch(() => ({}));
        throw new Error(errorJson.text || errorJson.error?.code || `HTTP ${v7Response.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Parse Cobalt response and normalize output
   */
  parseCobaltResponse(data) {
    if (!data) throw new Error('Empty response received from extraction engine');

    // Error status check
    if (data.status === 'error') {
      const errText = data.text || data.error?.code || 'Extraction engine returned an error';
      throw new Error(errText);
    }

    // Direct stream or redirect
    if (data.url) {
      return {
        type: 'single',
        url: data.url,
        filename: data.filename || `verox_media_${Date.now()}`
      };
    }

    // Multiple picker items (e.g., Instagram album, TikTok gallery)
    if (data.status === 'picker' && Array.isArray(data.picker)) {
      return {
        type: 'picker',
        items: data.picker.map((item, idx) => ({
          type: item.type || 'media',
          url: item.url,
          thumb: item.thumb || item.url,
          title: `Item #${idx + 1}`
        })),
        audioUrl: data.audio || null
      };
    }

    throw new Error('Unsupported response payload from stream engine');
  }

  /**
   * Test latency of all registered instances for settings monitor
   */
  async pingInstances() {
    const results = [];
    const testList = [this.activeInstance, ...this.defaultInstances];
    const uniqueList = Array.from(new Set(testList));

    for (const inst of uniqueList) {
      const start = performance.now();
      let status = 'offline';
      let latency = null;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${inst}/api/serverInfo`, {
          signal: controller.signal
        }).catch(() => null);
        clearTimeout(timeout);

        if (res && (res.ok || res.status === 404 || res.status === 200)) {
          latency = Math.round(performance.now() - start);
          status = 'online';
        } else {
          // Alternative ping on root
          const rootRes = await fetch(`${inst}/`, { method: 'HEAD' }).catch(() => null);
          if (rootRes) {
            latency = Math.round(performance.now() - start);
            status = 'online';
          }
        }
      } catch (e) {
        status = 'timeout';
      }

      results.push({
        url: inst,
        status,
        latency,
        isCurrent: inst === this.activeInstance
      });
    }

    return results;
  }
}

// Global instance export
const veroxApi = new VeroxApiEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VeroxApiEngine, veroxApi };
}
