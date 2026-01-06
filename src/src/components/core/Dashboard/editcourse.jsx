/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Course from "../../../pages/course";
import { getFullCourseDetails } from "../../../services/auth";
import {
  setCourse,
  setEditCourse,
  setCourseId,
  setStep,
} from "../../../Slices/courseSlice";

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  console.log("The Course id is ", courseId);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);

      const result = await getFullCourseDetails(courseId);

      if (result?.courseDetails) {
        dispatch(setEditCourse(true)); // EDIT MODE
        dispatch(setCourseId(courseId)); // STORE ID
        dispatch(setCourse(result.courseDetails)); // STORE FULL COURSE
        dispatch(setStep(1)); // START FROM STEP 1
      }

      setLoading(false);
    };

    populateCourseDetails();
  }, [courseId, dispatch]);

  if (loading) {
    return <>Loading......</>;
  }

  return (
    <>
      <h1>Edit Course</h1>
      <div>{course ? <Course /> : <p>Course Not Found</p>}</div>
    </>
  );
}
