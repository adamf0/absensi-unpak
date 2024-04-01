import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Absen } from "../model/Absen";

interface state{
  absen: Absen | null,
}
const initialState:state = {
  absen: null,
}

// export const fetchDataAbsent = createAsyncThunk(
//   'absen/fetchData',
//   async (nidn: string) => {
//     const requestOptions = {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     };
//     console.log(`http://localhost:8000/getabsen`)
//     const response = await fetch(`http://localhost:8000/getabsen?nidn=${nidn}`, requestOptions);
//     const json: any = await response.json();

//     if (json.status !== 200) {
//       throw new Error(json.message ?? "Terjadi masalah pada saat request ke server");
//     }

//     const data = new Absen() //json.data
//     return { data };
//   }
// );

export const absenlice = createSlice({
  name: "absen",
  initialState,
  reducers: {
    getAbsent: (state, action: PayloadAction<Absen|null>) => {
      state.absen = action.payload;
    },
    setAbsent: (state, action: PayloadAction<Absen|null>) => {
      state.absen = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchDataAbsent.fulfilled, (state, action) => {
  //     state.absen = action.payload.data;
  //   });
  // },
});
export const {setAbsent,getAbsent} = absenlice.actions;
export const absenselector = (state: RootState) => state.absenReducer;
export default absenlice.reducer;