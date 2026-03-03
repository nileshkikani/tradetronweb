// pages/_app.js
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
import { AuthConsumer, AuthProvider } from 'src/contexts/JWTAuthContext';
import { store } from '../src/redux/store';
const ReduxProvider = dynamic(() => import('../src/redux/store/RootProvider'), {
  ssr: false
});

const clientSideEmotionCache = createEmotionCache();

function TokyoApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
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
          content="TradeOnAir empowers strategy creators to automate quant trading strategies and sell them to investors worldwide. No coding required."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradeonair.com/" />
        <meta property="og:title" content="TradeOnAir | Automated Algo Trading Platform" />
        <meta
          property="og:description"
          content="TradeOnAir empowers strategy creators to automate quant trading strategies and sell them to investors worldwide. No coding required."
        />
        <meta name="twitter:title" content="TradeOnAir | Automated Algo Trading Platform" />
        <meta
          name="twitter:description"
          content="TradeOnAir empowers strategy creators to automate quant trading strategies and sell them to investors worldwide. No coding required."
        />
      </Head>
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
                        !auth.isInitialized ? (
                          <Loader />
                        ) : (
                          getLayout(<Component {...pageProps} />)
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
    </CacheProvider>
  );
}

export default appWithTranslation(TokyoApp);
