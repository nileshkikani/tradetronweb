import { snapshotQuotes } from 'src/server/angelStreamHub';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const names = req.body?.names;
  const list = Array.isArray(names) ? [...new Set(names.filter(Boolean).map(String))] : [];
  if (!list.length) {
    return res.status(400).json({ ok: false, error: 'Body must include names: string[]' });
  }

  const { quotes, missing } = snapshotQuotes(list);

  /** 207-style partial content is noisy for clients — always 200 with missing map. */
  return res.status(200).json({ ok: true, quotes, missing });
}
