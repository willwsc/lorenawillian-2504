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

  const { nome, email, telefone, presenca, acompanhantes, membrosFamilia, mensagem } = body || {};
  if (!nome || !email || !presenca) {
    res.status(400).json({ ok: false, error: 'Missing required fields.' });
    return;
  }

  const acompanhantesValue =
    acompanhantes === undefined || acompanhantes === null || String(acompanhantes).trim() === ''
      ? '0'
      : String(acompanhantes);
  const membrosFamiliaTrim =
    membrosFamilia === undefined || membrosFamilia === null ? '' : String(membrosFamilia).trim();
  const membrosFamiliaValue = membrosFamiliaTrim || '-';
  const acompanhantesCount = Number.parseInt(acompanhantesValue, 10);
  const hasAcompanhantes =
    Number.isFinite(acompanhantesCount) && acompanhantesCount > 0;

  if (hasAcompanhantes && !membrosFamiliaTrim) {
    res.status(400).json({
      ok: false,
      error: 'Membros da familia sao obrigatorios quando ha acompanhantes.',
    });
    return;
  }

  const text = [
    'Nova confirmacao de presenca',
    `Nome: ${nome}`,
    `Email: ${email}`,
    `Telefone: ${telefone || '-'}`,
    `Presenca: ${presenca}`,
    `Acompanhantes: ${acompanhantesValue}`,
    `Membros da familia: ${membrosFamiliaValue}`,
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
