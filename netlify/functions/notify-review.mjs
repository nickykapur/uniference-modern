/**
 * Netlify Function: notify-review
 * Called by the frontend after a review is saved to Firestore.
 * Sends a Telegram message to the admin with Approve/Reject inline buttons.
 *
 * Env vars needed in Netlify dashboard:
 *   TELEGRAM_BOT_TOKEN  — from @BotFather
 *   TELEGRAM_CHAT_ID    — your personal Telegram chat ID
 */

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

// Escape HTML special chars so user content never breaks the message
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

// Returns the client IP from Netlify request headers (never stored, only used transiently)
function getClientIP(headers) {
  return (
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0] ||
    headers['client-ip'] ||
    null
  )?.trim() || null
}

// Masks the last octet of IPv4 (e.g. 190.30.45.12 → 190.30.45.0)
// or the last 80 bits of IPv6, so no individual is identifiable
function anonymizeIP(ip) {
  if (!ip) return null
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return parts.slice(0, 3).join(':') + '::/48'
  }
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`
  return null
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    return { statusCode: 500, body: 'Bot not configured' }
  }

  let body
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { docId, universidad, profesor, materia, rating, comentario, userEmail } = body
  if (!docId) return { statusCode: 400, body: 'Missing docId' }

  const stars = STARS[Math.min(Math.max(Math.round(rating), 0), 5)] ?? '?'
  const author = userEmail ? `@${userEmail.split('@')[0]}` : 'anónimo'
  const anonIP = anonymizeIP(getClientIP(event.headers))

  const text =
    `📋 <b>Nueva reseña pendiente</b>\n\n` +
    `🏫 <b>Universidad:</b> ${esc(universidad?.toUpperCase())}\n` +
    `👤 <b>Profesor:</b> ${esc(profesor)}\n` +
    `📚 <b>Materia:</b> ${esc(materia)}\n` +
    `${stars} <b>Calificación:</b> ${esc(rating)}/5\n\n` +
    `💬 <i>"${esc(comentario)}"</i>\n\n` +
    `👤 Enviado por: ${esc(author)}` +
    (anonIP ? `\n🌍 IP (anonimizada): <code>${esc(anonIP)}</code>` : '')

  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Aprobar', callback_data: `APPROVE_${docId}` },
      { text: '❌ Rechazar', callback_data: `DENY_${docId}` },
    ]]
  }

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('Telegram error:', err)
    return { statusCode: 502, body: `Telegram error: ${err}` }
  }

  return { statusCode: 200, body: 'OK' }
}
