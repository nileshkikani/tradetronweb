// src/content/Overview/HowItWorks.js
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  styled,
  useTheme
} from '@mui/material';
import {
  CreateOutlined,
  TuneOutlined,
  RocketLaunchOutlined,
  MonetizationOnOutlined
} from '@mui/icons-material';

const HowItWorksWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(15, 0)};
    position: relative;
`
);

const StepCard = styled(Card)(
  ({ theme }) => `
    height: 100%;
    text-align: center;
    border-radius: ${theme.spacing(3)};
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }
`
);

const StepNumber = styled(Box)(
  ({ theme }) => `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #44A574;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 auto ${theme.spacing(2)};
    position: relative;
    z-index: 2;
`
);

const IconWrapper = styled(Box)(
  ({ theme }) => `
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(3)};
    color: white;
    
    svg {
      font-size: 2.5rem;
    }
`
);

const ConnectorLine = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: 30px;
    left: calc(50% + 30px);
    width: calc(100% - 60px);
    height: 2px;
    background: linear-gradient(90deg, #36845C, rgba(54, 132, 92, 0.3));
    z-index: 1;
    
    @media (max-width: ${theme.breakpoints.values.md}px) {
      display: none;
    }
`
);

const steps = [
  {
    number: 1,
    icon: <CreateOutlined />,
    title: 'Create Your Strategy',
    description: 'Use our intuitive visual builder to create trading strategies without any coding. Drag and drop indicators, set conditions, and define your trading logic in minutes.'
  },
  {
    number: 2,
    icon: <TuneOutlined />,
    title: 'Backtest & Optimize',
    description: 'Test your strategy against historical data to see how it would have performed. Fine-tune parameters and optimize for maximum profitability before going live.'
  },
  {
    number: 3,
    icon: <RocketLaunchOutlined />,
    title: 'Deploy & Automate',
    description: 'Launch your strategy with real capital and let our platform execute trades automatically. Monitor performance in real-time with detailed analytics and reporting.'
  },
  {
    number: 4,
    icon: <MonetizationOnOutlined />,
    title: 'Monetize & Scale',
    description: 'Share successful strategies in our marketplace to earn passive income. Connect with traders worldwide and scale your trading business globally.'
  }
];

function HowItWorks() {
  const theme = useTheme();

  return (
    <HowItWorksWrapper>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2
            }}
          >
            How TradeOnAir Works
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            From strategy creation to monetization in four simple steps
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ position: 'relative' }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={3} key={index} sx={{ position: 'relative' }}>
              {index < steps.length - 1 && (
                <ConnectorLine />
              )}
              <StepCard>
                <CardContent sx={{ p: 4 }}>
                  <StepNumber>
                    {step.number}
                  </StepNumber>
                  <IconWrapper>
                    {step.icon}
                  </IconWrapper>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 2, color: 'white' }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {step.description}
                  </Typography>
                </CardContent>
              </StepCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </HowItWorksWrapper>
  );
}

export default HowItWorks;