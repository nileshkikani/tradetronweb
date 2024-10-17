import { useEffect,useRef, useState } from 'react'
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    Box,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Slide
} from '@mui/material';
import CustomModal from 'src/components/Deployed/DeployedModal';
import { TOAST_ALERTS, TOAST_PLACE, TOAST_TYPES } from 'src/constants/keywords';
import { initializeWebSocket } from 'src/utils/socket';



function DashboardDeployedContent() {
    const [datas, setDatas] = useState([]);
    const [strategyNames, setStrategyNames] = useState([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [orderList, setOrderList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const socketRef = useRef(null); 
    const [livePrices, setLivePrices] = useState({});
    const authState = useSelector((state) => state.auth.authState);
    const { enqueueSnackbar } = useSnackbar();



    const getData = async (id) => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.ORDER_DATE_LIST(id), {
                headers: { Authorization: `Bearer ${authState}` }
            });
            setDatas(data);
        } catch (error) {
            enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
                variant: TOAST_TYPES.ERROR,
                anchorOrigin: TOAST_PLACE,
                autoHideDuration: 2000,
                TransitionComponent: Slide
            });
        }
    };

    // user's strategy list
    const getStrategyList = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST, {
                headers: { Authorization: `Bearer ${authState}` }
            });
            const strategies = data?.map((e) => ({
                id: e.id,
                strategy_name: e.strategy_name,
            }));
            setStrategyNames(strategies);
        } catch (error) {
            enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
                variant: TOAST_TYPES.ERROR,
                anchorOrigin: TOAST_PLACE,
                autoHideDuration: 2000,
                TransitionComponent: Slide
            });
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
                const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedParam), {
                    headers: { Authorization: `Bearer ${authState}` }
                });
                const openOrderTokens = data.filter(item => item.close_price === null).map(item => item.token);
                setOrderList(data);

                // socket call for live price 
                initializeWebSocket(setLivePrices, openOrderTokens, socketRef);


            } catch (error) {
                enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
                    variant: TOAST_TYPES.ERROR,
                    anchorOrigin: TOAST_PLACE,
                    autoHideDuration: 2000,
                    TransitionComponent: Slide
                });
            }
        }
    };

    const handleSymbolClick = async (order) => {
        const positionType = order.position_type;
        if (selectedStrategyId && selectedDate) {
            try {
                const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedDate, positionType), {
                    headers: { Authorization: `Bearer ${authState}` }
                });
                setSelectedOrder(data);
                setIsModalOpen(true);
            } catch (error) {
                enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
                    variant: TOAST_TYPES.ERROR,
                    anchorOrigin: TOAST_PLACE,
                    autoHideDuration: 2000,
                    TransitionComponent: Slide
                });
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    console.log('livePrices', livePrices);
    const getLivePrice = (token) => {
        const price = livePrices[String(token)]?.ltp || 'N/A'; 
        console.log('Retrieved live price for token', token, ':', price);
        return price;
    };
    
    
    useEffect(() => {
        getStrategyList();
        
        // close socket when component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                console.log('WebSocket connection closed on component unmount.');
            }
        };
    }, []);


    return (
        <>
            <PageTitleWrapper>
                <h1>Deployed</h1>
            </PageTitleWrapper>
            <Box className='min-h-screen p-4' p={4}>
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
                        <Table px={4}>
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>ID</TableCell> */}
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
                                        {/* <TableCell>{order.id}</TableCell> */}
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
                        </Table>
                    </TableContainer>
                )}
            </Box>

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
                order={selectedOrder}
            />
            <Footer />
        </>
    );
}

DashboardDeployedContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);


export default DashboardDeployedContent;
