const { randomUUID } = require('crypto');
const { getRedisClient } = require('./redis-client');

const INTENT_PREFIX = 'gifts:intent:';
const INTENT_LIST_KEY = 'gifts:intents';

function buildIntent(payload) {
  return {
    id: randomUUID(),
    status: 'created',
    createdAt: new Date().toISOString(),
    ...payload,
  };
}

async function createGiftIntent(payload) {
  const intent = buildIntent(payload);
  const redis = await getRedisClient();
  await redis.set(`${INTENT_PREFIX}${intent.id}`, JSON.stringify(intent));
  await redis.lPush(INTENT_LIST_KEY, intent.id);
  return intent;
}

async function getGiftIntent(intentId) {
  if (!intentId) return null;
  const redis = await getRedisClient();
  const raw = await redis.get(`${INTENT_PREFIX}${intentId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

async function markGiftIntentPaid(intentId, paymentId) {
  if (!intentId) return null;
  const redis = await getRedisClient();
  const key = `${INTENT_PREFIX}${intentId}`;
  const raw = await redis.get(key);
  if (!raw) return null;

  let intent;
  try {
    intent = JSON.parse(raw);
  } catch (error) {
    return null;
  }

  const alreadyPaid = intent.status === 'paid';
  if (!alreadyPaid) {
    intent.status = 'paid';
    intent.paidAt = new Date().toISOString();
  }
  if (paymentId && !intent.paymentId) {
    intent.paymentId = String(paymentId);
  }

  await redis.set(key, JSON.stringify(intent));
  return { intent, alreadyPaid };
}

module.exports = {
  createGiftIntent,
  getGiftIntent,
  markGiftIntentPaid,
};
