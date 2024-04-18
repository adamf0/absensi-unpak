import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from './cutiSlice';
import absenReducer from './absenSlice';
import izinReducer from './izinSlice';
import penggunaReducer from './penggunaSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer,
    absenReducer,
    izinReducer,
    penggunaReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;