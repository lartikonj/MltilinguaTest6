// Environment configuration for switching between API and static data

// Check if we're in a production build on Vercel/Netlify
export const isStaticDeployment = import.meta.env.PROD && 
  (process.env.VERCEL || process.env.NETLIFY || import.meta.env.STATIC_DEPLOYMENT === 'true');

export const apiBaseUrl = isStaticDeployment ? '' : '/api';