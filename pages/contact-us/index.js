import React from 'react';
import Head from 'next/head';
import { Formik, Form } from 'formik';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { contactUsValidations } from '../../src/validation-schema/contactUsSchema';
import Footer from 'src/components/Footer';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { TOAST_ALERTS, TOAST_TYPES } from 'src/constants/keywords';
import useToast from 'src/hooks/useToast';
import { useSelector } from "react-redux";
import Navbar1 from 'src/components/Navbar';

const ContactUs = () => {
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };
  const { showToast } = useToast();
  const authState = useSelector((state) => state.auth.authState);
  const headers = { Authorization: `Bearer ${authState}`, "Content-Type": "application/json" };

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post(API_ROUTER.USER_CONTACTUS,values, {headers});
      if (response.status === 200) {
        showToast(TOAST_ALERTS.SUCCESS, TOAST_TYPES.SUCCESS);
      } else {
        showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      // console.error("Error submitting form:", error);
      showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  };
  
  return (
  <>
    <Head>
      <title>Contact TradeOnAir | Algo Trading Support India — Get Help Fast</title>
      <meta
        name="description"
        content="Contact TradeOnAir's algo trading support team. Get help with strategy automation, broker integration, NSE/BSE trading bots, and account questions. We're here for Indian traders."
      />
      <meta
        name="keywords"
        content="contact tradeonair, tradeonair support, algo trading help India, trading bot support, NSE BSE trading support"
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://app.tradeonair.com/contact-us" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://app.tradeonair.com/contact-us" />
      <meta property="og:title" content="Contact TradeOnAir | Algo Trading Support India" />
      <meta
        property="og:description"
        content="Get in touch with the TradeOnAir team. We're here to help Indian traders with algo trading, strategy automation, and broker integration questions."
      />
      <meta name="twitter:title" content="Contact TradeOnAir | Algo Trading Support India" />
      <meta
        name="twitter:description"
        content="Get in touch with the TradeOnAir team. We're here to help Indian traders with algo trading and automation questions."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact TradeOnAir',
            url: 'https://app.tradeonair.com/contact-us',
            description: 'Contact TradeOnAir for algo trading support, strategy help, and broker integration assistance for Indian stock markets.',
            mainEntity: {
              '@type': 'Organization',
              name: 'TradeOnAir',
              email: 'support@tradeonair.com',
              url: 'https://app.tradeonair.com',
              areaServed: 'India',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://app.tradeonair.com' },
              { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://app.tradeonair.com/contact-us' },
            ],
          }),
        }}
      />
    </Head>
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    marginTop:"-60px"
  }}>
    <Navbar1 />
    <Box 
      sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: 450,
          p: 4,
          backgroundColor:"#232A2E",
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center',
            mb: 3,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #4caf50, #81c784)',
              borderRadius: '3px'
            }
          }}
        >
          Contact Us
        </Typography>
        
        <Formik
          initialValues={initialValues}
          validationSchema={contactUsValidations}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                  mb: 2
                }}
              />
              
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                  mb: 2
                }}
              />
              
              <TextField
                fullWidth
                variant="outlined"
                label="Message"
                name="message"
                multiline
                rows={5}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                  mb: 3
                }}
              />
              
              <Button 
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                sx={{ 
                  mt: 1,
                  width: '100%',
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'primary.main',
                  boxShadow: '0 4px 6px #232A2E',
                  '&:hover': {
                    boxShadow: '0 6px 10px #232A2E',
                    background: 'primary.main'
                  }
                }}
              >
                  Submit Message
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
    <Footer />
  </Box>
  </>
);
};

export default ContactUs;
