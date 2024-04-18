import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JenisIzinModel } from "../model/JenisIzinModel";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";

interface state {
  list: Array<JenisIzinModel>,
  paging: PagingTable,
  editJenisIzin: JenisIzinModel | null,
  deletedJenisIzin: JenisIzinModel | null,
}
const initialState: state = {
  list: [],
  paging: {
    totalData: 0,
    totalPage: 10,
    currentPage: 1,
    start: 0,
    end: 0,
    prevPage: null,
    nextPage: null,
    pageSize: 10
  },
  editJenisIzin: null,
  deletedJenisIzin: null,
}

export const jenisizinlice = createSlice({
  name: "jenisizin",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<JenisIzinModel>>) => {
      state.list = action.payload;
    },
    editJenisIzin: (state, action: PayloadAction<JenisIzinModel>) => {
      state.editJenisIzin = action.payload;
    },
    deletedJenisIzin: (state, action: PayloadAction<JenisIzinModel>) => {
      state.deletedJenisIzin = action.payload;
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
export const { loadList, editJenisIzin, deletedJenisIzin, pagingTable, prev, next } = jenisizinlice.actions;
export const jenisizinselector = (state: RootState) => state.jenisIzinReducer;
export default jenisizinlice.reducer;