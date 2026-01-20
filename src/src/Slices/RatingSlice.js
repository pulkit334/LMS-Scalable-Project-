/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/apiconnnector";
import { getRating, MyLectureReview } from "../services/operations/Rating";

export const fetchHomeReviews = createAsyncThunk(
  "home/fetchHomeReviews",
  async (_, { rejectWithValue }) => {
    try {
      const   response = await getRating();
      console.log("the Revivew after fetch is ", response);
      return response?.data;
    } catch (Error) {
      return rejectWithValue(Error?.response || Error);
    }
  },
);

export const fetchCourseReviews = createAsyncThunk(
  "Course/fetchCourseReviews",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await MyLectureReview(courseId);
      console.log("The data is ", response);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response || error);
    }
  },
);
const RatingSlice = createSlice({
  name: "ratingSlice",
  initialState: {
    reviews: [],
    reviewsByCourse: {},
    courseLoadingById: {},
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeReviews.fulfilled, (state, action) => {
        ((state.loading = false), (state.reviews = action.payload));
      })
      .addCase(fetchHomeReviews.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload));
      });

    builder
      .addCase(fetchCourseReviews.pending, (state, action) => {
        const courseId = action.meta.arg;
        state.courseLoadingById[courseId] = true;
      })
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        const courseId = action.meta.arg;
        state.courseLoadingById[courseId] = false;
        state.reviewsByCourse[courseId] = action.payload;
      })
      .addCase(fetchCourseReviews.rejected, (state, action) => {
        //argument that was send Before. redux Stores it Internally
        const courseId = action.meta.arg;
        state.courseLoadingById[courseId] = false;
        state.error = action.payload;
      });
  },
});
export default RatingSlice.reducer;
