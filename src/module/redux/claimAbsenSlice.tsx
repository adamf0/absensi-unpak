import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClaimAbsenModel } from "@/module/model/ClaimAbsenModel";
import { RootState } from "@/module/redux/store";
import PagingTable from "@/module/model/PagingTable";
import { AbsenModel } from "../model/AbsenModel";

interface state {
  list_absen: Array<AbsenModel>,
  list: Array<ClaimAbsenModel>,
  paging: PagingTable,
  editClaimAbsen: ClaimAbsenModel | null,
  deletedClaimAbsen: ClaimAbsenModel | null,
}
const initialState: state = {
  list_absen: [],
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
  editClaimAbsen: null,
  deletedClaimAbsen: null,
}

export const claimAbsenlice = createSlice({
  name: "claimAbsen",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<ClaimAbsenModel>>) => {
      state.list = action.payload;
    },
    loadListAbsen: (state, action: PayloadAction<Array<AbsenModel>>) => {
      state.list_absen = action.payload;
    },
    editClaimAbsen: (state, action: PayloadAction<ClaimAbsenModel>) => {
      state.editClaimAbsen = action.payload;
    },
    deletedClaimAbsen: (state, action: PayloadAction<ClaimAbsenModel>) => {
      state.deletedClaimAbsen = action.payload;
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
export const { loadList, loadListAbsen, editClaimAbsen, deletedClaimAbsen, pagingTable, prev, next } = claimAbsenlice.actions;
export const claimAbsenselector = (state: RootState) => state.claimAbsenReducer;
export default claimAbsenlice.reducer;