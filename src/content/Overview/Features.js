// src/content/Overview/Features.js
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  styled,
  useTheme
} from '@mui/material';
import {
  AutoAwesome,
  Code,
  TrendingUp,
  Security,
  Speed,
  Groups
} from '@mui/icons-material';

const FeaturesWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(15, 0)};
    position: relative;
`
);

const FeatureCard = styled(Card)(
  ({ theme }) => `
    height: 100%;
    transition: all 0.3s ease;
    border-radius: ${theme.spacing(2)};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
      border-color: ${theme.palette.primary.main};
    }
`
);

const IconWrapper = styled(Box)(
  ({ theme }) => `
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing(2)};
    background: #44A574;
    color: white;
`
);

const features = [
  {
    icon: <AutoAwesome />,
    title: 'No-Code Strategy Creation',
    description: 'Build sophisticated trading strategies without writing a single line of code. Our intuitive visual builder makes it easy for anyone to create professional-grade algorithms.'
  },
  {
    icon: <Code />,
    title: 'No Software Downloads',
    description: 'Everything runs in your browser. No need to download clunky software or manage complex installations. Start trading strategies instantly from anywhere.'
  },
  {
    icon: <TrendingUp />,
    title: 'Automated Trading',
    description: 'Set your strategies and let them run automatically. Our advanced automation ensures your strategies execute precisely when market conditions are met.'
  },
  {
    icon: <Security />,
    title: 'Enterprise Security',
    description: 'Bank-level security protects your strategies and data. Multi-layer encryption and secure APIs ensure your trading algorithms remain safe and private.'
  },
  {
    icon: <Speed />,
    title: 'Lightning Fast Execution',
    description: 'Ultra-low latency execution ensures your strategies capitalize on market opportunities the moment they arise. Every millisecond counts in trading.'
  },
  {
    icon: <Groups />,
    title: 'Global Marketplace',
    description: 'Connect with traders and investors worldwide. Sell your successful strategies or discover proven algorithms from top strategy creators globally.'
  }
];

function Features() {
  const theme = useTheme();

  return (
    <FeaturesWrapper>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              background:"#44A574",
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Powerful Features for Modern Traders
          </Typography>
          <Typography
            variant="h5"
            // color="textSecondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Everything you need to create, automate, and monetize your trading strategies
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 4, textAlign: 'center'}}>
                  <IconWrapper sx={{ mx: 'auto' }}>
                    {feature.icon}
                  </IconWrapper>
                  <Typography
                    variant="h5"
                    color="#44A574"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="black"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </FeaturesWrapper>
  );
}

export default Features;