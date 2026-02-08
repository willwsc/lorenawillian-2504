const { MercadoPagoConfig, Payment } = require('mercadopago');
const { Resend } = require('resend');
const { isValidGiftName } = require('./_lib/gift-catalog');
const { markGiftAsPaid } = require('./_lib/gifts-store');
const { markGiftIntentPaid } = require('./_lib/gift-intents-store');
const { hasRedisConfig } = require('./_lib/redis-client');

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

  if (!hasRedisConfig()) {
    res.status(500).json({ ok: false, error: 'Redis not configured.' });
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

    const reference = String(payment.external_reference || '').trim();
    const [giftName, intentId] = reference.split('|');
    if (!giftName || !isValidGiftName(giftName)) {
      res.status(200).json({ ok: true, ignored: true, reason: 'invalid_gift_reference' });
      return;
    }

    await markGiftAsPaid(giftName);
    const intentResult = await markGiftIntentPaid(intentId, paymentId);

    if (process.env.RESEND_API_KEY && intentResult?.intent && !intentResult.alreadyPaid) {
      const intent = intentResult.intent;
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: 'Lorena & Willian <onboarding@resend.dev>',
          to: 'willian.silvacosta@hotmail.com',
          subject: `Pagamento confirmado - ${intent.giverName || 'Presente'}`,
          replyTo: intent.giverEmail || undefined,
          text: [
            'Pagamento confirmado no Mercado Pago',
            `Presente: ${intent.giftLabel || giftName}`,
            `Gift ID: ${giftName}`,
            `Intent ID: ${intent.id}`,
            `Pagamento ID: ${String(paymentId)}`,
            `Status: ${payment?.status || 'approved'}`,
            `Nome: ${intent.giverName || '-'}`,
            `Email: ${intent.giverEmail || '-'}`,
            `Bilhetinho: ${intent.giftMessage || '-'}`,
          ].join('\n'),
        });
      } catch (error) {
        console.error('Falha ao enviar email de pagamento confirmado:', error.message || error);
      }
    }

    res.status(200).json({ ok: true, giftName, paymentId: String(paymentId), intentId: intentId || null });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Falha ao processar webhook do Mercado Pago.' });
  }
};








