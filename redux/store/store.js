
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import rootReducer from '../reducers/rootReducer';

// const rootReducer = {
//     strategy: strategyReducer,
// };

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});


export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
