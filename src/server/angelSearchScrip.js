const axios = require('axios');
const { angelAuthHeaders } = require('./angelSession');

const ANGEL_ROOT = 'https://apiconnect.angelone.in';

function exchangeLabelToStreamingType(label) {
  const u = String(label || '').toUpperCase();
  if (u === 'NFO') return 2;
  if (u === 'BFO') return 4;
  if (u === 'MCX') return 5;
  if (u === 'CDS') return 13;
  return 2;
}

async function searchScripRequest(jwtRaw, apiKey, exchange, searchscrip) {
  const url = `${ANGEL_ROOT}/rest/secure/angelbroking/order/v1/searchScrip`;
  const { data } = await axios.post(
    url,
    { exchange, searchscrip },
    {
      headers: angelAuthHeaders(apiKey, jwtRaw),
      timeout: 20000,
    }
  );
  return data;
}

/**
 * When OpenAPIScripMaster.json is unavailable, resolve `{ token, exchangeType }` via SearchScrip.
 */
async function lookupFutureViaSearch(jwtRaw, apiKey, futSymbolUpper) {
  const exchanges = ['NFO', 'BFO'];
  for (const ex of exchanges) {
    try {
      const res = await searchScripRequest(jwtRaw, apiKey, ex, futSymbolUpper);
      const rows = res?.data;
      if (!Array.isArray(rows) || !rows.length) continue;
      const hit = rows.find((x) => String(x.tradingsymbol || '').toUpperCase() === futSymbolUpper);
      if (hit?.symboltoken) {
        const exFromRow = hit.exchange || ex;
        return {
          futSymbolKey: futSymbolUpper,
          symbol: String(hit.tradingsymbol || futSymbolUpper).toUpperCase(),
          token: String(hit.symboltoken),
          exchangeType: exchangeLabelToStreamingType(exFromRow),
          exch_seg: exFromRow,
        };
      }
    } catch {
      /* try next exchange */
    }
  }
  return null;
}

module.exports = {
  lookupFutureViaSearch,
};
