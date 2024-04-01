// import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { storeRoot } from './redux/store'
// import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={storeRoot}>
    <App />
  </Provider>
  // </React.StrictMode>,
)
