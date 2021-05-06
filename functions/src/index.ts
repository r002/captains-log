import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const app = admin.initializeApp()
const firestore = app.firestore()
// const storage = app.storage()

/**
 * A secure cloud function that shows the protected asset only to authorized users.
 */
export const showPic_v0 = functions.https.onRequest((request, response) => {
  // console.log('>> token:', request.query.token)
  if (request.query.token && '' !== request.query.token) {
    const userToken = request.query.token.toString()
    admin
        .auth()
        .verifyIdToken(userToken)
        .then((decodedToken) => {
          const uid = decodedToken.uid
          console.log('>> uid verified from token:', uid)
          // console.log('>> decoded token:', decodedToken)

          // Now check if this uid is authorized to access the image
          const user = firestore.collection('authorized').doc(uid)
          user.get().then((doc) => {
            // console.log('>> doc.data():', doc.data())
            if (doc.data()!.role === 'admin') {
              const bucket = admin.storage().bucket('r002-cloud.appspot.com')
              // const stream = bucket.file('protected/Course_Certificate.pdf').createReadStream()
              const stream = bucket.file('protected/topgun2.jpg').createReadStream()
              // pipe stream on 'end' event to the response
              stream
                  .on('end', (data: any) => {})
                  .pipe(response)
            } else {
              response.send('You\'re not authorized to access this asset.')
            }
          })
        })
        .catch((error) => {
          console.log('>> server token verification error:', error)
          response.send('Invalid user token!')
        })
  } else {
    response.send('Invalid user token!')
  }
})

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello! Today is 5/4/21!', {structuredData: true})
  response.send('Hello there!!! Today is 5/4/21!')
})

// export const testCloudFunction_v0 = functions.https.onRequest(async (request, response) => {
//   const userId = request.query.uid
//   if (userId) {
//     response.send(`>> request from uid: ${userId}`)
//     const snapshot = await firestore.collection('passages').limit(1).get()
//     snapshot.forEach((doc) => {
//       console.log(util.inspect(doc.data()))
//     })
//     return
//   }
//   response.send('Invalid! No user id!')
// })

// export const getSecureAsset_v0 = functions.https.onCall((data, context) => {
//   const bucket = admin.storage().bucket('r002-cloud.appspot.com')
//   const stream = bucket.file('protected/topgun2.jpg')
//   // // pipe stream on 'end' event to the response
//   // stream
//   //     .on('end', (data: any) => {})
//   //     .pipe(response)
//   return stream
// })
