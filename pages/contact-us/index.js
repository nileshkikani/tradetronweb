import React from 'react';
import { Formik, Form } from 'formik';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Box,
} from '@mui/material';
import { contactUsValidations } from '../../src/validation-schema/contactUsSchema';

const ContactUs = () => {
  const initialValues = {
    name: '',
    email: '',
    message: '',
    captcha: false,
  };

  const handleSubmit = (values) => {
    // add api call here
    console.log(values);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={contactUsValidations}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
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
            <FormControlLabel
              control={
                <Checkbox
                  name="captcha"
                  checked={values.captcha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              }
              label="add captcha"
            />
            {touched.captcha && errors.captcha && (
              <FormHelperText error>{errors.captcha}</FormHelperText>
            )}
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContactUs;
