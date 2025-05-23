import React from "react";
import {
  Box,
  Typography,
  styled,
  Button,
  Container,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import Footer from "src/components/Footer";
import Navbar1 from "src/components/Navbar";
import {
  CheckCircle,
  MonetizationOn,
  Share,
  BarChart,
  Payment,
  SupportAgent,
} from "@mui/icons-material";

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${theme.palette.background.default};
  `
);
const ContentWrapper = styled(Container)(
  ({ theme }) => `
    flex: 1;
    padding: ${theme.spacing(4, 0)};
    overflow-y: auto;
    max-height: calc(100vh - 186px);
    scrollbar-width: none;
  `
);

const BenefitCard = styled(Paper)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: ${theme.shadows[6]};
    }
  `
);

const IconWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.primary.main};
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing(2)};
    color: ${theme.palette.common.white};
  `
);

const SectionHeader = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(4, 0, 2)};
    position: relative;
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 80px;
      height: 4px;
      background: ${theme.palette.primary.main};
      border-radius: 2px;
    }
  `
);

const Affiliates = () => {
  return (
    <OverviewWrapper>
      <Navbar1 />

      <ContentWrapper>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            TradeOnAir Affiliate Program
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Get rewarded regularly by promoting the next generation of
            algorithmic trading.
          </Typography>

          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
              /*href="#signup"*/
            >
              Join Now
            </Button>
            <Button variant="outlined" size="large" /*href="#login"*/>
              Affiliate Login
            </Button>
          </Box>
        </Box>

        <Box mb={8}>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
            TradeOnAir is transforming the landscape of algorithmic trading. Our
            advanced platform enables strategy creators to automate their
            quantitative strategies and offer them to a global investor base—no
            coding required. As a TradeOnAir affiliate, you can build a steady
            stream of recurring income while contributing to the future of
            financial technology.
          </Typography>
        </Box>

        <SectionHeader variant="h3" id="benefits">
          Why Join Our Affiliate Program?
        </SectionHeader>

        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <MonetizationOn fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                High Commissions
              </Typography>
              <Typography variant="body1">
                Receive 20% recurring commission on every dollar your referrals
                spend — from subscriptions to strategy purchases.
              </Typography>
            </BenefitCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <Share fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                Marketing Tools
              </Typography>
              <Typography variant="body1">
                Access pre-designed marketing materials embedded with your
                referral links—making promotion effortless.
              </Typography>
            </BenefitCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <BarChart fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                Real-Time Tracking
              </Typography>
              <Typography variant="body1">
                Track your commissions instantly with a real-time, easy-to-use
                affiliate dashboard.
              </Typography>
            </BenefitCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <Payment fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                Monthly Payouts
              </Typography>
              <Typography variant="body1">
                Get guaranteed monthly payouts straight to your account for
                earnings above ₹2000.
              </Typography>
            </BenefitCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <CheckCircle fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                Passive Income
              </Typography>
              <Typography variant="body1">
                Keep earning passive income for as long as your referrals stay
                active on TradeOnAir.
              </Typography>
            </BenefitCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <BenefitCard elevation={3}>
              <IconWrapper>
                <SupportAgent fontSize="large" />
              </IconWrapper>
              <Typography variant="h5" gutterBottom>
                Dedicated Support
              </Typography>
              <Typography variant="body1">
                Get personalized assistance from our affiliate team to help
                maximize your earnings and grow your referrals.
              </Typography>
            </BenefitCard>
          </Grid>
        </Grid>

        <SectionHeader variant="h3">How You Earn</SectionHeader>
        <Paper
          elevation={2}
          sx={{ p: 4, mb: 6, backgroundColor: "primary.light" }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Subscription Example
              </Typography>
              <Typography variant="body1" paragraph>
                When someone subscribes to a ₹1000/month plan using your
                referral link, you receive <strong>₹200/month</strong> (20%) for
                as long as their subscription is active.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Strategy Purchase Example
              </Typography>
              <Typography variant="body1" paragraph>
                If the same user purchases a strategy for ₹1000, and TradeOnAir
                charges a ₹200 fee (20%), you earn <strong>₹40/month</strong> —
                which is 20% of that fee — from the strategy sale.
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
            Earn 20% commission on every revenue generated by your referrals
            through TradeOnAir!
          </Typography>
        </Paper>

        <SectionHeader variant="h3" id="signup">
          Ready to Get Started?
        </SectionHeader>
        <Box textAlign="center" mb={6}>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
            Select your region to join our affiliate program:
          </Typography>

          <Box mt={3}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2, minWidth: 200 }}
              /*href="/affiliates/signup/india"*/
            >
              India Affiliates
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
              /*href="/affiliates/signup/usa"*/
            >
              USA Affiliates
            </Button>
          </Box>
        </Box>

        <SectionHeader variant="h3" id="login">
          Existing Affiliates
        </SectionHeader>
        <Box textAlign="center" mb={4}>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
            Log in to your affiliate dashboard to monitor your earnings and
            track your performance:
          </Typography>

          <Button
            variant="outlined"
            size="large"
            sx={{ mt: 2, minWidth: 200 }}
           /* href="/affiliates/login"*/
          >
            Affiliate Login
          </Button>
        </Box>

        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          By participating in our affiliate program, you accept our{" "}
          <Link /*href="/affiliate-terms"*/ color="primary" underline="hover">
            Affiliate Terms and Conditions
          </Link>
          .
        </Typography>
      </ContentWrapper>

      <Footer />
      
    </OverviewWrapper>
  );
};

export default Affiliates;
