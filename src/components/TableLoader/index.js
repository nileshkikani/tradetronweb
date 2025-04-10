import { Box, CircularProgress } from '@mui/material';

function Loader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(5px)', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 9999,
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  );
}

export default Loader;
