import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Componnents/App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'


createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="443461054250-tkuhs6172n01ohgbf4fpmlgqjep84991.apps.googleusercontent.com">

  <StrictMode>
    <App />
  </StrictMode>,
  </GoogleOAuthProvider>
)


