const { createClient } = require('redis');

let clientPromise;

function hasRedisConfig() {
  return Boolean(
    process.env.REDIS_URL ||
      (process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_PASSWORD)
  );
}

function buildRedisUrl() {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  const username = encodeURIComponent(process.env.REDIS_USERNAME || 'default');
  const password = encodeURIComponent(process.env.REDIS_PASSWORD || '');
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;

  if (!host || !port || !password) {
    return '';
  }

  return `redis://${username}:${password}@${host}:${port}`;
}

async function getRedisClient() {
  if (!clientPromise) {
    const url = buildRedisUrl();
    if (!url) {
      throw new Error('Redis not configured.');
    }

    const client = createClient({
      url,
      socket: {
        tls: process.env.REDIS_TLS === 'true',
      },
    });

    client.on('error', (error) => {
      console.error('Redis error:', error.message);
    });

    clientPromise = client.connect().then(() => client);
  }

  return clientPromise;
}

module.exports = {
  getRedisClient,
  hasRedisConfig,
};
