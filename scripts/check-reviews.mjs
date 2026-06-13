import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync('./uniference-2db8a-firebase-adminsdk-c8fpk-12457b3e9c.json', 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const snap = await db.collection('reviews').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

const approved = all.filter(r => r.aceptado === true)
const pending  = all.filter(r => r.aceptado === false && !r.rechazado)
const rejected = all.filter(r => r.rechazado === true)
const other    = all.filter(r => r.aceptado !== true && r.aceptado !== false)

console.log(`Total reviews:  ${all.length}`)
console.log(`Approved:       ${approved.length}`)
console.log(`Pending:        ${pending.length}`)
console.log(`Rejected:       ${rejected.length}`)
console.log(`Other/unknown:  ${other.length}`)

if (other.length > 0) {
  console.log('\nOther docs:')
  other.forEach(r => console.log(' ', r.id, JSON.stringify(r)))
}
