import * as Yup from 'yup';

export const contactUsValidations = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    message: Yup.string()
        .required('Message is required'),
    captcha: Yup.bool()
        .oneOf([true], 'Captcha must be checked')
});