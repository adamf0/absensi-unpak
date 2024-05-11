import { configureStore } from '@reduxjs/toolkit';
import cutiReducer from '@/module/redux/cutiSlice';
import absenReducer from '@/module/redux/absenSlice';
import izinReducer from '@/module/redux/izinSlice';
import penggunaReducer from '@/module/redux/penggunaSlice';
import jenisCutiReducer from '@/module/redux/jenisCutiSlice';
import jenisIzinReducer from '@/module/redux/jenisIzinSlice';
import claimAbsenReducer from '@/module/redux/claimAbsenSlice';
import masterCalendarReducer from '@/module/redux/masterCalendarSlice';

export const storeRoot = configureStore({
  reducer: {
    cutiReducer,
    absenReducer,
    izinReducer,
    claimAbsenReducer,
    penggunaReducer,
    jenisCutiReducer,
    jenisIzinReducer,
    masterCalendarReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export type AppDispatch = typeof storeRoot.dispatch;
export type RootState = ReturnType<typeof storeRoot.getState>;