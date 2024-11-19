import React from 'react';
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 3,
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={contactUsValidations}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
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
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Message"
                name="message"
                multiline
                rows={4}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                margin="normal"
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Form> 
          )}
        </Formik>
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactUs;
