const crypto = require('crypto');

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * RFC 4648 Base32 alphabet decode (Authenticator-style secrets).
 * @param {string} secret  spaces allowed, padding optional
 */
function base32Decode(secret) {
  const cleaned = String(secret || '')
    .replace(/\s+/g, '')
    .toUpperCase()
    .replace(/=+$/, '');
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const v = BASE32.indexOf(cleaned[i]);
    if (v === -1) continue;
    bits += v.toString(2).padStart(5, '0');
  }
  const out = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    out.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(out);
}

/**
 * RFC 6238 TOTP (SHA1, 30s step, 6 digits). Same defaults as Authenticator apps.
 */
function totpSixDigits(secret, nowMs = Date.now()) {
  const key = base32Decode(secret);
  if (!key.length) throw new Error('Invalid TOTP secret (empty after base32 decode)');
  const step = Math.floor(nowMs / 1000 / 30);
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));

  const hmac = crypto.createHmac('sha1', key).update(counter).digest();
  const o = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[o] & 0x7f) << 24) |
    ((hmac[o + 1] & 0xff) << 16) |
    ((hmac[o + 2] & 0xff) << 8) |
    (hmac[o + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, '0');
}

module.exports = { totpSixDigits };
