import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from '@/module/redux/cutiSlice';
import absenReducer from '@/module/redux/absenSlice';
import izinReducer from '@/module/redux/izinSlice';
import penggunaReducer from '@/module/redux/penggunaSlice';
import jenisCutiReducer from '@/module/redux/jenisCutiSlice';
import jenisIzinReducer from '@/module/redux/jenisIzinSlice';

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