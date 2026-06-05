/**
 * Netlify Function: telegram-webhook
 * Telegram calls this when you tap ✅ Aprobar or ❌ Rechazar.
 *
 * APPROVE_<docId> → signs in anonymously (satisfies `request.auth != null`),
 *                   then sets aceptado:true via Firestore REST API.
 * DENY_<docId>    → leaves aceptado:false (review stays hidden).
 *
 * No Firestore rule changes needed — anonymous auth satisfies the existing
 * `allow update: if request.auth != null` rule.
 */

const FIREBASE_PROJECT = 'uniference-2db8a'
const FIREBASE_API_KEY = 'AIzaSyCXi090Onl0-A4ylyAmICJkau5ibpZq0_A'

async function getAnonIdToken() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  )
  if (!res.ok) throw new Error('Anonymous sign-in failed')
  const data = await res.json()
  return data.idToken
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { TELEGRAM_BOT_TOKEN } = process.env
  if (!TELEGRAM_BOT_TOKEN) {
    return { statusCode: 500, body: 'Bot not configured' }
  }

  let update
  try {
    update = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const callbackQuery = update.callback_query
  if (!callbackQuery) {
    // Not a button press — just acknowledge
    return { statusCode: 200, body: 'OK' }
  }

  const { id: callbackId, data, message } = callbackQuery
  const chatId = message?.chat?.id
  const messageId = message?.message_id

  const answerCallback = (text) =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackId, text, show_alert: false }),
    })

  const editMessage = (newText) =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [] }, // remove buttons after action
      }),
    })

  // Support both formats:
  //   new: "APPROVE:reviews:docId" / "APPROVE:tutors:docId"
  //   old: "APPROVE_docId" (reviews, backward compat)
  let action, collection, docId
  if (data?.includes(':')) {
    // New format
    const parts = data.split(':')
    action = parts[0]
    collection = parts[1]
    docId = parts[2]
  } else if (data?.startsWith('APPROVE_') || data?.startsWith('DENY_')) {
    // Old format — treat as reviews
    action = data.startsWith('APPROVE_') ? 'APPROVE' : 'DENY'
    collection = 'reviews'
    docId = data.replace(/^(APPROVE|DENY)_/, '')
  } else {
    await answerCallback('Acción desconocida')
    return { statusCode: 200, body: 'OK' }
  }

  const isReview = collection === 'reviews'
  const label = isReview ? 'Reseña' : 'Tutor'

  if (action === 'APPROVE') {
    // Sign in anonymously to satisfy `request.auth != null` rule
    let idToken
    try {
      idToken = await getAnonIdToken()
    } catch {
      await answerCallback('❌ Error de autenticación con Firebase')
      return { statusCode: 200, body: 'OK' }
    }

    const url =
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}` +
      `/databases/(default)/documents/${collection}/${docId}` +
      `?updateMask.fieldPaths=aceptado`

    const fsRes = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields: { aceptado: { booleanValue: true } } }),
    })

    if (!fsRes.ok) {
      const err = await fsRes.text()
      console.error('Firestore error:', err)
      await answerCallback('❌ Error al aprobar')
      return { statusCode: 200, body: 'OK' }
    }

    await answerCallback(`✅ ${label} aprobado/a y publicado/a`)
    const originalText = message?.text ?? ''
    await editMessage(`✅ *APROBADO/A*\n\n${originalText}`)
  } else {
    await answerCallback(`🗑 ${label} rechazado/a`)
    const originalText = message?.text ?? ''
    await editMessage(`❌ *RECHAZADO/A*\n\n${originalText}`)
  }

  return { statusCode: 200, body: 'OK' }
}
