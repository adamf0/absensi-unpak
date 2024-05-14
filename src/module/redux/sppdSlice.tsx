import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/module/redux/store";
import PagingTable from "@/module/model/PagingTable";
import { SPPDModel } from "@/module/model/SPPDModel";
import { JenisSPPDModel } from "@/module/model/JenisSPPDModel";

interface state {
  list_jenis_sppd: Array<JenisSPPDModel>,
  list: Array<SPPDModel>,
  paging: PagingTable,
  editSppd: SPPDModel | null,
  deletedSppd: SPPDModel | null,
}
const initialState: state = {
  list_jenis_sppd: [],
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
  editSppd: null,
  deletedSppd: null,
}

export const sppdlice = createSlice({
  name: "sppd",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<SPPDModel>>) => {
      state.list = action.payload;
    },
    loadListJenisSPPD: (state, action: PayloadAction<Array<JenisSPPDModel>>) => {
      state.list_jenis_sppd = action.payload;
    },
    editSppd: (state, action: PayloadAction<SPPDModel>) => {
      state.editSppd = action.payload;
    },
    deletedSppd: (state, action: PayloadAction<SPPDModel>) => {
      state.deletedSppd = action.payload;
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
export const { loadList, loadListJenisSPPD, editSppd, deletedSppd, pagingTable, prev, next } = sppdlice.actions;
export const sppdselector = (state: RootState) => state.sppdReducer;
export default sppdlice.reducer;