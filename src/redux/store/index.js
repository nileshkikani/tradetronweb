import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from '../reducers/rootReducer';
// import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});


export const persistor = persistStore(store);

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();
