/**
 * VEROX MEDIA DOWNLOADER - Platform Definitions & Regex Detectors
 * Supports YouTube, TikTok, Instagram, Twitter/X, Facebook, Reddit, Pinterest, SoundCloud, Vimeo, Twitch, and more.
 */

const PLATFORMS = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    domain: 'youtube.com',
    color: '#FF0000',
    accentColor: '#FF1E27',
    badgeText: 'YouTube / Shorts',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    },
    getThumbnail(id) {
      if (!id) return null;
      return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    },
    fallbackThumbnail(id) {
      if (!id) return null;
      return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    },
    defaultFormat: 'mp4',
    defaultQuality: '1080',
    supportedFormats: ['mp4', 'mp3', 'webm', 'ogg', 'wav'],
    supportedQualities: ['max', '2160', '1440', '1080', '720', '480', '360'],
    audioBitrates: ['320', '256', '192', '128']
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    domain: 'tiktok.com',
    color: '#00F2FE',
    accentColor: '#FE2C55',
    badgeText: 'TikTok (No Watermark)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.3 6.3 0 0 0 1.9-4.42V8.92a8.28 8.28 0 0 0 4.84 1.54V7.01a4.85 4.85 0 0 1-1.01-.32z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/(\d+)|[\w.-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? (match[1] || 'tiktok') : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: 'max',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720'],
    audioBitrates: ['320', '256', '128']
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    domain: 'instagram.com',
    color: '#E1306C',
    accentColor: '#F77737',
    badgeText: 'Instagram (Reels / Post)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/([a-zA-Z0-9_-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: 'max',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720'],
    audioBitrates: ['320', '256', '128']
  },

  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    domain: 'x.com',
    color: '#1DA1F2',
    accentColor: '#E50914',
    badgeText: 'X / Twitter (HD Video)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[2] : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: 'max',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720'],
    audioBitrates: ['320', '256', '128']
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    domain: 'facebook.com',
    color: '#1877F2',
    accentColor: '#1877F2',
    badgeText: 'Facebook (Reels / Watch)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.|m\.|web\.)?(?:facebook\.com\/(?:watch\/?\?v=|[\w.-]+\/videos\/|reel\/|share\/v\/)|fb\.watch\/)([a-zA-Z0-9_-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: '1080',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720', '480'],
    audioBitrates: ['320', '256', '128']
  },

  reddit: {
    id: 'reddit',
    name: 'Reddit',
    domain: 'reddit.com',
    color: '#FF4500',
    accentColor: '#FF5722',
    badgeText: 'Reddit (Video + Audio)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm-5.465 4.14a.5.5 0 0 0-.14.695c.576.84 1.684 1.385 2.855 1.385 1.171 0 2.28-.545 2.855-1.385a.5.5 0 0 0-.828-.56c-.43.626-1.265 1.025-2.027 1.025-.762 0-1.597-.399-2.027-1.025a.5.5 0 0 0-.688-.135z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.)?(?:reddit\.com\/r\/[\w.-]+\/comments\/[\w.-]+|redd\.it\/[\w.-]+)/i,
    extractId(url) {
      return 'reddit-media';
    },
    defaultFormat: 'mp4',
    defaultQuality: 'max',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720'],
    audioBitrates: ['320', '256', '128']
  },

  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    domain: 'pinterest.com',
    color: '#BD081C',
    accentColor: '#E60023',
    badgeText: 'Pinterest (Video & Pin)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12.004-5.378 12.004-11.999C24.017 5.367 18.641 0 12.017 0z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:[a-zA-Z0-9.-]+\.)?pinterest\.(?:com|[\w.]+)\/pin\/(\d+)|pin\.it\/([a-zA-Z0-9_-]+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? (match[1] || match[2]) : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: 'max',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720'],
    audioBitrates: ['320', '256']
  },

  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    domain: 'soundcloud.com',
    color: '#FF5500',
    accentColor: '#FF7700',
    badgeText: 'SoundCloud (High-Bitrate MP3)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1.175 12.225c-.05 0-.09.04-.09.09v3.37c0 .05.04.09.09.09s.09-.04.09-.09v-3.37c0-.05-.04-.09-.09-.09zm1.32-.93c-.06 0-.11.05-.11.11v5.23c0 .06.05.11.11.11s.11-.05.11-.11v-5.23c0-.06-.05-.11-.11-.11zm1.32-.82c-.07 0-.13.06-.13.13v6.87c0 .07.06.13.13.13s.13-.06.13-.13v-6.87c0-.07-.06-.13-.13-.13zm1.32-.47c-.08 0-.15.07-.15.15v7.81c0 .08.07.15.15.15s.15-.07.15-.15v-7.81c0-.08-.07-.15-.15-.15zm1.32-.24c-.09 0-.17.08-.17.17v8.29c0 .09.08.17.17.17s.17-.08.17-.17v-8.29c0-.09-.08-.17-.17-.17zm1.32.14c-.1 0-.18.08-.18.18v8.01c0 .1.08.18.18.18s.18-.08.18-.18v-8.01c0-.1-.08-.18-.18-.18zm1.32-.61c-.11 0-.2.09-.2.2v9.22c0 .11.09.2.2.2s.2-.09.2-.2v-9.22c0-.11-.09-.2-.2-.2zm1.32-1.02c-.12 0-.22.1-.22.22v11.26c0 .12.1.22.22.22s.22-.1.22-.22v-11.26c0-.12-.1-.22-.22-.22zm1.32-.51c-.13 0-.24.11-.24.24v12.28c0 .13.11.24.24.24s.24-.11.24-.24v-12.28c0-.13-.11-.24-.24-.24zm1.32-.23c-.14 0-.25.11-.25.25v12.74c0 .14.11.25.25.25s.25-.11.25-.25v-12.74c0-.14-.11-.25-.25-.25zm1.32.18c-.14 0-.26.12-.26.26v12.38c0 .14.12.26.26.26s.26-.12.26-.26v-12.38c0-.14-.12-.26-.26-.26zm5.82-3.07a4.93 4.93 0 0 0-3.3 1.26c-.14.12-.22.3-.22.49v10.98c0 .35.28.63.63.63h6.97a3.94 3.94 0 0 0 0-7.88c-.37 0-.72.06-1.05.17a4.93 4.93 0 0 0-3.03-5.65z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/[\w.-]+\/[\w.-]+/i,
    extractId(url) {
      return 'sc-track';
    },
    defaultFormat: 'mp3',
    defaultQuality: 'max',
    supportedFormats: ['mp3', 'ogg', 'wav'],
    supportedQualities: ['max'],
    audioBitrates: ['320', '256', '128']
  },

  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    domain: 'vimeo.com',
    color: '#1AB7EA',
    accentColor: '#1AB7EA',
    badgeText: 'Vimeo (4K / 1080p)',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.525 3.01 7.525c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128 1.581-1.365 2.766-2.091 3.556-2.175 1.867-.179 3.018 1.096 3.447 3.826.46 2.923.778 4.739.957 5.449.539 2.457 1.134 3.687 1.787 3.687.499 0 1.256-.798 2.268-2.394 1.015-1.594 1.564-2.805 1.644-3.633.14-1.363-.393-2.046-1.597-2.046-.576 0-1.188.132-1.836.394 1.187-3.89 3.443-5.773 6.772-5.648 2.47.094 3.642 1.677 3.518 4.747z"/></svg>`,
    pattern: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/i,
    extractId(url) {
      const match = url.match(this.pattern);
      return match ? match[1] : null;
    },
    defaultFormat: 'mp4',
    defaultQuality: '1080',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720', '480'],
    audioBitrates: ['320', '256']
  },

  generic: {
    id: 'generic',
    name: 'Universal Media',
    domain: '',
    color: '#E50914',
    accentColor: '#FF1E27',
    badgeText: 'Web Stream / Direct',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>`,
    pattern: /^https?:\/\/.+/i,
    extractId(url) {
      return 'media';
    },
    defaultFormat: 'mp4',
    defaultQuality: '1080',
    supportedFormats: ['mp4', 'mp3'],
    supportedQualities: ['max', '1080', '720', '480'],
    audioBitrates: ['320', '256', '128']
  }
};

/**
 * Detect platform based on input URL
 */
function detectPlatform(url) {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PLATFORMS, detectPlatform };
}
