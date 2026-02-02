const { MercadoPagoConfig, Payment } = require('mercadopago');
const { isValidGiftName } = require('./_lib/gift-catalog');
const { markGiftAsPaid } = require('./_lib/gifts-store');

function extractPaymentId(req) {
  return (
    req.query?.['data.id'] ||
    req.query?.id ||
    req.body?.data?.id ||
    req.body?.id ||
    null
  );
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

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    res.status(500).json({ ok: false, error: 'Vercel KV not configured.' });
    return;
  }

  const paymentId = extractPaymentId(req);
  if (!paymentId) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: String(paymentId) });

    if (payment?.status !== 'approved') {
      res.status(200).json({ ok: true, ignored: true, status: payment?.status || 'unknown' });
      return;
    }

    const giftName = String(payment.external_reference || '').trim();
    if (!giftName || !isValidGiftName(giftName)) {
      res.status(200).json({ ok: true, ignored: true, reason: 'invalid_gift_reference' });
      return;
    }

    await markGiftAsPaid(giftName);

    res.status(200).json({ ok: true, giftName, paymentId: String(paymentId) });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Falha ao processar webhook do Mercado Pago.' });
  }
};
