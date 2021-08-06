import './assets/css/landscape.css'
import './assets/css/design02.css'
import * as l from './widgets/Layout'
import { MemberBoard } from './widgets/MemberBoard'
import { Footer } from './widgets/Footer'
import { Attribution } from './widgets/Attribution'
// import { SceneViz } from './widgets/SceneViz'

import ReactDOM from 'react-dom'

ReactDOM.render(
  <l.Board>
    <MemberBoard />
  </l.Board>,
  document.getElementById('root')
)

// ReactDOM.render(
//   <SceneViz />,
//   document.getElementById('sceneViz')
// )

ReactDOM.render(
  <Attribution />,
  document.getElementById('attribution')
)

ReactDOM.render(
  <Footer />,
  document.getElementById('footer')
)

// https://webpack.js.org/api/hot-module-replacement/
if (module.hot) {
  module.hot.accept(
    // errorHandler // Function to handle errors when evaluating the new version
  )

  module.hot.dispose(() => {
    console.clear() // Clear the console on every hot reload
    // Clean up and pass data to the updated module...
  })
}
