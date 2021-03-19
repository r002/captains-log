import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import { App } from './App'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root')
)

if (module.hot) {
  module.hot.accept('./App.tsx', () => {
    ReactDOM.render(
      <StrictMode>
        <App />
      </StrictMode>,
      document.querySelector('#root')
    )
  })
}
