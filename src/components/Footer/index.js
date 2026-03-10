import React, { useState } from 'react';
import { Box, Card, Typography, styled } from '@mui/material';
import Link from 'src/components/Link';
import ContactUs from '../../../pages/contact-us/index'; 


const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
        position: absolute;
        width: 100%;
        bottom: 0;
        z-index: 9;
`
);

function Footer() {
  const [showContactForm, setShowContactForm] = useState(false);


  // const handleContactUsClick = (e) => {
  //   e.preventDefault();
  //   setShowContactForm(!showContactForm);

  // };



  // const handlePrivacyPolicyClick = (e) => {
  //   e.preventDefault();

  //   setShowContactForm(false);
  // };

  return (
    <FooterWrapper className="footer-wrapper">
      <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">
            <Link href="/" passHref>
              <a style={{ cursor: 'pointer', textDecoration: 'none' }}>
                &copy; 2024 - TradeOnAir
              </a>
            </Link>
          </Typography>
          
          <Box mx={2}>
            <Link
              href="/contact-us"
              // onClick={handleContactUsClick}
              passHref
            >
                Contact us
            </Link>
          </Box>

          <Box mx={2}>
            <Link
              href="/privacy-policy"
              // onClick={handlePrivacyPolicyClick}
              passHref
            >
            Privacy Policy
            </Link>
          </Box>
          <Box mx={2}>
            <Link
              href="/how-to-use"
              // onClick={handlePrivacyPolicyClick}
              passHref
            >
            How To Use ?
            </Link>
          </Box>
        </Box>
        <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
          Made in India
        </Typography>
      </Box>
      {showContactForm && (
        <Box mt={2}>
          <ContactUs />
        </Box>
      )}

    </FooterWrapper>
  );
}

export default Footer;
