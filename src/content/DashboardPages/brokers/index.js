import React, { useState } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
} from '@mui/material';

const DashboardBrokersContent = () => {
    const [selectedBroker, setSelectedBroker] = useState('');
    const [formData, setFormData] = useState({});

    const handleOpen = (broker) => {
        setSelectedBroker(broker);
        setFormData({}); // Reset form data when opening the form
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                        <Button variant="contained" onClick={() => console.log(formData)} style={{ marginTop: '16px' }}>
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
