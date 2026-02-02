const { getRedisClient } = require('./redis-client');

const PAID_GIFTS_KEY = 'gifts:paid';

function sanitizePaidList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((item) => typeof item === 'string');
}

async function getPaidGifts() {
  const redis = await getRedisClient();
  const raw = await redis.get(PAID_GIFTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return sanitizePaidList(parsed);
  } catch (error) {
    return [];
  }
}

async function markGiftAsPaid(giftId) {
  const current = await getPaidGifts();
  if (current.includes(giftId)) {
    return current;
  }

  const updated = [...current, giftId];
  const redis = await getRedisClient();
  await redis.set(PAID_GIFTS_KEY, JSON.stringify(updated));
  return updated;
}

module.exports = {
  getPaidGifts,
  markGiftAsPaid,
};
