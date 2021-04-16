import ReactDOM from 'react-dom'
// import { StrictMode } from 'react'
import App from './App'
import LogEntry from './widgets/LogEntry'
import StoryBoard from './widgets/StoryBoard'
import Admin from './widgets/Admin'

// Parse the url and route to the requested page
const urlParams = new URLSearchParams(window.location.search)
const page = urlParams.get('p') ?? 'index'
console.log('>>> urlParams p:', page)

let bc = <>Page not found!</>
switch (page) {
  case 'index':
    bc = <LogEntry />
    break
  case 'storyboard':
    bc = <StoryBoard />
    break
  case 'admin':
    bc = <Admin />
    break
}

ReactDOM.render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <App bodyContent={bc} />,
  document.querySelector('#root')
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

  // module.hot.accept('./App.tsx', () => {
  //   console.clear() // Clear the console on every hot reload

  //   ReactDOM.render(
  //     // <StrictMode>
  //     //   <App />
  //     // </StrictMode>,
  //     <App bodyContent={bc} />,
  //     document.querySelector('#root')
  //   )
  // })
}
