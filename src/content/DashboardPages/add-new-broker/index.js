import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import useToast from 'src/hooks/useToast';
import useEncryption from 'src/hooks/useEncryption';
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { TOAST_ALERTS, TOAST_TYPES } from 'src/constants/keywords';
import { useSelector } from "react-redux";

import { getBrokerValidationSchema } from 'src/validation-schema/brokerCredsSchema';

const DashboardBrokersContent = () => {
    const authState = useSelector((state) => state.auth.authState);
    const [selectedBroker, setSelectedBroker] = useState('');
    const [isAngelAdded, setIsAngelAdded] = useState(false);
    const [isKotakAdded, setIsKotakAdded] = useState(false);
    const [isDhanAdded, setIsDhanAdded] = useState(false);

    const { showToast } = useToast();
    const { encryptAngelCredentials, encryptKotakCredentials, encryptDhanCredentials } = useEncryption();
    const headers = { Authorization: `Bearer ${authState}`, "Content-Type": "application/json" };

    const formik = useFormik({
        initialValues: {
            client_code: '',
            password: '',
            totp: '',
            api_key: '',
            consumer_key: '',
            consumer_secret: '',
            username: '',
            neo_fin_key: '',
            mobile_no: '',
            login_password: '',
            mpin: '',
            client_id: '',
            access_token: ''
        },
        validationSchema: getBrokerValidationSchema(selectedBroker),
        onSubmit: async (values) => {
            try {
                const encryptedData = {
                    accounts: {
                        provider: selectedBroker,
                        creds: selectedBroker === 'kotak'
                            ? encryptKotakCredentials(values)
                            : selectedBroker === 'angel'
                                ? encryptAngelCredentials(values)
                                : selectedBroker === 'dhan'
                                    ? encryptDhanCredentials(values)
                                    : '',
                    },
                };
                await axiosInstance.post(API_ROUTER.ADD_BROKER, encryptedData, { headers });
                showToast(TOAST_ALERTS.STRATEGY_SAVED, TOAST_TYPES.SUCCESS);
            } catch (error) {
                showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
            }
        },
    });

    const getBrokerData = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.UPDATE_BROKER, { headers });
            setIsAngelAdded(data.accounts.angel);
            setIsKotakAdded(data.accounts.kotak);
            setIsDhanAdded(data.accounts.dhan);
            setSelectedBroker(
                data.accounts.kotak ? 'kotak' :
                    data.accounts.angel ? 'angel' :
                        data.accounts.dhan ? 'dhan' : ''
            );

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data[0] || "You don't have any broker added";
                showToast(errorMessage, TOAST_TYPES.INFO);
            } else {
                showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
            }
        }
    };

    const handleOpen = (broker) => {
        setSelectedBroker(broker);
        formik.resetForm();
    };

    useEffect(() => {
        getBrokerData();
    }, []);

    const renderFields = () => {
        const fields = {
            angel: [
                { name: 'client_code', label: 'Client Code' },
                { name: 'password', label: 'Password', type: 'password' },
                { name: 'totp', label: 'TOTP' },
                { name: 'api_key', label: 'API Key', type: 'password' },
            ],
            kotak: [
                { name: 'consumer_key', label: 'Consumer Key' },
                { name: 'consumer_secret', label: 'Consumer Secret', type: 'password' },
                { name: 'username', label: 'Username' },
                { name: 'password', label: 'Password', type: 'password' },
                { name: 'neo_fin_key', label: 'Neo Fin Key' },
                { name: 'mobile_no', label: 'Mobile No' },
                { name: 'login_password', label: 'Login Password', type: 'password' },
                { name: 'mpin', label: 'MPIN', type: 'password' },
            ],
            dhan: [
                { name: 'client_id', label: 'Client Id' },
                { name: 'access_token', label: 'Access Token' },
            ]
        };

        return fields[selectedBroker]?.map(field => (
            <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                margin="normal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field.name] || ''}
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
                inputProps={{ maxLength: field.name === 'mobile_no' ? 10 : undefined }}
            />
        )) || <Typography>No broker added, Please add</Typography>;
    };

    return (
        <Box height="100vh">
            <PageTitleWrapper>
                <h1>Add Your Broker</h1>
            </PageTitleWrapper>
            <Typography
                variant="h6"
                align="left"
                color="textSecondary"
                gutterBottom
                sx={{ paddingX: 2, display: 'inline-flex', alignItems: 'center' }}
            >
                <GppGoodOutlinedIcon sx={{ marginRight: 1 }} />
                your data is encrypted in transit
            </Typography>
            <Box display="flex" justifyContent="space-around" p={2}>
                <Button
                    variant="outlined"
                    onClick={() => handleOpen('angel')}
                    startIcon={<Image src="/angel.png" alt="Angel" width={60} height={60} />}
                    endIcon={selectedBroker === 'angel' ? <CheckCircleIcon color="success" /> : null}
                >
                    Angel One
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleOpen('kotak')}
                    startIcon={<Image src="/kotak_neo.png" alt="Kotak" width={60} height={60} />}
                    endIcon={selectedBroker === 'kotak' ? <CheckCircleIcon color="success" /> : null}
                >
                    Kotak Neo
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleOpen('dhan')}
                    startIcon={<Image src="/dhan.svg" alt="Kotak" width={60} height={60} />}
                    endIcon={selectedBroker === 'dhan' ? <CheckCircleIcon color="success" /> : null}
                >
                    Dhan
                </Button>
            </Box>
            <Box p={5} sx={{
                height: selectedBroker === 'angel' ? 'auto' : 'calc(500px - 50px)',
                overflow: selectedBroker === 'angel' ? 'visible' : 'hidden',
                overflowY: selectedBroker === 'angel' ? 'visible' : 'auto'
            }}>
                {selectedBroker && (selectedBroker === 'angel' && isAngelAdded || selectedBroker === 'kotak' && isKotakAdded || selectedBroker === 'dhan' && isDhanAdded) ? (
                    <Typography variant="caption">{selectedBroker} already added</Typography>
                ) : (
                    selectedBroker && (
                        <Paper style={{ padding: 20, marginTop: '20px' }}>
                            <Typography variant="h4">Please Enter {selectedBroker} Credentials</Typography>
                            <form onSubmit={formik.handleSubmit}>
                                {renderFields()}
                                <Button variant="contained" type="submit" style={{ marginTop: '16px' }}>Submit</Button>
                            </form>
                        </Paper>
                    )
                )}
            </Box>
            <Footer />
        </Box>
    );
};

DashboardBrokersContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardBrokersContent;