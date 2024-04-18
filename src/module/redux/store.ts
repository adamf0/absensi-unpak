import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from './cutiSlice';
import absenReducer from './absenSlice';
import izinReducer from './izinSlice';
import penggunaReducer from './penggunaSlice';
import jenisCutiReducer from './jenisCutiSlice';
import jenisIzinReducer from './jenisIzinSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer,
    absenReducer,
    izinReducer,
    penggunaReducer,
    jenisCutiReducer,
    jenisIzinReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;