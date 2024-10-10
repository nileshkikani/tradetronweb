"use client";

import React,{useEffect} from "react";
// import { RiDeleteBinLine } from "react-icons/ri"; // Uncomment as needed
// import toast from "react-hot-toast"; // Uncomment as needed
// import { setSelectedStrategyId } from "@/redux/reducers/strategySlice"; // Uncomment as needed
// import { useAppDispatch, useAppSelector } from "@/redux/store/store"; // Uncomment as needed

import {
    Button,
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { API_ROUTER } from "src/services/routes";
import axiosInstance from "src/utils/axios";
import { useSelector } from "react-redux";
import { setSelectedStrategyId } from "src/store/strategySlice";
import { useDispatch } from "react-redux";

const Titlesection = ({ setShowForm, setInitialValues, strategyNames, selectedStrategy,setSelectedStrategy,getStrategyList }) => {


    const authState = useSelector((state) => state.auth.authState);
    const dispatchStore = useDispatch();

    const handleFormDisplay = () => {
        setShowForm(true);
        // setInitialValues('');
        setSelectedStrategy(null)
    };

    const getSpecificStrategy = async (id) => {
        try {
          const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_UPDATE(id),{
            headers: { Authorization: `Bearer ${authState}` }
        });
          const [start_HH, start_MM] = data.start_time
            .split(":")
            .map((time) => parseInt(time, 10));
          const [exit_HH, exit_MM] = data.exit_time
            .split(":")
            .map((time) => parseInt(time, 10));
    
          const selectedStrategyData = {
            strategy_name: data.strategy_name || "",
            index_name: data.index_name || "",
            capital: data.capital || 0,
            strategy_type: data.strategy_type || "",
            order_take_profit_type: data.order_take_profit_type || "",
            order_stop_loss_type: data.order_stop_loss_type || "",
            positions:
              data.positions.map((position) => ({
                id: position.id,
                option_type: position.option_type,
                order_type: position.order_type,
                strike_selection: position.strike_selection,
                value: position.value,
                expiry: position.expiry,
                order_take_profit_value: position.order_take_profit_value || "",
                order_stop_loss_value: position.order_stop_loss_value || "",
                lots: position.lots || 1,
              })) || [],
            entry_HH: start_HH.toString() || "",
            entry_MM: start_MM.toString() || "",
            days: data.days || [],
            exit_HH: exit_HH.toString() || "",
            exit_MM: exit_MM.toString() || "",
            take_profit_type: data.take_profit_type || "none",
            take_profit_value: data.take_profit_value || "",
            stop_loss_value: data.stop_loss_value || "",
            stop_loss_type: data.stop_loss_type || "none",
            do_repeat: data.do_repeat || false,
          };

          console.log('selectedStrategyData', selectedStrategyData)
    
          setInitialValues(selectedStrategyData);
          dispatch(setSelectedStrategyId(id));
          handleFormDisplay()
        } catch (error) {
          console.error("Error getting specific strategy", error);
        }
      };


    const handleStrategyChange = (event) => {
        const selectedId = event.target.value;
        setSelectedStrategy(selectedId);
        getSpecificStrategy(selectedId); 
        setShowForm(true)
        // dispatchStore(setSelectedStrategyId(selectedId))
    };


    useEffect(() => {
        getStrategyList();
    }, []);

    return (
        <section>
            <div className="first-section">
                <div className="dropdown-container" style={{ display: 'flex', alignItems: 'center', gap: '16px',justifyContent:'space-evenly' }}>
                    <div>
                        {/* <label htmlFor="pre-build-strategy">Pre Build Strategies</label> */}
                        <ListItem component="div" className="Mui-children">
                            {/* <FormControl fullWidth> */}
                                <Select
                                    labelId="pre-build-strategy-label"
                                    value= ""
                                    onChange={handleStrategyChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Strategy
                                    </MenuItem>
                                    <MenuItem value="strategy1">Pre-build here...</MenuItem>
                                    {/* {strategyNames.map((strategy) => (
                                        <MenuItem key={strategy.id} value={strategy.id}>
                                            {strategy.strategy_name}
                                        </MenuItem>
                                    ))} */}
                                </Select>
                            {/* </FormControl> */}
                        </ListItem>
                    </div>
                    <div>
                        {/* <p>Create</p> */}
                        <Button
                            variant="contained"
                            color="primary"
                            className="create-own-strategy-btn"
                            onClick={handleFormDisplay}
                        >
                            Create Own Strategy
                        </Button>
                    </div>
                    <div>
                        {/* <label htmlFor="my-strategies">My Strategies</label> */}
                        {/* <FormControl fullWidth> */}
                            <Select
                                labelId="my-strategies-label"
                                value={selectedStrategy || ""}
                                onChange={handleStrategyChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Own strategy
                                </MenuItem>
                                {/* <MenuItem value="strategy1">created strategies here</MenuItem> */}
                                {strategyNames.map((strategy) => (
                                    <MenuItem key={strategy.id} value={strategy.id}>
                                        {strategy.strategy_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        {/* </FormControl> */}
                    </div>
                    
                </div>
                <hr className='position-line' />
            </div>
        </section>
    );
};

export default Titlesection;
