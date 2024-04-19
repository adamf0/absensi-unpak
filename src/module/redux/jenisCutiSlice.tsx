import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JenisCutiModel } from "../model/JenisCutiModel";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";

interface state {
  list: Array<JenisCutiModel>,
  paging: PagingTable,
  editJenisCuti: JenisCutiModel | null,
  deletedJenisCuti: JenisCutiModel | null,
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
  editJenisCuti: null,
  deletedJenisCuti: null,
}

export const jeniscutilice = createSlice({
  name: "jeniscuti",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<JenisCutiModel>>) => {
      state.list = action.payload;
    },
    editJenisCuti: (state, action: PayloadAction<JenisCutiModel>) => {
      state.editJenisCuti = action.payload;
    },
    deletedJenisCuti: (state, action: PayloadAction<JenisCutiModel>) => {
      state.deletedJenisCuti = action.payload;
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
export const { loadList, editJenisCuti, deletedJenisCuti, pagingTable, prev, next } = jeniscutilice.actions;
export const jeniscutiselector = (state: RootState) => state.jenisCutiReducer;
export default jeniscutilice.reducer;