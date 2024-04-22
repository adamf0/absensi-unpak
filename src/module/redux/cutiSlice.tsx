import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CutiModel } from "@/module/model/CutiModel";
import { RootState } from "@/module/redux/store";
import PagingTable from "@/module/model/PagingTable";
import { JenisCutiModel } from "@/module/model/JenisCutiModel";

interface state {
  list_jenis_cuti: Array<JenisCutiModel>,
  list: Array<CutiModel>,
  paging: PagingTable,
  editCuti: CutiModel | null,
  deletedCuti: CutiModel | null,
}
const initialState: state = {
  list_jenis_cuti: [],
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
  editCuti: null,
  deletedCuti: null,
}

export const cutilice = createSlice({
  name: "cuti",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<CutiModel>>) => {
      state.list = action.payload;
    },
    loadListJenisCuti: (state, action: PayloadAction<Array<JenisCutiModel>>) => {
      state.list_jenis_cuti = action.payload;
    },
    editCuti: (state, action: PayloadAction<CutiModel>) => {
      state.editCuti = action.payload;
    },
    deletedCuti: (state, action: PayloadAction<CutiModel>) => {
      state.deletedCuti = action.payload;
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
export const { loadList, loadListJenisCuti, editCuti, deletedCuti, pagingTable, prev, next } = cutilice.actions;
export const cutiselector = (state: RootState) => state.cutiReducer;
export default cutilice.reducer;