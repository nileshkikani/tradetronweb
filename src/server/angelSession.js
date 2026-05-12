const axios = require('axios');
const { totpSixDigits } = require('./totpSha1');

const ANGEL_ROOT = 'https://apiconnect.angelone.in';
const LOGIN_PATH = '/rest/auth/angelbroking/user/v1/loginByPassword';

let sessionCache = null;

function trimmedEnv(val) {
  return typeof val === 'string' ? val.trim().replace(/\s+/g, '') : val;
}

function loginHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': '127.0.0.1',
    'X-ClientPublicIP': '127.0.0.1',
    'X-MACAddress': '00:00:00:00:00:00',
    'X-PrivateKey': apiKey,
  };
}

async function angelLoginFresh() {
  const apiKey = trimmedEnv(process.env.ANGEL_API_KEY);
  const clientCode = trimmedEnv(process.env.ANGEL_CLIENT_CODE);
  const password = trimmedEnv(process.env.ANGEL_PIN);
  const totpSecret = trimmedEnv(process.env.ANGEL_TOTP_SECRET);

  if (!apiKey || !clientCode || !password || !totpSecret) {
    throw new Error('Angel credentials missing (ANGEL_API_KEY, ANGEL_CLIENT_CODE, ANGEL_PIN, ANGEL_TOTP_SECRET)');
  }

  const totp = totpSixDigits(totpSecret);
  const url = `${ANGEL_ROOT}${LOGIN_PATH}`;
  const { data } = await axios.post(url, { clientcode: clientCode, password, totp }, { headers: loginHeaders(apiKey), timeout: 20000 });

  if (!data?.status) {
    throw new Error(data?.message || 'Angel login failed');
  }

  const jwtRaw = String(data.data.jwtToken || '').replace(/^Bearer\s+/i, '');

  return {
    jwtRaw,
    feedToken: data.data.feedToken,
    refreshToken: data.data.refreshToken,
    apiKey,
    clientCode,
  };
}

/**
 * Cached login for downstream REST + Smart Stream consumers.
 */
async function getAngelSession(forceRefresh = false) {
  if (!forceRefresh && sessionCache && Date.now() < sessionCache.expiresAt) {
    return sessionCache.payload;
  }
  const payload = await angelLoginFresh();
  sessionCache = {
    payload,
    expiresAt: Date.now() + 11 * 60 * 60 * 1000,
  };
  return payload;
}

function invalidateAngelSessionCache() {
  sessionCache = null;
}

module.exports = {
  getAngelSession,
  invalidateAngelSessionCache,
  trimmedEnv,
  angelAuthHeaders(apiKey, jwtRaw) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': '127.0.0.1',
      'X-ClientPublicIP': '127.0.0.1',
      'X-MACAddress': '00:00:00:00:00:00',
      'X-PrivateKey': apiKey,
      Authorization: `Bearer ${jwtRaw}`,
    };
  },
};
