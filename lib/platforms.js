/**
 * VEROX MEDIA DOWNLOADER - Platform Definitions
 */
export const PLATFORMS = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    accentColor: '#FF1E27',
    badgeText: 'YouTube / Shorts',
    pattern: /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    }
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#00F2FE',
    accentColor: '#FE2C55',
    badgeText: 'TikTok (No Watermark)',
    pattern: /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/(\d+)|[\w.-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? (match[1] || 'tiktok') : null;
    }
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    accentColor: '#F77737',
    badgeText: 'Instagram (Reels / Post)',
    pattern: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/([a-zA-Z0-9_-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    }
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    accentColor: '#1877F2',
    badgeText: 'Facebook (Watch & Reels)',
    pattern: /(?:https?:\/\/)?(?:www\.|m\.|web\.)?(?:facebook\.com\/(?:watch\/?\?v=|[\w.-]+\/videos\/|reel\/|share\/v\/)|fb\.watch\/)([a-zA-Z0-9_-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    }
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    color: '#1DA1F2',
    accentColor: '#E50914',
    badgeText: 'X / Twitter (HD Video)',
    pattern: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[2] : null;
    }
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    accentColor: '#FF5722',
    badgeText: 'Reddit (Video + Audio)',
    pattern: /(?:https?:\/\/)?(?:www\.)?(?:reddit\.com\/r\/[\w.-]+\/comments\/[\w.-]+|redd\.it\/[\w.-]+)/i,
    extractId() {
      return 'reddit-media';
    }
  },
  generic: {
    id: 'generic',
    name: 'Universal Media',
    color: '#E50914',
    accentColor: '#FF1E27',
    badgeText: 'Direct Stream',
    pattern: /^https?:\/\/.+/i,
    extractId() {
      return 'media';
    }
  }
};

export function detectPlatform(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (key === 'generic') continue;
    if (platform.pattern.test(cleanUrl)) {
      return platform;
    }
  }

  if (PLATFORMS.generic.pattern.test(cleanUrl)) {
    return PLATFORMS.generic;
  }

  return null;
}
