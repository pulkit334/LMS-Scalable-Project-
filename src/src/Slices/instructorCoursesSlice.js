import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetInsturctorCourse } from "../services/auth";

// 🔹 async thunk using YOUR API
export const fetchInstructorCourses = createAsyncThunk(
  "instructorCourses/fetch",
  async () => {
    const res = await GetInsturctorCourse();
    console.log("The data is this ", res);
    return res.data; // backend data array
  }
);

const instructorCoursesSlice = createSlice({
  name: "InstructorSlice",
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const {removeCourse}= instructorCoursesSlice.actions;
export default instructorCoursesSlice.reducer;
