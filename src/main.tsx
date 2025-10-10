import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'
import { AuthProvider } from './contexts/AuthContext'

// Make supabase globally accessible for console debugging (only in development)
if (import.meta.env.DEV) {
  (window as any).supabase = supabase;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);