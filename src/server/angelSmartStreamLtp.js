const WebSocket = require('ws');
const { randomBytes } = require('crypto');

const STREAM_URL = 'wss://smartapisocket.angelone.in/smart-stream';

function randCorrelationId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const buf = randomBytes(10);
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[buf[i] % chars.length];
  return out;
}

/** Parse Angel Smart Stream v2 binary LTP payload (subscription mode 1). */
function parseLtpPacket(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 51) return null;

  const subscriptionMode = buf.readUInt8(0);

  let token = '';
  for (let i = 2; i < 27; i += 1) {
    const c = buf[i];
    if (c === 0) break;
    token += String.fromCharCode(c);
  }

  const lastTradedPriceRaw = Number(buf.readBigInt64LE(43));
  const ltp = lastTradedPriceRaw / 100;

  return { subscriptionMode, token, ltp };
}

function groupSubscriptionsByExchange(entries) {
  const byEt = new Map();
  for (const e of entries) {
    if (!byEt.has(e.exchangeType)) byEt.set(e.exchangeType, new Set());
    byEt.get(e.exchangeType).add(String(e.token));
  }
  return [...byEt.entries()].map(([exchangeType, set]) => ({
    exchangeType,
    tokens: [...set],
  }));
}

/**
 * Open Smart Stream once, subscribe LTP mode, collect first tick per token, then close.
 */
function subscribeLtpOnce({ jwtBearer, apiKey, clientCode, feedToken }, subscriptionsByToken, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 14000;

  /** token → { underlying, futSymbolKey } */
  const metaByToken = new Map();
  for (const s of subscriptionsByToken) {
    metaByToken.set(String(s.token), { underlying: s.underlying, futSymbolKey: s.futSymbolKey });
  }

  const tokenList = groupSubscriptionsByExchange(subscriptionsByToken);

  return new Promise((resolve, reject) => {
    const received = {};
    let done = false;
    let pingTimer;
    let ws;
    let t;

    const cleanup = () => {
      if (t) clearTimeout(t);
      if (pingTimer) clearInterval(pingTimer);
      try {
        if (ws) ws.close();
      } catch (_) {
        /* ignore */
      }
    };

    const safeResolve = (val) => {
      if (done) return;
      done = true;
      cleanup();
      resolve(val);
    };

    const safeReject = (err) => {
      if (done) return;
      done = true;
      cleanup();
      reject(err);
    };

    const maybeCompleteEarly = () => {
      const need = subscriptionsByToken.length;
      if (need === 0) safeResolve(received);
      else if (Object.keys(received).length >= need) safeResolve(received);
    };

    const headers = {
      Authorization: jwtBearer.startsWith('Bearer ') ? jwtBearer : `Bearer ${jwtBearer}`,
      'x-api-key': apiKey,
      'x-client-code': clientCode,
      'x-feed-token': feedToken,
    };

    ws = new WebSocket(STREAM_URL, { headers });

    t = setTimeout(() => safeResolve(received), timeoutMs);

    ws.once('open', () => {
      pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping');
      }, 10000);

      const payload = {
        correlationID: randCorrelationId(),
        action: 1,
        params: {
          mode: 1,
          tokenList,
        },
      };
      ws.send(JSON.stringify(payload));
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        /* text control e.g. "pong" */
        return;
      }
      const parsed = parseLtpPacket(data);
      if (!parsed || parsed.subscriptionMode !== 1) return;
      const tk = parsed.token.trim();
      if (!metaByToken.has(tk)) return;
      if (received[tk]) return;
      const meta = metaByToken.get(tk);
      received[tk] = {
        underlying: meta.underlying,
        futSymbolKey: meta.futSymbolKey,
        token: tk,
        ltp: parsed.ltp,
      };
      maybeCompleteEarly();
    });

    ws.on('error', (err) => safeReject(err));

    ws.on('close', () => {
      if (!done) safeResolve(received);
    });
  });
}

module.exports = {
  subscribeLtpOnce,
  parseLtpPacket,
  STREAM_URL,
  groupSubscriptionsByExchange,
  randCorrelationId,
};
