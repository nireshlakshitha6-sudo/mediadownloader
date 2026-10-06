'use client';

import { useState } from 'react';

/**
 * LoginPage Component
 * KeyAuth REST Authentication & Free Tier Guest Entry
 */
export default function LoginPage({ onLoginSuccess, onContinueFree }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyAuthLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both KeyAuth username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/keyauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user || { username: username.trim() });
      } else {
        setErrorMessage(data.message || 'Invalid KeyAuth credentials. Please verify your username & password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error connecting to KeyAuth server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 14px' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <h1 className="login-title">
            VEROX <span>DOWNLOADER</span>
          </h1>
          <p className="login-subtitle">
            Universal Social Media Downloader with Turbo 4K & Lossless MP3
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="login-error-alert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* KeyAuth Form */}
        <form onSubmit={handleKeyAuthLogin} className="login-form">
          <div className="login-input-group">
            <label className="login-label">KeyAuth Username</label>
            <div className="login-input-wrap">
              <input
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">KeyAuth Password</label>
            <div className="login-input-wrap">
              <input
                type="password"
                className="login-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="btn-login-premium" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Authenticating with KeyAuth...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span>Login as Premium (VIP)</span>
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        {/* Continue as Free Tier */}
        <button
          type="button"
          onClick={onContinueFree}
          className="btn-continue-free"
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span>Continue as Free Tier (Guest Mode)</span>
        </button>

        {/* WhatsApp Support Help */}
        <div className="login-footer-info">
          <p>
            Need a Premium account or license key?{' '}
            <a
              href="https://wa.me/94724074632?text=Hello%20VEROX%20MEDIA%2C%20I%20want%20to%20buy%20a%20Premium%20Account."
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ff333f', fontWeight: '700' }}
            >
              Order on WhatsApp (+94724074632)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
