// Static build script for Vercel/Netlify deployment
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building static website for deployment...');

// Set environment variable for static deployment
process.env.STATIC_DEPLOYMENT = 'true';

// Run Vite build with production mode
const buildCommand = 'npm run build -- --mode production';

exec(buildCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during build: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Build stderr: ${stderr}`);
  }
  
  console.log(`Build stdout: ${stdout}`);
  console.log('Static build completed successfully!');
  console.log('The static site is built to the dist/ directory');
  console.log('You can now deploy this directory to Vercel or Netlify');
  
  // Create a _redirects file for Netlify (ensures SPA routing works)
  const redirectsContent = '/* /index.html 200';
  fs.writeFileSync(path.join('dist', '_redirects'), redirectsContent);
  
  console.log('Created _redirects file for Netlify');
});