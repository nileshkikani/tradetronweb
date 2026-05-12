import axios from 'axios';
import { getAngelSession, invalidateAngelSessionCache } from 'src/server/angelSession';
import { lookupFutureFromMaster, buildFutureSymbolKey } from 'src/server/angelScripMaster';
import { lookupFutureViaSearch } from 'src/server/angelSearchScrip';
import { syncSubscriptions, waitForLtps, snapshotQuotes, invalidateConnection } from 'src/server/angelStreamHub';

function scalpingBaseUrl() {
  const raw = process.env.EMA_SCALPING_URL || '';
  return raw.replace(/\s+/g, '').replace(/\/+$/, '');
}

function forwardedAuthHeader(req) {
  const raw = req.headers?.authorization ?? req.headers?.Authorization;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]) return String(raw[0]).trim();
  return '';
}

async function fetchExpiryDate(forwardAuthorization) {
  const base = scalpingBaseUrl();
  if (!base) throw new Error('EMA_SCALPING_URL is not set');
  const url = `${base}/premium/expiry-date/`;
  const axiosConfig = { timeout: 20000 };
  if (forwardAuthorization) {
    axiosConfig.headers = { Authorization: forwardAuthorization };
  }
  const { data } = await axios.get(url, axiosConfig);
  const expiry = data?.expiry_date;
  if (!expiry) throw new Error('expiry_date missing from premium API');
  return String(expiry).trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const names = req.body?.names;
  const list = Array.isArray(names) ? names.filter(Boolean).map(String) : [];
  if (!list.length) {
    return res.status(400).json({ ok: false, error: 'Body must include names: string[]' });
  }

  const clientAuth = forwardedAuthHeader(req);

  try {
    const expiry_date = await fetchExpiryDate(clientAuth);

    const runQuotes = async (refreshSession) => {
      const { jwtRaw } = await getAngelSession(refreshSession);

      /** Fresh session each call so reconnect picks up rotated feed/jwt tokens. */
      const getStreamerSession = async () => {
        const s = await getAngelSession(false);
        return {
          jwtRaw: s.jwtRaw,
          feedToken: s.feedToken,
          apiKey: s.apiKey,
          clientCode: s.clientCode,
        };
      };

      const subscriptions = [];
      const missing = {};

      /* eslint-disable no-await-in-loop */
      for (const name of [...new Set(list)]) {
        const underlying = String(name || '').trim();
        if (!underlying) continue;

        const futKey = buildFutureSymbolKey(underlying, expiry_date);
        let row = await lookupFutureFromMaster(underlying, expiry_date);
        if (!row) {
          row = await lookupFutureViaSearch(jwtRaw, apiKey, futKey);
        }
        if (!row?.token) {
          missing[underlying] = { futSymbolKey: futKey, reason: 'instrument_not_found' };
          continue;
        }
        subscriptions.push({
          underlying,
          futSymbolKey: row.futSymbolKey || futKey,
          token: row.token,
          exchangeType: row.exchangeType,
        });
      }
      /* eslint-enable no-await-in-loop */

      if (!subscriptions.length) {
        return {
          expiry_date,
          quotes: {},
          missing,
        };
      }

      await syncSubscriptions(subscriptions, getStreamerSession);
      await waitForLtps(
        subscriptions.map((s) => s.token),
        16000,
        50
      );

      const snap = snapshotQuotes(subscriptions.map((s) => s.underlying));

      subscriptions.forEach((sub) => {
        if (!(sub.underlying in snap.quotes)) {
          missing[sub.underlying] = missing[sub.underlying] || {
            futSymbolKey: sub.futSymbolKey,
            reason: 'no_tick',
          };
        }
      });

      return { expiry_date, quotes: snap.quotes, missing };
    };

    try {
      const payload = await runQuotes(false);
      return res.status(200).json({ ok: true, ...payload });
    } catch (e1) {
      invalidateAngelSessionCache();
      invalidateConnection();
      try {
        const payload = await runQuotes(true);
        return res.status(200).json({ ok: true, ...payload });
      } catch (e2) {
        throw e2;
      }
    }
  } catch (err) {
    const msg = err?.message || 'futures-ltp failed';
    if (axios.isAxiosError(err)) {
      const st = err.response?.status;
      const body = err.response?.data;
      const detail =
        (typeof body === 'object' && body && (body.detail || body.message || body.error)) || null;
      if (st === 401) {
        const upstream = String(err.config?.url || '');
        const expiryCall = upstream.includes('/premium/expiry-date');
        return res.status(401).json({
          ok: false,
          error:
            detail ||
            (!expiryCall
              ? msg
              : clientAuth
              ? 'Expiry API rejected your session (401). Try signing in again.'
              : 'Send Authorization: Bearer token with the request so the server can load expiry from the scalping API.'),
        });
      }
      if (detail) {
        const status = /credentials missing/i.test(String(detail)) ? 503 : st && st >= 400 && st < 600 ? st : 500;
        return res.status(status).json({ ok: false, error: String(detail) });
      }
    }
    const status = /credentials missing/i.test(msg) ? 503 : 500;
    return res.status(status).json({ ok: false, error: msg });
  }
}
