import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface auth{
  nidn: string | null,
}
const initialState:auth = {
  nidn: null,
}

export const authlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAuth: (state) => {
      state.nidn = localStorage.getItem('authData');
    },
    setAuth: (state, action: PayloadAction<string>) => {
      localStorage.setItem('authData', action.payload);
      state.nidn = action.payload;
    },
    clearAuth: (state) => {
      localStorage.clear();
      state.nidn = null;
    },
  }
});
export const {getAuth, setAuth, clearAuth} = authlice.actions;
export const authselector = (state: RootState) => state.authReducer;
export default authlice.reducer;