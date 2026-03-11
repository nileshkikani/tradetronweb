/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tradeonair.com',
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
  transform: async (config, path) => {
    const priorityMap = {
      '/': { priority: 1.0, changefreq: 'daily' },
      '/algo-trading': { priority: 0.9, changefreq: 'weekly' },
      '/how-to-use': { priority: 0.9, changefreq: 'monthly' },
      '/contact-us': { priority: 0.8, changefreq: 'monthly' },
      '/privacy-policy': { priority: 0.5, changefreq: 'yearly' },
      '/terms-and-conditions': { priority: 0.5, changefreq: 'yearly' },
    };

    const custom = priorityMap[path];
    return {
      loc: path,
      changefreq: custom?.changefreq ?? config.changefreq,
      priority: custom?.priority ?? config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
