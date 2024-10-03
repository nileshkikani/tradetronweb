'use client';
import React, { useEffect, useState } from 'react';
import { API_ROUTER } from '@/services/routes';
import axiosInstance from '@/utils/axios';
import { useAppSelector } from '@/redux/store/store';



const Page = () => {
  const [datas, setDatas] = useState([]);
  // const [orders, setOrders] = useState([]);

  const selectedStrategyId = useAppSelector((state) => state.strategy.selectedStrategyId);

  console.log('sadsa',selectedStrategyId)

  const getData = async (id) => {
    try {
      const { data } = await axiosInstance.get(API_ROUTER.ORDER_DATE_LIST(id));
      console.log('ORDER_DATE_LIST', data);
      setDatas(data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
     getData(selectedStrategyId);
  }, [selectedStrategyId]);

  return (
    <>
      <section>
        {datas.map((item) => (
          <option key={item.id}>{item.name}</option> 
        ))}
      </section>
    </>
  );
};

export default Page;
