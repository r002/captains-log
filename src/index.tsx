import ReactDOM from 'react-dom'
// import { StrictMode } from 'react'
import App from './App'

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)

if (module.hot) {
  module.hot.accept('./App.tsx', () => {
    console.clear() // Clear the console on every hot reload

    ReactDOM.render(
      <App />,
      document.querySelector('#root')
    )
  })
}
