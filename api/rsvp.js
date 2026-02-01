const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ ok: false, error: 'RESEND_API_KEY not configured.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      body = null;
    }
  }

  const { nome, email, telefone, presenca, acompanhantes, mensagem } = body || {};
  if (!nome || !email || !presenca) {
    res.status(400).json({ ok: false, error: 'Missing required fields.' });
    return;
  }

  const acompanhantesValue =
    acompanhantes === undefined || acompanhantes === null || String(acompanhantes).trim() === ''
      ? '0'
      : String(acompanhantes);

  const text = [
    'Nova confirmacao de presenca',
    `Nome: ${nome}`,
    `Email: ${email}`,
    `Telefone: ${telefone || '-'}`,
    `Presenca: ${presenca}`,
    `Acompanhantes: ${acompanhantesValue}`,
    `Mensagem: ${mensagem || '-'}`,
  ].join('\n');

  try {
    await resend.emails.send({
      from: 'Lorena & Willian <onboarding@resend.dev>',
      to: 'willian.silvacosta@hotmail.com',
      subject: `Confirmação de presença - ${nome}`,
      replyTo: email,
      text,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Falha ao enviar.' });
  }
};
