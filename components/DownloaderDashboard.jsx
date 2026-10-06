'use client';

import { useState } from 'react';
import { detectPlatform, PLATFORMS } from '../lib/platforms';
import PremiumTab from './PremiumTab';
import UpgradeModal from './UpgradeModal';

/**
 * DownloaderDashboard Component
 * Core downloading engine with 3 tabs, Freemium enforcement, and CORS-free download proxy.
 */
export default function DownloaderDashboard({
  userTier,
  user,
  onLogout,
  freeVideoCount,
  freeAudioCount,
  onIncrementFreeCount
}) {
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'audio' | 'premium'
  const [urlInput, setUrlInput] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState(null);

  // Media Details State
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [mediaData, setMediaData] = useState(null);

  // Quality Selection
  const [selectedQuality, setSelectedQuality] = useState(activeTab === 'audio' ? '128' : '360');

  // Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeLockedFeature, setUpgradeLockedFeature] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Toasts
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const handleUrlChange = (val) => {
    setUrlInput(val);
    const plat = detectPlatform(val);
    setDetectedPlatform(plat);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleUrlChange(text.trim());
          showToast('URL pasted from clipboard!', 'success');
        }
      }
    } catch (e) {
      showToast('Clipboard access denied. Please paste manually.', 'warning');
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'video') {
      setSelectedQuality('360');
    } else if (tab === 'audio') {
      setSelectedQuality('128');
    }
  };

  // Fetch Media Metadata
  const handleFetchMedia = async () => {
    if (!urlInput.trim()) {
      showToast('Please enter or paste a valid media URL.', 'warning');
      return;
    }

    setIsFetching(true);
    setShowProgress(true);
    setProgressMsg('Detecting platform and querying stream nodes...');
    setProgressPercent(25);

    try {
      const plat = detectedPlatform || detectPlatform(urlInput) || PLATFORMS.generic;
      setDetectedPlatform(plat);

      let title = `${plat.name} Media`;
      let author = 'Online Creator';
      let thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60';

      // Fast oEmbed detection for YouTube / TikTok
      if (plat.id === 'youtube') {
        const videoId = plat.extractId(urlInput);
        if (videoId) {
          thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }
        try {
          const oeRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlInput)}&format=json`);
          if (oeRes.ok) {
            const oeData = await oeRes.json();
            title = oeData.title || title;
            author = oeData.author_name || author;
          }
        } catch (_) {}
      } else if (plat.id === 'tiktok') {
        try {
          const oeRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(urlInput)}`);
          if (oeRes.ok) {
            const oeData = await oeRes.json();
            title = oeData.title || title;
            author = oeData.author_name || author;
            if (oeData.thumbnail_url) thumbnail = oeData.thumbnail_url;
          }
        } catch (_) {}
      }

      setMediaData({
        title,
        author,
        thumbnail,
        url: urlInput.trim(),
        platform: plat
      });

      setProgressPercent(100);
      setProgressMsg('Media ready for download!');
      setTimeout(() => setShowProgress(false), 900);
      showToast('Media details retrieved!', 'success');
    } catch (err) {
      showToast('Failed to fetch details. You can still proceed to download.', 'warning');
      setShowProgress(false);
    } finally {
      setIsFetching(false);
    }
  };

  // Execute CORS-Free Download
  const handleDownloadExecution = async () => {
    if (isDownloading) return;

    const isAudio = activeTab === 'audio';

    // 1. Check Free Tier Limit (Max 5 Videos and 5 Audios)
    if (userTier === 'free') {
      if (!isAudio && freeVideoCount >= 5) {
        setIsLimitReached(true);
        setIsUpgradeModalOpen(true);
        return;
      }
      if (isAudio && freeAudioCount >= 5) {
        setIsLimitReached(true);
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    setIsDownloading(true);
    setShowProgress(true);
    setProgressMsg('Initiating server-side stream extraction...');
    setProgressPercent(30);

    try {
      // 2. Call Next.js Server-Side Extraction Route
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          quality: selectedQuality,
          format: isAudio ? 'mp3' : 'mp4',
          isAudioOnly: isAudio,
          bitrate: selectedQuality
        })
      });

      const extractData = await extractRes.json();

      if (!extractRes.ok || !extractData.success || !extractData.url) {
        throw new Error(extractData.error || 'Failed to generate download stream');
      }

      setProgressPercent(75);
      setProgressMsg('Bypassing CORS & streaming file through server proxy...');

      // 3. CRITICAL CORS FIX: Route through /api/download server proxy
      const cleanFilename = `${(mediaData?.title || 'verox_media').replace(/[^\w\s-]/gi, '')}.${isAudio ? 'mp3' : 'mp4'}`;
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(extractData.url)}&filename=${encodeURIComponent(cleanFilename)}`;

      // 4. Trigger in-browser direct file transfer
      const a = document.createElement('a');
      a.href = proxyDownloadUrl;
      a.download = cleanFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 5. Track download for free tier
      if (userTier === 'free') {
        onIncrementFreeCount(isAudio ? 'audio' : 'video');
      }

      setProgressPercent(100);
      setProgressMsg('Download initiated successfully!');
      showToast('Download started! Check your browser downloads.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Download error. Please check the URL or try again.', 'error');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setShowProgress(false), 2000);
    }
  };

  // Freemium Qualities Matrix
  const videoQualities = [
    { id: '360', label: '360p', isFree: true },
    { id: '480', label: '480p', isFree: false },
    { id: '720', label: '720p', isFree: false },
    { id: '1080', label: '1080p', isFree: false },
    { id: '2160', label: '4K', isFree: false }
  ];

  const audioQualities = [
    { id: '128', label: '128 kbps', isFree: true },
    { id: '192', label: '192 kbps', isFree: false },
    { id: '256', label: '256 kbps', isFree: false },
    { id: '320', label: '320 kbps', isFree: false }
  ];

  const currentQualities = activeTab === 'audio' ? audioQualities : videoQualities;

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className="brand-name">
              VEROX <span>DOWNLOADER</span>
            </div>
          </div>

          {/* 3 Top Navigation Tabs */}
          <nav className="nav-center-tabs">
            <button
              onClick={() => handleTabSwitch('video')}
              className={`nav-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              <span>Video</span>
            </button>

            <button
              onClick={() => handleTabSwitch('audio')}
              className={`nav-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span>Audio</span>
            </button>

            <button
              onClick={() => handleTabSwitch('premium')}
              className={`nav-tab-btn premium-tab-btn ${activeTab === 'premium' ? 'active' : ''}`}
            >
              <svg className="crown-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z" />
              </svg>
              <span>Premium</span>
            </button>
          </nav>

          {/* User Status Badge & Logout */}
          <div className="nav-actions">
            {userTier === 'premium' ? (
              <span className="badge-pro" style={{ background: 'rgba(255, 183, 3, 0.15)', borderColor: '#ffb703', color: '#ffb703' }}>
                👑 PREMIUM VIP: {user?.username || 'Active'}
              </span>
            ) : (
              <span className="badge-pro" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                🆓 FREE TIER (Videos: {5 - freeVideoCount}/5 | Audios: {5 - freeAudioCount}/5)
              </span>
            )}

            <button onClick={onLogout} className="nav-btn" title="Switch User / Logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-wrapper">
        {activeTab === 'premium' ? (
          <PremiumTab />
        ) : (
          <div>
            {/* Hero */}
            <section className="hero">
              <div className="hero-pill">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>
                <span>
                  {activeTab === 'video' ? 'HIGH-SPEED VIDEO EXTRACTION' : 'LOSSLESS AUDIO & MP3 RIPPER'} • ZERO CORS
                </span>
              </div>

              <h1 className="hero-title">
                <span className="gradient-text">VEROX MEDIA DOWNLOADER</span>
              </h1>
              <p className="hero-subtitle">
                {activeTab === 'video'
                  ? 'Paste any video link from YouTube, TikTok, Facebook, or Instagram.'
                  : 'Extract high-fidelity MP3 audio from any social media video.'}
              </p>
            </section>

            {/* Input Box */}
            <section className="downloader-box">
              <div className="input-container">
                {detectedPlatform && (
                  <div className="platform-detector-badge visible" style={{ borderColor: detectedPlatform.accentColor }}>
                    <span>{detectedPlatform.badgeText}</span>
                  </div>
                )}

                <div className="input-row">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    className="url-input"
                    placeholder={`Paste ${activeTab === 'video' ? 'video' : 'audio'} link (YouTube, TikTok, Facebook, Instagram)...`}
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchMedia()}
                  />
                  <div className="input-buttons">
                    <button onClick={() => setUrlInput('')} className="btn-icon-action" title="Clear">
                      Clear
                    </button>
                    <button onClick={handlePaste} className="btn-icon-action btn-paste" title="Paste">
                      Paste
                    </button>
                  </div>
                </div>

                <button onClick={handleFetchMedia} className="btn-fetch" disabled={isFetching}>
                  {isFetching ? (
                    <>
                      <span className="spinner"></span>
                      <span>Fetching Media...</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      <span>Fetch Media & Details</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time Progress Bar */}
              {showProgress && (
                <div className="status-tracker visible">
                  <div className="status-info">
                    <span className="status-text">
                      <span className="spinner"></span> {progressMsg}
                    </span>
                    <span className="status-percentage">{progressPercent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
              )}
            </section>

            {/* Media Preview Card */}
            {mediaData && (
              <section className="media-preview-card visible">
                <div className="preview-grid">
                  <div className="thumbnail-wrap">
                    <img src={mediaData.thumbnail} alt={mediaData.title} className="preview-thumbnail" />
                    <div className="platform-floating-tag">
                      <span>{mediaData.platform?.name}</span>
                    </div>
                  </div>

                  <div className="preview-details">
                    <div className="preview-meta-top">
                      <h2 className="preview-title">{mediaData.title}</h2>
                      <div className="preview-author">By {mediaData.author}</div>
                    </div>

                    <div className="controls-panel">
                      <div className="control-group">
                        <div className="control-header-row">
                          <label className="control-label">
                            {activeTab === 'video' ? 'Select Resolution:' : 'Select Audio Bitrate:'}
                          </label>
                          <span className="freemium-hint">
                            {userTier === 'premium' ? '👑 All Qualities Unlocked' : 'Free Tier: 360p / 128kbps Only'}
                          </span>
                        </div>

                        {/* Freemium Quality Chips */}
                        <div className="quality-chips-grid">
                          {currentQualities.map((q) => {
                            const isUnlocked = userTier === 'premium' || q.isFree;
                            return (
                              <div
                                key={q.id}
                                onClick={() => {
                                  if (isUnlocked) {
                                    setSelectedQuality(q.id);
                                  } else {
                                    setUpgradeLockedFeature(`${q.label} ${activeTab === 'video' ? 'Video' : 'Audio'}`);
                                    setIsLimitReached(false);
                                    setIsUpgradeModalOpen(true);
                                  }
                                }}
                                className={`quality-chip ${isUnlocked ? '' : 'locked'} ${selectedQuality === q.id ? 'selected' : ''}`}
                              >
                                <span>{q.label}</span>
                                {isUnlocked ? (
                                  <span className="chip-tag-free">{q.isFree ? 'Free' : 'VIP'}</span>
                                ) : (
                                  <span className="lock-badge">🔒 LOCKED</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="download-action-row">
                      <button
                        onClick={handleDownloadExecution}
                        className="btn-download-main"
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <span className="spinner"></span>
                            <span>Bypassing CORS & Transferring...</span>
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                            </svg>
                            <span>
                              Download Now ({selectedQuality}
                              {activeTab === 'video' ? 'p MP4' : 'kbps MP3'})
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onGoPremium={() => {
          setIsUpgradeModalOpen(false);
          setActiveTab('premium');
        }}
        onGoLogin={onLogout}
        lockedFeature={upgradeLockedFeature}
        isLimitReached={isLimitReached}
      />

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
