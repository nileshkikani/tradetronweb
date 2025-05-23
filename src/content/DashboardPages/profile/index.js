import React, { useEffect, useState } from 'react';
import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import useToast from 'src/hooks/useToast';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/router';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { TOAST_ALERTS, TOAST_TYPES } from 'src/constants/keywords';
import { useSelector } from "react-redux";

const DashboardProfileContent = () => {
  const { showToast } = useToast();
  const authState = useSelector((state) => state.auth.authState);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [buttonState, setButtonState] = useState(false);

  const headers = { Authorization: `Bearer ${authState}` };
  const { logout } = useAuth();
  const router = useRouter();

  const getUserInfo = async () => {
    try {
      const { data } = await axiosInstance.get(API_ROUTER.USER_PROFILE, { headers });
      if (data.code === "user_not_found") {
        setError(data.detail);
        showToast(data.detail, TOAST_TYPES.ERROR);
      } else {
        setUserData(data.user);
        setButtonState(data.user.cronjobs_current_status);
      }
    } catch (error) {
      setError("An error occurred while fetching user information.");
      showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  };

  const handleToggleAllStrategies = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.STRATEGY_ON_OFF_ALL, { headers });
      if (response.data.state === false) {
        showToast(response.data.details, TOAST_TYPES.SUCCESS);
        setButtonState(false);
      } else {
        showToast(response.data.details, TOAST_TYPES.SUCCESS);
        setButtonState(true);
      }
    } catch (error) {
      showToast('An error occurred while toggling strategies.', TOAST_TYPES.ERROR);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

    const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <PageTitleWrapper>
        <h1>Account Info</h1>
      </PageTitleWrapper>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}>
        {error ? (
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : (
          userData && (
            <TableContainer component={Paper} sx={{
              marginTop: 3,
              maxWidth: '500px',
              overflowX: 'auto',
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attribute</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell align="right">{userData.full_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">{userData.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Box>

      
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2,gap:'22px' }}>
          {userData?.is_superuser && (
            <Button
              variant="contained"
              color={!buttonState ? "success" : "error"}
              onClick={handleToggleAllStrategies}
            >
              {buttonState ? "Disable All Strategies" : "Enable All Strategies"}
            </Button>
          )}

          <Button
            variant="contained"
            backgroundColor="#47A47B"
            onClick={handleLogout}
          >
           Logout
          </Button>
        </Box>
      
    </>
  );
};

DashboardProfileContent.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardProfileContent;
