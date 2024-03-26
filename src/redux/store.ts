import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from './cutiSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;