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

type TSecure = {
  asset: string
}
const Secure = (props: TSecure) => {
  const [token, setToken] = useState('')
  const assetEl = useRef(null)
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
    // const img = assetEl.current as unknown as HTMLImageElement
    // console.log('>> imgLoaded:', img.naturalHeight)
    // console.log('>> fire handleLoad!')
    setAuthorized(true) // handleLoad() only fires if user is authorized to see the asset
  }

  // TODO: Drive this from config! 5/7/21
  const endpoint = 'https://us-central1-r002-cloud.cloudfunctions.net/getAsset_v0'
  // const endpoint = 'http://localhost:5001/r002-cloud/us-central1/getAsset_v0'

  const match = props.asset.match(/^secure\//)
  if (match) {
    const asset = props.asset.replace(/^secure\//, '')
    return (
      <>
        The asset will load if you're authorized to see it:<br /><br />
        {!authorized &&
          <>Sorry, you're not authorized to view this protected asset.</>
        }
        {/* <img ref={assetEl} src={`${endpoint}?token=${token}&asset=${asset}`}
          style={authorized ? {} : { display: 'none' }}
          onLoad={handleLoad} /> */}

        <object ref={assetEl} data={`${endpoint}?token=${token}&asset=${asset}`}
          onLoad={handleLoad} width='1200' height='1600px' />
      </>
    )
  } else {
    const asset = props.asset
    return (
      <>
        Open asset:<br /><br />
        <iframe ref={assetEl} src={`https://r002.github.io/learning/${asset}`}
          style={authorized ? {} : { display: 'none' }}
          onLoad={handleLoad} frameBorder='0' width='1200' height='1600px' />
      </>
    )
  }
}

export default Secure
