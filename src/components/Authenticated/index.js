import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { Slide } from '@mui/material';

export const Authenticated = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || authChecked) {
      return;
    }

    const checkAuth = async () => {
      try {
        const isAuthenticated = await auth.validateToken();
        
        if (!isAuthenticated) {
          router.push({
            pathname: '/auth/login/cover',
            query: { backTo: router.asPath }
          });
          return;
        }

        setVerified(true);
        setAuthChecked(true);
        enqueueSnackbar('You are successfully authenticated!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide
        });
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push({
          pathname: '/auth/login/cover',
          query: { backTo: router.asPath }
        });
      }
    };

    checkAuth();
  }, [router.isReady, auth, router, authChecked]);

  if (!verified) {
    return null;
  }

  return <>{children}</>;
};

Authenticated.propTypes = {
  children: PropTypes.node
};