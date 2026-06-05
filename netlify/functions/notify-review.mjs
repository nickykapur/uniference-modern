/**
 * Netlify Function: notify-review
 * Called by the frontend after a review is saved to Firestore.
 * Sends a Telegram message to the admin with Approve/Reject inline buttons.
 *
 * Env vars needed in Netlify dashboard:
 *   TELEGRAM_BOT_TOKEN  — from @BotFather
 *   TELEGRAM_CHAT_ID    — your personal Telegram chat ID
 */

const STAR_LABELS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

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

  const stars = STAR_LABELS[Math.min(Math.max(Math.round(rating), 0), 5)] ?? '?'
  const author = userEmail ? `@${userEmail.split('@')[0]}` : 'anónimo'

  const text =
    `📋 *Nueva reseña pendiente*\n\n` +
    `🏫 *Universidad:* ${universidad?.toUpperCase()}\n` +
    `👤 *Profesor:* ${profesor}\n` +
    `📚 *Materia:* ${materia}\n` +
    `${stars} *Calificación:* ${rating}/5\n\n` +
    `💬 _"${comentario}"_\n\n` +
    `👤 Enviado por: ${author}`

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
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('Telegram error:', err)
    return { statusCode: 502, body: 'Telegram API error' }
  }

  return { statusCode: 200, body: 'OK' }
}
