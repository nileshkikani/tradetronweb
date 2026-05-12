const axios = require('axios');

const MASTER_URL = 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';

let symbolMap = null;
let loadedAt = 0;
const TTL_MS = 6 * 60 * 60 * 1000;

function exchSegToExchangeType(seg) {
  switch (String(seg || '').toUpperCase()) {
    case 'NFO':
      return 2;
    case 'BFO':
      return 4;
    case 'MCX':
      return 5;
    case 'CDF':
      return 13;
    default:
      return 2;
  }
}

async function loadOpenApiScripMaster() {
  if (symbolMap && Date.now() - loadedAt < TTL_MS) return symbolMap;

  const { data } = await axios.get(MASTER_URL, {
    timeout: 180000,
    maxBodyLength: 80 * 1024 * 1024,
    maxContentLength: 80 * 1024 * 1024,
  });

  const list = Array.isArray(data) ? data : [];
  const map = new Map();
  for (const row of list) {
    if (row.symbol) map.set(String(row.symbol).toUpperCase(), row);
  }
  symbolMap = map;
  loadedAt = Date.now();
  return symbolMap;
}

/**
 * Futures contract key from underlying + expiry (e.g. NIFTY + 26MAY26 → NIFTY26MAY26FUT).
 */
function buildFutureSymbolKey(underlyingName, expiryDateRaw) {
  const base = String(underlyingName || '').toUpperCase().replace(/\s+/g, '');
  const expiry = String(expiryDateRaw || '').toUpperCase().replace(/\s+/g, '');
  return `${base}${expiry}FUT`;
}

async function lookupFutureFromMaster(underlyingName, expiryDateRaw) {
  try {
    const key = buildFutureSymbolKey(underlyingName, expiryDateRaw);
    const master = await loadOpenApiScripMaster();
    const row = master.get(key);
    if (!row?.token) return null;
    return {
      futSymbolKey: key,
      symbol: String(row.symbol).toUpperCase(),
      token: String(row.token),
      exchangeType: exchSegToExchangeType(row.exch_seg),
      exch_seg: row.exch_seg,
    };
  } catch {
    return null;
  }
}

module.exports = {
  MASTER_URL,
  loadOpenApiScripMaster,
  buildFutureSymbolKey,
  lookupFutureFromMaster,
  exchSegToExchangeType,
};
