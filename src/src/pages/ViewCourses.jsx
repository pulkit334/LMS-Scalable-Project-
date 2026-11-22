/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getFullCourseDetails } from "../services/auth";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../Slices/ViewCourseSlics";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VedioDEtailsSIdebar from "../components/core/ViewCourse/VedioDEtailsSIdebar";

const ViewCourses = () => {
  const [reviewModal, setReviewModal] = useState(false);

  const { courseId, sectionId, subSectionId } = useParams();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        const CourseData = await getFullCourseDetails(courseId);
        dispatch(setCourseSectionData(CourseData?.courseDetails?.courseContent || []));
        dispatch(setEntireCourseData(CourseData?.courseDetails || {}));
        dispatch(setCompletedLectures(CourseData?.completedVideos || []));
        let lecture = 0;
        CourseData?.courseDetails?.courseContent?.forEach((sec) => {
          lecture += sec.subsection?.length || 0;
        });
        dispatch(setTotalNoOfLectures(lecture));
      } catch (error) {
        console.error("Failed to fetch full course details:", error);
      }
    };
    if (courseId) setCourseSpecificDetails();
  }, [courseId, dispatch, token]);

  useEffect(() => {
    if (!courseSectionData?.length) return;
    if (!location.pathname.startsWith("/view-course")) return;

    const matchedSec = courseSectionData.find((sec) => sec._id === sectionId);
    const hasValidSection = Boolean(matchedSec && sectionId !== "[object Object]");
    const targetSec = hasValidSection
      ? matchedSec
      : courseSectionData.find((sec) => sec.subsection?.length > 0) || courseSectionData[0];

    if (!targetSec) return;

    const hasValidSub =
      subSectionId &&
      targetSec.subsection?.some((sub) => String(sub._id) === String(subSectionId));

    if (!hasValidSection || !hasValidSub) {
      const firstSub = targetSec.subsection?.[0];
      if (firstSub?._id) {
        navigate(
          `/view-course/${courseId}/section/${targetSec._id}/sub-section/${firstSub._id}`,
          { replace: true }
        );
      }
    }
  }, [courseSectionData, subSectionId, sectionId, courseId, navigate, location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-[#020617] text-white overflow-x-hidden">
      {/* Left Sidebar */}
      <VedioDEtailsSIdebar setReviewModal={setReviewModal} />

      {/* Video Player & Content Column */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
};

export default ViewCourses;
