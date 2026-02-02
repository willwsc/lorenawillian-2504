const { hasRedisConfig } = require('./_lib/redis-client');
const { getPaidGifts } = require('./_lib/gifts-store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  if (!hasRedisConfig()) {
    res.status(500).json({ ok: false, error: 'Redis not configured.' });
    return;
  }

  try {
    const paidGifts = await getPaidGifts();
    res.status(200).json({ ok: true, paidGifts });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Falha ao obter status dos presentes.' });
  }
};

