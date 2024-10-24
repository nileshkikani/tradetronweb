import React, { useState, useEffect } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useToast from 'src/hooks/useToast';
import useEncryption from 'src/hooks/useEncryption';
// import useDecryption from 'src/hooks/useDecryption';
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
    const [isAngelAdded, setIsAngelAdded] = useState(false);
    const { showToast } = useToast();

    const key = process.env.ENCRYPTION_KEY;

    const { encryptAngelCredentials, encryptKotakCredentials } = useEncryption(key);
    // const { decryptField } = useDecryption(key);

    const headers = { Authorization: `Bearer ${authState}`, "Content-Type": "application/json" };

    const addBroker = async () => {
        try {
            const encryptedData = {
                accounts: {
                    provider: selectedBroker,
                    creds: selectedBroker === 'kotak'
                        ? encryptKotakCredentials(formData)
                        : encryptAngelCredentials(formData),
                },
            };
            await axiosInstance.post(API_ROUTER.ADD_BROKER, encryptedData, { headers });
            showToast(TOAST_ALERTS.STRATEGY_SAVED, TOAST_TYPES.SUCCESS);
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const getBrokerData = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.UPDATE_BROKER, { headers });
            setIsAngelAdded(data.accounts.angel); // Update state based on the API response
            setSelectedBroker(data.accounts.kotak ? 'kotak' : (data.accounts.angel ? 'angel' : ''));
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const handleOpen = (broker) => {
        setSelectedBroker(broker);
        if (broker === 'angel') {
            setFormData(formData.accounts?.angel || {});
        } else if (broker === 'kotak') {
            setFormData(formData.accounts?.kotak || {});
        }
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

    const renderFields = () => {
        const fields = {
            angel: [
                { name: 'client_code', label: 'CLIENT CODE' },
                { name: 'password', label: 'PASSWORD', type: 'password' },
                { name: 'totp', label: 'TOTP' },
                { name: 'api_key', label: 'API KEY', type: 'password' },
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
        };

        return fields[selectedBroker]?.map(field => (
            <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={formData[field.name] || ''}
                inputProps={{ maxLength: field.name === 'mobile_no' ? 10 : undefined }}
            />
        )) || <Typography>No broker added, Please add</Typography>;
    };

    useEffect(() => {
        getBrokerData();
    }, []);

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
                {selectedBroker === 'angel' && isAngelAdded ? (
                    <Typography variant="caption">
                       {selectedBroker} already added
                    </Typography>
                ) : (
                    selectedBroker && (
                        <Paper style={{ padding: 20, marginTop: '20px' }}>
                            <Typography variant="h4">
                                Please Enter {selectedBroker} Credentials
                            </Typography>
                            {renderFields()}
                            <Button variant="contained" onClick={addBroker} style={{ marginTop: '16px' }}>
                                Submit
                            </Button>
                        </Paper>
                    )
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
