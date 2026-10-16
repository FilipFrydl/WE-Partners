import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { PartnersPage } from './pages/PartnersPage'
import { seedIfFirstLaunch } from './data/seed'
import { ToastProvider } from './components/Toast'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)

// Runs in the background; the live queries pick up the seeded rows.
seedIfFirstLaunch()
