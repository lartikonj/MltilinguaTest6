
import fs from 'fs';
import path from 'path';
import { storage } from './storage';

async function generateSitemap() {
  const baseUrl = 'https://multilingua.replit.app';
  
  // Get all subjects and articles
  const subjects = await storage.getAllSubjects();
  const articles = await storage.getAllArticles();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${subjects.map(subject => `
  <url>
    <loc>${baseUrl}/subject/${subject.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
}

export { generateSitemap };
