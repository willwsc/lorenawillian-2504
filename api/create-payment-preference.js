const { MercadoPagoConfig, Preference } = require('mercadopago');
const { isValidGiftName, getGiftById } = require('./_lib/gift-catalog');
const { Resend } = require('resend');
const fs = require('fs/promises');
const path = require('path');
const { createGiftIntent } = require('./_lib/gift-intents-store');
const { hasRedisConfig } = require('./_lib/redis-client');

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

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

async function appendGiftIntentCsv(intent) {
  const dir = path.join(process.cwd(), 'api', '_data');
  const filePath = path.join(dir, 'gift-intents.csv');
  await fs.mkdir(dir, { recursive: true });

  let needsHeader = false;
  try {
    await fs.access(filePath);
  } catch (error) {
    needsHeader = true;
  }

  const header =
    'created_at,intent_id,gift_id,gift_label,giver_name,giver_email,gift_message,status\n';
  const line = [
    intent.createdAt,
    intent.id,
    intent.giftId,
    intent.giftLabel,
    intent.giverName,
    intent.giverEmail,
    intent.giftMessage,
    intent.status,
  ]
    .map(csvEscape)
    .join(',') + '\n';

  const payload = (needsHeader ? header : '') + line;
  await fs.appendFile(filePath, payload, 'utf8');
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

  if (!hasRedisConfig()) {
    res.status(500).json({ ok: false, error: 'Redis not configured.' });
    return;
  }

  const body = parseRequestBody(req);
  const giftId = body.giftName ? String(body.giftName).trim() : '';
  const giverName = body.giverName ? String(body.giverName).trim() : '';
  const giverEmail = body.giverEmail ? String(body.giverEmail).trim() : '';
  const giftMessage = body.giftMessage ? String(body.giftMessage).trim() : '';

  if (!giftId || !isValidGiftName(giftId)) {
    res.status(400).json({ ok: false, error: 'Invalid gift name.' });
    return;
  }

  if (!giverName || !giverEmail || !giftMessage) {
    res.status(400).json({
      ok: false,
      error: 'Nome, e-mail e bilhetinho sao obrigatorios.',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(giverEmail)) {
    res.status(400).json({ ok: false, error: 'E-mail invalido.' });
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
    const intent = await createGiftIntent({
      giftId,
      giftLabel: gift.label,
      giverName,
      giverEmail,
      giftMessage,
    });
    try {
      await appendGiftIntentCsv(intent);
    } catch (error) {
      console.error('Falha ao salvar backup CSV do presente:', error.message || error);
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const externalReference = `${giftId}|${intent.id}`;

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
        external_reference: externalReference,
        statement_descriptor: 'CASAMENTO LW',
      },
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const receiver =
        process.env.GIFTS_RECEIVER_EMAIL ||
        process.env.RSVP_RECEIVER_EMAIL ||
        'willian.silvacosta@hotmail.com';

      resend.emails
        .send({
          from: 'Lorena & Willian <onboarding@resend.dev>',
          to: receiver,
          subject: `Presente identificado - ${giverName}`,
          replyTo: giverEmail,
          text: [
            'Novo presente identificado',
            `Presente: ${gift.label}`,
            `Gift ID: ${giftId}`,
            `Intent ID: ${intent.id}`,
            `Nome: ${giverName}`,
            `Email: ${giverEmail}`,
            `Bilhetinho: ${giftMessage}`,
          ].join('\n'),
        })
        .catch(() => {});
    }

    res.status(200).json({
      ok: true,
      intentId: intent.id,
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

