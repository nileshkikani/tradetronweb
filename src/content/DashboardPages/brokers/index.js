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

    const renderFields = () => {
        if (selectedBroker === 'angel') {
            return (
                <>
                    <TextField
                        name="CLIENT_CODE"
                        label="CLIENT CODE"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="PASSWORD"
                        label="PASSWORD"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="TOTP"
                        label="TOTP"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="API_KEY"
                        label="API KEY"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                </>
            );
        } else if (selectedBroker === 'kotak') {
            return (
                <>
                    <TextField
                        name="consumer_key"
                        label="Consumer Key"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="consumer_secret"
                        label="Consumer Secret"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="username"
                        label="Username"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="neo_fin_key"
                        label="Neo Fin Key"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="mobile_no"
                        label="Mobile No"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="login_password"
                        label="Login Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        name="mpin"
                        label="MPIN"
                        type="password"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                </>
            );
        }
        return null;
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
                    startIcon={
                        <Image
                            src="/angel.png"
                            alt="Angel"
                            width={60}
                            height={60}
                        />
                    }
                    endIcon={selectedBroker === 'angel' ? <CheckCircleIcon color="success" /> : null} // Show checkmark if selected
                >
                    Angel One
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleOpen('kotak')}
                    startIcon={
                        <Image
                            src="/kotak_neo.png"
                            alt="Kotak"
                            width={60}
                            height={60}
                        />
                    }
                    endIcon={selectedBroker === 'kotak' ? <CheckCircleIcon color="success" /> : null} // Show checkmark if selected
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
