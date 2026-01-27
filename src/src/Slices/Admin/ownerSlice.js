/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AdminInsightApi,
  CourseApi,
  Coursetrend,
  InstrctorApi,
  UserApi,
  ToptrendingData,
} from "../../services/Admin/adminapi's";

export const fetchDataInsight = createAsyncThunk(
  "Admin/fetchDataInsight",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AdminInsightApi();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const fetchInstructorInsight = createAsyncThunk(
  "Admin/fetchInstructorInsight",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await InstrctorApi(page, limit);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
//fetch the user Insight
export const fetchUserInsight = createAsyncThunk(
  "Admin/fetchUserInsight",
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApi();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
//fetch Course Path
export const fetchCourseInsight = createAsyncThunk(
  "Admin/fetchCourseInsight",
  async (_, { rejectWithValue }) => {
    try {
      const res = await CourseApi();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
//Course Trend Path
export const fetchCourseChartPath = createAsyncThunk(
  "Admin/fetchCourseChart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Coursetrend();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
//Trending Categoires Data
export const fetchcategoriesTrend = createAsyncThunk(
  "Admin/fetchTopCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ToptrendingData();
      return res;
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
    InstructorData: [],
    UserData: [],
    CourseData: [],
    Coursetrend: [],
    TopCategories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin Data Insight
      .addCase(fetchDataInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.Data = action.payload;
      })
      .addCase(fetchDataInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Instructor Insight
      .addCase(fetchInstructorInsight.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.InstructorData = action.payload;
      })
      .addCase(fetchInstructorInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //user Insight Data
      .addCase(fetchUserInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.UserData = action.payload;
      })
      .addCase(fetchUserInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Course Insight Data
      .addCase(fetchCourseInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.CourseData = action.payload;
      })
      .addCase(fetchCourseInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Course Trend Chart is
      .addCase(fetchCourseChartPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseChartPath.fulfilled, (state, action) => {
        state.loading = false;
        state.Coursetrend = action.payload;
      })
      .addCase(fetchCourseChartPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Categoires Trending
      .addCase(fetchcategoriesTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcategoriesTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.TopCategories = action.payload;
      })
      .addCase(fetchcategoriesTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default OwnerSlice.reducer;
