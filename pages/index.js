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
        <title>TradeOnAir — Best Algo Trading Platform India | Automated Trading Bot NSE & BSE</title>
        <meta
          name="description"
          content="India's best algo trading platform. Build, deploy & automate NSE/BSE trading strategies — no coding required. Free trading bot for intraday, swing & options trading. Trusted by 10,000+ Indian traders."
        />
        <meta
          name="keywords"
          content="tradeonair, algo trading India, algorithmic trading India, trading bot India, automated trading bot, AI trading bot, best trading bot India, algo trading platform India, automated stock trading, intraday trading bot, swing trading bot, NSE trading strategies, BSE trading strategies, auto trading software, stock market trading India, no code trading bot, options trading automation"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TradeOnAir" />
        <link rel="canonical" href="https://app.tradeonair.com/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.tradeonair.com/" />
        <meta property="og:title" content="TradeOnAir — Best Algo Trading Platform India | Automated Trading Bot" />
        <meta
          property="og:description"
          content="India's best algo trading platform. Automate NSE/BSE strategies with no code. Build, deploy and profit from algorithmic trading — free to start."
        />
        <meta property="og:image" content="https://app.tradeonair.com/icon-512x512.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://app.tradeonair.com/" />
        <meta name="twitter:title" content="TradeOnAir — Best Algo Trading Platform India | Automated Trading Bot" />
        <meta
          name="twitter:description"
          content="India's best algo trading platform. Automate NSE/BSE strategies with no code. Build, deploy and profit from algorithmic trading."
        />

        {/* JSON-LD: Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TradeOnAir',
              url: 'https://app.tradeonair.com',
              logo: 'https://app.tradeonair.com/TradeOnAir.svg',
              description: "India's leading algo trading platform enabling automated NSE and BSE trading strategies without coding.",
              foundingDate: '2022',
              areaServed: { '@type': 'Country', name: 'India' },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@tradeonair.com',
                contactType: 'customer service',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
              },
              sameAs: [
                'https://twitter.com/tradeonair',
                'https://www.linkedin.com/company/tradeonair',
              ],
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
              url: 'https://app.tradeonair.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://app.tradeonair.com/?q={search_term_string}',
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
              applicationSubCategory: 'Algo Trading Platform',
              operatingSystem: 'Web, Android, iOS',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                description: 'Free plan available with premium upgrades',
              },
              featureList: [
                'No-code algo trading strategy builder',
                'NSE and BSE automated trading',
                'Intraday and options trading bot',
                'Multi-broker integration (Angel Broking, Dhan, Kotak Neo)',
                'Real-time position monitoring',
                'AI-powered strategy optimization',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.7',
                ratingCount: '1200',
                bestRating: '5',
                worstRating: '1',
              },
              description:
                "TradeOnAir is India's best algo trading platform. Automate quant strategies for NSE and BSE with no coding required. Build, deploy, and scale algorithmic trading strategies with a free account.",
            }),
          }}
        />

        {/* JSON-LD: FAQPage Structured Data — enables Google rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is TradeOnAir?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TradeOnAir is an automated algo trading platform for Indian stock markets (NSE & BSE). It allows traders to create, deploy, and automate multi-leg options strategies without writing any code.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is TradeOnAir free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, TradeOnAir offers a free plan that lets you create and deploy algo trading strategies. Premium plans with advanced features are also available.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which brokers does TradeOnAir support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TradeOnAir supports multiple Indian brokers including Angel Broking (AngelOne), Dhan, and Kotak Neo. More brokers are being added regularly.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need coding knowledge to use TradeOnAir?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No coding is required. TradeOnAir provides a visual, no-code strategy builder for creating automated trading strategies for NSE and BSE markets.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is algo trading legal in India?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, algo trading is legal in India and regulated by SEBI. TradeOnAir operates as a neutral technology service provider, helping traders automate their strategies on NSE and BSE.',
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://app.tradeonair.com',
                },
              ],
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