import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";
import { IzinModel } from "../model/IzinModel";

interface state{
  list: Array<IzinModel>,
  paging: PagingTable,
  editIzin: IzinModel | null,
  deletedIzin: IzinModel | null
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
    editIzin: null,
    deletedIzin: null,
}

export const fetchListIzin = createAsyncThunk(
  'izin/fetchData',
  async (page: number) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    console.log(`${process.env.base_url_api}/izin?page=${page}&pageSize=10`)
    const response = await fetch(`${process.env.base_url_api}/izin?page=${page}&pageSize=10`, requestOptions);
    const json: any = await response.json();

    if (json.status !== 200) {
      throw new Error(json.message ?? "Terjadi masalah pada saat request ke server");
    }

    const izinList = json.list.data.map((item: any) =>
      new IzinModel(item.tanggal_pengajuan, item.tujuan, "Pending", item.id, false)
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

    return { izinList, paging };
  }
);

export const izinlice = createSlice({
  name: "izin",
  initialState,
  reducers: {
    loadList: (state, action: PayloadAction<Array<IzinModel>>) => {
      state.list = action.payload;
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
    builder.addCase(fetchListIzin.fulfilled, (state, action) => {
      state.list = action.payload.izinList;
      state.paging = action.payload.paging;
    });
  },
});
export const { loadList, editIzin, deletedIzin, pagingTable, prev, next } = izinlice.actions;
export const izinselector = (state: RootState) => state.izinReducer;
export default izinlice.reducer;