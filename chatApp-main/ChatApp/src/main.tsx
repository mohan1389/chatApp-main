import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router'
import AppContextProvider from './AppContext.tsx'
import AuthContextProvider from './AuthContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AppContextProvider>
                <App />
        </AppContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
