import MyCourses from "../components/core/Dashboard/InstructorCourse";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorCourses } from "../Slices/instructorCoursesSlice";

const MyCoursesPage = () => {
    console.log("🚨 MyCoursesPage FILE LOADED");

  const dispatch = useDispatch();
  const { courses } = useSelector(
    (state) => state.instructorCourses
  );

  useEffect(() => {
    dispatch(fetchInstructorCourses());
  }, [dispatch]);
console.log("The data is",courses)
  return (
    <MyCourses
      courses={courses}
      onAdd={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  );
};

export default MyCoursesPage;
