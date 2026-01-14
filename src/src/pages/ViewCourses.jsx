/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullCourseDetails } from "../services/auth";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../Slices/ViewCourseSlics";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VedioDEtailsSIdebar from "../components/core/ViewCourse/VedioDEtailsSIdebar";
import {  useNavigate } from "react-router-dom"; 

const ViewCourses = () => {
  const [reviewModal, setReviewModal] = useState(false);
  
  const { courseId,sectionId, subSectionId } = useParams();


  const { token } = useSelector((state) => state.auth);
  const { courseSectionData } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        console.log("the Coures Id is", courseId);
        const CourseData = await getFullCourseDetails(courseId);
        dispatch(setCourseSectionData(CourseData?.courseDetails.courseContent));
        dispatch(setEntireCourseData(CourseData?.courseDetails));
        dispatch(setCompletedLectures(CourseData?.completedVideos));
        let lecture = 0;
        CourseData?.courseDetails?.courseContent?.forEach((sec) => {
          lecture += sec.subsection.length;
        });
        dispatch(setTotalNoOfLectures(lecture));
      } catch (error) {
        console.log("'the error is ", error);
      }
    };
    setCourseSpecificDetails();
  }, [courseId, dispatch, token]);
useEffect(() => {
  if ((!subSectionId) && courseSectionData?.length > 0) {
    const section = courseSectionData.find(
      (sec) => sec._id === sectionId
    );

    if (!section || !section.subsection?.length) return;
 if (!location.pathname.startsWith("/view-course")) return;
    navigate(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${section.subsection[0]._id}`,
      { replace: true }
    );
  }
}, [courseSectionData, subSectionId, sectionId, courseId, navigate]);



return (
  <div className="flex h-screen bg-[#161D29] text-white">
    
    {/* Left Side Bar  */}
    <VedioDEtailsSIdebar setReviewModal={setReviewModal} />

    {/* My vedio Column */}
    <div className="w-full">
      <Outlet />
    </div>

   

    {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
  </div>
);

};

export default ViewCourses;
