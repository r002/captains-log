import { createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import CONFIG from '../config'

// These settings are meant to be public!
// It's how Firebase works! 3/18/21
if (firebase.apps.length === 0) {
  const firebaseConfig = {
    apiKey: CONFIG.apiKey,
    authDomain: CONFIG.authDomain,
    projectId: CONFIG.projectId,
    storageBucket: CONFIG.storageBucket,
    messagingSenderId: CONFIG.messagingSenderId,
    appId: CONFIG.appId,
    measurementId: CONFIG.measurementId
  }

  firebase.initializeApp(firebaseConfig) // Must happen first!

  if (location.hostname === 'localhost') {
    // firebase.firestore().useEmulator('localhost', 8080)
    firebase.functions().useEmulator('localhost', 5001)
    // firebase.auth().useEmulator('http://localhost:9099')
  }
}

export const UserContext = createContext({
  user: null as firebase.User | null
})
