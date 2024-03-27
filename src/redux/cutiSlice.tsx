import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CutiModel } from "../model/CutiModel";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";

interface state{
  list: Array<CutiModel>,
  paging: PagingTable,
  editCuti: CutiModel | null,
  deletedCuti: CutiModel | null
}
const initialState:state = {
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
    editCuti: null,
    deletedCuti: null,
}

export const fetchListCuti = createAsyncThunk(
  'cuti/fetchData',
  async (page: number) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    console.log(`http://localhost:8000/cuti?page=${page}&pageSize=10`)
    const response = await fetch(`http://localhost:8000/cuti?page=${page}&pageSize=10`, requestOptions);
    const json: any = await response.json();

    if (json.status !== 200) {
      throw new Error(json.message ?? "Terjadi masalah pada saat request ke server");
    }

    const cutiList = json.list.data.map((item: any) =>
      new CutiModel(item.tanggal_pengajuan, item.lama_cuti, item.jenis_cuti, item.tujuan, "Pending", item.id, false)
    );

    const paging: PagingTable = {
      totalData: json.list.totalData,
      totalPage: json.list.totalPage,
      currentPage: json.list.currentPage,
      start: json.list.startIndex || 1,
      end: json.list.endIndex,
      prevPage: json.list.prevPage,
      nextPage: json.list.nextPage,
    };

    return { cutiList, paging };
  }
);

export const cutilice = createSlice({
  name: "cuti",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<CutiModel>>) => {
      state.list = action.payload;
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
    prev: (state, action: PayloadAction<void>) => {
      state.paging.currentPage -= 1;
    },
    next: (state, action: PayloadAction<void>) => {
      state.paging.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListCuti.fulfilled, (state, action) => {
      state.list = action.payload.cutiList;
      state.paging = action.payload.paging;
    });
  },
});
export const { loadList, editCuti, deletedCuti, pagingTable, prev, next } = cutilice.actions;
export const cutiselector = (state: RootState) => state.cutiReducer;
export default cutilice.reducer;