import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import Route from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Route />
  </StrictMode>,
)
