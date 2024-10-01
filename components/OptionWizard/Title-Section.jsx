"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/routes";

const Titlesection = ({ setShowForm, setInitialValues, setStrategyId }) => {
    const [strategyNames, setStrategyName] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState("");

    const handleFormDisplay = () => {
        setShowForm(true);
        setStrategyId(null);
        setInitialValues({
            strategy_name: '',
            index_name: '',
            capital: 100000,
            strategy_type: '',
            order_take_profit_type: '',
            order_stop_loss_type: '',
            positions: [],
            start_time: '',
            days: [],
            exit_time: '',
            take_profit_type: 'none',
            take_profit_value: '',
            stop_loss_value: '',
            stop_loss_type: 'none',
            do_repeat: false,
        });
    };

    const getStrategyList = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST);
            const strategies = data?.map((e) => ({
                id: e.id,
                strategy_name: e.strategy_name,
            }));
            setStrategyName(strategies);
        } catch (error) {
            console.error("Error getting strategy list", error);
        }
    };

    const getSpecificStrategy = async (id) => {
        try {
            const { data } = await axiosInstance.get(`${API_ROUTER.STRATEGY_UPDATE}${id}/`);

            const [start_HH, start_MM] = data.start_time.split(":");
            const [exit_HH, exit_MM] = data.exit_time.split(":");

            const initialValues = {
                strategy_name: data.strategy_name || "",
                index_name: data.index_name || "",
                capital: data.capital || 0,
                strategy_type: data.strategy_type || "",
                order_take_profit_type: data.order_take_profit_type || "",
                order_stop_loss_type: data.order_stop_loss_type || "",
                positions: data.positions.map((position) => ({
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
                entry_HH: start_HH || "",
                entry_MM: start_MM || "",
                days: data.days || [],
                exit_HH: exit_HH || "",
                exit_MM: exit_MM || "",
                take_profit_type: data.take_profit_type || "",
                take_profit_value: data.take_profit_value || "",
                stop_loss_value: data.stop_loss_value || "",
                stop_loss_type: data.stop_loss_type || "none",
                do_repeat: data.do_repeat || false,
            };

            setInitialValues(initialValues);
            setStrategyId(id); 
            setShowForm(true);
        } catch (error) {
            console.error("Error getting specific strategy", error);
        }
    };

    useEffect(() => {
        getStrategyList();
    }, []);

    const handleStrategyChange = (event) => {
        const selectedId = event.target.value;
        setSelectedStrategy(selectedId);
        getSpecificStrategy(selectedId);
    };

    return (
        <section>
            <h1 className="option-wizard">Option Wizard</h1>
            <div className="first-section">
                <div className="dropdown-container">
                    <label htmlFor="pre-build-strategy">Pre Build Strategies</label>
                    <select defaultValue="">
                        <option value="" disabled>
                            Select Strategy
                        </option>
                        <option value="strategy1">pre-build here...</option>
                    </select>
                </div>
                <div>
                    <p>Create</p>
                    <button onClick={handleFormDisplay}>Create Own Strategy</button>
                </div>
                <div className="dropdown-container">
                    <label htmlFor="my-strategies">My Strategies</label>
                    <select value={selectedStrategy} onChange={handleStrategyChange}>
                        <option value="" disabled>
                            Own strategy
                        </option>
                        {strategyNames.map((strategy) => (
                            <option key={strategy.id} value={strategy.id}>
                                {strategy.strategy_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <hr width="70%" />
        </section>
    );
};

export default Titlesection;
