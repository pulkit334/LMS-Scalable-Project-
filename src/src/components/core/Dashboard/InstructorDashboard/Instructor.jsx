/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorData } from "../../../../services/operations/insturctor";
import { fetchInstructorCourses } from "../../../../Slices/instructorCoursesSlice";
import Result from "../../../../utils/Spinnre";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { loading, courseData } = useSelector((state) => state.instructor);
  const { courses } = useSelector((state) => state.instructorCourses);

  useEffect(() => {
    dispatch(fetchInstructorData());
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  const totalAmount =
    (courseData ?? []).reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0) ||
    0;

  const totalStudents =
    (courseData ?? []).reduce(
      (acc, curr) => acc + (curr?.totalStudentEnrolled || 0),
      0
    ) || 0;
};

export default Instructor;
