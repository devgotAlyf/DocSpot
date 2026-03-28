import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <GoogleOAuthProvider clientId="675064680628-db7phu5urmqv3kvorpqtvgbj4tt3f68a.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
