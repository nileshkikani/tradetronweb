import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from 'src/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-IN">
        <Head>
          {/* Character set */}
          <meta charSet="utf-8" />

          {/* Favicon & PWA */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/TradeOnAir.svg" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1975ff" />
          <meta name="application-name" content="TradeOnAir" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="TradeOnAir" />

          {/* India Geo-Targeting */}
          <meta name="geo.region" content="IN" />
          <meta name="geo.placename" content="India" />
          <meta name="geo.position" content="20.5937;78.9629" />
          <meta name="ICBM" content="20.5937, 78.9629" />

          {/* Google Search Console Verification */}
          <meta name="google-site-verification" content="vOY7fxQuwOndakbWeYYXJh1a4nnMGd_B4wcPXPpIeQ8" />

          {/* Default OG image (overridden per page) */}
          <meta property="og:image" content="https://app.tradeonair.com/TradeOnAir.svg" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta property="og:image:alt" content="TradeOnAir - Algo Trading Platform India" />
          <meta property="og:site_name" content="TradeOnAir" />
          <meta property="og:locale" content="en_IN" />

          {/* Twitter Card defaults */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@tradeonair" />
          <meta name="twitter:image" content="https://app.tradeonair.com/TradeOnAir.svg" />

          {/* JSON-LD Schema (Organization & SoftwareApplication) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "name": "TradeOnAir",
                    "url": "https://app.tradeonair.com",
                    "logo": "https://app.tradeonair.com/TradeOnAir.svg",
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "contactType": "customer support",
                      "availableLanguage": ["English", "Hindi"]
                    }
                  },
                  {
                    "@type": "SoftwareApplication",
                    "name": "TradeOnAir",
                    "applicationCategory": "FinanceApplication",
                    "operatingSystem": "Web",
                    "url": "https://app.tradeonair.com",
                    "description": "Automated algorithmic trading platform for Indian markets (NSE & BSE). Connect your broker, build quant strategies without coding, and deploy instantly.",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "INR",
                      "availability": "https://schema.org/InStock"
                    }
                  }
                ]
              })
            }}
          />



          {/* Fonts (Next.js automatically adds preconnects for Google Fonts) */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags
    ]
  };
};
