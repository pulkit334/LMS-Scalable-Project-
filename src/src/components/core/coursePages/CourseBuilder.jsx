/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createCourseSection, deleteSection } from "../../../services/auth";
import Asideinformation from "../../../utils/Asideinformation";
import Confirmation from "../common/confirmmation";
import AddLectureModal from "../common/AddLectureModal";
import ViewLectureModal from "./ViewLectureModal";
// import course from "../../../../../server/models/course";

// ===== REDUX =====
import { useDispatch, useSelector } from "react-redux";
import {
  setSections,
  setStep,
  setViewLecture,
} from "../../../Slices/courseSlice";
import { Plus, Trash2, Pencil, Video, GripVertical, ChevronRight, Check } from "lucide-react";

const CourseBuilder = () => {
  const dispatch = useDispatch();

  // ===== REDUX STATE =====
  const { sections, courseId, viewLecture } = useSelector(
    (state) => state.course
  );

  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);

  // ================= CREATE SECTION =================
  const handleCreateSection = async () => {
    if (!sectionName.trim()) return;

    const toastId = toast.loading("Creating section...");
    setLoading(true);

    try {
      const response = await createCourseSection({
        sectionName,
        courseId,
      });

      const updatedSections = response?.updatedCourse?.courseContent;

      if (!updatedSections) {
        throw new Error("Updated course content not returned");
      }

      //  REDUX UPDATE (same data structure)
      dispatch(setSections(updatedSections));
      setSectionName("");

      toast.success("Section created successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to create section", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE SECTION =================
  const handleDeleteSection = async (sectionId) => {
    const toastId = toast.loading("Deleting section...");

    try {
      const response = await deleteSection(sectionId);

      const updatedSections = response?.data?.updatedCourse?.courseContent;

      if (Array.isArray(updatedSections)) {
        dispatch(setSections(updatedSections));
      } else {
        dispatch(setSections([])); // fallback safety
      }

      setConfirmationModal(null);
      toast.success("Section deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete section", { id: toastId });
    }
  };

  const handleLectureAdded = (payload) => {
    setIsLectureModalOpen(false);
    setEditingLecture(null);

    if (!payload) {
      setActiveSectionId(null);
      return;
    }

    if (payload.updatedSection) {
      const updated = sections.map((section) =>
        section._id === payload.updatedSection._id
          ? {
              ...payload.updatedSection,
              subsection: [...payload.updatedSection.subsection],
            }
          : section
      );

      dispatch(setSections(updated));
      setActiveSectionId(null);
      return;
    }

    //  CREATE CASE: append lecture
    if (payload.lecture && payload.sectionId) {
      const updated = sections.map((section) =>
        section._id === payload.sectionId
          ? {
              ...section,
              subsection: [...(section.subsection || []), payload.lecture],
            }
          : section
      );

      dispatch(setSections(updated));
    }

    setActiveSectionId(null);
  };

  return (
    <section className="min-h-screen text-white px-0 py-10"
      style={{ background: "linear-gradient(160deg, #060d1a 0%, #080f1e 60%, #060d1a 100%)", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .cb-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e2e8f0;
          transition: border-color 0.2s ease, background 0.2s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .cb-input:focus {
          border-color: rgba(251,191,36,0.5);
          background: rgba(255,255,255,0.05);
        }
        .cb-input::placeholder { color: rgba(255,255,255,0.2); }

        .section-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s ease;
        }
        .section-card:hover { border-color: rgba(255,255,255,0.12); }

        .lecture-row {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s ease;
        }
        .lecture-row:hover {
          border-color: rgba(251,191,36,0.3);
          background: rgba(251,191,36,0.04);
        }

        .icon-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          width: 30px; height: 30px;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.1); }
        .icon-btn.danger:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #ef4444; }

        .btn-outline-amber {
          border: 1px solid rgba(251,191,36,0.4);
          color: #fbbf24;
          background: rgba(251,191,36,0.05);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-outline-amber:hover:not(:disabled) {
          background: rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.7);
          box-shadow: 0 0 20px rgba(251,191,36,0.1);
        }
        .btn-outline-amber:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-amber {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-weight: 700;
          box-shadow: 0 4px 20px rgba(251,191,36,0.2);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-amber:hover:not(:disabled) {
          box-shadow: 0 8px 28px rgba(251,191,36,0.35);
          transform: translateY(-1px);
        }
        .btn-amber:disabled { opacity: 0.4; cursor: not-allowed; }

        .add-lecture-btn {
          color: #fbbf24;
          font-size: 13px;
          font-weight: 600;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s ease;
          opacity: 0.8;
        }
        .add-lecture-btn:hover { opacity: 1; transform: translateX(2px); }

        .stepper-connector { height: 1px; width: 48px; border-top: 1.5px dashed; }
        .step-done { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 16px rgba(251,191,36,0.3); }
        .step-active { border: 1.5px solid #fbbf24; color: #fbbf24; }
        .step-inactive { border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.3); }
      `}</style>

      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-2xl font-bold text-center mb-10"
        style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
      >
        Edit Course
      </h1>

      {/* ===== STEPPER ===== */}
      <div className="mb-14 flex justify-center items-center gap-5 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="step-done h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs">
            <Check size={13} />
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Course Information</span>
        </div>

        <div className="stepper-connector" style={{ borderColor: "#fbbf24" }} />

        <div className="flex items-center gap-2.5">
          <span className="step-active h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs">
            2
          </span>
          <span style={{ color: "#fbbf24", fontWeight: 600 }}>Course Builder</span>
        </div>

        <div className="stepper-connector" style={{ borderColor: "rgba(255,255,255,0.15)" }} />

        <div className="flex items-center gap-2.5">
          <span className="step-inactive h-7 w-7 rounded-full flex items-center justify-center text-xs">
            3
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>Publish</span>
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ===== LEFT ===== */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-xl rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            <h2 className="text-lg font-bold mb-6"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
            >
              Course Builder
            </h2>

            {/* INPUT */}
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Section Name <span className="text-red-400">*</span>
            </label>

            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Add a section to build your course"
              className="cb-input mt-2 w-full h-11 rounded-xl px-4 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleCreateSection()}
            />

            <button
              onClick={handleCreateSection}
              disabled={loading}
              className="btn-outline-amber mt-3 flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold"
            >
              <Plus size={15} /> Create Section
            </button>

            {/* ===== SECTIONS LIST ===== */}
            <div className="mt-6 space-y-3">
              {sections.map((section, idx) => (
                <div
                  key={section._id}
                  className="section-card rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 font-semibold text-sm" style={{ color: "#f0f4ff" }}>
                      <GripVertical size={15} style={{ color: "rgba(255,255,255,0.2)", cursor: "grab" }} />
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {section.sectionName}
                    </div>

                    <div className="flex gap-2">
                      <button className="icon-btn text-slate-400">
                        <Pencil size={13} />
                      </button>
                      <button
                        className="icon-btn danger text-slate-400"
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this Section?",
                            text2:
                              "All lectures inside this section will be deleted.",
                            btn1text: "Delete",
                            btn2text: "Cancel",
                            btn1handler: () => handleDeleteSection(section._id),
                            btn2handler: () => setConfirmationModal(null),
                          })
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* ADD LECTURE */}
                  <button
                    onClick={() => {
                      setActiveSectionId(section._id);
                      setIsLectureModalOpen(true);
                    }}
                    className="add-lecture-btn mt-3 ml-7"
                  >
                    <Plus size={13} /> Add Lecture
                  </button>

                  {/* ===== LECTURES LIST ===== */}
                  {Array.isArray(section.subsection) &&
                    section.subsection.length > 0 && (
                      <div className="mt-3 space-y-1.5 ml-7 pl-3"
                        style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        {section.subsection
                          .filter(
                            (lecture) =>
                              lecture &&
                              lecture._id &&
                              lecture.tittle &&
                              typeof lecture.timeduration === "number"
                          )
                          .map((lecture) => (
                            <div
                              key={lecture._id}
                              onClick={() => dispatch(setViewLecture(lecture))} // REDUX
                              className="lecture-row flex items-center justify-between text-sm cursor-pointer px-3 py-2.5 rounded-lg"
                            >
                              {/* LEFT */}
                              <div className="flex items-center gap-2.5 truncate">
                                <Video size={13} style={{ color: "#fbbf24", flexShrink: 0 }} />
                                <span className="truncate max-w-65 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                                  {lecture.tittle}
                                </span>
                              </div>

                              {/* RIGHT */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {/* EDIT */}
                                <button
                                  className="icon-btn text-slate-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLecture(lecture);
                                    setActiveSectionId(section._id);
                                    setIsLectureModalOpen(true);
                                  }}
                                >
                                  <Pencil size={11} />
                                </button>

                                {/* DELETE */}
                                <button
                                  className="icon-btn danger text-slate-400"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 size={11} />
                                </button>

                                {/* DURATION */}
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                                >
                                  {lecture.timeduration}s
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* ===== FOOTER ===== */}
            <div className="mt-10 flex justify-between">
              <button
                onClick={() => dispatch(setStep(1))}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", transition: "all 0.2s" }}
              >
                ← Back
              </button>

              <button
                onClick={() => dispatch(setStep(3))}
                disabled={!sections.length}
                className="btn-amber px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="sticky top-24 h-fit">
          <Asideinformation />
        </div>

        <AddLectureModal
          isOpen={isLectureModalOpen}
          sectionId={activeSectionId}
          onClose={handleLectureAdded}
          lecture={editingLecture}
        />

        {confirmationModal && <Confirmation modalData={confirmationModal} />}

        <ViewLectureModal
          lecture={viewLecture}
          onClose={() => dispatch(setViewLecture(null))}
        />
      </div>
    </section>
  );
};

export default CourseBuilder;
