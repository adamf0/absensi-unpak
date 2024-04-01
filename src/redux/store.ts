import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from './cutiSlice';
import absenReducer from './absenSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer,
    absenReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;