'use client';
import React, { useEffect, useState } from 'react';
import { API_ROUTER } from '@/services/routes';
import axiosInstance from '@/utils/axios';
import CustomModal from '@/components/Deployed/DeployedModal';
import './modalStyles.css';
import useToaster from '@/hooks/useToaster';
import { TOAST_ALERTS, TOAST_TYPES } from '@/constants/keywords';

const Page = () => {
  const [datas, setDatas] = useState([]);
  const [strategyNames, setStrategyNames] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { toaster } = useToaster()

  const getData = async (id) => {
    try {
      const { data } = await axiosInstance.get(API_ROUTER.ORDER_DATE_LIST(id));
      setDatas(data);
    } catch (error) {
      toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
      // console.error('Error fetching data:', error);
    }
  };

  const getStrategyList = async () => {
    try {
      const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST);
      const strategies = data?.map((e) => ({
        id: e.id,
        strategy_name: e.strategy_name,
      }));
      setStrategyNames(strategies);
    } catch (error) {
      toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
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
        const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedParam));
        setOrderList(data);
      } catch (error) {
        toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
      }
    }
  };

  const handleSymbolClick = async (order) => {
    const positionType = order.position_type;
    if (selectedStrategyId && selectedDate) {
      try {
        const { data } = await axiosInstance.get(API_ROUTER.ORDER_LIST(selectedStrategyId, selectedDate, positionType));
        setSelectedOrder(data);
        setIsModalOpen(true);
      } catch (error) {
        toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    getStrategyList();
  }, []);

  return (
    <section className='min-h-screen'>
      <select onChange={handleStrategyChange} value={selectedStrategyId}>
        <option value="">Select a strategy</option>
        {strategyNames.map((item) => (
          <option key={item.id} value={item.id}>
            {item.strategy_name}
          </option>
        ))}
      </select>

      {datas.length > 0 && (
        <select onChange={handleDateChange} value={selectedDate}>
          <option value="">Select a date</option>
          {datas.map((item, index) => {
            const day = item.date.split('-')[2];
            return (
              <option key={index} value={item.date}>
                {day} (total pl: {item.total_pl})
              </option>
            );
          })}
        </select>
      )}

      {orderList.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Symbol</th>
              <th>Order Type</th>
              <th>Open Price</th>
              <th>Close Price</th>
              <th>Profit</th>
              <th>Quantity</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td onClick={() => handleSymbolClick(order)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {order.symbol}
                </td>
                <td>{order.order_type}</td>
                <td>{order.open_price}</td>
                <td>{order.close_price}</td>
                <td>{order.profit}</td>
                <td>{order.quantity}</td>
                <td>{order.order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </section>
  );
};

export default Page;
