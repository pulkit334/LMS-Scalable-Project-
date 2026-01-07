/* eslint-disable no-unused-vars */

import { COURSE_STATUS } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import Confirmation from "../common/confirmmation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CourseDelete } from "../../../services/auth";
import { useDispatch } from "react-redux";
import { removeCourse } from "../../../Slices/instructorCoursesSlice";
import Course from "./Dashb_Insturctor_modal/Course";
import Empty from "./Dashb_Insturctor_modal/empty"
const MyCourses = ({ courses = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ONFIRM DELETE HANDLER
  const handleConfirmDelete = async () => {
    if (!courseToDelete || isProcessing) return;

    setIsProcessing(true);
    const toastId = toast.loading("Deleting course...");

    try {
      await CourseDelete(courseToDelete._id);
      dispatch(removeCourse(courseToDelete._id));

      toast.success("Course deleted successfully", { id: toastId });

      setConfirmationOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      toast.error("Failed to delete course", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

return (
  <>
    {courses.length > 0 ? (
      <Course
        courses={courses}
        COURSE_STATUS={COURSE_STATUS}
        isProcessing={isProcessing}
        setConfirmationOpen={setConfirmationOpen}
        setCourseToDelete={setCourseToDelete}
        handleConfirmDelete={handleConfirmDelete}
        confirmationOpen={confirmationOpen}
      />
    ) : (
      <Empty navigate={navigate} />
    )}
  </>
);
};

export default MyCourses;
