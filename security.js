/**
 * VEROX MEDIA DOWNLOADER - High-Security & Anti-Copy Protection Suite
 * Prevents unauthorized inspection, code tampering, right-click, devtools,
 * text copying, and image extraction.
 */

(function () {
  'use strict';

  // 1. Disable Context Menu (Right Click)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showSecurityToast('Security Notice: Right-click is protected on VEROX.');
    return false;
  }, { capture: true });

  // 2. Disable Key Combinations for DevTools and Source Viewing
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('Developer tools access is restricted.');
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('Source inspection is restricted.');
      return false;
    }

    // Ctrl+Shift+J / Cmd+Option+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('Console access is restricted.');
      return false;
    }

    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('Element inspection is restricted.');
      return false;
    }

    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('View source is restricted.');
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. Disable Dragging of Images, Media and Elements
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 4. Disable Text Selection via JavaScript events
  document.addEventListener('selectstart', function (e) {
    // Allow selection only inside URL input
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return true;
    }
    e.preventDefault();
    return false;
  }, { capture: true });

  // 5. Anti-Tamper & DevTools Detection Monitor
  let devtoolsOpen = false;
  const threshold = 160;

  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
        console.warn('%cVEROX MEDIA DOWNLOADER - Protected Environment', 'color: #ff1e27; font-size: 20px; font-weight: bold;');
      }
    } else {
      devtoolsOpen = false;
    }
  }

  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 2000);

  // 6. Security Notification Toast
  function showSecurityToast(msg) {
    if (window.showToast) {
      window.showToast(msg, 'warning');
      return;
    }
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(229, 9, 20, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '30px';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '999999';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.3s ease';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  // Freeze security namespace against modification
  Object.freeze({ secure: true });
})();
