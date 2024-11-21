import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const BaseLayout = ({ children }) => {
  return (
    <Box
    sx={{
      display: 'flex',
      flex: 1,
      height: '100%'
    }}
    >
      {/* <Box sx={{ flex: 1 }}> */}

      {children}
      {/* </Box> */}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
