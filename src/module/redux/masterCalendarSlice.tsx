import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MasterCalendarModel } from "@/module/model/MasterCalendarModel";
import { RootState } from "@/module/redux/store";
import PagingTable from "@/module/model/PagingTable";

interface state {
  list: Array<MasterCalendarModel>,
  paging: PagingTable,
  editMasterCalendar: MasterCalendarModel | null,
  deletedMasterCalendar: MasterCalendarModel | null,
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
  editMasterCalendar: null,
  deletedMasterCalendar: null,
}

export const masterCalendarlice = createSlice({
  name: "masterCalendar",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<MasterCalendarModel>>) => {
      state.list = action.payload;
    },
    editMasterCalendar: (state, action: PayloadAction<MasterCalendarModel>) => {
      state.editMasterCalendar = action.payload;
    },
    deletedMasterCalendar: (state, action: PayloadAction<MasterCalendarModel>) => {
      state.deletedMasterCalendar = action.payload;
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
export const { loadList, editMasterCalendar, deletedMasterCalendar, pagingTable, prev, next } = masterCalendarlice.actions;
export const jenisizinselector = (state: RootState) => state.masterCalendarReducer;
export default masterCalendarlice.reducer;