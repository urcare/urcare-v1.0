import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { supabase } from './integrations/supabase/client'

// Make supabase globally accessible for console debugging
(window as any).supabase = supabase;
console.log('🔧 Supabase made globally available for debugging');
console.log('💡 You can now use "supabase" in the browser console');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
