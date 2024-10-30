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
        z-index:9;
`
);

function Footer() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">
            &copy; 2024 - TradeOnAir
          </Typography>
          <Box mx={2}>
            <Link
              href="/contact-us"
              onClick={() => setShowContactForm(!showContactForm)}
              style={{ cursor: 'pointer' }}
            >
              {showContactForm ? 'Hide Contact Us' : 'Contact us'}
            </Link>
          </Box>
        </Box>

        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
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
