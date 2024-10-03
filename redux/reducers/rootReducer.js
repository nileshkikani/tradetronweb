import { combineReducers } from "@reduxjs/toolkit";
import strategyReducer from "./strategySlice"

const rootReducer = combineReducers({
    strategy: strategyReducer
});

export default rootReducer;