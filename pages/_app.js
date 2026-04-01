// pages/_app.js
import { useRouter } from 'next/router';
import '/src/components/DatePicker/DatePicker.css'
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { SidebarProvider } from 'src/contexts/SidebarContext';
// import Layout from 'src/components/Layout';
import Loader from 'src/components/Loader';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { AuthConsumer, AuthProvider } from 'src/contexts/JWTAuthContext';
import { store } from '../src/redux/store';
// Load the full ReduxProvider (with PersistGate) only on the client side.
// On the server we use a plain Provider so SSG/SSR produces real HTML.
const ReduxProvider = dynamic(() => import('../src/redux/store/RootProvider'), {
  ssr: false,
  loading: () => null,
});

const clientSideEmotionCache = createEmotionCache();

// Public pages that should be pre-rendered without waiting for auth init.
// These are marketing/legal pages visible to Googlebot.
const PUBLIC_ROUTES = ['/', '/privacy-policy', '/terms-and-conditions', '/how-to-use', '/contact-us'];

function TokyoApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const isPublicPage = PUBLIC_ROUTES.includes(router.pathname);
  useScrollTop();

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>TradeOnAir | Automated Algo Trading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          name="description"
          content="TradeOnAir is an automated algorithmic trading platform for Indian markets (NSE & BSE). Connect your broker, build quant strategies without coding, and deploy instantly."
        />
        <meta 
          name="keywords" 
          content="algo trading, algorithmic trading, automated trading, trading automation, algorithmic trading software, NSE, BSE, Indian stock market, quant trading, trading strategies, stock trading automation, options trading bots, TradeOnAir, what is algo trading" 
        />
        <meta name="robots" content="index, follow" />
        {/* ── Canonical URL: prevents duplicate-content between domains ── */}
        <link
          rel="canonical"
          href={`https://app.tradeonair.com${(router.asPath || router.pathname || '').split('?')[0]}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://app.tradeonair.com${(router.asPath || router.pathname || '').split('?')[0]}`} />
        <meta property="og:title" content="TradeOnAir | Automated Algo Trading Platform" />
        <meta
          property="og:description"
          content="TradeOnAir is an automated algorithmic trading platform for Indian markets (NSE & BSE). Connect your broker, build quant strategies without coding, and deploy instantly."
        />
        <meta name="twitter:title" content="TradeOnAir | Automated Algo Trading Platform" />
        <meta
          name="twitter:description"
          content="TradeOnAir is an automated algorithmic trading platform for Indian markets (NSE & BSE). Connect your broker, build quant strategies without coding, and deploy instantly."
        />
      </Head>
      {/* For public pages: use plain Redux Provider (SSR-safe, no PersistGate).
          For app pages: use full ReduxProvider with PersistGate (client-only). */}
      {isPublicPage ? (
        <Provider store={store}>
          <AuthProvider>
            <SidebarProvider>
              <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <SnackbarProvider
                    maxSnack={6}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    >
                    <CssBaseline />
                    {getLayout(<Component {...pageProps} />)}
                  </SnackbarProvider>
                </LocalizationProvider>
              </ThemeProvider>
            </SidebarProvider>
          </AuthProvider>
        </Provider>
      ) : (
        <ReduxProvider store={store}>
            <AuthProvider>
              <SidebarProvider>
                <ThemeProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SnackbarProvider
                      maxSnack={6}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      >
                      <CssBaseline />
                      {/* <Layout> */}
                      <AuthConsumer>
                        {(auth) =>
                          // Skip auth gate on public pages so SSG renders full HTML for Googlebot
                          isPublicPage || auth.isInitialized ? (
                            getLayout(<Component {...pageProps} />)
                          ) : (
                            <Loader />
                          )
                        }
                      </AuthConsumer>
          {/* </Layout> */}
                    </SnackbarProvider>
                  </LocalizationProvider>
                </ThemeProvider>
              </SidebarProvider>
            </AuthProvider>
        </ReduxProvider>
      )}
    </CacheProvider>
  );
}

export default appWithTranslation(TokyoApp);
