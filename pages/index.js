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
        <title>Trading For Everyone</title>
        <meta 
          name="description" 
          content="Empower strategy creators to automate quant strategies and sell them to investors worldwide. No coding required, no clunky software downloads." 
        />
        <meta name="keywords" content="trading, strategies, automation, quant, algorithmic trading, financial technology" />
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