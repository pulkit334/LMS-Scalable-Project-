import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InstructorCourse } from "./Profileapi"

//  Thunk
export const fetchInstructorData= createAsyncThunk(
  "instructor/fetchInstructorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await InstructorCourse(); 
      // res should be array OR res.data
      return res;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch instructor courses"
      );
    }
  }
);

const InstructorSlice = createSlice({
  name: "instructor",
  initialState: {
    courseData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorData.fulfilled, (state, action) => {
        state.loading = false;
        state.courseData = action.payload; // store courses
      })
      .addCase(fetchInstructorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default InstructorSlice.reducer;
