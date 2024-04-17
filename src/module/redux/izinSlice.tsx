import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";
import { IzinModel } from "../model/IzinModel";
import { JenisIzin } from "../model/JenisIzin";

interface state{
  list_jenis_izin: Array<JenisIzin>,
  list: Array<IzinModel>,
  paging: PagingTable,
  editIzin: IzinModel | null,
  deletedIzin: IzinModel | null
}
const initialState:state = {
    list_jenis_izin: [],
    list: [],
    paging: {
      totalData:0,
      totalPage:10,
      currentPage:1,
      start:0,
      end:0,
      prevPage:null,
      nextPage:null,
    },
    editIzin: null,
    deletedIzin: null,
}

export const izinlice = createSlice({
  name: "izin",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<IzinModel>>) => {
      state.list = action.payload;
    },
    loadListJenisIzin: (state, action: PayloadAction<Array<JenisIzin>>) => {
      state.list_jenis_izin = action.payload;
    },
    editIzin: (state, action: PayloadAction<IzinModel>) => {
      state.editIzin = action.payload;
    },
    deletedIzin: (state, action: PayloadAction<IzinModel>) => {
      state.deletedIzin = action.payload;
    },
    pagingTable: (state, action: PayloadAction<PagingTable>) => {
      state.paging = action.payload;
    },
    prev: (state) => {
      state.paging.currentPage -= 1;
    },
    next: (state) => {
      state.paging.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    
  },
});
export const { loadList, loadListJenisIzin, editIzin, deletedIzin, pagingTable, prev, next } = izinlice.actions;
export const izinselector = (state: RootState) => state.izinReducer;
export default izinlice.reducer;