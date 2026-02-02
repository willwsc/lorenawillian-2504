const { getPaidGifts } = require('./_lib/gifts-store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    res.status(500).json({ ok: false, error: 'Vercel KV not configured.' });
    return;
  }

  try {
    const paidGifts = await getPaidGifts();
    res.status(200).json({ ok: true, paidGifts });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Falha ao obter status dos presentes.' });
  }
};
