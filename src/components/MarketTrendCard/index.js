import {
  Grid,
  Box,
  CardActionArea,
  Card,
  Avatar,
  Typography,
  styled,
  useTheme
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SubscriptionsTwoToneIcon from '@mui/icons-material/SubscriptionsTwoTone';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import Text from 'src/components/Text';
import Label from 'src/components/Label';

const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
    padding: ${theme.spacing(2.5)};
    display: flex;
    align-items: center;
    justify-content: space-between;

    .MuiTouchRipple-root {
        opacity: .15;
    }

    &:hover {
        .MuiCardActionArea-focusHighlight {
            opacity: .02;
        }
    }
  `
);

function Block4(marketData) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardActionAreaWrapper>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                    width: 64,
                    height: 64,
                    background: `${theme.colors.primary.lighter}`,
                    color: `${theme.colors.primary.main}`
                  }}
              >
               < TrendingDownIcon/>
              </Avatar>
              <Box ml={1.5}>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  sx={{
                    fontSize: `${theme.typography.pxToRem(16)}`
                  }}
                >
                  {t('EMA 9')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: `${theme.typography.pxToRem(14)}`
                  }}
                >
                  <Text color="primary">{marketData?.marketData?.ema_nine}</Text>
                </Typography>
              </Box>
            </Box>
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                opacity: 0.7,
                display: 'flex'
              }}
            >
            </Typography>
          </CardActionAreaWrapper>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardActionAreaWrapper>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                    width: 64,
                    height: 64,
                    background: `${theme.colors.primary.lighter}`,
                    color: `${theme.colors.primary.main}`
                  }}
              >
                {marketData?.marketData?.trend === 1 ? (
                    <TrendingUpIcon />
                ) : (
                    <TrendingDownIcon />
                )}
              </Avatar>
              <Box ml={1.5}>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  sx={{
                    fontSize: `${theme.typography.pxToRem(16)}`
                  }}
                >
                  {t('Trend')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: `${theme.typography.pxToRem(14)}`
                  }}
                >
                  <Text color="primary">{marketData?.marketData?.trend === 1 ? (
                    'Up'
                ) : (
                   'Down'
                )}</Text>
                </Typography>
              </Box>
            </Box>
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                opacity: 0.7,
                display: 'flex'
              }}
            >
            </Typography>
          </CardActionAreaWrapper>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardActionAreaWrapper>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background: `${theme.colors.primary.lighter}`,
                  color: `${theme.colors.primary.main}`
                }}
              >
               < CurrencyRupeeIcon/>
              </Avatar>
              <Box ml={1.5}>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  sx={{
                    fontSize: `${theme.typography.pxToRem(16)}`
                  }}
                >
                  {t('Close Price')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: `${theme.typography.pxToRem(14)}`
                  }}
                >
                  <Box component="span">
                    <Text color="primary"> {marketData?.marketData?.current_price}</Text>
                  </Box>
                </Typography>
              </Box>
            </Box>
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                opacity: 0.7,
                display: 'flex'
              }}
            >
            </Typography>
          </CardActionAreaWrapper>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardActionAreaWrapper>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background: `${theme.colors.primary.lighter}`,
                  color: `${theme.colors.primary.main}`
                }}
              >
                <CalculateIcon/>
              </Avatar>
              <Box ml={1.5}>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  sx={{
                    fontSize: `${theme.typography.pxToRem(16)}`
                  }}
                >
                  {t('ADX ')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: `${theme.typography.pxToRem(14)}`
                  }}
                >
                  <Box component="span">
                    <Text color="primary">{marketData?.marketData?.adx}</Text>
                  </Box>
                </Typography>
              </Box>
            </Box>
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                opacity: 0.7,
                display: 'flex'
              }}
            >
            </Typography>
          </CardActionAreaWrapper>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Block4;
