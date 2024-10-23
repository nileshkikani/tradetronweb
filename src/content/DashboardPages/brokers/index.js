import React, { useState } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useToast from 'src/hooks/useToast';
import CryptoJS from 'crypto-js';

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

const DashboardBrokersContent = () => {
    const authState = useSelector((state) => state.auth.authState);
    const [selectedBroker, setSelectedBroker] = useState('');
    const [formData, setFormData] = useState({});
    const { showToast } = useToast();

    const key = process.env.ENCRYPTION_KEY;
    const secretKey = CryptoJS.enc.Utf8.parse(key);

    //bear token for api calling
    const headers = { Authorization: `Bearer ${authState}`, "Content-Type": "application/json" };

    const addBroker = async () => {
        try {
            const encryptedData = {
                accounts: {
                    provider: selectedBroker,
                    creds: selectedBroker === 'kotak' 
                        ? {
                            consumer_key: encryptData(formData.consumer_key),
                            consumer_secret: encryptData(formData.consumer_secret),
                            username: encryptData(formData.username),
                            password: encryptData(formData.password),
                            neo_fin_key: encryptData(formData.neo_fin_key),
                            mobile_no: encryptData(`+91${formData.mobile_no}`),
                            login_password: encryptData(formData.login_password),
                            mpin: encryptData(formData.mpin),
                        }
                        : {
                            client_code: encryptData(formData.CLIENT_CODE),
                            password: encryptData(formData.PASSWORD),
                            api_key: encryptData(formData.API_KEY),
                            totp: encryptData(formData.TOTP),
                        },
                },
            };
    
            await axiosInstance.post(API_ROUTER.ADD_BROKER, encryptedData, { headers });
            showToast(TOAST_ALERTS.STRATEGY_SAVED, TOAST_TYPES.SUCCESS);
        } catch (error) {
            console.error('Error adding broker:', error.response ? error.response.data : error.message);
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };
    
    

    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), secretKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }).toString().toString(CryptoJS.enc.Base64);
    };

    const handleOpen = (broker) => {
        setSelectedBroker(broker);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile_no' && value.length > 10) {
            return;
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const renderTextField = (name, label, type = 'text') => (
        <TextField
            name={name}
            label={label}
            type={type}
            fullWidth
            margin="normal"
            onChange={handleChange}
            inputProps={{ maxLength: name === 'mobile_no' ? 10 : undefined }}
        />
    );

    const renderFields = () => {
        const fields = {
            angel: [
                { name: 'CLIENT_CODE', label: 'CLIENT CODE' },
                { name: 'PASSWORD', label: 'PASSWORD', type: 'password' },
                { name: 'TOTP', label: 'TOTP' },
                { name: 'API_KEY', label: 'API KEY' },
            ],
            kotak: [
                { name: 'consumer_key', label: 'Consumer Key' },
                { name: 'consumer_secret', label: 'Consumer Secret' },
                { name: 'username', label: 'Username' },
                { name: 'password', label: 'Password', type: 'password' },
                { name: 'neo_fin_key', label: 'Neo Fin Key' },
                { name: 'mobile_no', label: 'Mobile No' },
                { name: 'login_password', label: 'Login Password', type: 'password' },
                { name: 'mpin', label: 'MPIN', type: 'password' },
            ],
        };

        return fields[selectedBroker]?.map(field => renderTextField(field.name, field.label, field.type));
    };

    return (
        <>
            <PageTitleWrapper>
                <h1>Select Your Broker</h1>
            </PageTitleWrapper>
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
            </Box>
            <Box p={5}>
                {selectedBroker && (
                    <Paper style={{ padding: 20, marginTop: '20px' }}>
                        <Typography variant="h4">
                            Please Enter {selectedBroker} Credentials
                        </Typography>
                        {renderFields()}
                        <Button variant="contained" onClick={addBroker} style={{ marginTop: '16px' }}>
                            Submit
                        </Button>
                    </Paper>
                )}
            </Box>
            <Footer />
        </>
    );
};

DashboardBrokersContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardBrokersContent;
