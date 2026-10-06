/**
 * VEROX MEDIA DOWNLOADER - Master Application Controller
 * KeyAuth REST API Authentication, Freemium Locks (5 Video/5 Audio),
 * 3 Top Tabs, CORS-Free Streaming Download Engine, and Anti-Theft Security.
 */

document.addEventListener('DOMContentLoaded', () => {
  // KeyAuth Credentials
  const KEYAUTH_CONFIG = {
    name: "Unknown9z's Application",
    ownerid: "xN6SKSCq6w",
    secret: "27ff193a1341e2b1a7d475e3a4c21577f3207a21ed1f97f26f08bdd50e5bbb86",
    version: "1.0",
    apiUrl: "https://keyauth.win/api/1.2/"
  };

  // State
  let userTier = 'free'; // 'premium' | 'free'
  let currentUser = null;
  let activeTab = 'video'; // 'video' | 'audio' | 'premium'
  let selectedQuality = '360';
  let freeVideoCount = 0;
  let freeAudioCount = 0;
  let currentMetadata = null;
  let isDownloading = false;

  // DOM Elements - Views
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');

  // Login Form & Security
  const keyauthForm = document.getElementById('keyauthForm');
  const keyauthUsername = document.getElementById('keyauthUsername') || document.getElementById('Username');
  const keyauthPassword = document.getElementById('keyauthPassword') || document.getElementById('Password');
  const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
  const btnLoginPremium = document.getElementById('btnLoginPremium');
  const btnContinueFree = document.getElementById('btnContinueFree');
  const loginErrorAlert = document.getElementById('loginErrorAlert');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const displayHwidVal = document.getElementById('displayHwidVal');
  const btnResetLocalHwid = document.getElementById('btnResetLocalHwid');

  // Dashboard Header & Tabs (Dynamic UI based on Free vs Premium)
  const userBadge = document.getElementById('userBadge');
  const btnLogout = document.getElementById('btnLogout');
  const navTabVideo = document.getElementById('navTabVideo');
  const navTabAudio = document.getElementById('navTabAudio');
  const navTabPremium = document.getElementById('navTabPremium');
  const navTabPcOpt = document.getElementById('navTabPcOpt');
  const navTabNetTweaks = document.getElementById('navTabNetTweaks');
  const navTabProUtils = document.getElementById('navTabProUtils');
  const navTabUserInfo = document.getElementById('navTabUserInfo');

  const tabDownloader = document.getElementById('tabDownloader');
  const tabPremium = document.getElementById('tabPremium');
  const tabPcOpt = document.getElementById('tabPcOpt');
  const tabNetTweaks = document.getElementById('tabNetTweaks');
  const tabProUtils = document.getElementById('tabProUtils');
  const tabUserInfo = document.getElementById('tabUserInfo');

  // User Information View Elements
  const infoDisplayUsername = document.getElementById('infoDisplayUsername');
  const infoDisplayLifespan = document.getElementById('infoDisplayLifespan');
  const infoDisplayExpiryDate = document.getElementById('infoDisplayExpiryDate');
  const infoFieldUsernameVal = document.getElementById('infoFieldUsernameVal');
  const infoDisplayPassword = document.getElementById('infoDisplayPassword');
  const btnToggleInfoPw = document.getElementById('btnToggleInfoPw');
  const btnCopyInfoPw = document.getElementById('btnCopyInfoPw');
  const btnCopyInfoUsername = document.getElementById('btnCopyInfoUsername');
  const infoDisplaySubName = document.getElementById('infoDisplaySubName');
  const infoDisplayHwid = document.getElementById('infoDisplayHwid');
  const btnCopyInfoHwid = document.getElementById('btnCopyInfoHwid');
  const btnResetHwidFromInfo = document.getElementById('btnResetHwidFromInfo');
  const btnLogoutFromInfo = document.getElementById('btnLogoutFromInfo');

  // Input & Preview
  const urlInput = document.getElementById('urlInput');
  const btnClear = document.getElementById('btnClear');
  const btnPaste = document.getElementById('btnPaste');
  const btnFetch = document.getElementById('btnFetch');
  const platformBadge = document.getElementById('platformBadge');
  const platformBadgeText = document.getElementById('platformBadgeText');

  // Progress Bar
  const statusTracker = document.getElementById('statusTracker');
  const statusStepText = document.getElementById('statusStepText');
  const statusPercentage = document.getElementById('statusPercentage');
  const progressBarFill = document.getElementById('progressBarFill');

  // Preview Card & Controls
  const mediaPreviewCard = document.getElementById('mediaPreviewCard');
  const previewThumbnail = document.getElementById('previewThumbnail');
  const previewTitle = document.getElementById('previewTitle');
  const previewAuthor = document.getElementById('previewAuthor');
  const tagPlatformName = document.getElementById('tagPlatformName');
  const qualityChipsContainer = document.getElementById('qualityChipsContainer');
  const qualitySectionLabel = document.getElementById('qualitySectionLabel');
  const freemiumHint = document.getElementById('freemiumHint');
  const btnDownloadMain = document.getElementById('btnDownloadMain');
  const downloadBtnText = document.getElementById('downloadBtnText');

  // Upgrade Modal
  const upgradeModal = document.getElementById('upgradeModal');
  const upgradeModalClose = document.getElementById('upgradeModalClose');
  const btnModalUpgradeNow = document.getElementById('btnModalUpgradeNow');
  const btnModalLoginNow = document.getElementById('btnModalLoginNow');
  const upgradeModalTitle = document.getElementById('upgradeModalTitle');
  const upgradeModalDesc = document.getElementById('upgradeModalDesc');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // -------------------- 1. INITIALIZATION --------------------
  init();

  function init() {
    setupSecurityShield();
    loadSession();
    updateHwidDisplay();
    setupEventListeners();
    initGamingCursor();
  }

  // -------------------- 2. SECURITY SHIELD --------------------
  function setupSecurityShield() {
    // Disable Right-Click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showToast('Right-click is protected on VEROX.', 'warning');
      return false;
    }, { capture: true });

    // Block F12, DevTools, View Source
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' || e.keyCode === 123 ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['u', 'U', 's', 'S'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { capture: true });

    // Disable dragging
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    }, { capture: true });
  }

  // -------------------- 3. SESSION MANAGEMENT --------------------
  function loadSession() {
    try {
      // Remember Me Check & Auto-fill
      const isRemembered = localStorage.getItem('verox_remember_me') === 'true';
      if (isRemembered) {
        const savedUsername = localStorage.getItem('verox_saved_username') || '';
        const savedPassword = localStorage.getItem('verox_saved_password') || '';
        if (keyauthUsername && savedUsername) keyauthUsername.value = savedUsername;
        if (keyauthPassword && savedPassword) keyauthPassword.value = savedPassword;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
      }

      const savedUser = localStorage.getItem('verox_keyauth_user');
      const savedTier = localStorage.getItem('verox_user_tier');
      freeVideoCount = parseInt(localStorage.getItem('verox_free_video_count') || '0', 10);
      freeAudioCount = parseInt(localStorage.getItem('verox_free_audio_count') || '0', 10);

      if (savedUser && savedTier === 'premium') {
        currentUser = JSON.parse(savedUser);
        userTier = 'premium';
        showDashboard();
      } else if (savedTier === 'free') {
        userTier = 'free';
        currentUser = null;
        showDashboard();
      } else {
        showLogin();
      }
    } catch (e) {
      showLogin();
    }
  }

  function showLogin() {
    loginView.classList.add('active');
    dashboardView.classList.remove('active');

    // Auto-fill Remember Me credentials when returning to login screen
    if (localStorage.getItem('verox_remember_me') === 'true') {
      const savedUsername = localStorage.getItem('verox_saved_username') || '';
      const savedPassword = localStorage.getItem('verox_saved_password') || '';
      if (keyauthUsername && savedUsername) keyauthUsername.value = savedUsername;
      if (keyauthPassword && savedPassword) keyauthPassword.value = savedPassword;
      if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
  }

  function showDashboard() {
    loginView.classList.remove('active');
    dashboardView.classList.add('active');
    updateUserBadge();
    updateDynamicTabs();
    switchTab(activeTab);
  }

  function updateUserBadge() {
    if (userTier === 'premium') {
      userBadge.innerHTML = `👑 PREMIUM VIP: <strong>${currentUser?.username || 'Active'}</strong> (Unlimited)`;
      userBadge.style.color = '#ffb703';
      userBadge.style.borderColor = '#ffb703';
      userBadge.style.background = 'rgba(255, 183, 3, 0.15)';
    } else {
      userBadge.innerHTML = `🆓 FREE TIER (Videos: ${Math.max(0, 5 - freeVideoCount)}/5 | Audios: ${Math.max(0, 5 - freeAudioCount)}/5 left)`;
      userBadge.style.color = '#fff';
      userBadge.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      userBadge.style.background = 'rgba(255, 255, 255, 0.08)';
    }
  }

  // -------------------- DYNAMIC UI TABS CONTROLLER --------------------
  function updateDynamicTabs() {
    if (userTier === 'premium') {
      // PREMIUM USER:
      // 1. Hide the "Premium" (Pricing) Tab completely
      if (navTabPremium) navTabPremium.style.display = 'none';
      if (tabPremium) tabPremium.classList.remove('active');

      // 2. Show the VIP-exclusive utility & user information tabs
      if (navTabPcOpt) navTabPcOpt.style.display = 'inline-flex';
      if (navTabNetTweaks) navTabNetTweaks.style.display = 'inline-flex';
      if (navTabProUtils) navTabProUtils.style.display = 'inline-flex';
      if (navTabUserInfo) navTabUserInfo.style.display = 'inline-flex';

      // If currently on 'premium' (pricing), redirect to PC Optimization
      if (activeTab === 'premium') {
        activeTab = 'pc_opt';
      }
    } else {
      // FREE USER:
      // 1. Show the "Premium" (Pricing) Tab
      if (navTabPremium) navTabPremium.style.display = 'inline-flex';

      // 2. Hide the VIP-exclusive tabs
      if (navTabPcOpt) navTabPcOpt.style.display = 'none';
      if (navTabNetTweaks) navTabNetTweaks.style.display = 'none';
      if (navTabProUtils) navTabProUtils.style.display = 'none';
      if (navTabUserInfo) navTabUserInfo.style.display = 'none';

      // If user was on a VIP tab, redirect back to Video downloader
      if (['pc_opt', 'net_tweaks', 'pro_utils', 'user_info'].includes(activeTab)) {
        activeTab = 'video';
      }
    }
  }

  // -------------------- 3. DEVICE HWID GENERATOR --------------------
  function getDeviceHWID() {
    let hwid = '';
    try {
      hwid = (localStorage.getItem('verox_hwid') || '').trim();
    } catch (_) {}

    // Ensure valid 32-character hexadecimal fingerprint
    if (!hwid || hwid.length < 16 || !/^[A-Fa-f0-9]+$/.test(hwid)) {
      const screenData = `${window.screen?.width || 1920}x${window.screen?.height || 1080}x${window.screen?.colorDepth || 24}`;
      const navData = `${navigator.userAgent || 'Mozilla'}-${navigator.language || 'en'}-${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
      let h1 = 0x811c9dc5;
      let h2 = 0x55555555;
      const combined = `${screenData}@@@${navData}`;
      for (let i = 0; i < combined.length; i++) {
        const c = combined.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193);
        h2 = Math.imul(h2 ^ c, 0x5bd1e995);
      }
      const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
      const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
      const part3 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
      const part4 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
      hwid = `${part1}${part2}${part3}${part4}`.toUpperCase();
      try {
        localStorage.setItem('verox_hwid', hwid);
      } catch (_) {}
    }
    return hwid;
  }

  function resetHWID() {
    try {
      localStorage.removeItem('verox_hwid');
    } catch (_) {}
    const newHwid = getDeviceHWID();
    updateHwidDisplay();
    showToast('Device HWID regenerated: ' + newHwid.substring(0, 8) + '...', 'info');
    return newHwid;
  }

  function updateHwidDisplay() {
    const hw = getDeviceHWID();
    if (displayHwidVal) {
      displayHwidVal.textContent = hw.substring(0, 16) + '...';
      displayHwidVal.title = 'Full Device HWID: ' + hw;
    }
    if (infoDisplayHwid) {
      infoDisplayHwid.textContent = hw;
    }
    if (currentUser) {
      currentUser.hwid = hw;
    }
  }

  // -------------------- 4. KEYAUTH AUTHENTICATION --------------------
  // -------------------- 4. KEYAUTH AUTHENTICATION --------------------
  async function handleKeyAuthLogin(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Safely retrieve inputs with redundant query fallbacks
    const userInput = document.getElementById('keyauthUsername') || document.getElementById('Username') || document.querySelector('#keyauthForm input[type="text"]');
    const passInput = document.getElementById('keyauthPassword') || document.getElementById('Password') || document.querySelector('#keyauthForm input[type="password"]');

    const username = userInput ? userInput.value.trim() : '';
    const password = passInput ? passInput.value : '';

    if (!username) {
      showLoginError('Please enter your KeyAuth Username or License Key.');
      showToast('⚠️ Please enter your KeyAuth Username or License Key.', 'warning');
      if (userInput) userInput.focus();
      return;
    }

    setLoginLoading(true);
    hideLoginError();
    showToast('🔑 Connecting to KeyAuth Security Server...', 'info');

    const deviceHwid = getDeviceHWID();
    updateHwidDisplay();
    console.log('[VEROX KeyAuth] Attempting login with HWID:', deviceHwid);

    try {
      let authSuccessful = false;
      let userData = null;

      // 1. Try serverless backend route first (if deployed on Vercel/Netlify)
      const isHttp = window.location.protocol.startsWith('http');
      if (isHttp) {
        try {
          const serverRes = await fetch('/api/keyauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, hwid: deviceHwid })
          });
          const resJson = await serverRes.json().catch(() => null);
          if (resJson) {
            if (resJson.success) {
              authSuccessful = true;
              userData = {
                username,
                password,
                subscriptions: resJson.user?.subscriptions || [{ subscription: 'Premium' }],
                expiry: resJson.user?.expiry || resJson.user?.subscriptions?.[0]?.expiry || null,
                hwid: deviceHwid
              };
            } else {
              const err = resJson.message || 'Invalid KeyAuth credentials.';
              showLoginError(err);
              showToast('❌ Login Failed: ' + err, 'error');
              setLoginLoading(false);
              return;
            }
          }
        } catch (_) {}
      }

      // 2. Direct client request to KeyAuth REST API (with HWID)
      if (!authSuccessful) {
        const initParams = new URLSearchParams({
          type: 'init',
          name: KEYAUTH_CONFIG.name,
          ownerid: KEYAUTH_CONFIG.ownerid,
          secret: KEYAUTH_CONFIG.secret,
          ver: KEYAUTH_CONFIG.version
        });

        const initRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: initParams.toString()
        });

        const initData = await initRes.json().catch(() => null);
        if (initData && initData.success) {
          // Send hwid to satisfy KeyAuth "Force HWID" setting
          const loginParams = new URLSearchParams({
            type: 'login',
            username,
            pass: password || '',
            hwid: deviceHwid,
            sessionid: initData.sessionid,
            name: KEYAUTH_CONFIG.name,
            ownerid: KEYAUTH_CONFIG.ownerid
          });

          let loginRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginParams.toString()
          });

          let loginData = await loginRes.json().catch(() => null);

          // If password was empty or login failed, also test type: 'license'
          if (!loginData?.success && (!password || loginData?.message?.toLowerCase().includes('password') || loginData?.message?.toLowerCase().includes('key'))) {
            const licenseParams = new URLSearchParams({
              type: 'license',
              key: username,
              hwid: deviceHwid,
              sessionid: initData.sessionid,
              name: KEYAUTH_CONFIG.name,
              ownerid: KEYAUTH_CONFIG.ownerid
            });
            const licRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: licenseParams.toString()
            });
            const licData = await licRes.json().catch(() => null);
            if (licData && licData.success) {
              loginData = licData;
            }
          }

          if (loginData && loginData.success) {
            authSuccessful = true;
            userData = {
              username,
              password,
              subscriptions: loginData.info?.subscriptions || [{ subscription: 'Premium' }],
              expiry: loginData.info?.expiry || loginData.info?.subscriptions?.[0]?.expiry || null,
              hwid: deviceHwid
            };
          } else {
            const err = loginData?.message || 'Invalid KeyAuth credentials or license key.';
            showLoginError(err);
            showToast('❌ Login Failed: ' + err, 'error');
          }
        } else {
          const err = initData?.message || 'KeyAuth initialization failed.';
          showLoginError(err);
          showToast('❌ Login Failed: ' + err, 'error');
        }
      }

      if (authSuccessful) {
        userTier = 'premium';
        currentUser = userData;

        // Remember Me Storage
        const remBox = document.getElementById('rememberMeCheckbox');
        if (remBox && remBox.checked) {
          localStorage.setItem('verox_remember_me', 'true');
          localStorage.setItem('verox_saved_username', username);
          localStorage.setItem('verox_saved_password', password);
        } else {
          localStorage.removeItem('verox_remember_me');
          localStorage.removeItem('verox_saved_username');
          localStorage.removeItem('verox_saved_password');
        }

        localStorage.setItem('verox_keyauth_user', JSON.stringify(userData));
        localStorage.setItem('verox_user_tier', 'premium');
        showToast('✅ Login Successful! Welcome VIP Member ' + username, 'success');
        showDashboard();
      }
    } catch (err) {
      console.error('[KeyAuth Connection Error]:', err);
      const errText = err.message || 'Network error connecting to KeyAuth API. Please check your connection.';
      showLoginError('Login Failed: ' + errText);
      showToast('❌ Login Failed: ' + errText, 'error');
    } finally {
      setLoginLoading(false);
    }
  }

  // -------------------- VIP WHATSAPP PURCHASE HANDLER --------------------
  function handleVIPPurchase(planName = 'VIP Premium Package') {
    showToast(`👑 Redirecting to WhatsApp for ${planName}...`, 'success');
    const msg = `Hello VEROX MEDIA, I want to purchase the ${planName} VIP Premium Package.`;
    const waUrl = `https://wa.me/94724074632?text=${encodeURIComponent(msg)}`;

    try {
      const opened = window.open(waUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.assign(waUrl);
      }
    } catch (_) {
      window.location.assign(waUrl);
    }
  }

  // Expose globally so inline onclick handlers never fail
  window.handleKeyAuthLogin = handleKeyAuthLogin;
  window.handleVIPPurchase = handleVIPPurchase;

  function handleContinueFreeTier() {
    userTier = 'free';
    currentUser = null;
    localStorage.setItem('verox_user_tier', 'free');
    showDashboard();
    showToast('Entered as Free Tier. Free limit: 5 Videos and 5 Audios.', 'info');
  }

  function handleLogout() {
    userTier = 'free';
    currentUser = null;
    localStorage.removeItem('verox_keyauth_user');
    localStorage.removeItem('verox_user_tier');
    showLogin();
    showToast('Logged out successfully.', 'info');
  }

  function showLoginError(msg) {
    if (loginErrorMsg) loginErrorMsg.textContent = msg;
    if (loginErrorAlert) {
      loginErrorAlert.classList.add('visible');
      loginErrorAlert.style.display = 'flex';
    }
  }

  function hideLoginError() {
    if (loginErrorAlert) {
      loginErrorAlert.classList.remove('visible');
      loginErrorAlert.style.display = 'none';
    }
  }

  function setLoginLoading(loading) {
    const btn = document.getElementById('btnLoginPremium');
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.innerHTML = `<span class="spinner"></span><span>Logging in as VIP...</span>`;
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        <span>Login as Premium (VIP)</span>
      `;
    }
  }

  // -------------------- 5. TAB SWITCHING --------------------
  function switchTab(tab) {
    activeTab = tab;

    // Remove active class from all tab buttons
    const allTabBtns = [navTabVideo, navTabAudio, navTabPremium, navTabPcOpt, navTabNetTweaks, navTabProUtils, navTabUserInfo];
    allTabBtns.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    // Hide all tab sections
    const allTabSections = [tabDownloader, tabPremium, tabPcOpt, tabNetTweaks, tabProUtils, tabUserInfo];
    allTabSections.forEach(sec => {
      if (sec) sec.classList.remove('active');
    });

    if (tab === 'video') {
      navTabVideo.classList.add('active');
      tabDownloader.classList.add('active');
      selectedQuality = userTier === 'premium' ? '1080' : '360';
      urlInput.placeholder = 'Paste video link (YouTube, TikTok, Facebook, Instagram)...';
      renderQualityChips();
    } else if (tab === 'audio') {
      navTabAudio.classList.add('active');
      tabDownloader.classList.add('active');
      selectedQuality = userTier === 'premium' ? '320' : '128';
      urlInput.placeholder = 'Paste video or music link to extract audio...';
      renderQualityChips();
    } else if (tab === 'premium') {
      if (navTabPremium) navTabPremium.classList.add('active');
      if (tabPremium) tabPremium.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'pc_opt') {
      if (navTabPcOpt) navTabPcOpt.classList.add('active');
      if (tabPcOpt) tabPcOpt.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'net_tweaks') {
      if (navTabNetTweaks) navTabNetTweaks.classList.add('active');
      if (tabNetTweaks) tabNetTweaks.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'pro_utils') {
      if (navTabProUtils) navTabProUtils.classList.add('active');
      if (tabProUtils) tabProUtils.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'user_info') {
      if (navTabUserInfo) navTabUserInfo.classList.add('active');
      if (tabUserInfo) tabUserInfo.classList.add('active');
      populateUserInfoView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateDownloadButtonText();
  }

  // -------------------- FORMAT KEYAUTH EXPIRY & LIFESPAN --------------------
  function formatKeyAuthExpiry(expiryRaw) {
    if (!expiryRaw) {
      return {
        lifespanText: "Lifetime",
        isLifetime: true,
        formattedDate: "Permanent VIP License",
        daysLeft: 9999
      };
    }

    let expirySeconds = parseInt(expiryRaw, 10);
    if (isNaN(expirySeconds)) {
      const d = new Date(expiryRaw);
      if (!isNaN(d.getTime())) {
        expirySeconds = Math.floor(d.getTime() / 1000);
      }
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const diffSeconds = expirySeconds - nowSeconds;
    const fiveYearsSeconds = 5 * 365.25 * 86400; // ~157,788,000 seconds
    const expiryDate = new Date(expirySeconds * 1000);
    const formattedDate = !isNaN(expiryDate.getTime())
      ? expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Active VIP';

    // If remaining is >= 5 years OR the expiry year is >= 2031, display "Lifetime"
    if (diffSeconds >= fiveYearsSeconds || expiryDate.getFullYear() >= 2031 || diffSeconds > 150000000) {
      return {
        lifespanText: "Lifetime",
        isLifetime: true,
        formattedDate: `Permanent VIP (${formattedDate})`,
        daysLeft: Math.floor(diffSeconds / 86400)
      };
    }

    if (diffSeconds <= 0) {
      return {
        lifespanText: "Subscription Expired",
        isLifetime: false,
        formattedDate: `Expired on ${formattedDate}`,
        daysLeft: 0,
        years: 0,
        days: 0
      };
    }

    // Calculate exact "X Years and Y Days"
    const totalDays = Math.floor(diffSeconds / 86400);
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;

    return {
      lifespanText: `${years} Years and ${days} Days`,
      isLifetime: false,
      formattedDate: formattedDate,
      daysLeft: totalDays,
      years: years,
      days: days
    };
  }

  // -------------------- POPULATE USER INFORMATION VIEW --------------------
  function populateUserInfoView() {
    const username = currentUser?.username || localStorage.getItem('verox_saved_username') || 'VIP Member';
    const savedPw = currentUser?.password || localStorage.getItem('verox_saved_password') || '';
    const deviceHwid = currentUser?.hwid || getDeviceHWID();

    if (infoDisplayUsername) infoDisplayUsername.textContent = username;
    if (infoFieldUsernameVal) infoFieldUsernameVal.textContent = username;

    if (infoDisplayPassword) {
      infoDisplayPassword.value = savedPw || '••••••••••••';
      infoDisplayPassword.type = 'password';
      if (btnToggleInfoPw) {
        btnToggleInfoPw.title = 'Show Password';
        btnToggleInfoPw.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
      }
    }

    if (infoDisplayHwid) {
      infoDisplayHwid.textContent = deviceHwid;
    }

    const rawExpiry = currentUser?.expiry || currentUser?.subscriptions?.[0]?.expiry || null;
    const expiryInfo = formatKeyAuthExpiry(rawExpiry);

    if (infoDisplayLifespan) {
      infoDisplayLifespan.textContent = expiryInfo.lifespanText;
      if (expiryInfo.isLifetime) {
        infoDisplayLifespan.className = 'lifespan-hero-value lifetime-glow';
      } else {
        infoDisplayLifespan.className = 'lifespan-hero-value standard-glow';
      }
    }

    if (infoDisplayExpiryDate) {
      infoDisplayExpiryDate.textContent = expiryInfo.formattedDate;
    }

    if (infoDisplaySubName) {
      const subName = currentUser?.subscriptions?.[0]?.subscription || 'VIP Unlimited';
      infoDisplaySubName.textContent = subName;
    }
  }

  // -------------------- 6. FREEMIUM QUALITY CHIPS --------------------
  function renderQualityChips() {
    qualityChipsContainer.innerHTML = '';
    const isAudio = activeTab === 'audio';

    qualitySectionLabel.textContent = isAudio ? 'Select Audio Bitrate:' : 'Select Video Resolution:';
    freemiumHint.textContent = userTier === 'premium' ? '👑 All Qualities Unlocked' : 'Free Tier: 360p / 128kbps Only';

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

    const list = isAudio ? audioQualities : videoQualities;

    list.forEach((q) => {
      const chip = document.createElement('div');
      const isUnlocked = userTier === 'premium' || q.isFree;
      chip.className = `quality-chip ${isUnlocked ? '' : 'locked'} ${selectedQuality === q.id ? 'selected' : ''}`;

      chip.innerHTML = `
        <span>${q.label}</span>
        ${isUnlocked 
          ? `<span class="chip-tag-free">${q.isFree ? 'Free' : 'VIP'}</span>`
          : `<span class="lock-badge">🔒 LOCKED</span>`}
      `;

      chip.addEventListener('click', () => {
        if (isUnlocked) {
          selectedQuality = q.id;
          renderQualityChips();
          updateDownloadButtonText();
        } else {
          showUpgradePopup(false, `${q.label} ${isAudio ? 'Audio' : 'Video'}`);
        }
      });

      qualityChipsContainer.appendChild(chip);
    });
  }

  function updateDownloadButtonText() {
    const isAudio = activeTab === 'audio';
    downloadBtnText.textContent = `Download Now (${selectedQuality}${isAudio ? 'kbps MP3' : 'p MP4'})`;
  }

  // -------------------- 7. UPGRADE POPUP MODAL --------------------
  function showUpgradePopup(isLimit, featureName = '') {
    if (isLimit) {
      upgradeModalTitle.innerHTML = `Free Download <span>Limit Reached</span>`;
      upgradeModalDesc.innerHTML = `You have completed all <strong>5 free downloads</strong>. To continue downloading unlimited media in 4K & Full HD, please upgrade or login with a Premium Account.`;
    } else {
      upgradeModalTitle.innerHTML = `Upgrade to <span>Premium</span>`;
      upgradeModalDesc.innerHTML = `<strong style="color:#ff333f;">${featureName}</strong> is locked on Free Tier. Free users are limited to 360p video and 128kbps audio.`;
    }
    upgradeModal.classList.add('open');
  }

  // -------------------- 8. MEDIA EXTRACTION & METADATA --------------------
  function handleUrlInput() {
    const url = urlInput.value.trim();
    if (!url) {
      platformBadge.classList.remove('visible');
      return;
    }
    const plat = detectPlatform(url);
    if (plat) {
      platformBadge.classList.add('visible');
      platformBadgeText.textContent = plat.badgeText;
      platformBadge.style.borderColor = plat.accentColor;
    } else {
      platformBadge.classList.remove('visible');
    }
  }

  async function fetchMediaDetails() {
    const url = urlInput.value.trim();
    if (!url) {
      showToast('Please enter or paste a valid video/audio URL.', 'warning');
      return;
    }

    setFetchLoading(true);
    showProgress('Analyzing link & fetching media details...', 25);

    try {
      const plat = detectPlatform(url) || { id: 'generic', name: 'Social Media' };
      let title = `${plat.name} Media`;
      let author = 'Online Creator';
      let thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60';

      // Fast oEmbed detection
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const idMatch = url.match(/(?:watch\?v=|shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
        if (idMatch) thumbnail = `https://i.ytimg.com/vi/${idMatch[1]}/hqdefault.jpg`;
        try {
          const oe = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
          if (oe.ok) {
            const data = await oe.json();
            title = data.title || title;
            author = data.author_name || author;
          }
        } catch (_) {}
      } else if (url.includes('tiktok.com')) {
        try {
          const oe = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
          if (oe.ok) {
            const data = await oe.json();
            title = data.title || title;
            author = data.author_name || author;
            if (data.thumbnail_url) thumbnail = data.thumbnail_url;
          }
        } catch (_) {}
      }

      currentMetadata = { title, author, thumbnail, url, platform: plat };

      previewTitle.textContent = title;
      previewAuthor.textContent = `By ${author}`;
      previewThumbnail.src = thumbnail;
      tagPlatformName.textContent = plat.name;

      mediaPreviewCard.classList.add('visible');
      renderQualityChips();
      showProgress('Media ready for download!', 100);
      setTimeout(hideProgress, 800);
      showToast('Media details ready!', 'success');
    } catch (err) {
      showToast('Failed to fetch preview details.', 'warning');
      hideProgress();
    } finally {
      setFetchLoading(false);
    }
  }

  // -------------------- 9. CORS-FREE DOWNLOAD EXECUTION --------------------
  async function executeDownload() {
    if (isDownloading) return;
    const url = urlInput.value.trim();
    if (!url) return;

    const isAudio = activeTab === 'audio';

    // Check Free Tier Limit (Max 5 Videos AND 5 Audios)
    if (userTier === 'free') {
      if (!isAudio && freeVideoCount >= 5) {
        showUpgradePopup(true);
        return;
      }
      if (isAudio && freeAudioCount >= 5) {
        showUpgradePopup(true);
        return;
      }
      // Check quality locks
      if (!isAudio && selectedQuality !== '360') {
        showUpgradePopup(false, `${selectedQuality}p Video`);
        return;
      }
      if (isAudio && selectedQuality !== '128') {
        showUpgradePopup(false, `${selectedQuality}kbps Audio`);
        return;
      }
    }

    isDownloading = true;
    setDownloadLoading(true);
    showProgress('Initiating high-speed stream extraction...', 35);

    try {
      // 1. Query Cobalt extraction cluster
      let streamUrl = null;

      // Try serverless /api/extract first if available
      try {
        const extRes = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            quality: selectedQuality,
            format: isAudio ? 'mp3' : 'mp4',
            isAudioOnly: isAudio,
            bitrate: selectedQuality
          })
        });
        if (extRes.ok) {
          const extData = await extRes.json();
          if (extData.url) streamUrl = extData.url;
        }
      } catch (_) {}

      // Fallback to client Cobalt nodes if running purely static
      if (!streamUrl) {
        streamUrl = await queryPublicCobalt(url, selectedQuality, isAudio);
      }

      if (!streamUrl) {
        throw new Error('Could not generate download link. Please verify the URL.');
      }

      showProgress('Bypassing CORS & starting direct transfer...', 85);

      const cleanFilename = `${(currentMetadata?.title || 'verox_media').replace(/[^\w\s-]/gi, '')}.${isAudio ? 'mp3' : 'mp4'}`;

      // 2. TRIGGER CORS-FREE DOWNLOAD
      // When deployed on Vercel, route via server proxy. On static, trigger browser navigation anchor.
      triggerDirectDownload(streamUrl, cleanFilename);

      // 3. Increment Free counter
      if (userTier === 'free') {
        if (isAudio) {
          freeAudioCount++;
          localStorage.setItem('verox_free_audio_count', freeAudioCount.toString());
        } else {
          freeVideoCount++;
          localStorage.setItem('verox_free_video_count', freeVideoCount.toString());
        }
        updateUserBadge();
      }

      showProgress('Download transfer initiated!', 100);
      showToast('Download started successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Download error. Please try again.', 'error');
    } finally {
      isDownloading = false;
      setDownloadLoading(false);
      setTimeout(hideProgress, 2000);
    }
  }

  // Direct Browser Download (Zero CORS issues)
  function triggerDirectDownload(streamUrl, filename) {
    // Priority: Try Vercel proxy if /api/download is alive, otherwise direct native anchor
    const proxyUrl = `/api/download?url=${encodeURIComponent(streamUrl)}&filename=${encodeURIComponent(filename)}`;

    const a = document.createElement('a');
    a.href = proxyUrl;
    a.setAttribute('download', filename);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 200);

    // Backup trigger directly on stream URL
    setTimeout(() => {
      const fallbackA = document.createElement('a');
      fallbackA.href = streamUrl;
      fallbackA.setAttribute('download', filename);
      fallbackA.setAttribute('target', '_blank');
      document.body.appendChild(fallbackA);
      fallbackA.click();
      setTimeout(() => fallbackA.remove(), 200);
    }, 400);
  }

  // Client-side Cobalt node failover
  async function queryPublicCobalt(url, quality, isAudio) {
    const nodes = [
      'https://cobalt-api.kwiatekm.tokyo',
      'https://api.cobalt.tools',
      'https://dl.khann.me',
      'https://cobalt.bowser65.dev',
      'https://cobalt.api.scipnet.cloud'
    ];

    for (const node of nodes) {
      try {
        const res = await fetch(`${node}/api/json`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url,
            vQuality: quality,
            aFormat: isAudio ? 'mp3' : 'best',
            isAudioOnly: isAudio
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) return data.url;
        }
      } catch (_) {}
    }
    return null;
  }

  // -------------------- 10. EVENT LISTENERS --------------------
  function setupEventListeners() {
    if (keyauthForm) keyauthForm.addEventListener('submit', handleKeyAuthLogin);
    btnLoginPremium.addEventListener('click', handleKeyAuthLogin);
    btnContinueFree.addEventListener('click', handleContinueFreeTier);
    btnLogout.addEventListener('click', handleLogout);
    if (btnResetLocalHwid) btnResetLocalHwid.addEventListener('click', resetHWID);

    navTabVideo.addEventListener('click', () => switchTab('video'));
    navTabAudio.addEventListener('click', () => switchTab('audio'));
    if (navTabPremium) navTabPremium.addEventListener('click', () => switchTab('premium'));
    if (navTabPcOpt) navTabPcOpt.addEventListener('click', () => switchTab('pc_opt'));
    if (navTabNetTweaks) navTabNetTweaks.addEventListener('click', () => switchTab('net_tweaks'));
    if (navTabProUtils) navTabProUtils.addEventListener('click', () => switchTab('pro_utils'));
    if (navTabUserInfo) navTabUserInfo.addEventListener('click', () => switchTab('user_info'));

    // VIP WhatsApp Purchase Button Event Delegation
    document.addEventListener('click', (e) => {
      const buyBtn = e.target.closest('.btn-whatsapp-buy, [data-plan]');
      if (!buyBtn) return;
      e.preventDefault();
      const planName = buyBtn.getAttribute('data-plan') || 'VIP Premium Package';
      handleVIPPurchase(planName);
    });

    // One-Click Terminal Command Copy to Clipboard Delegation
    document.addEventListener('click', async (e) => {
      const copyBtn = e.target.closest('.btn-copy-cmd');
      if (!copyBtn) return;
      const cmd = copyBtn.getAttribute('data-cmd');
      if (!cmd) return;

      try {
        await navigator.clipboard.writeText(cmd);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = cmd;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      const origText = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `<span>✅</span><span>Copied!</span>`;
      showToast('Command copied to clipboard! Ready to paste into terminal.', 'success');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = origText;
      }, 2500);
    });

    urlInput.addEventListener('input', handleUrlInput);
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') fetchMediaDetails();
    });

    btnClear.addEventListener('click', () => {
      urlInput.value = '';
      platformBadge.classList.remove('visible');
      mediaPreviewCard.classList.remove('visible');
      urlInput.focus();
    });

    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            urlInput.value = text.trim();
            handleUrlInput();
            showToast('URL pasted from clipboard!', 'success');
            setTimeout(fetchMediaDetails, 150);
          }
        }
      } catch (_) {
        showToast('Clipboard access denied. Please paste manually.', 'warning');
      }
    });

    btnFetch.addEventListener('click', fetchMediaDetails);
    btnDownloadMain.addEventListener('click', executeDownload);

    upgradeModalClose.addEventListener('click', () => upgradeModal.classList.remove('open'));
    upgradeModal.addEventListener('click', (e) => {
      if (e.target === upgradeModal) upgradeModal.classList.remove('open');
    });

    btnModalUpgradeNow.addEventListener('click', () => {
      upgradeModal.classList.remove('open');
      switchTab('premium');
    });

    btnModalLoginNow.addEventListener('click', () => {
      upgradeModal.classList.remove('open');
      showLogin();
    });

    // User Information View Action Listeners
    if (btnToggleInfoPw && infoDisplayPassword) {
      btnToggleInfoPw.addEventListener('click', () => {
        if (infoDisplayPassword.type === 'password') {
          infoDisplayPassword.type = 'text';
          btnToggleInfoPw.title = 'Hide Password';
          btnToggleInfoPw.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
        } else {
          infoDisplayPassword.type = 'password';
          btnToggleInfoPw.title = 'Show Password';
          btnToggleInfoPw.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
        }
      });
    }

    if (btnCopyInfoPw && infoDisplayPassword) {
      btnCopyInfoPw.addEventListener('click', async () => {
        const val = infoDisplayPassword.value;
        if (!val || val === '••••••••••••') {
          showToast('No password saved to copy.', 'warning');
          return;
        }
        try {
          await navigator.clipboard.writeText(val);
          showToast('Password copied to clipboard!', 'success');
        } catch (_) {
          showToast('Clipboard permission denied.', 'error');
        }
      });
    }

    if (btnCopyInfoUsername && infoFieldUsernameVal) {
      btnCopyInfoUsername.addEventListener('click', async () => {
        const val = infoFieldUsernameVal.textContent;
        if (val && val !== '--') {
          try {
            await navigator.clipboard.writeText(val);
            showToast('Username copied to clipboard!', 'success');
          } catch (_) {
            showToast('Clipboard permission denied.', 'error');
          }
        }
      });
    }

    if (btnCopyInfoHwid && infoDisplayHwid) {
      btnCopyInfoHwid.addEventListener('click', async () => {
        const val = infoDisplayHwid.textContent;
        if (val) {
          try {
            await navigator.clipboard.writeText(val);
            showToast('HWID copied to clipboard!', 'success');
          } catch (_) {
            showToast('Clipboard permission denied.', 'error');
          }
        }
      });
    }

    if (btnResetHwidFromInfo) {
      btnResetHwidFromInfo.addEventListener('click', () => {
        resetHWID();
        populateUserInfoView();
      });
    }

    if (btnLogoutFromInfo) {
      btnLogoutFromInfo.addEventListener('click', handleLogout);
    }
  }

  // -------------------- 11. HELPERS & TOASTS --------------------
  function detectPlatform(url) {
    if (/(?:youtube\.com|youtu\.be)/i.test(url)) return { id: 'youtube', name: 'YouTube', badgeText: 'YouTube / Shorts', accentColor: '#ff1e27' };
    if (/tiktok\.com/i.test(url)) return { id: 'tiktok', name: 'TikTok', badgeText: 'TikTok (No Watermark)', accentColor: '#00f2fe' };
    if (/instagram\.com/i.test(url)) return { id: 'instagram', name: 'Instagram', badgeText: 'Instagram (Reels / Post)', accentColor: '#e1306c' };
    if (/facebook\.com|fb\.watch/i.test(url)) return { id: 'facebook', name: 'Facebook', badgeText: 'Facebook (Watch & Reels)', accentColor: '#1877f2' };
    if (/twitter\.com|x\.com/i.test(url)) return { id: 'twitter', name: 'Twitter / X', badgeText: 'X / Twitter HD', accentColor: '#1da1f2' };
    if (/reddit\.com|redd\.it/i.test(url)) return { id: 'reddit', name: 'Reddit', badgeText: 'Reddit Media', accentColor: '#ff4500' };
    return null;
  }

  function showProgress(text, percent) {
    statusStepText.innerHTML = `<span class="spinner"></span> ${text}`;
    statusPercentage.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;
    statusTracker.classList.add('visible');
  }

  function hideProgress() {
    statusTracker.classList.remove('visible');
  }

  function setFetchLoading(loading) {
    btnFetch.disabled = loading;
    if (loading) {
      btnFetch.innerHTML = `<span class="spinner"></span><span>Extracting Info...</span>`;
    } else {
      btnFetch.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
        <span>Fetch Media & Details</span>
      `;
    }
  }

  function setDownloadLoading(loading) {
    btnDownloadMain.disabled = loading;
    if (loading) {
      btnDownloadMain.innerHTML = `<span class="spinner"></span><span>Bypassing CORS & Transferring...</span>`;
    } else {
      updateDownloadButtonText();
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // -------------------- 12. GAMING & DIGITAL CUSTOM CURSOR --------------------
  function initGamingCursor() {
    const gamingCursor = document.getElementById('gamingCursor');
    const cursorPointer = document.getElementById('cursorPointer');
    const cursorAura = document.getElementById('cursorAura');
    const cursorRipple = document.getElementById('cursorRipple');

    if (!gamingCursor || !cursorPointer || !cursorAura) return;

    // Preserve native cursor & gestures on touch-screen devices
    if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let auraX = -100;
    let auraY = -100;
    let isClicking = false;
    let isHovering = false;
    let isCursorActive = false;

    // Instant 0ms Pointer Tracking
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorActive) {
        isCursorActive = true;
        gamingCursor.classList.add('active');
        auraX = mouseX;
        auraY = mouseY;
      }

      cursorPointer.style.transform = isClicking
        ? `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.85)`
        : `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth Spring / Aura Trail Loop (requestAnimationFrame)
    function renderAura() {
      if (isCursorActive) {
        const ease = 0.18;
        auraX += (mouseX - auraX) * ease;
        auraY += (mouseY - auraY) * ease;

        cursorAura.style.transform = isClicking
          ? `translate3d(${auraX}px, ${auraY}px, 0) scale(0.86)`
          : `translate3d(${auraX}px, ${auraY}px, 0)`;
      }

      requestAnimationFrame(renderAura);
    }
    requestAnimationFrame(renderAura);

    // Interactive Hover Lock-On (Cyan Reticle)
    const interactiveSelector = 'a, button, input, textarea, select, label, .clickable, .nav-tab-btn, .quality-chip, .btn-copy-chip, .btn-copy-cmd, .btn-whatsapp-buy, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        if (!isHovering) {
          isHovering = true;
          gamingCursor.classList.add('hovering');
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        const related = e.relatedTarget;
        if (!related || !related.closest || !related.closest(interactiveSelector)) {
          isHovering = false;
          gamingCursor.classList.remove('hovering');
        }
      }
    }, { passive: true });

    // Click Shockwave Pulse & Mouse Down State
    window.addEventListener('mousedown', (e) => {
      isClicking = true;
      gamingCursor.classList.add('clicking');

      if (cursorRipple) {
        cursorRipple.style.setProperty('--click-x', `${e.clientX}px`);
        cursorRipple.style.setProperty('--click-y', `${e.clientY}px`);
        cursorRipple.classList.remove('animate');
        void cursorRipple.offsetWidth; // Force CSS repaint
        cursorRipple.classList.add('animate');
      }

      cursorPointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.85)`;
      cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) scale(0.86)`;
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      gamingCursor.classList.remove('clicking');
      cursorPointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
    }, { passive: true });

    // Viewport Boundary Visibility
    document.addEventListener('mouseleave', () => {
      isCursorActive = false;
      gamingCursor.classList.remove('active');
    });

    document.addEventListener('mouseenter', () => {
      isCursorActive = true;
      gamingCursor.classList.add('active');
    });
  }
});
