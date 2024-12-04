import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import Footer from 'src/components/Footer';
import BaseLayout from 'src/layouts/BaseLayout';
import Navbar1 from 'src/components/Navbar';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: ${theme.palette.common.white};
  `
);

const ContentWrapper = styled(Box)(
    ({ theme }) => `
      flex: 1;
      overflow-y: auto;
      padding: ${theme.spacing(3)};
      background: ${theme.palette.background.default};
    //   padding-top: ${theme.spacing(10)};
  `
);

const PrivacyPolicy = () => {
    return (
        <OverviewWrapper>
            <Navbar1 />
            <ContentWrapper>
                <Typography variant="h4" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="h6" paragraph>
                    We are committed to your privacy
                </Typography>
                <Typography paragraph>
                    The confidentiality and security of information we collect about consumers and customers is something <strong>tradeOnAir</strong> is committed to protecting. Nonpublic information (“Information”) about you will not be shared with third parties without your consent.
                </Typography>

                <Typography variant="h6" paragraph>
                    This is how our information is gathered
                </Typography>
                <Typography paragraph>
                    We get most of our Information directly from you. This happens when you apply for, access, and use financial (and related) products and services offered by <strong>tradeOnAir</strong>.
                </Typography>

                <Typography variant="h6" paragraph>
                    This is how we protect your information
                </Typography>
                <Typography paragraph>
                    We maintain physical, electronic, and procedural safeguards which are designed to comply with industry rules and regulations. To protect the confidentiality of Information and to comply with our established policies is something our employees are required to do. Information may be accessed by them only when there is an appropriate reason to do so, such as to administer our products or services.
                </Typography>

                <Typography variant="h6" paragraph>
                    Password-protection on a secure server
                </Typography>
                <Typography paragraph>
                    Secure Sockets Layer (SSL) encryption is used on a secure server to better protect your information. Any interception by a third party is prevented when SSL encodes and decodes the transmission of personal information. Firewalls and other security technology are also used to protect our network and systems from external attack. In addition to our efforts.
                </Typography>

                <Typography variant="h6" paragraph>
                    Cookies
                </Typography>
                <Typography paragraph>
                    Cookies are small pieces of text used to store information on web browsers. The file contains a unique number so that our server knows which PC it is talking to. Some cookies are allocated to the user's PC only for the duration of the user's visit to a website, and these are called session-based cookies.
                </Typography>
                <Typography paragraph>
                    We use cookies to store data such as the country from which the site is being accessed in order to give data in a format specific to that country, e.g., currency type.
                </Typography>
                <Typography paragraph>
                    You can adjust the settings on your computer to decline any cookies if you wish. This can be done by activating the reject cookies setting on your browser.
                </Typography>

            </ContentWrapper>

            {/* Footer */}
            <Footer sx={{ marginTop: 'auto' }} />
        </OverviewWrapper>
    );
};

// Add the layout wrapper for the PrivacyPolicy page
PrivacyPolicy.getLayout = function getLayout(page) {
    return <BaseLayout>{page}</BaseLayout>;
};

export default PrivacyPolicy;
