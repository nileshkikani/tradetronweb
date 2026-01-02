import {
  Box,
  IconButton,
  Badge,
  Tooltip,
  alpha,
  tooltipClasses,
  styled,
  useTheme,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import PowerSettingsNewTwoToneIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import SmsTwoToneIcon from '@mui/icons-material/SmsTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'src/components/Link';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/router';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    boxShadow: theme.shadows[24],
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(12)
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function SidebarFooter() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        height: 60,
        px: 2
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        href="/dashboards/profile"
        component={Link}
        startIcon={<AccountCircleIcon />}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          color: theme.colors.alpha.trueWhite[70],
          background: theme.colors.alpha.trueWhite[10],
          transition: theme.transitions.create(['all']),
          padding: theme.spacing(1.2, 2),
          '&:hover': {
            background: alpha(theme.colors.alpha.trueWhite[100], 0.2),
            color: theme.colors.alpha.trueWhite[100]
          }
        }}
      >
        Profile
      </Button>
    </Box>
  );
}

export default SidebarFooter;
