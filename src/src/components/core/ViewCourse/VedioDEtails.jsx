/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CompleteLectureMarker } from "../../../services/auth";
import { updateCompletedLectures } from "../../../Slices/ViewCourseSlics";
import { fetchEnrolledCourses } from "../../../Slices/EnroilledCourseSlice";

const VedioDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef(null);

  const { courseSectionData, completedLectures = [] } = useSelector(
    (state) => state.viewCourse
  );

  console.log("the courseSeciton is ", completedLectures);
  const { token } = useSelector((state) => state.auth);
  const [videoActive, setVideoActive] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ===============================
     FIND CURRENT VIDEO
     =============================== */
  let currentSub = null;

  courseSectionData?.forEach((sec) => {
    sec?.subsection?.forEach((sub) => {
      if (sub._id === subSectionId) currentSub = sub;
    });
  });

  if (!currentSub) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Video not found
      </div>
    );
  }

  const sectionIndex = courseSectionData.findIndex(
    (sec) => sec._id === sectionId
  );

  const subIndex = courseSectionData?.[sectionIndex]?.subsection.findIndex(
    (sub) => sub._id === subSectionId
  );

  let nextLecture = null;
  let nextSectionId = null;

  // same section
  if (subIndex + 1 < courseSectionData?.[sectionIndex]?.subsection.length) {
    nextLecture = courseSectionData[sectionIndex].subsection[subIndex + 1];
    nextSectionId = sectionId;
  }
  // next section
  else if (sectionIndex + 1 < courseSectionData.length) {
    nextLecture = courseSectionData[sectionIndex + 1].subsection[0];
    nextSectionId = courseSectionData[sectionIndex + 1]._id;
  }

  const handleNext = async () => {
    if (!nextLecture) return;

    try {
      setSaving(true);

      if (!completedLectures.includes(subSectionId)) {
        const res = await CompleteLectureMarker(courseId, subSectionId, token);

        if (res?.success) {
          dispatch(updateCompletedLectures(subSectionId));
          dispatch(fetchEnrolledCourses());
        }
      }

      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextLecture._id}`
      );

      setVideoActive(false);
      setVideoEnded(false);
    } catch (err) {
      console.log("Completion error", err);
    } finally {
      setSaving(false);
    }
  };

  /* ====
     Rewatch (useRef)
     =======*/
  const handleRewatch = () => {
    playerRef.current.currentTime = 0;
    playerRef.current.play();
    setVideoEnded(false);
  };

  // ====================================
const handleVideoEnd = async () => {
  setVideoEnded(true);

  //  Mark EVERY lecture as completed
  if (!completedLectures.includes(subSectionId)) {
    try {
      const res = await CompleteLectureMarker(courseId, subSectionId, token);

      if (res?.success) {
        dispatch(updateCompletedLectures(subSectionId));

        // Updated the Dashboard
        dispatch(fetchEnrolledCourses());
      }
    } catch (err) {
      console.log("Auto completion failed", err);
    }
  }
};

// last lecture handler Function
  const isLastLecture = () => {
    const isLastSub =
      subIndex === courseSectionData[sectionIndex].subsection.length - 1;

    const isLastSection = sectionIndex === courseSectionData.length - 1;

    return isLastSub && isLastSection;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-linear-to-r from-[#020617] via-[#161D29] to-[#020617] p-6">
      <div className="relative w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        {!videoActive && (
          <button
            onClick={() => setVideoActive(true)}
            className="absolute z-10 border border-white rounded-full px-6 py-6 text-white text-2xl bg-black/60 backdrop-blur-sm hover:scale-105 transition"
          >
            ▶
          </button>
        )}

        {videoActive && (
          <video
            ref={playerRef}
            src={currentSub.videoUrl}
            autoPlay
            controls
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />
        )}

        {/* ===== COMPLETION OVERLAY (same UI) ===== */}
        {videoEnded && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={handleRewatch}
                className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold"
              >
                Rewatch
              </button>

              {nextLecture && (
                <button
                  disabled={saving}
                  onClick={handleNext}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold"
                >
                  Mark as Completed
                </button>
              )}
            </div>

            {nextLecture && (
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>

      {/* TITLE & DESCRIPTION (UNCHANGED) */}
      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-xl font-semibold text-white">
          {currentSub.tittle}
        </h1>
        <p className="text-slate-400 mt-1">{currentSub.description}</p>
      </div>
    </div>
  );
};

export default VedioDetails;
