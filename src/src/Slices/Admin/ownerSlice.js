/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AdminInsightApi,
  CourseApi,
  Coursetrend,
  InstrctorApi,
  UserApi,
  ToptrendingData,
  StatusPath,
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
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
const res = await InstrctorApi(page, limit, search);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
//fetch the user Insight
export const fetchUserInsight = createAsyncThunk(
  "Admin/fetchUserInsight",
  async ({ page = 1, limit = 5, search }, { rejectWithValue }) => {
    try {
      const res = await UserApi(page, limit, search);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

//fetch Course Path
export const fetchCourseInsight = createAsyncThunk(
  "Admin/fetchCourseInsight",
  async ({ page, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await CourseApi(page, limit);
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

export const fetchUserState = createAsyncThunk(
  "Admin/InstructorStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await StatusPath({ id, status });
return res?.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const OwnerSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    actionLoadingId: null,
    error: null,
    Data: [],
    InstructorData: [],
    UserData: [],
    CourseData: [],
    Coursetrend: [],
    TopCategories: [],
    InstructorState: [],
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
      })
      //Instrcutor State
      .addCase(fetchUserState.pending, (state, action) => {
        ((state.actionLoadingId = action.meta.arg.id), (state.error = null));
      })
      .addCase(fetchUserState.fulfilled, (state, action) => {
        const updated = action.payload; // one instructor

        const list = state.InstructorData?.data?.instructors;
        if (!Array.isArray(list)) return;

        const idx = list.findIndex((i) => i._id === updated._id);
        if (idx !== -1) {
          list[idx].status = updated.status;
        }
     state.actionLoadingId = null;
      })

      .addCase(fetchUserState.rejected, (state, action) => {
         state.actionLoadingId = null;
        state.error = action.payload;
      });
  },
});

export default OwnerSlice.reducer;
