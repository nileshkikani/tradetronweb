const WebSocket = require('ws');
const {
  parseLtpPacket,
  STREAM_URL,
  groupSubscriptionsByExchange,
  randCorrelationId,
} = require('./angelSmartStreamLtp');

const underlyingToMeta = new Map();

/** token string → { underlying, futSymbolKey, exchangeType } */
const tokenMeta = new Map();

/** token string → { ltp, updatedAt } */
const ltpByToken = new Map();

const subscribedTokens = new Set();

let ws = null;
let pingTimer = null;
let connectPromise = null;
let intentionalClose = false;
let lastGetSession = null;
let reconnectTimer = null;
let reconnectGen = 0;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function clearPing() {
  if (pingTimer) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
}

function shutdownSocket() {
  intentionalClose = true;
  clearPing();
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  try {
    if (ws) ws.close();
  } catch (_) {
    /* ignore */
  }
  ws = null;
  subscribedTokens.clear();
}

/** Call when Angel JWT cache is invalidated — force new connection. */
function invalidateConnection() {
  shutdownSocket();
}

function onBinaryMessage(buffer) {
  const parsed = parseLtpPacket(buffer);
  if (!parsed || parsed.subscriptionMode !== 1) return;
  const tk = String(parsed.token || '').trim();
  if (!tk || !tokenMeta.has(tk)) return;
  ltpByToken.set(tk, { ltp: parsed.ltp, updatedAt: Date.now() });
}

function subscribeTokenList(entries) {
  if (!ws || ws.readyState !== WebSocket.OPEN || !entries.length) return false;
  const tokenList = groupSubscriptionsByExchange(entries).filter((g) => Array.isArray(g.tokens) && g.tokens.length > 0);
  if (!tokenList.length) return false;
  ws.send(
    JSON.stringify({
      correlationID: randCorrelationId(),
      action: 1,
      params: { mode: 1, tokenList },
    })
  );
  return true;
}

function subscribeNewEntries(newEntries) {
  if (!newEntries.length) return;
  if (subscribeTokenList(newEntries)) {
    newEntries.forEach((e) => subscribedTokens.add(String(e.token)));
  }
}

async function openConnection(getSessionFn) {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  if (connectPromise) {
    await connectPromise;
    return;
  }

  intentionalClose = false;
  connectPromise = (async () => {
    const sess = await getSessionFn();
    const jwtBearer = `Bearer ${String(sess.jwtRaw || '').replace(/^Bearer\s+/i, '')}`;
    const headers = {
      Authorization: jwtBearer.startsWith('Bearer ') ? jwtBearer : `Bearer ${jwtBearer}`,
      'x-api-key': sess.apiKey,
      'x-client-code': sess.clientCode,
      'x-feed-token': sess.feedToken,
    };

    await new Promise((resolve, reject) => {
      const socket = new WebSocket(STREAM_URL, { headers });

      const fail = (err) => {
        try {
          socket.close();
        } catch (_) {
          /* ignore */
        }
        reject(err || new Error('WebSocket failed'));
      };

      socket.once('open', () => {
        ws = socket;
        pingTimer = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) ws.send('ping');
        }, 10000);

        socket.on('message', (data, isBinary) => {
          if (!isBinary) return;
          onBinaryMessage(data);
        });

        socket.on('error', () => {});

        socket.on('close', () => {
          ws = null;
          clearPing();
          subscribedTokens.clear();
          if (!intentionalClose) {
            scheduleReconnect(getSessionFn);
          }
        });

        resolve();
      });

      socket.once('error', (e) => fail(e));
    });

    /** After connect (or reconnect), subscribe all known tokens Angel has not seen on this socket. */
    const pending = [...tokenMeta.keys()]
      .filter((t) => !subscribedTokens.has(t))
      .map((t) => tokenMeta.get(t))
      .map((m) => ({
        underlying: m.underlying,
        token: m.token,
        exchangeType: m.exchangeType,
        futSymbolKey: m.futSymbolKey,
      }));
    subscribeNewEntries(pending);
  })().finally(() => {
    connectPromise = null;
  });

  await connectPromise;
}

