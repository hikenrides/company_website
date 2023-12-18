import React from 'react'
import ReactDOM from '/opt/build/repo/client/node_modules/react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
