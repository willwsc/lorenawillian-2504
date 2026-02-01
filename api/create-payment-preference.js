const { MercadoPagoConfig, Preference } = require('mercadopago');

const GIFT_CATALOG = {
  'Unha da noiva': 250,
  'Make da noiva': 280,
  'Vaquinha dos noivos': 1900,
  'Relógio do noivo': 350,
  'Decoração do cantinho': 1300,
  'Jogo de cama premium': 900,
  'Vida real dos noivos': 2500,
  'Kit sobrevivência': 600,
  'Amigos para sempre': 420,
  'Cabelo do noivo': 1700,
  'Potes da geladeira': 250,
  'Skincare de clínica': 450,
  'Taxa da paciência': 3000,
  'Primeira rodada': 500,
  'Roupa de cama premium': 800,
  'Mobiliar a casa': 1100,
  'Kit emergência': 320,
  'Relógio de respeito': 2000,
  'Primeira compra': 650,
  'Camisa do Santos': 550,
};

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
  const giftName = body.giftName ? String(body.giftName).trim() : '';

  if (!giftName || !Object.prototype.hasOwnProperty.call(GIFT_CATALOG, giftName)) {
    res.status(400).json({ ok: false, error: 'Invalid gift name.' });
    return;
  }

  const amount = GIFT_CATALOG[giftName];
  const baseUrl = getBaseUrl(req, body);

  if (!baseUrl) {
    res.status(500).json({ ok: false, error: 'Could not determine site URL.' });
    return;
  }

  const encodedGift = encodeURIComponent(giftName);
  const successUrl = `${baseUrl}/?payment_status=approved&gift=${encodedGift}`;
  const pendingUrl = `${baseUrl}/?payment_status=pending&gift=${encodedGift}`;
  const failureUrl = `${baseUrl}/?payment_status=failure&gift=${encodedGift}`;

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: giftName,
            title: giftName,
            description: `Presente de casamento: ${giftName}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: amount,
          },
        ],
        payment_methods: {
          installments: 12,
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
        },
        back_urls: {
          success: successUrl,
          pending: pendingUrl,
          failure: failureUrl,
        },
        auto_return: 'approved',
        external_reference: giftName,
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
