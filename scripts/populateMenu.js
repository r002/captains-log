const admin = require('firebase-admin')
const serviceAccount = require('../../service-account.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()

db.collection('menus').doc('gtx_isye6501').get().then(items => {
  console.log('>> items.data:', items.data())
})

// const data = {
//   menu: [
//     {
//       asset: 'GTx__ISYE6501/Timeline1-11Summer__1_.pdf',
//       order: 0,
//       title: '📅 ISyE 6501x - Timeline (Summer 2020)'
//     },
//     {
//       asset: 'GTx__ISYE6501/Syllabus-combined-Summer2020__3_.pdf',
//       order: 1,
//       title: '💡 ISyE 6501x - Syllabus (Summer 2020)'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_1_hw-summer.pdf',
//       order: 2,
//       title: '📄 HW #1: Classification & Validation'
//     },
//     {
//       asset: 'secure/gtx/isye6501/GTx-ISYE6501__hw01-final.pdf',
//       order: 3,
//       title: '🔒 HW #1: Submission (May 21, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_1_solutions-summer.pdf',
//       order: 4,
//       title: '🔒 HW #1: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_2_hw-summer.pdf',
//       order: 5,
//       title: '📄 HW #2: Clustering, Data Prep, Δ Detection'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week02c_final.pdf',
//       order: 6,
//       title: '🔒 HW #2: Submission (May 28, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_2_solutions-summer.pdf',
//       order: 7,
//       title: '🔒 HW #2: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_3_hw-summer.pdf',
//       order: 8,
//       title: '📄 HW #3: Time Series + Basic Regression'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week03_subB.pdf',
//       order: 9,
//       title: '🔒 HW #3: Submission (June 4, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_3_solutions-summer.pdf',
//       order: 10,
//       title: '🔒 HW #3: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_4_hw-summer.pdf',
//       order: 11,
//       title: '📄 HW #4: Adv Data Prep + Adv Regression'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week04_subA.pdf',
//       order: 12,
//       title: '🔒 HW #4: Submission (June 11, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_4_solutions-summer.pdf',
//       order: 13,
//       title: '🔒 HW #4: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_5_hw-summer.pdf',
//       order: 14,
//       title: '📄 HW #5: Var Sel, Exp Design, Prob Models'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week05_subA.pdf',
//       order: 15,
//       title: '🔒 HW #5: Submission (June 18, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_5_solutions-summer.pdf',
//       order: 16,
//       title: '🔒 HW #5: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_6_hw-summer.pdf',
//       order: 17,
//       title: '📄 HW #6: Prob Mods, Data Imp, Optimization'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week06_subC.pdf',
//       order: 18,
//       title: "🔒 HW #6: Robert's Airport PySim (Jun 25, 20)"
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_6_solutions-summer.pdf',
//       order: 19,
//       title: '🔒 HW #6: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_7_hw-summer.pdf',
//       order: 20,
//       title: '📄 HW #7: More Optimization + Adv Models'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week07_subA.pdf',
//       order: 21,
//       title: '🔒 HW #7: Army Diet Problem (July 1, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week_7_solutions-summer.pdf',
//       order: 22,
//       title: '🔒 HW #7: Official Solutions'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_8_hw-summer.pdf',
//       order: 23,
//       title: '📄 HW #8: Power Company Case Study'
//     },
//     {
//       asset: 'secure/gtx/isye6501/week08_subA.pdf',
//       order: 24,
//       title: '🔒 HW #8: Robert PowerCo (July 9, 2020)'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_9_hw-summer.pdf',
//       order: 25,
//       title: '📄 HW #9: Retailer Case Study'
//     },
//     {
//       asset: 'GTx__ISYE6501/week_10_hw-summer.pdf',
//       order: 26,
//       title: '📄 HW #10: Monetization Case Study'
//     },
//     {
//       asset: 'GTx__ISYE6501/ISyE_6501_Project.pdf',
//       order: 27,
//       title: '📄 Final Course Project (July 16, 2020)'
//     },
//     {
//       asset: 'secure/gtx/isye6501/project_subB.pdf',
//       order: 28,
//       title: '🔒 Final Project: Eprimo GmbH’s Chat Bot'
//     },
//     {
//       asset: 'https://credentials.edx.org/records/programs/shared/5e01b7235a294e56bfef1c2f0f3bd3b4/',
//       order: 29,
//       title: "🅰️ My Final Grade-- I got an 'A'! (Aug 9, 2020)"
//     },
//     {
//       asset: 'https://courses.edx.org/certificates/0fc4e6b0ad184913a4a31c27d84b7a19',
//       order: 30,
//       title: '🏆 My Course Certificate (Aug 10, 2020)'
//     }
//   ]
// }

// // Add a new document in collection "cities" with ID 'LA'
// db.collection('menus').doc('gtx_isye6501').set(data).then(() => {
//   console.log('>> Script Finished! | this is populate menu!!!')
// })
