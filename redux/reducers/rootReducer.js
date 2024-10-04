import { combineReducers } from "@reduxjs/toolkit";
import strategyReducer from "./strategySlice"
import { authReducer } from "./authSlice";

const rootReducer = combineReducers({
    strategy: strategyReducer,
    auth:authReducer
});

export default rootReducer;