const { kv } = require('@vercel/kv');

const PAID_GIFTS_KEY = 'gifts:paid';

async function getPaidGifts() {
  const stored = await kv.get(PAID_GIFTS_KEY);
  if (!Array.isArray(stored)) {
    return [];
  }

  return stored.filter(item => typeof item === 'string');
}

async function markGiftAsPaid(giftName) {
  const current = await getPaidGifts();
  if (current.includes(giftName)) {
    return current;
  }

  const updated = [...current, giftName];
  await kv.set(PAID_GIFTS_KEY, updated);
  return updated;
}

module.exports = {
  getPaidGifts,
  markGiftAsPaid,
};
