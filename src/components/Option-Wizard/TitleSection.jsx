"use client";

import React, { useEffect } from "react";
// import axiosInstance from "@/utils/axios"; // Uncomment as needed
// import { API_ROUTER } from "@/services/routes"; // Uncomment as needed
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

const Titlesection = ({ setShowForm, setInitialValues, getStrategyList, strategyNames, setSelectedStrategy, selectedStrategy }) => {

    // const dispatch = useAppDispatch();
    // const authState = useAppSelector((state) => state.auth.authState);

    const handleFormDisplay = () => {
        setShowForm(true);
    };

    // const getSpecificStrategy = async (id) => {
    //     // Your existing code here
    // };

    // useEffect(() => {
    //     getStrategyList();
    // }, [getStrategyList]);

    const handleStrategyChange = (event) => {
        const selectedId = event.target.value;
        setSelectedStrategy(selectedId);
        // getSpecificStrategy(selectedId); // Uncomment as needed
    };

    return (
        <section>
            <div className="first-section">
                <div className="dropdown-container" style={{ display: 'flex', alignItems: 'center', gap: '16px',justifyContent:'space-evenly' }}>
                    <div>
                        <label htmlFor="pre-build-strategy">Pre Build Strategies</label>
                        <ListItem component="div" className="Mui-children">
                            {/* <FormControl fullWidth> */}
                                <Select
                                    labelId="pre-build-strategy-label"
                                    value={selectedStrategy || ""}
                                    onChange={handleStrategyChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Strategy
                                    </MenuItem>
                                    <MenuItem value="strategy1">Pre-build here...</MenuItem>
                                    {/* You can map over your strategyNames here */}
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
                        <label htmlFor="my-strategies">My Strategies</label>
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
                                <MenuItem value="strategy1">created strategies here</MenuItem>
                                {/* {strategyNames.map((strategy) => (
                                    <MenuItem key={strategy.id} value={strategy.id}>
                                        {strategy.strategy_name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                        {/* </FormControl> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Titlesection;
