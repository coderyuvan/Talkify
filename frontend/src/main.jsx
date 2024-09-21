import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,
)
