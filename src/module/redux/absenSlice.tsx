import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/module/redux/store";
import { AbsenModel } from "@/module/model/AbsenModel";

interface state{
  absen: AbsenModel | null,
}
const initialState:state = {
  absen: null,
}

export const absenlice = createSlice({
  name: "absen",
  initialState,
  reducers: {
    getAbsent: (state, action: PayloadAction<AbsenModel|null>) => {
      state.absen = action.payload;
    },
    setAbsent: (state, action: PayloadAction<AbsenModel|null>) => {
      state.absen = action.payload;
    },
    setOutAbsent: (state, action: PayloadAction<string>) => {
      if (state.absen !== null) {
        state.absen.absen_keluar = action.payload;
      }
    },
  },
});
export const {setAbsent,setOutAbsent,getAbsent} = absenlice.actions;
export const absenselector = (state: RootState) => state.absenReducer;
export default absenlice.reducer;