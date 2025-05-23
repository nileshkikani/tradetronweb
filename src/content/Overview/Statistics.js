// src/content/Overview/Statistics.js
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';

const StatisticsWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(15, 0)};
    position: relative;
`
);

const StatCard = styled(Card)(
  ({ theme }) => `
    height: 100%;
    text-align: center;
    border-radius: ${theme.spacing(3)};
    // background: #394043;  
    background:white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
`
);

const StatNumber = styled(Typography)(
  ({ theme }) => `
    font-size: 3.5rem;
    font-weight: 800;
    background: #44A574;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    margin-bottom: ${theme.spacing(1)};
    
    @media (max-width: ${theme.breakpoints.values.md}px) {
      font-size: 2.5rem;
    }
`
);

const stats = [
  {
    number: 50000,
    suffix: '+',
    label: 'Active Users',
    description: 'Strategy creators and traders worldwide'
  },
  {
    number: 15000,
    suffix: '+',
    label: 'Strategies Created',
    description: 'Profitable algorithms built without code'
  },
  {
    number: 2.5,
    suffix: 'B+',
    prefix: '$',
    label: 'Assets Under Management',
    description: 'Total value being traded automatically'
  },
  {
    number: 89,
    suffix: '%',
    label: 'Success Rate',
    description: 'Of strategies profitable after 6 months'
  }
];

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <StatNumber>
      {prefix}{count.toLocaleString()}{suffix}
    </StatNumber>
  );
}

function Statistics() {
  return (
    <StatisticsWrapper>
      <Container maxWidth="lg">
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
            Trusted by Thousands
          </Typography>
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Join a thriving community of successful traders and strategy creators
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <AnimatedCounter
                    end={stat.number}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    color = "#378367"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="black"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {stat.description}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StatisticsWrapper>
  );
}

export default Statistics;