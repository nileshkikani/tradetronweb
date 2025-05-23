// src/content/Overview/FAQ.js
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useState } from 'react';

const FAQWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(15, 0)};
    position: relative;
`
);

const StyledAccordion = styled(Accordion)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
    border-radius: ${theme.spacing(1)} !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid ${theme.palette.divider};
    
    &:before {
      display: none;
    }
    
    &.Mui-expanded {
      margin-bottom: ${theme.spacing(2)};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
`
);

const StyledAccordionSummary = styled(AccordionSummary)(
  ({ theme }) => `
    padding: ${theme.spacing(2, 3)};
    min-height: 60px;
    
    &.Mui-expanded {
      background: #44A574;
      color: white;
    }
    
    .MuiAccordionSummary-expandIconWrapper {
      color: inherit;
    }
`
);

const faqs = [
  {
    question: 'Do I need any programming knowledge to use TradeOnAir?',
    answer: 'Absolutely not! TradeOnAir is designed specifically for traders without coding experience. Our visual strategy builder uses drag-and-drop components and intuitive interfaces. You can create sophisticated trading algorithms using simple logic blocks and pre-built indicators.'
  },
  {
    question: 'How does the strategy marketplace work?',
    answer: 'Our marketplace connects strategy creators with traders and investors. You can list your proven strategies for sale, set your own prices, and earn royalties from each subscription. Buyers can browse, backtest, and subscribe to strategies that match their trading style and risk tolerance.'
  },
  {
    question: 'What types of trading strategies can I create?',
    answer: 'You can create virtually any type of trading strategy including day trading, swing trading, scalping, arbitrage, mean reversion, momentum strategies, and more. Our platform supports multiple asset classes including stocks, forex, cryptocurrencies, and commodities.'
  },
  {
    question: 'Is my trading data and strategies secure?',
    answer: 'Yes, security is our top priority. We use enterprise-grade encryption, secure APIs, and follow industry best practices. Your strategies and data are protected with bank-level security measures. You maintain full ownership and control over your intellectual property.'
  },
];

function FAQ() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <FAQWrapper>
      <Container maxWidth="md">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              background: "#44A574",

              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Everything you need to know about TradeOnAir
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <StyledAccordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <StyledAccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600 }}
                >
                  {faq.question}
                </Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.7, color: 'text.secondary' }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      </Container>
    </FAQWrapper>
  );
}

export default FAQ;