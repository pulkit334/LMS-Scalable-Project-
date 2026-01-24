/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminInsights } from "../../services/Admin/adminapi's";
import { fetchEnrolledCourses } from "../EnroilledCourseSlice";
const fetchDataInsight = createAsyncThunk(
  "Admin/Data",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AdminInsights();
      console.log("the data of the admin is ",response)
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const OwnerSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    error: null,
    Data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataInsight.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(fetchDataInsight.fulfilled, (state, action) => {
        ((state.loading = false), (state.Data = action.payload));
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload), (state.Data  = []));
      });
  },
});

export default OwnerSlice.reducer;