function scheduleReconnect(getSessionFn) {
  if (intentionalClose || !underlyingToMeta.size || !tokenMeta.size) return;
  reconnectGen += 1;
  const myGen = reconnectGen;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(async () => {
    if (myGen !== reconnectGen) return;
    try {
      await openConnection(getSessionFn || lastGetSession);
      const resume = [...tokenMeta.values()].filter((m) => !subscribedTokens.has(String(m.token)));
      subscribeNewEntries(
        resume.map((m) => ({
          underlying: m.underlying,
          token: m.token,
          exchangeType: m.exchangeType,
          futSymbolKey: m.futSymbolKey,
        }))
      );
    } catch (_) {
      /* next schedule */
    }
  }, 1600);
}

/**
 * Register instruments and maintain a shared Smart Stream that keeps LTPs updated.
 */
async function syncSubscriptions(subscriptions, getSessionFn) {
  lastGetSession = getSessionFn;

  for (const s of subscriptions) {
    const underlying = String(s.underlying || '').trim();
    const token = String(s.token || '').trim();
    if (!underlying || !token) continue;

    underlyingToMeta.set(underlying, {
      underlying,
      token,
      exchangeType: s.exchangeType,
      futSymbolKey: s.futSymbolKey,
    });

    tokenMeta.set(token, {
      underlying,
      token,
      exchangeType: s.exchangeType,
      futSymbolKey: s.futSymbolKey,
    });
  }

  await openConnection(getSessionFn);

  const newEntries = subscriptions
    .map((s) => ({
      underlying: String(s.underlying).trim(),
      token: String(s.token).trim(),
      exchangeType: s.exchangeType,
      futSymbolKey: s.futSymbolKey,
    }))
    .filter((e) => e.token && !subscribedTokens.has(e.token));

  subscribeNewEntries(newEntries);

  /** If WS came up asynchronously, retry shortly so subscribe is sent after OPEN. */
  if (newEntries.length && (!ws || ws.readyState !== WebSocket.OPEN)) {
    await sleep(200);
    const still = subscriptions
      .filter((s) => s.token && !subscribedTokens.has(String(s.token)))
      .map((s) => ({
        underlying: s.underlying,
        token: String(s.token),
        exchangeType: s.exchangeType,
        futSymbolKey: s.futSymbolKey,
      }));
    subscribeNewEntries(still);
  }
}

async function waitForLtps(tokens, timeoutMs = 14000, pollMs = 40) {
  const need = [...new Set(tokens.map(String).filter(Boolean))];
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (need.every((t) => ltpByToken.has(t))) return true;
    await sleep(pollMs);
  }
  return false;
}

function snapshotQuotes(names) {
  const quotes = {};
  const missing = {};
  const list = [...new Set((names || []).map(String).filter(Boolean))];

  for (const underlying of list) {
    const meta = underlyingToMeta.get(underlying);
    if (!meta) {
      missing[underlying] = { reason: 'not_registered' };
      continue;
    }
    const snap = ltpByToken.get(String(meta.token));
    if (!snap || typeof snap.ltp !== 'number' || !Number.isFinite(snap.ltp)) {
      missing[underlying] = { futSymbolKey: meta.futSymbolKey, reason: 'no_tick' };
      continue;
    }
    quotes[underlying] = {
      futSymbol: meta.futSymbolKey,
      token: meta.token,
      ltp: snap.ltp,
    };
  }
  return { quotes, missing };
}

module.exports = {
  syncSubscriptions,
  waitForLtps,
  snapshotQuotes,
  invalidateConnection,
  shutdownSocket,

  /** Diagnostics / testing */
  getHubDebug() {
    return {
      open: !!(ws && ws.readyState === WebSocket.OPEN),
      instruments: underlyingToMeta.size,
      ticks: ltpByToken.size,
      subscribedTokens: subscribedTokens.size,
    };
  },
};
