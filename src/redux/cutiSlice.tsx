import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CutiModel } from "../model/CutiModel";
import { RootState } from "./store";

interface state{
  list: Array<CutiModel>,
  edit: CutiModel | null
}
const initialState:state = {
    list: [],
    edit: null
}

export const cutilice = createSlice({
  name: "cuti",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<CutiModel>>) => {
      state.list = action.payload;
    },
    edit: (state, action: PayloadAction<CutiModel>) => {
      state.edit = action.payload;
    },
  },
});
export const { loadList, edit } = cutilice.actions;
export const cutiselector = (state: RootState) => state.cutiReducer;
export default cutilice.reducer;