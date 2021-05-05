import firebase from 'firebase/app'
// import 'firebase/storage'
// import 'firebase/functions'
import { useState, useEffect } from 'react'

// const storage = firebase.storage()

// function getSecureAsset () {
//   const getSecureAssetFxn = firebase.functions().httpsCallable('getSecureAsset_v0')
//   getSecureAssetFxn().then(rs => {
//     console.log('>> getSecureAsset:', rs)
//   })
// }

const Secure = () => {
  const [token, setToken] = useState('')
  // const [error, setError] = useState('')

  useEffect(() => {
    firebase.auth().currentUser!.getIdToken(true).then((idToken) => {
      console.log('>> idToken:', idToken)
      setToken(idToken)
    }).catch((error) => {
      console.log('>> error:', error)
    })
  }, [])

  return (
    <>
      An image will load if you're authorized to see it:<br /><br />
      <img src={'http://localhost:5001/r002-cloud/us-central1/showPic_v0?token=' + token} />
      {/* {error} */}
    </>
  )
}

export default Secure
