import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserEnrolledCourses } from "../services/operations/Profileapi";

export const fetchEnrolledCourses = createAsyncThunk(
  "enrollment/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserEnrolledCourses();
      console.log("the repsonse Of Enrolled Couress are",response)
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
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false; 
        state.enrolledCourses = action.payload;
        state.enrolledCourseIds = action.payload.map(
          (course) => course._id
        );
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false; 
        state.enrolledCourses = [];
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;
