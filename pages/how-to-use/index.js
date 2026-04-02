import React from 'react';
import Head from 'next/head';
import { Typography, Box, styled, Container, Paper, List, ListItem, ListItemText } from '@mui/material';
import Image from 'next/image';
import BaseLayout from 'src/layouts/BaseLayout';
import Navbar1 from '../../src/components/Navbar';
import Footer from '../../src/components/Footer/index';

const HowToUse = () => {
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
      padding: ${theme.spacing(4)} 0;
    `
  );

  const Section = styled(Paper)(
    ({ theme }) => `
      padding: ${theme.spacing(4)};
      margin-bottom: ${theme.spacing(4)};
      border-radius: 16px;
      box-shadow: ${theme.shadows[3]};
      background: ${theme.palette.background.paper};
    `
  );

  const ExampleBox = styled(Box)(
    ({ theme }) => `
      border-left: 4px solid ${theme.palette.primary.main};
      padding: ${theme.spacing(3)};
      margin: ${theme.spacing(3)} 0;
      border-radius: 0 8px 8px 0;
    `
  );

const ImageContainer = styled(Box)(
  ({ theme }) => `
    margin: ${theme.spacing(4)} 0;
    text-align: center;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border: 1px solid ${theme.palette.divider};
    position: relative;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
    }
  `
);

const ImageCaption = styled(Typography)(
  ({ theme }) => `
    padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
    display: inline-block;
    font-weight: 500;
    border-radius: 0 0 8px 8px;
    margin-top: -1px;
  `
);

  return (
    <OverviewWrapper>
      <Head>
        <title>How to Use TradeOnAir | Algo Trading Bot Setup Guide India — Step by Step</title>
        <meta
          name="description"
          content="Learn how to use TradeOnAir's algo trading bot. Step-by-step guide: create NSE/BSE strategies, automate intraday & options trades, connect your broker (Angel, Dhan, Kotak), and monitor positions."
        />
        <meta
          name="keywords"
          content="how to use tradeonair, algo trading tutorial India, trading bot setup guide, automate options trading India, NSE BSE strategy guide, intraday bot guide, no code trading tutorial"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://app.tradeonair.com/how-to-use" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://app.tradeonair.com/how-to-use" />
        <meta property="og:title" content="How to Use TradeOnAir | Algo Trading Bot Setup Guide India" />
        <meta
          property="og:description"
          content="Step-by-step guide to creating and automating trading strategies on TradeOnAir. No coding required — works for NSE & BSE markets."
        />
        <meta name="twitter:title" content="How to Use TradeOnAir | Algo Trading Bot Setup Guide India" />
        <meta
          name="twitter:description"
          content="Step-by-step guide to creating and automating trading strategies. No coding required — works for NSE & BSE markets."
        />
        {/* JSON-LD: HowTo Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Set Up Algo Trading on TradeOnAir',
              description: 'A step-by-step guide to create and deploy automated NSE/BSE trading strategies using TradeOnAir — no coding required.',
              totalTime: 'PT15M',
              tool: [{ '@type': 'HowToTool', name: 'TradeOnAir Account' }, { '@type': 'HowToTool', name: 'Indian Stock Broker (Angel, Dhan, or Kotak Neo)' }],
              step: [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: 'Create a Strategy',
                  text: 'Login to TradeOnAir, navigate to Option Wizard, click Create Own Strategy, add legs and configure entry/exit conditions for your NSE/BSE strategy.',
                  url: 'https://app.tradeonair.com/how-to-use#create-strategy',
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: 'Monitor Positions',
                  text: 'Navigate to the Deployed page, select your strategy and date to view active intraday or swing trading positions in real time.',
                  url: 'https://app.tradeonair.com/how-to-use#monitor-positions',
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: 'Manage Strategy Status',
                  text: 'Set strategies as Active or Inactive, and permanently delete strategies from the My Strategies page. Deactivating will close all open orders immediately.',
                  url: 'https://app.tradeonair.com/how-to-use#manage-strategies',
                },
                {
                  '@type': 'HowToStep',
                  position: 4,
                  name: 'Add Broker',
                  text: 'Add your Indian broker credentials (Angel Broking, Dhan, Kotak Neo) to enable live market trading. Your credentials are encrypted and secure.',
                  url: 'https://app.tradeonair.com/how-to-use#add-broker',
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://app.tradeonair.com' },
                { '@type': 'ListItem', position: 2, name: 'How to Use', item: 'https://app.tradeonair.com/how-to-use' },
              ],
            }),
          }}
        />
      </Head>
      <Navbar1 />
      <ContentWrapper maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 4 }}>
          TradeOnAir Strategy Bot Guide
        </Typography>
        
        <Section>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'primary.dark' }}>
            What is TradeOnAir?
          </Typography>
          <Typography variant="body1" paragraph>
            TradeOnAir is an <strong>automated multi-leg trading tool</strong> that simplifies the creation and execution of options strategies.
            It allows traders to add multiple option contracts and set specific entry and exit conditions based on price or time for each strategy.
          </Typography>
          <Typography variant="body1" paragraph>
            This tool uses the combined <strong>Last Traded Price (LTP)</strong> of all the contracts in a strategy, known as <strong>Strategy LTP</strong>, to trigger trades.
            Once the predefined conditions are met, the orders are automatically sent to the exchange, reducing the need for manual monitoring and quick decision-making.
          </Typography>
        </Section>

        <Section>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'primary.dark' }}>
            How Does Strategy Bot Work?
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3, fontWeight: 500 }}>
            Let's break it down with examples:
          </Typography>

          <ExampleBox>
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
              Example 1: Buy Orders
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• 1 lot of Nifty 25000 CE (Call Option) with an LTP of 100" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• 1 lot of Nifty 25000 PE (Put Option) with an LTP of 50" />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mt: 2 }}>
              The combined <strong>Strategy LTP</strong> becomes <strong>-150</strong> (100 + 50 = 150). Since it's a combination of buying both calls and puts.
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
              You set the below conditions:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Entry condition: When the Strategy LTP hits -100" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Exit condition: Book profit of 75 points, and Book loss of 50 points" />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Once the Strategy LTP reaches -100, the orders are sent to the exchange, and the strategy enters the market. After entry, if the Strategy LTP drops by 50 points (Strategy LTP = -50) or rises by 75 points (Strategy LTP = -175), the bot will automatically execute either a stop-loss or a book-profit order.
            </Typography>
          </ExampleBox>

          <ExampleBox>
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
              Example 2: Sell Orders
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              In a similar way, for sell orders:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• The user adds 1 lot of Nifty 25000 CE (LTP 100) and 1 lot of Nifty 25000 PE (LTP 50)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• The combined Strategy LTP becomes 150." />
              </ListItem>
            </List>
            
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
              You set the below conditions:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Entry condition: Trigger at 200" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Exit condition: Book profit of 100 points, and Book Loss of 50 points." />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Once the Strategy LTP reaches 200, the orders are sent to the exchange, and the strategy enters the market. After entry, if the Strategy LTP drops by 100 points (Strategy LTP = 100) or rises by 50 points (Strategy LTP = 250), the bot will automatically execute either a stop-loss or a book-profit order.
            </Typography>
          </ExampleBox>
        </Section>

        <Section>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'primary.dark' }}>
            Why Use Strategy Bot?
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              1. Automated Entry and Exit Execution
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Strategy Bot allows traders to automate the process of entering and exiting strategies by setting predefined conditions. This helps traders avoid missing key moments in the market and reduces the need for manual intervention, freeing them up to focus on other opportunities.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              2. Risk Management
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              With Strategy Bot, traders can easily manage risk by setting book profit and stop-loss conditions based on the points from the average entry or the profit and loss levels they can tolerate. This ensures that traders don't miss out on profits or incur unexpected losses. Additionally, traders can set a global exit for all open strategies, allowing them to exit when their overall Strategy Bot profit and loss (PnL) meets the desired thresholds.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              3. Strategy LTP-Based Execution
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              The combined Strategy LTP drives the execution, which simplifies strategy management. Instead of setting entry or exit prices for each individual leg of the options contracts, traders can rely on the Strategy LTP to trigger the execution of orders. This makes it easier to manage multiple-leg strategies.
            </Typography>
          </Box>
        </Section>

        <Section>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'primary.dark' }}>
            How to Use Strategy Bot
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              1. Creating Strategies
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Login to TradeOnAir" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Navigate to the Option Wizard" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Click on Create Own strategy" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Create positions and click on add to add legs" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Add all required fields like entry time, days and exit time" />
              </ListItem>
            </List>
            
            <ImageContainer>
              <Image
                src="/static/images/how-to-use/create-own-strategy.png"
                alt="Create Your Own Strategy"
                width={900}
                height={500}
                style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  height: 'auto', 
                  display: 'block',
                  borderBottom: '3px solid transparent'
                }}
              />
              <ImageCaption variant="caption" color="textSecondary">
                Create your custom trading strategy
              </ImageCaption>
          </ImageContainer>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              2. Monitor Existing Positions
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Navigate to Deployed page" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Select your Strategy and date" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• You can see your positions there" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Click on symbol to see particular symbol wise orders that created again" />
              </ListItem>
            </List>
            
            <ImageContainer>
              <Image
                src="/static/images/how-to-use/positions.png"
                alt="View Positions"
                width={900}
                height={500}
                 style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  height: 'auto', 
                  display: 'block',
                  borderBottom: '3px solid transparent'
                }}
              />
               <ImageCaption variant="caption" color="textSecondary">
                Monitor your active positions
              </ImageCaption>
            </ImageContainer>
            
            <ImageContainer>
              <Image
                src="/static/images/how-to-use/modal.png"
                alt="Order Details Modal"
                width={900}
                height={500}
                style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  height: 'auto', 
                  display: 'block',
                  borderBottom: '3px solid transparent'
                }}
              />
               <ImageCaption variant="caption" color="textSecondary">
                Detailed view of individual orders
              </ImageCaption>
            </ImageContainer>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              3. Status of All Your Strategies
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Here you can set your strategy status Active and Deactive, and also can Delete your strategy" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• When you Deactive strategy all your active orders of that strategy will be closed immediately" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• You can also Permanently Delete your strategies from here" />
              </ListItem>
            </List>
            
            <ImageContainer>
              <Image
                src="/static/images/how-to-use/my-strategies.png"
                alt="Strategy Management"
                width={900}
                height={500}
                 style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  height: 'auto', 
                  display: 'block',
                  borderBottom: '3px solid transparent'
                }}
              />
               <ImageCaption variant="caption" color="textSecondary">
                Manage all your strategies in one place
              </ImageCaption>
            </ImageContainer>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'secondary.main' }}>
              4. Add Broker
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• You can add your broker credentials here to place order in your trading account and trade in live market" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Your Broker credentials are fully secured and encrypted in transit" />
              </ListItem>
            </List>
            
            <ImageContainer>
              <Image
                src="/static/images/how-to-use/add-broker.png"
                alt="Broker Integration"
                width={900}
                height={500}
                 style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  height: 'auto', 
                  display: 'block',
                  borderBottom: '3px solid transparent'
                }}
              />
               <ImageCaption variant="caption" color="textSecondary">
                Securely connect your broker account
              </ImageCaption>
            </ImageContainer>
          </Box>
        </Section>
      </ContentWrapper>
      <Footer />
    </OverviewWrapper>
  )
};

export default HowToUse;

// Enable SSG: pre-renders full HTML at build time so Googlebot & AI crawlers
// see real content instead of an empty <div id="__next"> shell.
export async function getStaticProps() {
  return {
    props: {},
  };
}