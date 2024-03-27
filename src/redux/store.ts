import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from './cutiSlice';
import absenReducer from './absenSlice';
import authReducer from './authSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer,
    absenReducer,
    authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;