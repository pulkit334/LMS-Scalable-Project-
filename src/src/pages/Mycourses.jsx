import MyCourses from "../components/core/Dashboard/InstructorCourse";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorCourses } from "../Slices/instructorCoursesSlice";

const MyCoursesPage = () => {
const dispatch = useDispatch();
  const { courses } = useSelector(
    (state) => state.instructorCourses
  );
}, [dispatch]);
};

export default MyCoursesPage;
