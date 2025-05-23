import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Link from 'src/components/Link';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const ImgWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 5;
    width: 100%;
    overflow: hidden;
    border-radius: ${theme.general.borderRadiusLg};
    box-shadow: 0 0rem 14rem 0 rgb(255 255 255 / 20%), 0 0.8rem 2.3rem rgb(111 130 156 / 3%), 0 0.2rem 0.7rem rgb(17 29 57 / 15%);
    border-bottom: 1px solid ${theme.palette.divider};

    img {
      display: block;
      width: 100%;
    }
  `
);

const BoxAccent = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadiusLg};
    background: ${theme.palette.background.default};
    width: 100%;
    height: 100%;
    position: absolute;
    left: -40px;
    bottom: -40px;
    display: block;
    z-index: 4;
  `
);

const BoxContent = styled(Box)(
  ({ theme }) => `
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    
    video {
      width: 100%;
      max-width: 50rem;
      height: auto;
      border-radius: ${theme.general.borderRadiusLg};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      video {
        max-width: 100%;
      }
    }
  `
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const ListItemWrapper = styled(Box)(
  () => `
    display: flex;
    align-items: center;
`
);

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const JsAvatar = styled(Box)(
  ({ theme }) => `
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  border-radius: ${theme.general.borderRadius};
  background-color: #fef8d8;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(2)};

  img {
    width: 60%;
    height: 60%;
    display: block;
  }
`
);

const NextJsAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[50]
        : theme.colors.alpha.black[10]
    };
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

function Hero() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }} style={{paddingTop:"120px"}}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
        sx={{ minHeight: '70vh' }}
      >
        <Grid item xs={12} md={6} lg={5} style={{paddingLeft:"170px"}}>
          <Box sx={{ pr: { xs: 0, md: 3, lg: 4 } }}>
            <LabelWrapper color="success">{t('Version') + ' 2.0'}</LabelWrapper>
            <TypographyH1
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
              }}
              variant="h1"
            >
              {t('Trading for Everyone')}
            </TypographyH1>
            <TypographyH2
              sx={{
                lineHeight: 1.5,
                pb: 4,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
              }}
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
            >
              {t(" 'TradeOnAir has been created to empower strategy creators. How? By allowing them to automate their quant strategies and sell them to investors and traders the world over. The best part? You never have to write a single bit of code or download clunky algo trading software'")}
            </TypographyH2>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <BoxContent>
            <video
              className="w-full"
              id="bannerVideo"
              autoPlay
              loop
              playsInline
              muted
              style={{width:'50rem'}}
            >
              <source
                src="https://files.tradetron.tech/tt-ad2.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </BoxContent>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;