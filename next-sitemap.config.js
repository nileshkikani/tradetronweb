const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://app.tradeonair.com',
  generateRobotsTxt: false, // We maintain robots.txt manually in /public
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  // Only include public-facing pages
  exclude: [
    '/dashboards',
    '/dashboards/*',
    '/auth/*',
    '/blocks/*',
    '/status/*',
    '/404',
    '/500',
    '/api/*',
    '/affiliates', // Page has been removed
  ],
  // Custom transformation for specific pages
  transform: async (config, urlPath) => {
    const priorityMap = {
      '/': { priority: 1.0, changefreq: 'daily' },
      '/how-to-use': { priority: 0.9, changefreq: 'monthly' },
      '/contact-us': { priority: 0.8, changefreq: 'monthly' },
      '/privacy-policy': { priority: 0.5, changefreq: 'yearly' },
      '/terms-and-conditions': { priority: 0.5, changefreq: 'yearly' },
    };

    const custom = priorityMap[urlPath];
    let lastmod = config.autoLastmod ? new Date().toISOString() : undefined;

    if (config.autoLastmod) {
      try {
        let filePath = urlPath === '/' ? 'pages/index.js' : `pages${urlPath}/index.js`;
        let absolutePath = path.resolve(__dirname, filePath);
        
        if (!fs.existsSync(absolutePath)) {
          absolutePath = path.resolve(__dirname, `pages${urlPath}.js`);
        }
        
        if (fs.existsSync(absolutePath)) {
          const stats = fs.statSync(absolutePath);
          lastmod = stats.mtime.toISOString();
        }
      } catch (err) {
        // Silently fallback to build time if FS check fails
      }
    }

    return {
      loc: urlPath,
      changefreq: custom?.changefreq ?? config.changefreq,
      priority: custom?.priority ?? config.priority,
      lastmod,
    };
  },
};
