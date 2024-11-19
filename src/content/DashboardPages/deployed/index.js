import { useEffect, useState, useRef } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { useSelector } from 'react-redux';
import { Box, Skeleton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Tabs, Tab, Select, MenuItem, TableFooter, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CustomModal from 'src/components/Deployed/DeployedModal';
import { TOAST_ALERTS, TOAST_TYPES } from 'src/constants/keywords';
import { initializeWebSocket } from 'src/utils/socket';
import { useAuth } from 'src/hooks/useAuth';
import useToast from 'src/hooks/useToast';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function DashboardDeployedContent() {
    const [datas, setDatas] = useState([]);
    const [strategyNames, setStrategyNames] = useState([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState(localStorage.getItem('selectedStrategyId') || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [orderList, setOrderList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [strategyStatus, setStrategyStatus] = useState({});
    const [openDeactivationModal, setOpenDeactivationModal] = useState(false);
    const [selectedStrategyForDeactivation, setSelectedStrategyForDeactivation] = useState(null);
    const [selectedStrategyForDeletion, setSelectedStrategyForDeletion] = useState(null);
    const socketRef = useRef(null);
    const [livePrices, setLivePrices] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const authState = useSelector((state) => state.auth.authState);
    const { showToast } = useToast();

    const headers = { Authorization: `Bearer ${authState}` };
    const { handleResponceError } = useAuth();

    // Function to fetch order dates based on strategy ID
    const getData = async (id) => {
        if (!id) return;
        try {
            const { data } = await axiosInstance.get(API_ROUTER.ORDER_DATE_LIST(id), { headers });
            setDatas(data);
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    // Function to fetch strategy list
    const getStrategyList = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST, { headers });
            const strategies = data?.map((e) => ({
                id: e.id,
                strategy_name: e.strategy_name,
                strategy_status: e.strategy_status,
            }));

            setStrategyNames(strategies);
            setStrategyStatus(
                strategies.reduce((acc, strategy) => {
                    acc[strategy.id] = strategy.strategy_status;
                    return acc;
                }, {})
            );
        } catch (error) {
            handleResponceError();
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    const handleStrategyChange = (event) => {
        const selectedId = event.target.value;
        setSelectedStrategyId(selectedId);
        setSelectedDate('');
        setOrderList([]);
        localStorage.setItem('selectedStrategyId', selectedId);

        if (selectedId) {
            getData(selectedId);
        } else {
            setDatas([]);
        }
    };

    const handleDateChange = async (event) => {
        const selectedParam = event.target.value;
        setSelectedDate(selectedParam);
        setIsLoading(true);

        if (selectedStrategyId && selectedParam) {
            try {
                const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedParam), { headers });
                setOrderList(data);

                // const selectedData = datas.find(item => item.date === selectedParam);
                // setSelectedTotalPL(selectedData ? selectedData.total_pl : 0);

                initializeWebSocket(setLivePrices, socketRef);
            } catch (error) {
                showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
            } finally {
                setIsLoading(false);
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
        if (currentStatus) {
            // Show confirmation modal before deactivating
            setSelectedStrategyForDeactivation(strategyId);
            setOpenDeactivationModal(true);
        } else {
            // Deactivate immediately
            try {
                const response = await axiosInstance.get(
                    API_ROUTER.STRATEGY_STATUS(strategyId),
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
        }
    };

    const handleConfirmDeactivation = async () => {
        if (!selectedStrategyForDeactivation) return;

        try {
            const response = await axiosInstance.get(
                API_ROUTER.STRATEGY_STATUS(selectedStrategyForDeactivation),
                { headers }
            );
            showToast(response.data.details || TOAST_ALERTS.STRATEGY_STATUS, TOAST_TYPES.SUCCESS);
            setStrategyStatus((prevState) => ({
                ...prevState,
                [selectedStrategyForDeactivation]: false,
            }));
        } catch (error) {
            showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }

        // Close modal after deactivation
        setOpenDeactivationModal(false);
    };

    useEffect(() => {
        const storedStrategyId = localStorage.getItem('selectedStrategyId');
        if (storedStrategyId) {
            setSelectedStrategyId(storedStrategyId);
            getData(storedStrategyId);
        }
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

    const refreshbutton = () => {
        if (selectedDate) {
            handleDateChange({ target: { value: selectedDate } });
        }
    }


    const handleDeleteStrategy = async (id) => {
        try {
            await axiosInstance.delete(API_ROUTER.STRATEGY_UPDATE(id), { headers });
            showToast(TOAST_ALERTS.STRATEGY_DELETED_SUCCESS, TOAST_TYPES.SUCCESS);

            getStrategyList();
            setShowForm(false)
        } catch (error) {
            // showToast(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    return (
        <Box sx={{ height: "100vh", overflow: "hidden", overflowY: "auto" }}>
            <PageTitleWrapper>
                <h1>{selectedTab === 0 ? 'Deployed Strategies' : 'My Strategies'}</h1>
            </PageTitleWrapper>

            <Box p={4}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="strategy-tabs" sx={{ mb: 2 }}>
                    <Tab label="Deployed" />
                    <Tab label="My Strategies" />
                </Tabs>

                {selectedTab === 0 ? (
                    <>
                        {/* Deployed strategies content */}
                        <Box display="flex" gap={2} pb={2}>
                            <Select value={selectedStrategyId} onChange={handleStrategyChange} displayEmpty>
                                <MenuItem value="" disabled>Select a strategy</MenuItem>
                                {strategyNames?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.strategy_name}
                                    </MenuItem>
                                ))}
                            </Select>

                            {datas.length > 0 && (
                                <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
                                    <MenuItem value="" disabled>Select a date</MenuItem>
                                    {datas.map((item, index) => (
                                        <MenuItem key={index} value={item.date}>
                                            {item.date.split('-')[2]} (total pl: {item.total_pl})
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                            <Button onClick={() => refreshbutton()}
                                color="primary"
                                variant="contained"
                                size="small">
                                Refresh
                            </Button>
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
                                            <TableCell>Profit/Loss</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Order Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            [...Array(orderList.length || 3)].map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            orderList.map((order) => {
                                                const closePrice = order.close_price === null ? getLivePrice(order.token) : order.close_price;
                                                const profit = order.order_type === 'SELL'
                                                    ? (order.open_price - closePrice) * order.quantity
                                                    : (closePrice - order.open_price) * order.quantity;
                                                return (
                                                    <TableRow key={order.id}>
                                                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                                        <TableCell onClick={() => handleSymbolClick(order)} style={{ cursor: 'pointer', color: 'lightblue', textDecoration: 'underline' }}>
                                                            {order.symbol}
                                                        </TableCell>
                                                        <TableCell>{order.order_type}</TableCell>
                                                        <TableCell>{order.open_price}</TableCell>
                                                        <TableCell>{closePrice}</TableCell>
                                                        <TableCell>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(profit)}</TableCell>
                                                        <TableCell>{order.quantity}</TableCell>
                                                        <TableCell>{order.order_status}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5} align="right"><strong>Total PnL:</strong></TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                    orderList.reduce((total, order) => {
                                                        const closePrice = order.close_price === null ? getLivePrice(order.token) : order.close_price;
                                                        const profit = order.order_type === 'SELL'
                                                            ? (order.open_price - closePrice) * order.quantity
                                                            : (closePrice - order.open_price) * order.quantity;
                                                        return total + profit;
                                                    }, 0)
                                                )}
                                            </TableCell>
                                            <TableCell colSpan={2}></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>

                        )}
                    </>

                ) : (
                    // --------MY STRATEGY PART
                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Strategy Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {strategyNames?.map((strategy) => (
                                        <TableRow key={strategy.id}>
                                            <TableCell>
                                                <Typography variant="body1">{strategy.strategy_name}</Typography>
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
                                                {/* <Button onClick={() => {
                                                    setSelectedStrategyForDeletion(strategy.id);
                                                    setOpenModal(true);
                                                }}><DeleteOutlineOutlinedIcon color='error' /></Button> */}
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => {
                                                    setSelectedStrategyForDeletion(strategy.id);
                                                    setOpenModal(true);
                                                }}><DeleteOutlineOutlinedIcon color='error' /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>

            {/* Confirmation Modal */}
            <Dialog open={openDeactivationModal} onClose={() => setOpenDeactivationModal(false)}>
                <DialogTitle>Confirm Deactivation</DialogTitle>
                <DialogContent>
                    <Typography>
                        All open orders with this strategy will be closed. Are you sure you want to deactivate this strategy?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeactivationModal(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDeactivation} color="error">Deactivate</Button>
                </DialogActions>
            </Dialog>

            {/* delete strategy dialog box */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this strategy ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary" >
                        Cancel
                    </Button>
                    <Button
                         onClick={() => {
                            if (selectedStrategyForDeletion !== null) {
                                handleDeleteStrategy(selectedStrategyForDeletion);
                            }
                            setOpenModal(false);
                        }}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
