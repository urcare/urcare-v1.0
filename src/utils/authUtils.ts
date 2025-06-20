
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
