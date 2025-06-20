
// Get the correct base URL for redirects
export const getBaseURL = () => {
  // Check if we're in production (Vercel deployment)
  if (window.location.hostname === 'urcare.vercel.app') {
    return 'https://urcare.vercel.app';
  }
  
  // Check if we're in Lovable preview
  if (window.location.hostname.includes('lovable.app')) {
    return window.location.origin;
  }
  
  // Default to current origin for local development
  return window.location.origin;
};

export const getAuthRedirectURL = () => {
  const baseURL = getBaseURL();
  return `${baseURL}/dashboard`;
};

// Helper to get the post-login redirect URL
export const getPostLoginRedirectURL = () => {
  const baseURL = getBaseURL();
  
  // Check if there's a stored redirect URL from before login
  const storedRedirect = localStorage.getItem('auth_redirect_url');
  if (storedRedirect && storedRedirect.startsWith(baseURL)) {
    localStorage.removeItem('auth_redirect_url'); // Clean up
    return storedRedirect;
  }
  
  // Default redirect after successful login
  return `${baseURL}/dashboard`;
};

// Helper to store where user was trying to go before login
export const storeRedirectURL = (url: string) => {
  localStorage.setItem('auth_redirect_url', url);
};
