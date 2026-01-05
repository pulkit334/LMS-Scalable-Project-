// export default CourseBuilder;
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createCourseSection, deleteSection } from "../../../services/auth";
import Asideinformation from "../../../utils/Asideinformation";
import Confirmation from "../common/confirmmation";
import AddLectureModal from "../common/AddLectureModal";
import ViewLectureModal from "./ViewLectureModal";
// import course from "../../../../../server/models/course";

const CourseBuilder = ({
  sections = [],
  courseId,
  setSections,
  onBack,
  onNext,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [viewLecture, setViewLecture] = useState(null);
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

      setSections(updatedSections);
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
        setSections(updatedSections);
      } else {
        setSections([]); // fallback safety
      }

      setConfirmationModal(null);

      toast.success("Section deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete section", { id: toastId });
    }
  };
  // const handleLectureAdded = (payload) => {
  //   // Always close modal
  //   setIsLectureModalOpen(false);
  //   setEditingLecture(null);

  //   if (!payload || !payload.lecture) {
  //     setActiveSectionId(null);
  //     return;
  //   }

  //   const { isEdit, lecture } = payload;

  //   //  CAPTURE BEFORE CLEARING
  //   const sectionId = activeSectionId;

  //   setSections((prevSections) =>
  //     prevSections.map((section) => {
  //       if (section._id !== sectionId) return section;

  //       return {
  //         ...section,
  //         subsection: isEdit
  //           ? section.subsection.map((sub) =>
  //               sub._id === lecture._id ? lecture : sub
  //             )
  //           : [...(section.subsection || []), lecture],
  //       };
  //     })
  //   );

  //   // Clear AFTER update
  //   setActiveSectionId(null);
  // };


const handleLectureAdded = (payload) => {
  setIsLectureModalOpen(false);
  setEditingLecture(null);

  if (!payload) {
    setActiveSectionId(null);
    return;
  }

  //  UPDATE CASE: replace entire section
  if (payload.updatedSection) {
    const updatedSection = payload.updatedSection;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section._id === updatedSection._id
          ? {
              ...updatedSection,
              subsection: [...updatedSection.subsection],
            }
          : section
      )
    );

    setActiveSectionId(null);
    return;
  }

  //  CREATE CASE: append lecture
  if (payload.lecture && payload.sectionId) {
    const lecture = payload.lecture;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section._id === payload.sectionId
          ? {
              ...section,
              subsection: [...(section.subsection || []), lecture],
            }
          : section
      )
    );
  }

  setActiveSectionId(null);
};

  return (
    <section className="min-h-screen bg-[#0b1220] text-white px-0 py-10">
      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-2xl font-semibold text-center mb-10">Edit Course</h1>

      {/* ===== STEPPER ===== */}
      <div className="mb-14 flex justify-center items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
            ✓
          </span>
          <span>Course Information</span>
        </div>

        <div className="h-px w-14 border-t border-dashed border-yellow-400" />

        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
            2
          </span>
          <span>Course Builder</span>
        </div>

        <div className="h-px w-14 border-t border-dashed border-slate-600" />

        <div className="flex items-center gap-2 text-slate-500">
          <span className="h-7 w-7 rounded-full border border-slate-600 flex items-center justify-center">
            3
          </span>
          <span>Publish</span>
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ===== LEFT ===== */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Course Builder</h2>

            {/* INPUT */}
            <label className="text-sm">
              Section Name <span className="text-red-400">*</span>
            </label>

            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Add a section to build course"
              className="mt-2 w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
            />

            <button
              onClick={handleCreateSection}
              disabled={loading}
              className="mt-4 border border-yellow-400 text-yellow-400 px-6 py-2 rounded-md"
            >
              Create Section +
            </button>

            {/* ===== SECTIONS LIST ===== */}
            <div className="mt-8 space-y-4">
              {sections.map((section) => (
                <div
                  key={section._id}
                  className="bg-[#1c2636] border border-slate-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium">
                      ☰ {section.sectionName}
                    </div>

                    <div className="flex gap-3 text-gray-400">
                      <button>✏️</button>

                      <button
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
                        🗑️
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveSectionId(section._id);
                      setIsLectureModalOpen(true);
                    }}
                    className="mt-3 text-yellow-400 font-medium"
                  >
                    + Add Lecture
                  </button>
                  {/* ===== LECTURES LIST ===== */}
                  {Array.isArray(section.subsection) &&
                    section.subsection.length > 0 && (
                      <div className="mt-3 space-y-2 pl-4 border-l border-slate-600/60">
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
                              onClick={() => setViewLecture(lecture)} // VIEW ONLY
                              className="
        flex items-center justify-between
        text-sm
        cursor-pointer
        bg-[#020617]
        px-3 py-2
        rounded-md
        border border-slate-700
        hover:border-yellow-400/50
        transition
      "
                            >
                              {/* LEFT */}
                              <div className="flex items-center gap-2 truncate">
                                📹
                                <span className="truncate max-w-65">
                                  {lecture.tittle}
                                </span>
                              </div>

                              {/* RIGHT */}
                              <div className="flex items-center gap-3 text-gray-400">
                                {/* EDIT */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLecture(lecture); //  FIX
                                    setActiveSectionId(section._id); //  FIX
                                    setIsLectureModalOpen(true); //  OPEN EDIT MODAL
                                  }}
                                >
                                  ✏️
                                </button>

                                {/* DELETE (unchanged) */}
                                <button onClick={(e) => e.stopPropagation()}>
                                  🗑️
                                </button>

                                {/* DURATION */}
                                <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
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
                onClick={onBack}
                className="bg-slate-600 px-6 py-2 rounded-md"
              >
                ← Back
              </button>

              <button
                onClick={onNext}
                disabled={!sections.length}
                className="bg-yellow-400 text-black px-6 py-2 rounded-md disabled:opacity-40"
              >
                Next →
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
          onClose={() => setViewLecture(null)}
        />
      </div>
    </section>
  );
};

export default CourseBuilder;
