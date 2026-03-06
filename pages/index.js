import { Box, Card, Container, Button, styled } from '@mui/material';
import BaseLayout from 'src/layouts/BaseLayout';
// import Link from 'src/components/Link';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
// import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
// import Highlights from 'src/content/Overview/Highlights';
import Footer from 'src/components/Footer';
import Navbar1 from '../src/components/Navbar/index';
import Features from 'src/content/Overview/Features';
import HowItWorks from 'src/content/Overview/HowItWorks';
import Statistics from 'src/content/Overview/Statistics';
import Testimonials from 'src/content/Overview/Testimonials';
import FAQ from 'src/content/Overview/FAQ';
import CommunitySection from 'src/content/Overview/CommunitySection';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
  position: sticky;
  top: 0;
  z-index: 1000;
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
    position: relative;
`
);

const SectionWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.common.white};
    position: relative;
    z-index: 1;
    
`
);

const AlternateSection = styled(Box)(
  ({ theme }) => `
    // color: white;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
`
);

function Overview() {
  const { t } = useTranslation();

  return (
    <OverviewWrapper>
      <Head>
        <title>TradeOnAir | Automated Algo Trading for Everyone</title>
        <meta
          name="description"
          content="Empower strategy creators to automate quant strategies and sell them to investors worldwide. No coding required, no clunky software downloads. Start trading smarter today."
        />
        <meta
          name="keywords"
          content="algo trading, automated trading, quant strategies, options trading, TradeOnAir, trading bot, India trading platform, NIFTY strategies, no-code trading"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tradeonair.com/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradeonair.com/" />
        <meta property="og:title" content="TradeOnAir | Automated Algo Trading for Everyone" />
        <meta
          property="og:description"
          content="Empower strategy creators to automate quant strategies and sell them to investors worldwide. No coding required."
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://tradeonair.com/" />
        <meta name="twitter:title" content="TradeOnAir | Automated Algo Trading for Everyone" />
        <meta
          name="twitter:description"
          content="Empower strategy creators to automate quant strategies and sell them to investors worldwide. No coding required."
        />

        {/* JSON-LD: Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TradeOnAir',
              url: 'https://tradeonair.com',
              logo: 'https://tradeonair.com/TradeOnAir.svg',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@tradeonair.com',
                contactType: 'customer service',
              },
              sameAs: [],
            }),
          }}
        />

        {/* JSON-LD: WebSite Structured Data (enables Sitelinks searchbox) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TradeOnAir',
              url: 'https://tradeonair.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tradeonair.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* JSON-LD: SoftwareApplication Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'TradeOnAir',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              description:
                'Automate quant trading strategies with no coding. TradeOnAir lets strategy creators build, deploy, and monetize algorithmic trading strategies.',
            }),
          }}
        />
      </Head>
      
      <HeaderWrapper style={{position:"fixed"}}>
        <Navbar1/>
      </HeaderWrapper>

      <Hero />

      <SectionWrapper>
        <Features />
      </SectionWrapper>

      <AlternateSection>
        <HowItWorks />
      </AlternateSection>

      <SectionWrapper>
        <Statistics />
      </SectionWrapper>

      <AlternateSection>
        <Testimonials />
      </AlternateSection>

      <CommunitySection />

      <SectionWrapper>
        <FAQ />
      </SectionWrapper>

      <Footer />
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};