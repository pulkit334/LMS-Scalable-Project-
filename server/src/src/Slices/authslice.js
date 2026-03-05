import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  sinupData: null, //  KEEP SAME NAME
  token:  null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },

    setloading(state, action) {
      state.loading = action.payload; 
    },

    //  ADD THIS (IMPORTANT)
    setSinupData(state, action) {
      state.sinupData = action.payload;
    },

    //  OPTIONAL BUT SAFE
    clearSinupData(state) {
      state.sinupData = null;
    },

    logout(state) {
      state.token = null;
      state.sinupData = null;
        localStorage.removeItem("token");
    },
  },
});

export const { setToken, setloading, setSinupData, clearSinupData, logout } =
  authSlice.actions;

export default authSlice.reducer;
