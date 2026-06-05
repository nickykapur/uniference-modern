import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCXi090Onl0-A4ylyAmICJkau5ibpZq0_A",
  authDomain: "uniference-2db8a.firebaseapp.com",
  databaseURL: "https://uniference-2db8a.firebaseio.com",
  projectId: "uniference-2db8a",
  storageBucket: "uniference-2db8a.appspot.com",
  messagingSenderId: "313995125771",
  appId: "1:313995125771:web:0d3ab7a7181207dfb0130e",
  measurementId: "G-D7SBVNCZ7K"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
