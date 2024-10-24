import React, { useState, useEffect } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useToast from 'src/hooks/useToast';
import useDecryption from 'src/hooks/useDecryption';
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

const DashboardExistingBrokersContent = () => {
    const authState = useSelector((state) => state.auth.authState);
    const [selectedBroker, setSelectedBroker] = useState('');
    const [formData, setFormData] = useState({ accounts: {} });
    const { showToast } = useToast();

    const key = process.env.ENCRYPTION_KEY;

    const { decryptField } = useDecryption(key);
    const headers = { Authorization: `Bearer ${authState}`, "Content-Type": "application/json" };

    const { encryptAngelCredentials, encryptKotakCredentials } = useEncryption(key);

    // get broker data api
    const getBrokerData = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.UPDATE_BROKER, { headers });
            const decryptedData = {
                accounts: {
                    kotak: {},
                    angel: {},
                },
            };

            if (data.accounts.kotak) {
                decryptedData.accounts.kotak = {
                    mpin: decryptField(data.accounts.kotak.mpin),
                    password: decryptField(data.accounts.kotak.password),
                    username: decryptField(data.accounts.kotak.username),
                    mobile_no: decryptField(data.accounts.kotak.mobile_no).replace(/^(\+91)/, ''),
                    neo_fin_key: decryptField(data.accounts.kotak.neo_fin_key),
                    consumer_key: decryptField(data.accounts.kotak.consumer_key),
                    login_password: decryptField(data.accounts.kotak.login_password),
                    consumer_secret: decryptField(data.accounts.kotak.consumer_secret),
                };
            }

            if (data.accounts.angel) {
                decryptedData.accounts.angel = {
                    client_code: decryptField(data.accounts.angel.client_code),
                    password: decryptField(data.accounts.angel.password),
                    totp: decryptField(data.accounts.angel.totp),
                    api_key: decryptField(data.accounts.angel.api_key),
                };
            }
            console.log('decr',decryptedData);
            console.log('decr2',data);
            setFormData(decryptedData);
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    // update broker api
    const updateBroker = async () => {
        try {
            let encryptedCreds;

            if (selectedBroker === 'kotak') {
                encryptedCreds = encryptKotakCredentials(formData.accounts[selectedBroker]);
            } else if (selectedBroker === 'angel') {
                encryptedCreds = encryptAngelCredentials(formData.accounts[selectedBroker]);
            }

            const encryptedData = {
                accounts: {
                    provider: selectedBroker,
                    creds: encryptedCreds,
                },
            };

            await axiosInstance.patch(API_ROUTER.UPDATE_BROKER, encryptedData, { headers });
            showToast("Broker updated successfully!", TOAST_TYPES.SUCCESS);
            // await getBrokerData();
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    // delete broker api
    const deleteBroker = async () => {
        try {
            const provider = selectedBroker;
            const body = { provider };

            await axiosInstance.delete(API_ROUTER.UPDATE_BROKER, {
                headers,
                data: body,
            });

            showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} broker deleted successfully!`, TOAST_TYPES.SUCCESS);
            setFormData((prev) => ({
                accounts: {
                    ...prev.accounts,
                    [provider]: null,
                },
            }));
            setSelectedBroker('');
            await getBrokerData();
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const handleOpen = (broker) => {
        setSelectedBroker(broker);
    };

    const renderBrokerContent = () => {
        const hasAngel = formData.accounts.angel && Object.keys(formData.accounts.angel).length > 0;
        const hasKotak = formData.accounts.kotak && Object.keys(formData.accounts.kotak).length > 0;
    
        if (selectedBroker === 'angel' && hasAngel) {
            return (
                <Paper style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4">Angel Credentials</Typography>
                    {renderFields(formData.accounts.angel)}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }} gap={3}>
                        <Button variant="contained" onClick={updateBroker}>
                            Update
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteBroker}>
                            Delete
                        </Button>
                    </Box>
                </Paper>
            );
        }
    
        if (selectedBroker === 'kotak' && hasKotak) {
            return (
                <Paper style={{ padding: 20, marginTop: '20px' }}>
                    <Typography variant="h4">Kotak Credentials</Typography>
                    {renderFields(formData.accounts.kotak)}
                    <Button variant="contained" onClick={updateBroker} style={{ marginTop: '16px' }}>
                        Update
                    </Button>
                    <Button variant="outlined" onClick={deleteBroker} style={{ borderColor: 'red' }}>
                        Delete
                    </Button>
                </Paper>
            );
        }
    
        // Handle cases when a broker is selected but has no credentials
        if (selectedBroker === 'angel' && !hasAngel) {
            return <Typography variant="caption">Please select a broker to view credentials.</Typography>;
        }
    
        if (selectedBroker === 'kotak' && !hasKotak) {
            return <Typography variant="caption">Please select a broker to view credentials.</Typography>;
        }
    
        if (!hasAngel && !hasKotak) {
            return <Typography variant="caption">You have not added any broker.</Typography>;
        }
    
        return null; 
    };
    
    

    const renderFields = (accountData) => {
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
                value={accountData[field.name] || ''}
                onChange={(e) => handleInputChange(e, field.name)}
            />
        ));
    };
    
    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
    
        setFormData(prev => {
            const updatedData = {
                accounts: {
                    ...prev.accounts,
                    [selectedBroker]: {
                        ...prev.accounts[selectedBroker],
                        [fieldName]: value,
                    },
                },
            };
            console.log("Updated FormData:", updatedData);
            return updatedData;
        });
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
                {formData.accounts.angel && Object.keys(formData.accounts.angel).length > 0 && (
                    <Button
                        variant="outlined"
                        onClick={() => handleOpen('angel')}
                        startIcon={<Image src="/angel.png" alt="Angel" width={60} height={60} />}
                        endIcon={selectedBroker === 'angel' ? <CheckCircleIcon color="success" /> : null}
                    >
                        Angel One
                    </Button>
                )}
                {formData.accounts.kotak && Object.keys(formData.accounts.kotak).length > 0 && (
                    <Button
                        variant="outlined"
                        onClick={() => handleOpen('kotak')}
                        startIcon={<Image src="/kotak_neo.png" alt="Kotak" width={60} height={60} />}
                        endIcon={selectedBroker === 'kotak' ? <CheckCircleIcon color="success" /> : null}
                    >
                        Kotak Neo
                    </Button>
                )}
            </Box>
            <Box p={5}>
                {renderBrokerContent()}
            </Box>
            <Footer />
        </>
    );
};

DashboardExistingBrokersContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardExistingBrokersContent;
