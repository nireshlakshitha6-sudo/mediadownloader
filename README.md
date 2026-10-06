# 🚀 VEROX MEDIA DOWNLOADER

> **Production-Ready Universal Social Video & Audio Downloader + VIP PC Optimization Suite**  
> Modern Dark Mode with Neon Red Accents, KeyAuth Authentication with Device HWID, Dynamic UI (Free vs. Premium Tiers), VIP PC Optimization Suite, Zero-CORS Stream Downloads, and WhatsApp Checkout.

---

## 🌟 Dynamic UI & Tier Architecture

### 1. 🆓 Free Tier (Guest Mode)
- **Top Navigation Tabs**:
  - `[ 🎬 Video ]`: Dedicated video downloader.
  - `[ 🎵 Audio ]`: Dedicated audio extractor.
  - `[ 👑 Premium ]`: Dedicated VIP subscription plans (1 Month, 2 Months, Lifetime) with pre-generated WhatsApp checkout buttons (`+94724074632`).
- **Freemium Limits**:
  - **Quality Locks**: Only **360p** for Video and **128 kbps** for Audio are free. All higher resolutions (480p, 720p, 1080p, 4K, 192kbps, 256kbps, 320kbps) are locked (`🔒 LOCKED`).
  - **Download Quota**: Maximum of **5 Free Videos AND 5 Free Audios**.
  - Clicking locked qualities or reaching quotas triggers the **Upgrade Modal**.

---

### 2. 👑 Premium VIP Tier (KeyAuth Logged In)
- **Dynamic Tab Transformation**:
  - **The Pricing ("Premium") tab is COMPLETELY HIDDEN** (VIPs are already subscribed!).
  - **4 New VIP Exclusive Tabs are UNLOCKED in the navbar**:
    - `[ ⚡ PC Optimization ]`: Curated CMD & PowerShell commands with step-by-step tutorials and one-click copy buttons to eliminate bottlenecks, repair system corruption (`sfc /scannow`, `DISM`), purge junk caches, and unlock the hidden "Ultimate Performance" power scheme.
    - `[ 🌐 Network Tweaks ]`: Advanced network stack optimizations for competitive gamers. DNS flushes, TCP/IP & Winsock resets, Cloudflare 1.1.1.1 & Google 8.8.8.8 low-latency DNS setups, and network throttling index disablement.
    - `[ 🛠️ Pro Utilities ]`: Windows secret tweaks, telemetry blockers, background app RAM liberators, instant frozen app task killer, God Mode control folder creator, and a Power-User Hotkey Cheat Sheet (`Win+Ctrl+Shift+B`, `Win+V`, etc.).
    - `[ 👤 User Information ]`: Real-time VIP account profile displaying username, active subscription name, remaining subscription lifespan, expiry date, masked password toggle with clipboard copy, device HWID with one-click regeneration, and one-click VIP logout.
  - **Media Downloads**:
    - 100% unlocked up to 4K Ultra HD 60FPS and 320kbps Studio MP3.
    - **Unlimited downloads** with zero restrictions.

---

### 3. 🎯 Gaming & Digital Custom Cursor
- **0ms Instant Tracking**: Sharp, glowing red digital pointer that moves synchronously with the mouse.
- **Holographic Spring Aura**: GPU-accelerated trailing ring with 4 tactical crosshair pips animated via `requestAnimationFrame` easing.
- **Lock-On Targeting Reticle**: Automatically expands and turns neon cyan (`#00f2fe`) when hovering over buttons, links, chips, or inputs.
- **Click Shockwave Pulse**: Dynamic ripple wave expanding from exact click coordinates.
- **Touch-Device Friendly**: Native touch interaction preserved on mobile and tablets via `@media (hover: hover) and (pointer: fine)` scoping.

---

### 4. 🔐 KeyAuth Authentication, "Remember Me" & Live Device HWID
- **Remember Me Functionality**: Checkbox saves login credentials in `localStorage` for automatic 1-click login on subsequent visits.
- **Embedded Credentials**:
  - **App Name**: `Unknown9z's Application`
  - **Owner ID**: `xN6SKSCq6w`
  - **App Secret**: `27ff193a1341e2b1a7d475e3a4c21577f3207a21ed1f97f26f08bdd50e5bbb86`
  - **Version**: `1.0`
- **Automatic Device HWID Generation**:
  - Automatically generates a 32-character hardware fingerprint and binds it to every request, passing KeyAuth's "Force HWID" verification seamlessly.
  - Visual HWID status indicator on the login card with a "Reset HWID" button.

---

### 5. 🛠️ Critical CORS Bug Fix ("Failed to fetch" Permanently Solved)
- **Direct Native Browser Download**: Transferred via direct anchor/iframe browser triggers without client-side `fetch()`, bypassing browser Cross-Origin Resource Sharing (CORS) blocks completely.
- **Serverless Proxy Fallback (`api/download.js`)**: Streams media server-side on Vercel with forced attachment headers (`Content-Disposition: attachment; filename="..."`).

---

### 6. 🛡️ Strict Anti-Theft & Security
- Right-click (Context menu) disabled.
- F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S blocked.
- Text selection and image dragging disabled.

---

## 📁 Final Cleaned-Up Directory Structure

```text
VIDEO DOWNLOADER/
├── index.html         # Master web application (Login, Downloader & 4 VIP Utility Tabs)
├── style.css          # Master stylesheet (Dark Mode, Red Accents, Utility Cards, Anti-Theft)
├── app.js             # Master controller (KeyAuth, Dynamic UI Tiers, Clipboard, Downloads)
├── manifest.json      # PWA Web App Manifest
├── vercel.json        # Vercel zero-build static & serverless configuration
├── netlify.toml       # Netlify zero-build drag-and-drop configuration
├── _headers           # Netlify/Cloudflare CORS and caching headers
├── _redirects         # Single Page routing fallback rules
├── api/
│   ├── download.js    # Vercel serverless stream proxy (CORS fix)
│   ├── extract.js     # Vercel serverless Cobalt extraction cluster
│   └── keyauth.js     # Vercel serverless KeyAuth authenticator with HWID
├── export-zip.html    # Standalone 1-click in-browser project ZIP packager
└── README.md          # Complete documentation and deployment guide
```

---

## 🚀 Deployment Instructions

### 1. Drag-and-Drop Deployment on Netlify (10 Seconds)
1. Go to [**app.netlify.com/drop**](https://app.netlify.com/drop).
2. Sign in to your Netlify account (free).
3. Drag the entire **`VIDEO DOWNLOADER`** folder into the upload box.
4. Netlify will deploy the site immediately with zero build errors.

### 2. Deploy on Vercel
1. Go to [**vercel.com/new**](https://vercel.com/new).
2. Upload this folder or connect via GitHub.
3. Click **Deploy**. The included `vercel.json` and `/api` serverless routes configure automatically without any build errors.

### 3. Run Locally
Double-click [**`index.html`**](index.html) in your browser.

### 4. Download Complete ZIP
Double-click [**`export-zip.html`**](export-zip.html) and click **"⚡ Download Project ZIP Now"**.
