import firebase from 'firebase/app'
import 'firebase/storage'
import { useState, useEffect } from 'react'

const storage = firebase.storage()

const Secure = () => {
  const [imgUrl, setImgUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const ref = storage.ref(firebase.auth().currentUser!.uid + '/topgun2.jpg')
    ref.getDownloadURL().then(uri => {
      console.log('>> public uri:', uri)
      setImgUrl(uri)
    }).catch((error) => {
      console.error(error)
      setError('Sorry! You\'re not authorized to see this image!')
    })
  }, [])

  return (
    <>
      An image will load if you're authorized to see it:<br /><br />
      <img src={imgUrl} />
      {error}
    </>
  )
}

export default Secure
