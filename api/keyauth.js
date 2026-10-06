/**
 * VEROX MEDIA DOWNLOADER - KeyAuth REST API Authentication Handler
 * Server-side route for Vercel deployment with mandatory HWID support.
 */

const KEYAUTH_CONFIG = {
  name: "Unknown9z's Application",
  ownerid: "xN6SKSCq6w",
  secret: "27ff193a1341e2b1a7d475e3a4c21577f3207a21ed1f97f26f08bdd50e5bbb86",
  version: "1.0",
  apiUrl: "https://keyauth.win/api/1.2/"
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password, hwid } = req.body || {};

  if (!username) {
    return res.status(400).json({ success: false, message: 'Please provide username or license key.' });
  }

  // Generate fallback HWID if not provided
  const clientHwid = hwid && hwid.trim().length > 0 
    ? hwid.trim() 
    : `VEROX-${Buffer.from(username).toString('hex').slice(0, 16).toUpperCase()}`;

  try {
    // 1. Initialize session with KeyAuth
    const initParams = new URLSearchParams({
      type: 'init',
      name: KEYAUTH_CONFIG.name,
      ownerid: KEYAUTH_CONFIG.ownerid,
      secret: KEYAUTH_CONFIG.secret,
      ver: KEYAUTH_CONFIG.version
    });

    const initRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'KeyAuth'
      },
      body: initParams.toString()
    });

    const initData = await initRes.json().catch(() => null);

    if (!initData || !initData.success) {
      return res.status(500).json({
        success: false,
        message: initData?.message || 'KeyAuth initialization failed.'
      });
    }

    const sessionid = initData.sessionid;

    // 2. Try Login with username + password + hwid
    const loginParams = new URLSearchParams({
      type: 'login',
      username: username.trim(),
      pass: password || '',
      hwid: clientHwid,
      sessionid: sessionid,
      name: KEYAUTH_CONFIG.name,
      ownerid: KEYAUTH_CONFIG.ownerid
    });

    let loginRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'KeyAuth'
      },
      body: loginParams.toString()
    });

    let loginData = await loginRes.json().catch(() => null);

    // If login failed or password was empty, try type: 'license'
    if (!loginData?.success) {
      const licenseParams = new URLSearchParams({
        type: 'license',
        key: username.trim(),
        hwid: clientHwid,
        sessionid: sessionid,
        name: KEYAUTH_CONFIG.name,
        ownerid: KEYAUTH_CONFIG.ownerid
      });

      const licRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'KeyAuth'
        },
        body: licenseParams.toString()
      });

      const licData = await licRes.json().catch(() => null);
      if (licData && licData.success) {
        loginData = licData;
      }
    }

    if (loginData && loginData.success) {
      return res.status(200).json({
        success: true,
        message: 'KeyAuth Authentication Successful! Premium Unlocked.',
        user: {
          username: username.trim(),
          subscriptions: loginData.info?.subscriptions || [{ subscription: 'Premium' }],
          expiry: loginData.info?.expiry || loginData.info?.subscriptions?.[0]?.expiry || null,
          hwid: clientHwid
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: loginData?.message || 'Invalid KeyAuth credentials.'
    });
  } catch (error) {
    console.error('[KeyAuth API Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication server error: ' + error.message
    });
  }
}
