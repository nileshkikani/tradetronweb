import React from 'react';
import Head from 'next/head';
import { Box, Typography, styled, Container, Paper, useTheme } from '@mui/material';
import Footer from 'src/components/Footer';
// import BaseLayout from 'src/layouts/BaseLayout';
import Navbar1 from 'src/components/Navbar';
import { Security, Lock, Cookie, VisibilityOff, DataUsage } from '@mui/icons-material';
import { Grid } from '@mui/material';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: ${theme.palette.background.default};
  `
);

const ContentWrapper = styled(Container)(
  ({ theme }) => `
    flex: 1;
    padding: ${theme.spacing(6, 0)};
  `
);


const PolicySection = styled(Paper)(
  ({ theme }) => `
    padding: ${theme.spacing(4)};
    margin-bottom: ${theme.spacing(4)};
    border-left: 4px solid ${theme.palette.primary.main};
    transition: transform 0.3s ease;
    &:hover {
      transform: translateY(-3px);
      box-shadow: ${theme.shadows[4]};
    }
  `
);

const SectionHeader = styled(Typography)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    color: ${theme.palette.primary.main};
  `
);

const PrivacyPolicy = () => {
  const theme = useTheme();

  return (
    <OverviewWrapper>
      <Head>
        <title>Privacy Policy | TradeOnAir Algo Trading Platform India</title>
        <meta
          name="description"
          content="Read TradeOnAir's privacy policy. We protect Indian traders' personal data with bank-level security, 256-bit SSL encryption, and strict data practices. Your privacy is our priority."
        />
        <meta
          name="keywords"
          content="tradeonair privacy policy, algo trading platform privacy, trading data security India"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://app.tradeonair.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.tradeonair.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | TradeOnAir" />
        <meta
          property="og:description"
          content="Learn how TradeOnAir protects your personal data with bank-level security and strict privacy policies."
        />
        <meta name="twitter:title" content="Privacy Policy | TradeOnAir" />
        <meta
          name="twitter:description"
          content="Learn how TradeOnAir protects your personal data with bank-level security and strict privacy policies."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://app.tradeonair.com' },
                { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://app.tradeonair.com/privacy-policy' },
              ],
            }),
          }}
        />
      </Head>
      <Navbar1 />
      <ContentWrapper>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Your Data Security is Our Top Priority
          </Typography>
        </Box>

        <PolicySection elevation={2}>
          <SectionHeader variant="h4">
            <Security sx={{ mr: 2 }} />
            Our Commitment to Your Privacy
          </SectionHeader>
          <Typography variant="body1" paragraph>
            At <strong style={{ color: theme.palette.primary.main }}>tradeOnAir</strong>, we are deeply committed to protecting the confidentiality and security of your personal information. We maintain strict policies to ensure that your nonpublic information ("Information") is never shared with third parties without your explicit consent.
          </Typography>
        </PolicySection>

        <PolicySection elevation={2}>
          <SectionHeader variant="h4">
            <DataUsage sx={{ mr: 2 }} />
            Information Collection
          </SectionHeader>
          <Typography variant="body1" paragraph>
            We collect information directly from you when you apply for, access, and use our financial products and services. This includes:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <li><Typography variant="body1">Account registration details</Typography></li>
            <li><Typography variant="body1">Transaction history</Typography></li>
            <li><Typography variant="body1">Verification documents</Typography></li>
            <li><Typography variant="body1">Service preferences</Typography></li>
          </Box>
        </PolicySection>

        <PolicySection elevation={2}>
          <SectionHeader variant="h4">
            <Lock sx={{ mr: 2 }} />
            Security Measures
          </SectionHeader>
          <Typography variant="body1" paragraph>
            We implement robust safeguards to protect your information:
          </Typography>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Physical Security</Typography>
              <Typography variant="body2">
                Secure data centers with restricted access and 24/7 monitoring
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Electronic Protection</Typography>
              <Typography variant="body2">
                Advanced encryption (256-bit SSL) for all data transmissions
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Access Controls</Typography>
              <Typography variant="body2">
                Strict employee access policies and multi-factor authentication
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Continuous Monitoring</Typography>
              <Typography variant="body2">
                Real-time intrusion detection and prevention systems
              </Typography>
            </Grid>
          </Grid>
        </PolicySection>

        <PolicySection elevation={2}>
          <SectionHeader variant="h4">
            <VisibilityOff sx={{ mr: 2 }} />
            Data Protection
          </SectionHeader>
          <Typography variant="body1" paragraph>
            We employ bank-level security measures including Secure Sockets Layer (SSL) encryption on all our servers. This technology:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1">Encodes all data transmissions</Typography></li>
            <li><Typography variant="body1">Prevents third-party interception</Typography></li>
            <li><Typography variant="body1">Uses firewalls and DDoS protection</Typography></li>
          </Box>
          <Typography variant="body1">
            Our security protocols are regularly audited to ensure compliance with global financial data protection standards.
          </Typography>
        </PolicySection>

        <PolicySection elevation={2}>
          <SectionHeader variant="h4">
            <Cookie sx={{ mr: 2 }} />
            Cookie Policy
          </SectionHeader>
          <Typography variant="body1" paragraph>
            We use cookies to enhance your browsing experience and provide personalized services:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1"><strong>Session cookies:</strong> Temporary files deleted when you close your browser</Typography></li>
            <li><Typography variant="body1"><strong>Preference cookies:</strong> Remember your language and display settings</Typography></li>
            <li><Typography variant="body1"><strong>Analytics cookies:</strong> Help us improve our services</Typography></li>
          </Box>
          <Typography variant="body1" paragraph>
            You can manage cookie preferences in your browser settings, though some features may not function properly without them.
          </Typography>
        </PolicySection>

        <Box mt={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For questions about our privacy practices, please contact our Data Protection Officer at privacy@tradeonair.com
          </Typography>
        </Box>
      </ContentWrapper>

      <Footer sx={{ marginTop: 'auto' }} />
    </OverviewWrapper>
  );
};

// PrivacyPolicy.getLayout = function getLayout(page) {
//     return <BaseLayout>{page}</BaseLayout>;
// };

export default PrivacyPolicy;

// Enable SSG: pre-renders full HTML at build time so Googlebot & AI crawlers
// see real content instead of an empty <div id="__next"> shell.
export async function getStaticProps() {
  return {
    props: {},
  };
}