import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // auth / profile
  loading: false,
  ready: false,
  // categories
  categories: [],
  status: "idle",
  error: null,
  lastFetched: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // ---------- USER ----------
    setUser(state, action) {
      state.user = action.payload;
      state.ready = true;
    },

    setloading(state, action) {
      state.loading = action.payload;
    },

    // ---------- CATEGORIES ----------
    setCategories(state, action) {
      state.categories = action.payload;
      state.status = "succeeded";
      state.lastFetched = Date.now();
      state.error = null;
    },

    setCategoryLoading(state) {
      state.status = "loading";
    },

    setCategoryError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

    invalidateCategories(state) {
      state.status = "idle";
    },
    clearUser(state) {
      state.user = null;
      state.ready = false;
    },
  },
});

export const {
  setUser,
  setloading,
  clearUser,
  setCategories,
  setCategoryLoading,
  setCategoryError,
  invalidateCategories,
} = profileSlice.actions;

export default profileSlice.reducer;
