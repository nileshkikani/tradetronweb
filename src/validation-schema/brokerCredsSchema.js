import * as Yup from 'yup';

const mobileNoValidation = Yup.string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .matches(/^\d+$/, 'Mobile number must contain only numbers');

export const getBrokerValidationSchema = (broker) => {
    const commonFields = {
        client_code: Yup.string().required('Client code is required'),
        password: Yup.string().required('Password is required'),
        totp: Yup.string().required('TOTP is required'),
        api_key: Yup.string().required('API Key is required'),
        mobile_no: mobileNoValidation,
    };

    const kotakSchema = {
        consumer_key: Yup.string().required('Consumer key is required'),
        consumer_secret: Yup.string().required('Consumer secret is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
        neo_fin_key: Yup.string().required('Neo Fin Key is required'),
        mobile_no: mobileNoValidation,
        login_password: Yup.string().required('Login password is required'),
        mpin: Yup.string().required('MPIN is required'),
    };

    return Yup.object().shape({
        ...(broker === 'angel' ? commonFields : kotakSchema),
    });
};
