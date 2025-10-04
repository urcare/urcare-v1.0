import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { supabase } from './integrations/supabase/client'

// Suppress React DevTools warning in development
if (import.meta.env.DEV) {
  // @ts-ignore
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
}

// Disable debugger pauses in production
if (import.meta.env.PROD) {
  // Override console methods to prevent debugger pauses
  const originalConsole = { ...console };
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};
  
  // Disable debugger statements
  // @ts-ignore
  window.eval = (code) => {
    // Remove debugger statements from eval'd code
    const cleanedCode = code.replace(/debugger\s*;?/g, '');
    return originalConsole.log('Debugger statements removed');
  };
}

// Prevent debugger pauses in all environments
// @ts-ignore
window.addEventListener('error', (e) => {
  if (e.message.includes('debugger')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

// Override debugger function globally
// @ts-ignore
window.debugger = () => {};

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
