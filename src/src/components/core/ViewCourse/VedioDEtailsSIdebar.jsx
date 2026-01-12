/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconButton from "../common/iconButton";
import { ChevronDown, ChevronRight } from "lucide-react";

const VedioDEtailsSIdebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [vedioBarActive, setVedioBarActive] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse || {});

  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData?.length) return;

      const currentSectionIndex = courseSectionData.findIndex(
        (section) => section._id === sectionId
      );
      if (currentSectionIndex === -1) return;

      const currentSubSectionIndex = courseSectionData[
        currentSectionIndex
      ]?.subsection?.findIndex((sub) => sub._id === subSectionId);

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
  return (
    <div className="w-[380px] h-screen bg-[#020617] border-r border-slate-800 flex flex-col text-white">
      {/* HEADER */}
      <div className="p-5 border-b border-slate-800 bg-[#020617] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="text-slate-400 hover:text-white transition"
          >
            ← Back
          </button>

          <IconButton text="Add Review" onClick={() => setReviewModal(true)} />
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-lg font-semibold leading-snug line-clamp-2">
            {courseEntireData?.courseName}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-400 font-medium">
              {completedLectures?.length || 0}
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">
              {totalNoOfLectures || 0} lectures
            </span>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {courseSectionData?.map((section) => {
          const isOpen = activeStatus === section._id;

          return (
            <div key={section._id} className="border-b border-slate-800">
              {/* SECTION HEADER */}
              <button
                onClick={() => setActiveStatus(isOpen ? "" : section._id)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition
                ${
                  isOpen ? "bg-[#1E293B]" : "bg-[#020617] hover:bg-[#1E293B]/60"
                }
              `}
              >
                <span className="font-medium text-slate-100 line-clamp-1">
                  {section.sectionName}
                </span>

                <span className="text-slate-400 transition-transform duration-200">
                  {isOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </span>
              </button>

              {/* SUBSECTIONS */}
              {isOpen && (
                <div className="bg-[#020617]">
                  {section.subsection?.map((topic) => {
                    const isActive = vedioBarActive === topic._id;
                    const isCompleted = completedLectures?.includes(topic._id);

                    return (
                      <div
                        key={topic._id}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`
                          );
                          setVedioBarActive(topic._id);
                        }}
                        className={`group flex items-center gap-3 px-5 py-3 cursor-pointer text-sm transition
                        ${
                          isActive
                            ? "bg-amber-300/90 text-slate-900"
                            : "text-slate-300 hover:bg-slate-800"
                        }
                      `}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          readOnly
                          onClick={(e) => e.stopPropagation()}
                          className="accent-emerald-500"
                        />

                        <span className="line-clamp-1 flex-1">
                          {topic.tittle}
                        </span> 

                        {isActive && (
                          <span className="text-xs font-medium opacity-80">
                            Playing
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
      </div>
    </div>
  );
};

export default VedioDEtailsSIdebar;
