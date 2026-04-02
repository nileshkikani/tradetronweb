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
      // Redirect legacy locale-prefixed URLs to canonical paths.
      // This avoids runtime ISR renders for /en/* (which can time out on cache miss).
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
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
    ];
  },
};

module.exports = withImages(
  calendarTranspile({
    // NOTE: i18n is intentionally disabled. Keeping a single-locale i18n config
    // causes Next/Vercel to serve locale-prefixed routes like /en which can
    // trigger runtime ISR renders and timeouts on cache misses.
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
