import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryResponse } from "../services/auth";

const initialState = {
  step: 1,
  courseId: null,
  sections: [],
  viewLecture: null,
  isPublic: false,
  course: null, // ADD
  isEdit: false,
  isPaymentLoading: false,
  categorydata: [],
  loading: false,
  error: null,
};
export const CoursecategoryData = createAsyncThunk(
  "Admin/fetchCourseCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await CategoryResponse();
return res?.AllCategory;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.isPaymentLoading = action.payload;
    },

    setCourse: (state, action) => {
      state.course = action.payload;
      state.sections = action.payload?.courseContent || [];
    },
    setIsPublic(state, action) {
      state.isPublic = action.payload;
    },
    setCourseId: (state, action) => {
      state.courseId = action.payload;
    },

    setSections: (state, action) => {
      state.sections = action.payload;
    },
    setViewLecture: (state, action) => {
      state.viewLecture = action.payload;
    },
    setEditCourse: (state, action) => {
      state.isEdit = action.payload;
    },
    resetCourse: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(CoursecategoryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(CoursecategoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.categorydata = action.payload;
      })
      .addCase(CoursecategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setStep,
  setCourseId,
  setSections,
  resetCourse,
  setViewLecture,
  setIsPublic,
  setCourse,
  setEditCourse,
  setPaymentLoading,
} = courseSlice.actions;

export default courseSlice.reducer;
