"use client";

import React from 'react'
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
    // const router = useRouter();
    return (
        <Paper 
            elevation={3} 
            sx={{ 
                padding: 3, 
                borderRadius: 2, 
                maxWidth: 400, 
                margin: 'auto',
                marginTop: 5,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white' // Set background to pure white
            }}
        >
            <Typography 
                variant="h4" 
                align="center" 
                sx={{ 
                    marginBottom: 2, 
                    fontWeight: 'bold', 
                    color: 'black',
                }}
            >
                Sign Up
            </Typography>
            <form>
                <TextField 
                    fullWidth
                    label="Full Name" 
                    variant="outlined" 
                    margin="normal"
                    required
                />
                <TextField 
                    fullWidth
                    label="Email" 
                    type="email" 
                    variant="outlined" 
                    margin="normal"
                    required
                />
                <TextField 
                    fullWidth
                    label="Phone Number" 
                    type="tel" 
                    variant="outlined" 
                    margin="normal"
                    required
                />
                <TextField 
                    fullWidth
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    margin="normal"
                    required
                />
                <TextField 
                    fullWidth
                    label="Confirm Password" 
                    type="password" 
                    variant="outlined" 
                    margin="normal"
                    required
                />
                <Button 
                    type="submit" // This ensures the button triggers form submission
                    variant="contained" 
                    sx={{ 
                        marginTop: 2, 
                        background: 'linear-gradient(45deg, #4e73df 30%, #2e59d9 90%)', // Softer blue gradient
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        '&:hover': {
                            background: 'linear-gradient(45deg, #2e59d9 30%, #4e73df 90%)',
                        },
                        '&:active': {
                            transform: 'scale(0.98)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                        },
                        transition: 'background 0.3s ease, transform 0.2s ease',
                    }}
                    fullWidth
                >
                    Submit
                </Button>
            </form>
            <Typography 
                variant="body2" 
                align="center" 
                sx={{ marginTop: 2 }}
            >
                Already have an account? <Link href="/login">Login</Link>
            </Typography>
        </Paper>
    );
}

export default Page