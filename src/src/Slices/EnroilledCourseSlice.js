import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserEnrolledCourses } from "../services/operations/Profileapi";

export const fetchEnrolledCourses = createAsyncThunk(
  "enrollment/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserEnrolledCourses();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState: {
    enrolledCourses: null,
    enrolledCourseIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // pending
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false; // 🔥 FIX
        state.enrolledCourses = action.payload;
        state.enrolledCourseIds = action.payload.map(
          (course) => course._id
        );
      })

      // rejected
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false; //  FIX
        state.enrolledCourses = [];
        state.error = action.payload; //  FIX
      });
  },
});

export default enrollmentSlice.reducer;
