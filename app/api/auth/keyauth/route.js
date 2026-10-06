import { NextResponse } from 'next/server';

/**
 * KeyAuth REST API Authentication Handler
 * Authenticates username & password against KeyAuth backend.
 */
const KEYAUTH_CONFIG = {
  name: process.env.KEYAUTH_APP_NAME || "Unknown9z's Application",
  ownerid: process.env.KEYAUTH_OWNER_ID || "xN6SKSCq6w",
  secret: process.env.KEYAUTH_APP_SECRET || "27ff193a1341e2b1a7d475e3a4c21577f3207a21ed1f97f26f08bdd50e5bbb86",
  version: process.env.KEYAUTH_VERSION || "1.0",
  apiUrl: "https://keyauth.win/api/1.2/"
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both username and password.' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        {
          success: false,
          message: initData?.message || 'KeyAuth initialization failed. Verify credentials.'
        },
        { status: 500 }
      );
    }

    const sessionid = initData.sessionid;

    // 2. Perform user login
    const loginParams = new URLSearchParams({
      type: 'login',
      username: username.trim(),
      pass: password,
      sessionid: sessionid,
      name: KEYAUTH_CONFIG.name,
      ownerid: KEYAUTH_CONFIG.ownerid
    });

    const loginRes = await fetch(KEYAUTH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'KeyAuth'
      },
      body: loginParams.toString()
    });

    const loginData = await loginRes.json().catch(() => null);

    if (loginData && loginData.success) {
      return NextResponse.json({
        success: true,
        message: 'KeyAuth Authentication Successful! Premium Unlocked.',
        user: {
          username: username.trim(),
          subscriptions: loginData.info?.subscriptions || [{ subscription: 'Premium' }],
          ip: loginData.info?.ip,
          expiry: loginData.info?.subscriptions?.[0]?.expiry || 'Active'
        }
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: loginData?.message || 'Invalid KeyAuth username or password.'
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('[KeyAuth Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication server error: ' + error.message },
      { status: 500 }
    );
  }
}
