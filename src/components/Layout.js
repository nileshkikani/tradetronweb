// components/Layout.js

import React from 'react';
import { Box } from '@mui/material';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box 
      sx={{
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: 'background.default'
      }}
    >
      <Box 
        component="main" 
        sx={{ flex: 1 }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
