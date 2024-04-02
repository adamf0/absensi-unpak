import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CutiModel } from "../model/CutiModel";
import { RootState } from "./store";
import PagingTable from "../model/PagingTable";
import { JenisCuti } from "../model/JenisCuti";

interface state {
  list_jenis_cuti: Array<JenisCuti>,
  list: Array<CutiModel>,
  paging: PagingTable,
  editCuti: CutiModel | null,
  deletedCuti: CutiModel | null
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
    console.log(`${process.env.base_url_api}/cuti?page=${page}&pageSize=10`)
    const response = await fetch(`${process.env.base_url_api}/cuti?page=${page}&pageSize=10`, requestOptions);
    const json: any = await response.json();

    if (json.status !== 200) {
      throw new Error(json.message ?? "Terjadi masalah pada saat request ke server");
    }

    const cutiList = json.list.data.map((item: any) =>
      new CutiModel(
        item.tanggal_pengajuan,
        item.lama_cuti,
        new JenisCuti(
          item.JenisCuti.id,
          item.JenisCuti.nama,
          item.JenisCuti.min,
          item.JenisCuti.max,
          item.JenisCuti.dokumen,
          item.JenisCuti.kondisi,
        ),
        item.tujuan,
        "Pending",
        item.id,
        false
      )
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

export const fetchListJenisCuti = createAsyncThunk(
  'jenis_cuti/fetchData',
  async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    console.log(`${process.env.base_url_api}/jenis_cuti`)
    const response = await fetch(`${process.env.base_url_api}/jenis_cuti`, requestOptions);
    const json: any = await response.json();

    if (json.status !== 200) {
      throw new Error(json.message ?? "Terjadi masalah pada saat request ke server");
    }

    const listJenisCuti = json.list.map((item: any) =>
      new JenisCuti(
        item.id,
        item.nama,
        item.min,
        item.max,
        item.dokumen,
        item.kondisi,
      )
    );

    return { listJenisCuti };
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
    prev: (state) => {
      state.paging.currentPage -= 1;
    },
    next: (state) => {
      state.paging.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListCuti.fulfilled, (state, action) => {
      state.list = action.payload.cutiList;
      state.paging = action.payload.paging;
    });

    builder.addCase(fetchListJenisCuti.fulfilled, (state, action) => {
      state.list_jenis_cuti = action.payload.listJenisCuti;
    });
  },
});
export const { loadList, editCuti, deletedCuti, pagingTable, prev, next } = cutilice.actions;
export const cutiselector = (state: RootState) => state.cutiReducer;
export default cutilice.reducer;