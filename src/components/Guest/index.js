import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';

export const Guest = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const demo = router.query.demo;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.isAuthenticated && demo !== 'true') {
      router.push('/dashboards/reports');
    } else {
      setVerified(true);
    }
  }, [router.isReady]);

  if (!verified) {
    return null;
  }

  return <>{children}</>;
};

Guest.propTypes = {
  children: PropTypes.node
};
