'use client';

import { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import DownloaderDashboard from '../components/DownloaderDashboard';

/**
 * Main Root Page
 * Coordinates KeyAuth Authentication, Guest Free Mode, and Dashboard State.
 */
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTier, setUserTier] = useState('free'); // 'premium' | 'free'
  const [user, setUser] = useState(null);

  // Free Tier Download Counters (Max 5 Videos, Max 5 Audios)
  const [freeVideoCount, setFreeVideoCount] = useState(0);
  const [freeAudioCount, setFreeAudioCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Restore session from localStorage if available
    try {
      const savedUser = localStorage.getItem('verox_keyauth_user');
      const savedTier = localStorage.getItem('verox_user_tier');
      const videoDownloads = parseInt(localStorage.getItem('verox_free_video_count') || '0', 10);
      const audioDownloads = parseInt(localStorage.getItem('verox_free_audio_count') || '0', 10);

      setFreeVideoCount(videoDownloads);
      setFreeAudioCount(audioDownloads);

      if (savedUser && savedTier === 'premium') {
        setUser(JSON.parse(savedUser));
        setUserTier('premium');
        setIsAuthenticated(true);
      } else if (savedTier === 'free') {
        setUserTier('free');
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Storage initialization error:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setUserTier('premium');
    setIsAuthenticated(true);
    try {
      localStorage.setItem('verox_keyauth_user', JSON.stringify(userData));
      localStorage.setItem('verox_user_tier', 'premium');
    } catch (_) {}
  };

  const handleContinueFree = () => {
    setUser(null);
    setUserTier('free');
    setIsAuthenticated(true);
    try {
      localStorage.setItem('verox_user_tier', 'free');
    } catch (_) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserTier('free');
    try {
      localStorage.removeItem('verox_keyauth_user');
      localStorage.removeItem('verox_user_tier');
    } catch (_) {}
  };

  const handleIncrementFreeCount = (type) => {
    if (type === 'video') {
      const newCount = freeVideoCount + 1;
      setFreeVideoCount(newCount);
      try {
        localStorage.setItem('verox_free_video_count', newCount.toString());
      } catch (_) {}
    } else {
      const newCount = freeAudioCount + 1;
      setFreeAudioCount(newCount);
      try {
        localStorage.setItem('verox_free_audio_count', newCount.toString());
      } catch (_) {}
    }
  };

  if (!isInitialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070709' }}>
        <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onContinueFree={handleContinueFree}
      />
    );
  }

  return (
    <DownloaderDashboard
      userTier={userTier}
      user={user}
      onLogout={handleLogout}
      freeVideoCount={freeVideoCount}
      freeAudioCount={freeAudioCount}
      onIncrementFreeCount={handleIncrementFreeCount}
    />
  );
}
