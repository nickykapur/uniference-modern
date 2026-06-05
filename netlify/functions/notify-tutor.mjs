/**
 * Netlify Function: notify-tutor
 * Called when a new tutor application is submitted.
 * Sends a Telegram message with Approve/Reject inline buttons.
 */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { statusCode: 500, body: 'Bot not configured' }
  }

  let body
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { docId, nombre, universidad, carrera, materia, whatsapp, disponibilidad, tarifa, precio, porQueGoodTutor } = body
  if (!docId) return { statusCode: 400, body: 'Missing docId' }

  const tarifaLabel = tarifa === 'gratis' ? '🎁 Gratis' : `💰 ${precio || 'De pago'}`
  const disponLabel = Array.isArray(disponibilidad) ? disponibilidad.join(', ') : disponibilidad

  const text =
    `🎓 <b>Nueva solicitud de tutor</b>\n\n` +
    `👤 <b>Nombre:</b> ${esc(nombre)}\n` +
    `🏫 <b>Universidad:</b> ${esc(universidad?.toUpperCase())}\n` +
    `📖 <b>Carrera:</b> ${esc(carrera)}\n` +
    `📚 <b>Materia:</b> ${esc(materia)}\n` +
    `📱 <b>WhatsApp:</b> ${esc(whatsapp)}\n` +
    `⏰ <b>Disponibilidad:</b> ${esc(disponLabel)}\n` +
    `💵 <b>Tarifa:</b> ${esc(tarifaLabel)}\n\n` +
    `💬 <i>"${esc(porQueGoodTutor)}"</i>`

  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Aprobar tutor', callback_data: `APPROVE:tutors:${docId}` },
      { text: '❌ Rechazar', callback_data: `DENY:tutors:${docId}` },
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
    console.error('Telegram error:', await res.text())
    return { statusCode: 502, body: 'Telegram API error' }
  }

  return { statusCode: 200, body: 'OK' }
}
