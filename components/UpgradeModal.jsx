'use client';

/**
 * UpgradeModal Component
 * Alerts Free users when clicking locked qualities or reaching the 5-download limit.
 */
export default function UpgradeModal({ isOpen, onClose, onGoPremium, onGoLogin, lockedFeature, isLimitReached }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-badge-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
        </div>

        <h3 className="upgrade-title">
          {isLimitReached ? (
            <>Free Download <span>Limit Reached</span></>
          ) : (
            <>Upgrade to <span>Premium</span></>
          )}
        </h3>

        <p className="upgrade-desc">
          {isLimitReached ? (
            <>
              You have used all <strong>5 free downloads</strong>. To continue downloading unlimited media in 4K & Full HD, please login with a Premium Account.
            </>
          ) : (
            <>
              <strong style={{ color: '#ff333f' }}>{lockedFeature || 'High Quality'}</strong> is locked on Free Tier. Free users are limited to 360p video and 128kbps audio.
            </>
          )}
        </p>

        <div className="upgrade-features-pill-row">
          <span className="upgrade-pill">⚡ 4K 60FPS Video</span>
          <span className="upgrade-pill">🎵 320kbps MP3</span>
          <span className="upgrade-pill">🚫 No Watermarks</span>
          <span className="upgrade-pill">🚀 Unlimited Downloads</span>
        </div>

        <div className="upgrade-actions-row">
          <button
            onClick={() => {
              onClose();
              onGoPremium();
            }}
            className="btn-modal-upgrade-now"
          >
            👑 View Premium Plans (From 1,000)
          </button>

          <button
            onClick={() => {
              onClose();
              onGoLogin();
            }}
            className="nav-btn"
            style={{ justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
          >
            🔑 Login with KeyAuth Account
          </button>

          <button onClick={onClose} className="btn-modal-close-free">
            Continue on Free Tier
          </button>
        </div>
      </div>
    </div>
  );
}
