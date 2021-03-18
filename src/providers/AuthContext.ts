import { createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// These settings are meant to be public!
// It's how Firebase works! 3/18/21
if (firebase.apps.length === 0) {
  const firebaseConfig = {
    apiKey: 'AIzaSyAzc5oDi_B7OuE2aGImEsyAmLcLwo4nHGU',
    authDomain: 'r002-cloud.firebaseapp.com',
    projectId: 'r002-cloud',
    storageBucket: 'r002-cloud.appspot.com',
    messagingSenderId: '288481997734',
    appId: '1:288481997734:web:29f80ceecd62f33c255567',
    measurementId: 'G-P8PNPLHLSL'
  }

  firebase.initializeApp(firebaseConfig) // Must happen first!

  const db = firebase.firestore()
  const auth = firebase.auth()
  if (location.hostname === 'localhost') {
    db.useEmulator('localhost', 8080)
    auth.useEmulator('http://localhost:9099')
  }

  async function authStateObserver (user: any) : Promise<void> {
    if (user) {
      db.collection('articles').orderBy('created').limit(10).get().then(qs => {
        const articles = qs.docs.map((doc: any) => doc.data())
        console.log('>> results:', articles)
      })
    }
  }

  function bootstrapFirebase () {
    firebase.auth().onAuthStateChanged(authStateObserver)
  }

  // Run all side effects to initialize Firebase.
  bootstrapFirebase()
  console.log('>> Firebase boostrapped! Should only happen once!')
}

export const AuthContext = createContext(firebase)
