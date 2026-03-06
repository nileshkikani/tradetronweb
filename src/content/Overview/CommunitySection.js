import { Box, Container, Typography, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(68, 165, 116, 0.5); }
  70% { box-shadow: 0 0 0 16px rgba(68, 165, 116, 0); }
  100% { box-shadow: 0 0 0 0 rgba(68, 165, 116, 0); }
`;

const SectionWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.common.white};
    padding: ${theme.spacing(15, 0)};
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(68, 165, 116, 0.07) 0%, transparent 70%);
      pointer-events: none;
    }
  `
);

const TelegramIconWrapper = styled(Box)(
  () => `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: linear-gradient(145deg, #229ED9, #1a7ab5);
    margin: 0 auto 28px;
    box-shadow: 0 8px 32px rgba(34, 158, 217, 0.35);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.08);
    }
  `
);

const TelegramSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="40"
    height="40"
  >
    <path
      fill="white"
      d="M41.4 7.2L5.6 21.3c-2.4.9-2.4 2.3-.4 2.9l9 2.8 20.9-13.2c1-.6 1.9-.3 1.2.4L18.6 31.2l-.7 9.4c1 0 1.5-.5 2-1l4.8-4.7 9.9 7.3c1.8 1 3.1.5 3.5-1.7L43.9 9.9c.6-2.5-.9-3.6-2.5-2.7z"
    />
  </svg>
);

const JoinButton = styled(Button)(
  () => `
    background: #44A574;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    padding: 14px 40px;
    border-radius: 50px;
    text-transform: none;
    letter-spacing: 0.3px;
    animation: ${pulse} 2.4s infinite;
    transition: transform 0.2s ease, background 0.2s ease;
    box-shadow: 0 4px 20px rgba(68, 165, 116, 0.35);
    display: inline-flex;
    align-items: center;
    gap: 10px;

    &:hover {
      background: #369063;
      transform: translateY(-2px);
    }
  `
);

function CommunitySection() {
  return (
    <SectionWrapper>
      <Container maxWidth="sm">
        <Box textAlign="center">
          <TelegramIconWrapper>
            <TelegramSVG />
          </TelegramIconWrapper>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.8rem' },
              mb: 2,
              lineHeight: 1.2,
              background: '#44A574',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Join Our Growing Community
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontSize: '1.05rem',
              mb: 4,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.75,
              fontWeight: 'normal',
            }}
          >
            Connect with thousands of traders, get real-time strategy updates,
            tips, and exclusive insights — all in one place.
          </Typography>

          <JoinButton
            href="https://t.me/+hnzi8J_m6cJjZDk1"
            target="_blank"
            rel="noopener noreferrer"
            component="a"
          >
            <TelegramSVG />
            Join us on Telegram
          </JoinButton>
        </Box>
      </Container>
    </SectionWrapper>
  );
}

export default CommunitySection;
