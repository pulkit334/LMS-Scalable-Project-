/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CompleteLectureMarker } from "../../../services/auth";
import { updateCompletedLectures } from "../../../Slices/ViewCourseSlics";
import { fetchEnrolledCourses } from "../../../Slices/EnroilledCourseSlice";
import {
  fetchCourseReviews,
  fetchHomeReviews,
} from "../../../Slices/RatingSlice";
import { Edit, Star, RotateCcw, ChevronRight, Play, CheckCircle } from "lucide-react";
import CourseReviewModal from "./CourseReviewModal";
import AIQuizButton from "../Ai/AIQuizButton";
import AINotesButton from "../Ai/AiNotesDownloader";

const VedioDetails = () => {
  const [reviewModal, setReviewModal] = useState({
    open: false,
    isEdit: false,
    defaultData: null,
  });

  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    dispatch(fetchHomeReviews());
  }, [location.pathname, dispatch]);
  const { reviewsByCourse, courseLoadingById } = useSelector(
    (state) => state.ratingSlice,
  );

  const { courseSectionData, completedLectures = [] } = useSelector(
    (state) => state.viewCourse,
  );
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseReviews(courseId));
    }
  }, [courseId, dispatch]);

  const { token } = useSelector((state) => state.auth);
  const [videoActive, setVideoActive] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [saving, setSaving] = useState(false);

  //  FIND CURRENT VIDEO
  let currentSub = null;

  const courseReviews = reviewsByCourse?.[courseId] ?? [];
  const courseLoading = courseLoadingById?.[courseId] ?? false;
  courseSectionData?.forEach((sec) => {
    sec?.subsection?.forEach((sub) => {
      if (sub._id === subSectionId) currentSub = sub;
    });
  });
  // console.log("the Main Data of the course is",reviewsByCourse)
  if (!currentSub) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white"
        style={{ background: "linear-gradient(135deg, #020617 0%, #0a0f1e 100%)", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
          <Play size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p style={{ fontSize: 15 }}>Video not found</p>
        </div>
      </div>
    );
  }

  const sectionIndex = courseSectionData.findIndex(
    (sec) => sec._id === sectionId,
  );

  const subIndex = courseSectionData?.[sectionIndex]?.subsection.findIndex(
    (sub) => sub._id === subSectionId,
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
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextLecture._id}`,
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

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        fill={s <= rating ? "#fbbf24" : "none"}
        stroke={s <= rating ? "#fbbf24" : "rgba(255,255,255,0.2)"}
      />
    ));
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(160deg, #020617 0%, #070d1a 50%, #020617 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .video-play-btn {
          background: rgba(10,15,30,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(251,191,36,0.3);
          transition: all 0.25s ease;
          box-shadow: 0 0 40px rgba(251,191,36,0.1);
        }
        .video-play-btn:hover {
          border-color: rgba(251,191,36,0.7);
          box-shadow: 0 0 60px rgba(251,191,36,0.25);
          transform: scale(1.06);
        }

        .completion-overlay-btn {
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
        }
        .completion-overlay-btn:hover { transform: translateY(-2px); }

        .review-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease;
        }
        .review-card:hover {
          border-color: rgba(255,255,255,0.12);
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        }

        .edit-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
        }
        .edit-btn:hover {
          background: rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.3);
          color: #fbbf24 !important;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent);
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-16">

        {/* VIDEO PLAYER */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            background: "#000",
            boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {!videoActive && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #060c18 100%)",
              }}
            >
              {/* Decorative grid */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.04,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
              <button
                onClick={() => setVideoActive(true)}
                className="video-play-btn relative z-10 flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72 }}
              >
                <Play size={28} fill="#fbbf24" stroke="none" style={{ marginLeft: 4 }} />
              </button>
            </div>
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
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(8px)" }}
            >
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <CheckCircle size={40} style={{ color: "#34d399", margin: "0 auto 8px" }} />
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Lecture complete!</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRewatch}
                  className="completion-overlay-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                >
                  <RotateCcw size={15} /> Rewatch
                </button>

                {nextLecture && (
                  <button
                    disabled={saving}
                    onClick={handleNext}
                    className="completion-overlay-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      color: "#000",
                      fontWeight: 700,
                      boxShadow: "0 8px 24px rgba(251,191,36,0.3)",
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              {nextLecture && (
                <button
                  onClick={handleNext}
                  className="completion-overlay-btn flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                  }}
                >
                  Next Lecture <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="mt-6">
          <h1
            className="text-xl font-bold leading-snug"
            style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
          >
            {currentSub.tittle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {currentSub.description}
          </p>
        </div>

        {/* Divider */}
        <div className="section-divider my-8" />

        {/* ===== Course Reviews List ===== */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
            >
              Student Reviews
              <span
                className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", verticalAlign: "middle" }}
              >
                {courseReviews.length}
              </span>
            </h2>
          </div>

          {courseReviews.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}
            >
              <Star size={28} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {courseReviews.map((rev) => (
                <div key={rev._id} className="review-card rounded-2xl p-5 flex justify-between items-start gap-4">
                  {/* LEFT CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "#fff",
                        }}
                      >
                        {rev?.user?.firstName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#f0f4ff" }}>
                          {rev?.user?.firstName} {rev?.user?.lastName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">{renderStars(rev?.rating)}</div>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>•</span>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{rev?.Course?.courseName}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {rev?.review}
                    </p>
                  </div>

                  {/* RIGHT EDIT BUTTON */}
                  <button
                    onClick={() =>
                      setReviewModal({
                        open: true,
                        isEdit: true,
                        defaultData: {
                          reviewId: rev._id,
                          courseRating: rev?.rating,
                          courseExperince: rev.review,
                        },
                      })
                    }
                    className="edit-btn shrink-0 p-2 rounded-lg text-slate-400"
                  >
                    <Edit size={15} />
                  </button>
                </div>
              ))}
              {reviewModal.open && (
                <CourseReviewModal
                  setReviewModal={(val) =>
                    setReviewModal((prev) => ({ ...prev, open: val }))
                  }
                  isEdit={reviewModal.isEdit}
                  defaultData={reviewModal.defaultData}
                />
              )}
            </div>
          )}
        </div>

        {/* AI Buttons */}
        <AIQuizButton subsectionId={subSectionId} />
        <AINotesButton subsectionId={subSectionId} />
      </div>
    </div>
  );
};

export default VedioDetails;
