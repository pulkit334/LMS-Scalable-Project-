import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authslice";
import profileReducer from "../Slices/profile";
import cartReducer from "../Slices/cartSlice";
import InstuctorReducer from "../Slices/instructorCoursesSlice";
import CourseReducer from "../Slices/courseSlice"
import EnrolledReducer from "../Slices/EnroilledCourseSlice"
import CourseReducerSlice from "../Slices/ViewCourseSlics"
const rootReducers = combineReducers({
  auth: authReducer,
  profile: profileReducer, //
  cart: cartReducer,
  instructorCourses: InstuctorReducer,
    course: CourseReducer,
    enrollment : EnrolledReducer,
    viewCourse : CourseReducerSlice
});

export default rootReducers;
