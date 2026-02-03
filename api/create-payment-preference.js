const { MercadoPagoConfig, Preference } = require('mercadopago');
const { isValidGiftName, getGiftById } = require('./_lib/gift-catalog');

function parseRequestBody(req) {
  if (!req.body) return {};

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }

  return req.body;
}

function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getBaseUrl(req, body) {
  const fromEnv = normalizeSiteUrl(process.env.SITE_URL);
  if (fromEnv) return fromEnv;

  const fromBody = normalizeSiteUrl(body.siteUrl || body.origin || '');
  if (fromBody) return fromBody;

  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host;
  if (!host) return '';

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = forwardedProto || (String(host).includes('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    res.status(500).json({ ok: false, error: 'MP_ACCESS_TOKEN not configured.' });
    return;
  }

  const body = parseRequestBody(req);
  const giftId = body.giftName ? String(body.giftName).trim() : '';

  if (!giftId || !isValidGiftName(giftId)) {
    res.status(400).json({ ok: false, error: 'Invalid gift name.' });
    return;
  }

  const gift = getGiftById(giftId);
  const baseUrl = getBaseUrl(req, body);

  if (!baseUrl) {
    res.status(500).json({ ok: false, error: 'Could not determine site URL.' });
    return;
  }

  const encodedGift = encodeURIComponent(giftId);
  const successUrl = `${baseUrl}/?payment_status=approved&gift=${encodedGift}`;
  const pendingUrl = `${baseUrl}/?payment_status=pending&gift=${encodedGift}`;
  const failureUrl = `${baseUrl}/?payment_status=failure&gift=${encodedGift}`;
  const notificationUrl = `${baseUrl}/api/mercadopago-webhook`;

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: giftId,
            title: gift.label,
            description: `Presente de casamento: ${gift.label}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: gift.amount,
          },
        ],
        payment_methods: {
          installments: 12,
        },
        back_urls: {
          success: successUrl,
          pending: pendingUrl,
          failure: failureUrl,
        },
        notification_url: notificationUrl,
        auto_return: 'approved',
        external_reference: giftId,
        statement_descriptor: 'CASAMENTO LW',
      },
    });

    res.status(200).json({
      ok: true,
      preferenceId: response.id,
      checkoutUrl: response.init_point,
      sandboxCheckoutUrl: response.sandbox_init_point,
    });
  } catch (error) {
    const apiMessage = error?.cause?.[0]?.description || error?.message;
    res.status(500).json({
      ok: false,
      error: apiMessage || 'Falha ao criar pagamento no Mercado Pago.',
    });
  }
};

