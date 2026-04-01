const calendarTranspile = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/react",
  "@fullcalendar/daygrid",
  "@fullcalendar/list",
  "@fullcalendar/timegrid",
]);

const withImages = require("next-images");

const redirects = {
  async redirects() {
    return [
      {
        source: "/dashboards/healthcare",
        destination: "/dashboards/healthcare/doctor",
      },
      {
        source: "/dashboards",
        destination: "/dashboards",
      },
      {
        source: "/applications",
        destination: "/applications/file-manager",
      },
      {
        source: "/blocks",
        destination: "/blocks/charts-large",
      },
      {
        source: "/management",
        destination: "/management/users",
      },
      // Eradicate /en/ ghost URLs to prevent SEO duplicate content penalties
      // Removed manual redirects: We accomplish this safely by deleting the i18n object below instead.
    ];
  },
};

module.exports = withImages(
  calendarTranspile({
    redirects,
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss:;" },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
          ]
        }
      ];
    },
    env: {
      EMA_SCALPING_URL: process.env.EMA_SCALPING_URL,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      EMA_SCALPING_URL: process.env.EMA_SCALPING_URL,
    },
  })
);
