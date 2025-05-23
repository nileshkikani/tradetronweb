// src/content/Overview/Testimonials.js
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Rating,
  styled
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

const TestimonialsWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(15, 0)};
    position: relative;
`
);

const TestimonialCard = styled(Card)(
  ({ theme }) => `
    height: 100%;
    border-radius: ${theme.spacing(3)};
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }
`
);

const QuoteIcon = styled(FormatQuote)(
  ({ theme }) => `
    font-size: 3rem;
    color: #44A574;
    margin-bottom: ${theme.spacing(2)};
`
);

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Quantitative Analyst',
    company: 'Goldman Sachs',
    avatar: '/static/images/avatars/1.png',
    rating: 4,
    testimonial: 'TradeOnAir revolutionized how I create and deploy trading strategies. What used to take weeks of coding now takes hours with their intuitive platform. The automation is flawless.'
  },
  {
    name: 'Marcus Johnson',
    role: 'Independent Trader',
    company: 'Self-Employed',
    avatar: '/static/images/avatars/2.jpg',
    rating: 5,
    testimonial: 'I went from struggling with complex coding to creating profitable strategies in days. The marketplace feature has turned my trading knowledge into a steady income stream.'
  },
  {
    name: 'Dr. Elena Rodriguez',
    role: 'Financial Researcher',
    company: 'MIT Sloan',
    avatar: '/static/images/avatars/3.png',
    rating: 4,
    testimonial: 'The platform combines academic rigor with practical application beautifully. My students can now focus on strategy logic rather than implementation details.'
  },
  {
    name: 'David Kim',
    role: 'Hedge Fund Manager',
    company: 'Apex Capital',
    avatar: '/static/images/avatars/4.jpg',
    rating: 5,
    testimonial: 'TradeOnAir has democratized algorithmic trading. The quality of strategies available in their marketplace rivals what we develop in-house with million-dollar budgets.'
  },
  {
    name: 'Lisa Wang',
    role: 'Retail Trader',
    company: 'Day Trader',
    avatar: '/static/images/avatars/5.png',
    rating: 5,
    testimonial: 'Finally, a platform that makes professional-grade trading accessible to everyone. The returns on my automated strategies have exceeded all expectations.'
  },
  {
    name: 'Robert Taylor',
    role: 'Portfolio Manager',
    company: 'Vanguard',
    avatar: '/static/images/avatars/6.png',
    rating: 4,
    testimonial: 'The ease of strategy creation and backtesting capabilities are outstanding. TradeOnAir has become an essential tool in our quantitative research workflow.'
  }
];

function Testimonials() {
  return (
    <TestimonialsWrapper>
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
            Trusted by Traders Worldwide
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
            See what our community of strategy creators and traders are saying
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <TestimonialCard>
                <CardContent sx={{ p: 4 }}>
                  <QuoteIcon />
                  <Typography
                    variant="body1"
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.7,
                      color: 'white',
                      fontStyle: 'italic'
                    }}
                  >
                    "{testimonial.testimonial}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: 'white' }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {testimonial.role} • {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFD700'
                      }
                    }}
                  />
                </CardContent>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </TestimonialsWrapper>
  );
}

export default Testimonials;