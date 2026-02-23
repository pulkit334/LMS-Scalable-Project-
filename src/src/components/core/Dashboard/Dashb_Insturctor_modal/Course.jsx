import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, BookOpen } from "lucide-react";
import Confirmation from "../../common/confirmmation";

const Course = ({
  courses,
  COURSE_STATUS,
  isProcessing,
  setConfirmationOpen,
  setCourseToDelete,
  confirmationOpen,
  handleConfirmDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white px-8 py-10"
      style={{
        background: "linear-gradient(160deg, #020617 0%, #060d1a 60%, #020617 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .mc-table {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }

        .mc-header-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1fr;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }

        .mc-course-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1fr;
          padding: 20px 24px;
          align-items: start;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s ease;
        }
        .mc-course-row:last-child { border-bottom: none; }
        .mc-course-row:hover { background: rgba(255,255,255,0.02); }

        .mc-thumbnail {
          width: 160px; height: 100px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        .badge-published {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600;
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
          padding: 3px 10px; border-radius: 99px;
        }
        .badge-draft {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600;
          background: rgba(251,191,36,0.1);
          color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.2);
          padding: 3px 10px; border-radius: 99px;
        }

        .action-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .action-btn:hover { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); color: #fbbf24; }
        .action-btn.danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }
        .action-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .add-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-weight: 700;
          font-size: 13px;
          padding: 9px 20px;
          border-radius: 10px;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 20px rgba(251,191,36,0.2);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .add-btn:hover {
          box-shadow: 0 8px 28px rgba(251,191,36,0.35);
          transform: translateY(-1px);
        }

        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 64px 24px;
          border-radius: 16px;
          border: 1.5px dashed rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.01);
        }
      `}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "rgba(251,191,36,0.6)" }}
          >
            Instructor Dashboard
          </p>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
          >
            My Courses
          </h1>
        </div>

        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="add-btn"
        >
          <Plus size={15} /> Add Course
        </button>
      </div>

      {/* TABLE */}
      {courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={36} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>No courses yet</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Click "Add Course" to create your first one</p>
        </div>
      ) : (
        <div className="mc-table">
          {/* Table Header */}
          <div className="mc-header-row">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Course</span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Duration</span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Price</span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Actions</span>
          </div>

          <div>
            {courses.length > 0 &&
              courses.map((course) => {
                const isPublished =
                  course.status?.toLowerCase() === COURSE_STATUS.PUBLISHED;

                return (
                  <div key={course._id} className="mc-course-row">
                    {/* COURSE INFO */}
                    <div className="flex gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="mc-thumbnail"
                      />

                      <div className="space-y-1.5 min-w-0">
                        <h2 className="text-sm font-bold leading-snug" style={{ color: "#f0f4ff" }}>
                          {course.courseName}
                        </h2>

                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                          {course.courseDescription}
                        </p>

                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                          Created:{" "}
                          {new Date(course.createdAt).toLocaleDateString()} |{" "}
                          {new Date(course.createdAt).toLocaleTimeString()}
                        </p>

                        {isPublished ? (
                          <span className="badge-published">
                            <span style={{ width: 5, height: 5, borderRadius: "99px", background: "#34d399", display: "inline-block" }} />
                            Published
                          </span>
                        ) : (
                          <span className="badge-draft">
                            <span style={{ width: 5, height: 5, borderRadius: "99px", background: "#fbbf24", display: "inline-block" }} />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DURATION */}
                    <div className="text-xs pt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {course.totalDuration || "0 m 0 s"}
                    </div>

                    {/* PRICE */}
                    <div className="text-sm font-bold pt-1" style={{ color: "#f0f4ff" }}>
                      ₹ {course.price}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-1">
                      <button
                        className="action-btn"
                        onClick={() =>
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        className="action-btn danger"
                        disabled={isProcessing}
                        onClick={() => {
                          setCourseToDelete(course);
                          setConfirmationOpen(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmationOpen && (
        <Confirmation
          loading={isProcessing}
          modalData={{
            text1: "Do You Want to Delete Course?",
            text2: "After deleting, you won't be able to retrieve this course.",
            btn1text: "Confirm",
            btn2text: "Cancel",
            btn1handler: handleConfirmDelete,
            btn2handler: () => {
              if (isProcessing) return;
              setConfirmationOpen(false);
              setCourseToDelete(null);
            },
          }}
        />
      )}
    </div>
  );
};

export default Course;
