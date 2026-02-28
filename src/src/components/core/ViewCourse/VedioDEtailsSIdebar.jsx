/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconButton from "../common/iconButton";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, PlayCircle, Star, X, Menu } from "lucide-react";

const VedioDEtailsSIdebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [vedioBarActive, setVedioBarActive] = useState("");
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData = [],
    courseEntireData = {},
    totalNoOfLectures = 0,
    completedLectures = [],
  } = useSelector((state) => state.viewCourse || {});

  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData?.length) return;
      //First Check Whether the CourseSecctionData  Have the subsection id
      const currentSectionIndex = courseSectionData.findIndex(
        (section) => section._id === sectionId
      );
      // if No Then Return the
      if (currentSectionIndex === -1) return;
      // if Section-> then check the sectionindex Have the Matching subsection or not if
      const currentSubSectionIndex = courseSectionData[
        currentSectionIndex
      ]?.subsection?.findIndex((sub) => sub._id === subSectionId);
      // If Not Then return this
      if (currentSubSectionIndex === -1) return;

      setActiveStatus(courseSectionData[currentSectionIndex]._id);
      setVedioBarActive(
        courseSectionData[currentSectionIndex].subsection[
          currentSubSectionIndex
        ]?._id
      );
    };

    setActiveFlags();
  }, [courseSectionData, location.pathname]);
  console.log("the Course Entire Data is", courseSectionData);

  const progress = totalNoOfLectures > 0 ? Math.round((completedLectures?.length / totalNoOfLectures) * 100) : 0;

  // Close mobile sidebar when navigating
  const handleSubsectionClick = (courseId, secId, topicId) => {
    navigate(`/view-course/${courseId}/section/${secId}/sub-section/${topicId}`);
    setVedioBarActive(topicId);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* HEADER */}
      <div className="p-5 sticky top-0 z-10"
        style={{
          background: "linear-gradient(180deg, #080f1a 85%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="back-btn flex items-center gap-1.5 text-slate-400 text-sm font-medium"
          >
            <span style={{ fontSize: 16 }}>←</span> Back
          </button>

          <div className="flex items-center gap-2">
            <button
              className="review-btn flex items-center gap-1.5 px-3 py-1.5 text-black text-xs font-bold rounded-lg cursor-pointer"
              onClick={() => setReviewModal(true)}
            >
              <Star size={12} fill="black" />
              Add Review
            </button>

            {/* Close button on mobile only */}
            <button
              className="mobile-close-sidebar-btn md:hidden flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setMobileOpen(false)}
            >
              <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
          </div>
        </div>

        {/* Course Name */}
        <p className="text-sm font-bold leading-snug line-clamp-2 mb-3"
          style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
        >
          {courseEntireData?.courseName}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            <span style={{ color: "#fbbf24", fontWeight: 600 }}>
              {completedLectures?.length || 0} / {totalNoOfLectures || 0}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="progress-bar-fill h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
              }}
            />
          </div>
          <p className="text-xs text-slate-500">{progress}% complete</p>
        </div>
      </div>

      {/* Sections Where i list all the Sections*/}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {courseSectionData?.map((section, secIdx) => {
          const isOpen = activeStatus === section._id;
          const sectionCompleted = section.subsection?.every(sub => completedLectures?.includes(sub._id));
          const sectionPartial = !sectionCompleted && section.subsection?.some(sub => completedLectures?.includes(sub._id));

          return (
            <div key={section._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {/* SECTION HEADER */}
              <button
                onClick={() => setActiveStatus(isOpen ? "" : section._id)}
                className={`section-header w-full flex items-center justify-between px-5 py-4 text-left`}
                style={{
                  background: isOpen
                    ? "linear-gradient(90deg, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 100%)"
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Section number pill */}
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: sectionCompleted
                        ? "rgba(52,211,153,0.15)"
                        : sectionPartial
                          ? "rgba(251,191,36,0.15)"
                          : "rgba(255,255,255,0.06)",
                      color: sectionCompleted ? "#34d399" : sectionPartial ? "#fbbf24" : "#64748b",
                    }}
                  >
                    {secIdx + 1}
                  </span>
                  <span className="font-semibold text-sm text-slate-100 line-clamp-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {section.sectionName}
                  </span>
                </div>

                <span className="text-slate-500 ml-2 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(0deg)" : "rotate(0deg)" }}>
                  {isOpen ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </span>
              </button>

              {/* Subsections */}
              {isOpen && (
                <div>
                  {section.subsection?.map((topic, topicIdx) => {
                    const isActive = vedioBarActive === topic._id;
                    const isCompleted = completedLectures?.includes(topic._id);

                    return (
                      <div
                        key={topic._id}
                        onClick={() => handleSubsectionClick(courseEntireData?._id, section._id, topic._id)}
                        className={`subsection-item ${isActive ? "active" : ""} group flex items-center gap-3 px-5 py-3 cursor-pointer text-sm`}
                        style={{
                          background: isActive
                            ? "linear-gradient(90deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 100%)"
                            : "transparent",
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Completion icon */}
                        <span className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 size={15} style={{ color: "#34d399" }} />
                          ) : isActive ? (
                            <PlayCircle size={15} style={{ color: "#fbbf24" }} />
                          ) : (
                            <Circle size={15} style={{ color: "rgba(255,255,255,0.15)" }} />
                          )}
                        </span>

                        <span className={`line-clamp-1 flex-1 text-xs font-medium transition-colors`}
                          style={{ color: isActive ? "#fbbf24" : isCompleted ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)" }}
                        >
                          {topic.tittle}
                        </span>

                        {isActive && (
                          <span className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24", fontSize: 10 }}
                          >
                            NOW
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.25); border-radius: 99px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(251,191,36,0.5); }

        .subsection-item {
          position: relative;
          transition: all 0.2s ease;
        }
        .subsection-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: transparent;
          transition: all 0.25s ease;
        }
        .subsection-item.active::before {
          background: linear-gradient(180deg, #fbbf24, #f59e0b);
        }

        .section-header {
          position: relative;
          overflow: hidden;
        }
        .section-header::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(251,191,36,0.04) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .section-header:hover::after { opacity: 1; }

        .progress-bar-fill {
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-btn {
          position: relative;
          transition: all 0.2s ease;
        }
        .back-btn:hover { color: #fbbf24; transform: translateX(-2px); }

        .review-btn {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 0 20px rgba(251,191,36,0.2);
          transition: all 0.2s ease;
        }
        .review-btn:hover {
          box-shadow: 0 0 28px rgba(251,191,36,0.4);
          transform: translateY(-1px);
        }

        /* ===== DESKTOP: always visible sidebar ===== */
        .sidebar-desktop {
          display: flex;
        }

        /* ===== MOBILE TOGGLE BUTTON ===== */
        .sidebar-mobile-toggle {
          display: none;
        }

        /* ===== MOBILE DRAWER ===== */
        .sidebar-mobile-drawer {
          display: none;
        }

        @media (max-width: 768px) {
          /* Hide desktop sidebar */
          .sidebar-desktop {
            display: none !important;
          }

          /* Show toggle button */
          .sidebar-mobile-toggle {
            display: flex !important;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            box-shadow: 0 8px 28px rgba(251,191,36,0.45);
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .sidebar-mobile-toggle:hover {
            transform: scale(1.08);
            box-shadow: 0 12px 36px rgba(251,191,36,0.55);
          }

          /* Mobile drawer */
          .sidebar-mobile-drawer {
            display: flex;
            position: fixed;
            inset: 0;
            z-index: 200;
            pointer-events: none;
          }

          .sidebar-mobile-drawer.open {
            pointer-events: all;
          }

          .sidebar-drawer-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(2,6,23,0.7);
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.25s ease;
          }
          .sidebar-mobile-drawer.open .sidebar-drawer-backdrop {
            opacity: 1;
          }

          .sidebar-drawer-panel {
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 85%;
            max-width: 340px;
            display: flex;
            flex-direction: column;
            background: linear-gradient(180deg, #080f1a 0%, #050c18 100%);
            border-right: 1px solid rgba(255,255,255,0.08);
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          .sidebar-mobile-drawer.open .sidebar-drawer-panel {
            transform: translateX(0);
          }

          .mobile-close-sidebar-btn {
            display: flex !important;
          }
        }

        /* On md+ hide the mobile close button inside sidebar header */
        @media (min-width: 769px) {
          .mobile-close-sidebar-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <div
        className="sidebar-desktop w-[340px] h-screen flex-col text-white flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #080f1a 0%, #050c18 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <SidebarContent />
      </div>

      {/* ===== MOBILE TOGGLE BUTTON ===== */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open course menu"
      >
        <Menu size={22} color="#000" />
      </button>

      {/* ===== MOBILE DRAWER ===== */}
      <div className={`sidebar-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        {/* Backdrop */}
        <div
          className="sidebar-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className="sidebar-drawer-panel text-white flex flex-col"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default VedioDEtailsSIdebar;
