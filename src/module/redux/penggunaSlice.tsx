import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";
import { PenggunaModel } from "../model/PenggunaModel";

interface state {
  list: Array<PenggunaModel>,
  paging: PagingTable,
  editPengguna: PenggunaModel | null,
  deletedPengguna: PenggunaModel | null,
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
  editPengguna: null,
  deletedPengguna: null,
}

export const penggunaslice = createSlice({
  name: "pengguna",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<PenggunaModel>>) => {
      state.list = action.payload;
    },
    editPengguna: (state, action: PayloadAction<PenggunaModel>) => {
      state.editPengguna = action.payload;
    },
    deletedPengguna: (state, action: PayloadAction<PenggunaModel>) => {
      state.deletedPengguna = action.payload;
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
});
export const { loadList, editPengguna, deletedPengguna, pagingTable, prev, next } = penggunaslice.actions;
export const penggunaselector = (state: RootState) => state.penggunaReducer;
export default penggunaslice.reducer;