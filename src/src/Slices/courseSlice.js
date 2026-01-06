// redux/slices/courseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  courseId: null,
  sections: [],
  viewLecture: null,
  isPublic: false,
   course: null,        // ADD
  isEdit: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
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
});

export const {
  setStep,
  setCourseId,
  setSections,
  resetCourse,
  setViewLecture,
  setIsPublic,
  setCourse,
  setEditCourse
} = courseSlice.actions;

export default courseSlice.reducer;
