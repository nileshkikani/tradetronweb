import { useEffect, useState, useRef } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { useSelector } from 'react-redux';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Tabs, Tab, Select, MenuItem, TableFooter } from '@mui/material';
import CustomModal from 'src/components/Deployed/DeployedModal';
import { TOAST_ALERTS, TOAST_TYPES } from 'src/constants/keywords';
import { initializeWebSocket } from 'src/utils/socket';
import useToast from 'src/hooks/useToast';

function DashboardDeployedContent() {
    const [datas, setDatas] = useState([]);
    const [strategyNames, setStrategyNames] = useState([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [orderList, setOrderList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTotalPL, setSelectedTotalPL] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [strategyStatus, setStrategyStatus] = useState({});
    const socketRef = useRef(null);
    const [livePrices, setLivePrices] = useState({});
    const authState = useSelector((state) => state.auth.authState);
    const { showToast } = useToast();

    const headers = { Authorization: `Bearer ${authState}` };

    const getData = async (id) => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.ORDER_DATE_LIST(id), { headers });
            setDatas(data);
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const getStrategyList = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST, { headers });
            const strategies = data?.map((e) => ({
                id: e.id,
                strategy_name: e.strategy_name,
            }));
            setStrategyNames(strategies);
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const handleStrategyChange = (event) => {
        const selectedId = event.target.value;
        setSelectedStrategyId(selectedId);
        setOrderList([]);
        if (selectedId) {
            getData(selectedId);
        } else {
            setDatas([]);
        }
    };

    const handleDateChange = async (event) => {
        const selectedParam = event.target.value;
        setSelectedDate(selectedParam);
        if (selectedStrategyId && selectedParam) {
            try {
                const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedParam), { headers });
                const openOrderTokens = data.filter(item => item.close_price === null).map(item => item.token);
                setOrderList(data);

                const selectedData = datas.find(item => item.date === selectedParam);
                setSelectedTotalPL(selectedData ? selectedData.total_pl : 0);

                initializeWebSocket(setLivePrices, openOrderTokens, socketRef);
            } catch (error) {
                showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
            }
        }
    };

    const handleSymbolClick = async (order) => {
        const positionType = order.position_type;
        if (selectedStrategyId && selectedDate) {
            try {
                const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedDate, positionType), { headers });
                setSelectedOrder(data);
                setIsModalOpen(true);
            } catch (error) {
                showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const getLivePrice = (token) => {
        const price = livePrices[String(token)]?.ltp || 'N/A';
        return price;
    };

    const handleToggleChange = async (strategyId, currentStatus) => {
        try {
            const response = await axiosInstance.get(
                API_ROUTER.STRATEGY_STATUS(strategyId),
                // { status: currentStatus ? 'inactive' : 'active' },
                { headers }
            );
            showToast(response.data.details || TOAST_ALERTS.STRATEGY_STATUS, TOAST_TYPES.SUCCESS);
            setStrategyStatus((prevState) => ({
                ...prevState,
                [strategyId]: !currentStatus,
            }));
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    useEffect(() => {
        getStrategyList();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                console.log('WebSocket connection closed on component unmount.');
            }
        };
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{
            height: "100vh",
            overflow: "hidden",
            overflowY: "auto",
        }}>
            <PageTitleWrapper>
                <h1>{selectedTab === 0 ? 'Deployed Strategies' : 'My Strategies'}</h1>
            </PageTitleWrapper>

            <Box p={4}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="strategy-tabs" sx={{ mb: 2 }}>
                    <Tab label="Deployed" />
                    <Tab label="My Strategies" />
                </Tabs>

                {selectedTab === 0 ? (
                    // Render Deployed Strategies content
                    <>
                        <Box display="flex" gap={2} pb={2}>
                            <Select value={selectedStrategyId} onChange={handleStrategyChange} displayEmpty>
                                <MenuItem value="">Select a strategy</MenuItem>
                                {strategyNames.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.strategy_name}
                                    </MenuItem>
                                ))}
                            </Select>

                            {datas.length > 0 && (
                                <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
                                    <MenuItem value="">Select a date</MenuItem>
                                    {datas.map((item, index) => {
                                        const day = item.date.split('-')[2];
                                        return (
                                            <MenuItem key={index} value={item.date}>
                                                {day} (total pl: {item.total_pl})
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            )}
                        </Box>

                        {orderList.length > 0 && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Symbol</TableCell>
                                            <TableCell>Order Type</TableCell>
                                            <TableCell>Open Price</TableCell>
                                            <TableCell>Close Price</TableCell>
                                            <TableCell>Profit</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Order Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderList.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                                <TableCell onClick={() => handleSymbolClick(order)} style={{ cursor: 'pointer', color: 'lightblue', textDecoration: 'underline' }}>
                                                    {order.symbol}
                                                </TableCell>
                                                <TableCell>{order.order_type}</TableCell>
                                                <TableCell>{order.open_price}</TableCell>
                                                <TableCell>
                                                    {order.close_price === null ? getLivePrice(order.token) : order.close_price}
                                                </TableCell>
                                                <TableCell>{order.profit}</TableCell>
                                                <TableCell>{order.quantity}</TableCell>
                                                <TableCell>{order.order_status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5} align="right"><strong>Total PnL:</strong></TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedTotalPL)}
                                            </TableCell>
                                            <TableCell colSpan={2}></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                ) : (
                    // Render "My Strategies" content
                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Strategy Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {strategyNames.map((strategy) => (
                                        <TableRow key={strategy.id}>
                                            <TableCell>
                                                <Typography variant="body1">
                                                    {strategy.strategy_name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color={strategyStatus[strategy.id] ? 'green' : 'red'}>
                                                    {strategyStatus[strategy.id] ? 'Active' : 'Inactive'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => handleToggleChange(strategy.id, strategyStatus[strategy.id])}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    {strategyStatus[strategy.id] ? 'Deactivate' : 'Activate'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
                order={selectedOrder}
            />

            <Footer />
        </Box>
    );
}

DashboardDeployedContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardDeployedContent;
