import React from 'react';
import { Box, Typography, Divider, styled, Stack, Chip } from '@mui/material';
import Link from 'src/components/Link';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import GavelIcon from '@mui/icons-material/Gavel';

const FooterRoot = styled(Box)(() => `
  width: 100%;
  margin-top: auto;
  background: linear-gradient(180deg, #0f1923 0%, #111d27 100%);
  border-top: 2px solid rgba(68, 165, 116, 0.35);
`);

/* ── Disclaimer section ── */
const DisclaimerSection = styled(Box)(() => `
  width: 100%;
  background: transparent;
  border-bottom: 1px solid rgba(255, 193, 7, 0.15);
  padding: 28px 40px;
`);

const DisclaimerCard = styled(Box)(() => `
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  align-items: flex-start;
`);

const IconBadge = styled(Box)(() => `
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`);

/* ── Nav bar ── */
const NavBar = styled(Box)(() => `
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`);

const NavLink = styled('a')(({ theme }) => `
  color: rgba(203, 204, 210, 0.75);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
`);

const NAV_LINKS = [
  { href: '/contact-us',         label: 'Contact Us' },
  { href: '/privacy-policy',     label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' }, 
  { href: '/how-to-use',         label: 'How To Use' },
];

export default function Footer() {
  return (
    <FooterRoot className="footer-wrapper">

      {/* ─── Regulatory Disclaimer ─── */}
      <DisclaimerSection>
        <DisclaimerCard>
          <IconBadge>
            <WarningAmberRoundedIcon sx={{ color: '#FFB300', fontSize: 22 }} />
          </IconBadge>

          <Box flex={1}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1.1, color: '#FFB300', mb: 0.75, textTransform: 'uppercase' }}>
              Risk Disclaimer &amp; Regulatory Notice
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.85, color: 'rgba(203,204,210,0.82)' }}>
              Trading in financial instruments (equities, derivatives, F&amp;O) involves a <strong style={{ color: '#e0e0e0' }}>substantial risk of loss</strong> and is not suitable for all investors.
              Past performance is not indicative of future results. Investments in securities markets are subject to market risks; please read all related documents carefully before investing.
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', lineHeight: 1.85, color: 'rgba(203,204,210,0.72)', mt: 0.75 }}>
              TradeOnAir is a neutral technology service provider and <strong style={{ color: '#e0e0e0' }}>does not provide investment advice</strong>, portfolio management, or stock recommendations.
              Users are solely responsible for their trading decisions.{' '}
              <span style={{ color: '#FFB300', fontWeight: 600 }}>TradeOnAir is NOT a SEBI-registered Investment Advisor or Portfolio Manager.</span>{' '}
              Strategy creators who provide advisory or portfolio management services must hold their own valid SEBI registration as applicable under the SEBI (Investment Advisers) Regulations, 2013 or SEBI (Portfolio Managers) Regulations.{' '}
              <Link href="/terms-and-conditions" passHref>
                <a style={{ color: '#44a574', textDecoration: 'underline', fontWeight: 600 }}>Read Terms &amp; Conditions →</a>
              </Link>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1, flexShrink: 0 }}>
            <Chip
              icon={<GavelIcon sx={{ fontSize: '14px !important' }} />}
              label="SEBI Compliant"
              size="small"
              sx={{ bgcolor: 'rgba(68,165,116,0.12)', color: '#44a574', border: '1px solid rgba(68,165,116,0.3)', fontSize: '0.7rem', fontWeight: 600 }}
            />
            <Chip
              label="NSE · BSE"
              size="small"
              sx={{ bgcolor: 'rgba(255,193,7,0.1)', color: '#FFB300', border: '1px solid rgba(255,193,7,0.25)', fontSize: '0.7rem', fontWeight: 600 }}
            />
          </Box>
        </DisclaimerCard>
      </DisclaimerSection>

      {/* ─── Navigation Bar ─── */}
      <NavBar>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#44a574', letterSpacing: 0.5 }}>
            TradeOnAir
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(203,204,210,0.5)' }}>
            &copy; {new Date().getFullYear()} All rights reserved
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ display: 'flex' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} passHref>
              <NavLink>{label}</NavLink>
            </Link>
          ))}
        </Stack>

        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(203,204,210,0.5)' }}>
          Made with ❤️ in India 🇮🇳
        </Typography>
      </NavBar>

    </FooterRoot>
  );
}
