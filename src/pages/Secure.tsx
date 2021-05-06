import firebase from 'firebase/app'
// import 'firebase/storage'
// import 'firebase/functions'
import { useState, useEffect, useRef } from 'react'

// const storage = firebase.storage()

// function getSecureAsset () {
//   const getSecureAssetFxn = firebase.functions().httpsCallable('getSecureAsset_v0')
//   getSecureAssetFxn().then(rs => {
//     console.log('>> getSecureAsset:', rs)
//   })
// }

const Secure = () => {
  const [token, setToken] = useState('')
  const imgEl = useRef(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    firebase.auth().currentUser!.getIdToken(true).then((idToken) => {
      // console.log('>> idToken:', idToken)
      setToken(idToken)
    }).catch((error) => {
      console.log('>> error:', error)
    })
  }, [])

  function handleLoad () {
    // const img = imgEl.current as unknown as HTMLImageElement
    // console.log('>> imgLoaded:', img.naturalHeight)
    setAuthorized(true) // handleLoad() only fires if user is authorized to see the asset
  }

  return (
    <>
      An image will load if you're authorized to see it:<br /><br />
      {!authorized &&
        <>Sorry, you're not authorized to view this protected asset.</>
      }
      <img ref={imgEl} src={'https://us-central1-r002-cloud.cloudfunctions.net/showPic_v0?token=' + token}
        style={authorized ? {} : { display: 'none' }}
        onLoad={handleLoad} />
    </>
  )
}

export default Secure
