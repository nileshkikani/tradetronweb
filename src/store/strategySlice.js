
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allStrategyIds: [],
    selectedStrategyId: '',
};

export const strategySlice = createSlice({
    name: "strategy",
    initialState,
    reducers: {
        setSelectedStrategyId: (state, action) => {
            state.selectedStrategyId = action.payload;
        },
        setAllStrategyIds: (state, action) => {
            state.allStrategyIds = action.payload;
        }
    },
});

export const { setSelectedStrategyId, setAllStrategyIds } = strategySlice.actions;
export default strategySlice.reducer;
