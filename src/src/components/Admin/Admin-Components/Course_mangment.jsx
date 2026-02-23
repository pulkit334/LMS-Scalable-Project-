/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchcategoriesTrend,
  fetchCourseInsight,
} from "../../../Slices/Admin/ownerSlice";
import Result from "../../../utils/Spinnre";
// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import CourseTrendLineChart from "../../../utils/LIneChart";
import { CourseDelete } from "../../../services/auth";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

const Course_mangment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { CourseData, loading, error, TopCategories } = useSelector(
    (state) => state.admin,
  );
  const CourseTableData = CourseData?.data?.CourseData;
  // Pagination Logic Would Be
  const paginationdata = CourseData?.data?.pagination;
  const totalPage = paginationdata?.pages || 1;
  const hasNextPage = paginationdata?.hasNextPage || false;
  const hasPrevPage = paginationdata?.hasPrevpage || false; //
  const currentPage = paginationdata?.page || 1;

  console.log("the course Management data would be", paginationdata);
  // Current Pages
  const getPages = () => {
    const pages = [];
    const chunkSize = 10;

    const currentChunk = Math.floor((currentPage - 1) / chunkSize);
    const startPage = currentChunk * chunkSize + 1;
    const endPage = Math.min(startPage + chunkSize - 1, totalPage);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPage) {
      pages.push("...");
      pages.push(totalPage);
    }

    return pages;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPage) return;
    if (page === currentPage) return;

    dispatch(fetchCourseInsight({ page, limit: 5 }));
  };

  //state compontnent
  const getStatus = (status) => {
    return status === "PUBLISHED"
      ? "badge-published"
      : "badge-draft";
  };

  const deleteCourse = async (courseId) => {
    const response = await CourseDelete(courseId);
    let toastId

    if (response?.success) {
      setTimeout(() => {
        toast.success(`${response?.message}`, toastId);
      }, 1000);
      dispatch(fetchCourseInsight({ page: 1, limit: 5 }))
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    dispatch(fetchCourseInsight({ page: 1, limit: 5 }));
    dispatch(fetchcategoriesTrend());
  }, [dispatch]);
  console.log("the course table data would be ", CourseTableData);
  console.log("the categoires  table data would be ", TopCategories);

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .cm-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .cm-th {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #94a3b8; padding: 12px 20px;
          background: #f8fafc; border-bottom: 1px solid #e2e8f0;
        }

        .cm-tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .cm-tr:hover { background: #f8fafc; }
        .cm-tr:last-child { border-bottom: none; }
        .cm-td { padding: 14px 20px; font-size: 13px; color: #334155; }

        .badge-published {
          display: inline-flex; align-items: center; gap: 5px;
          background: #ecfdf5; color: #10b981;
          border: 1px solid #a7f3d0;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
        }
        .badge-draft {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fef9c3; color: #ca8a04;
          border: 1px solid #fde68a;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
        }

        .btn-remove {
          font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid #fecaca;
          background: #fef2f2; color: #ef4444;
          transition: all 0.15s ease; cursor: pointer;
        }
        .btn-remove:hover { background: #fee2e2; }

        .pg-btn {
          padding: 6px 12px; border-radius: 7px; font-size: 13px;
          border: 1px solid #e2e8f0; background: #fff; color: #64748b;
          transition: all 0.15s ease; cursor: pointer;
        }
        .pg-btn:hover:not(:disabled) { background: #f1f5f9; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; font-weight: 600; }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94a3b8" }}>Admin</p>
        <h2 className="text-xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>Course Management</h2>
      </div>

      {/* TABLE CARD */}
      <div className="cm-card overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="p-8 text-center" style={{ color: "#94a3b8" }}>
            <Result loading={true} text="Loading data..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 text-sm" style={{ color: "#ef4444" }}>Failed to load courses</div>
        )}

        {/* Table */}
        {!loading && CourseTableData?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              {/* Table Head */}
              <thead>
                <tr>
                  <th className="cm-th text-left">Course</th>
                  <th className="cm-th text-center">Category</th>
                  <th className="cm-th text-center">Students</th>
                  <th className="cm-th text-center">Status</th>
                  <th className="cm-th text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {CourseTableData.map((course) => {
                  return (
                    <tr key={course._id} className="cm-tr">
                      {/* Course */}
                      <td className="cm-td">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
                          >
                            {course?.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-semibold text-sm"
                                style={{ color: "#64748b" }}
                              >
                                {course?.courseName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                            {course?.courseName}
                          </span>
                        </div>
                      </td>

                      {/* Categories */}
                      <td className="cm-td text-center">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "#eff6ff", color: "#3b82f6" }}
                        >
                          {course?.category?.name}
                        </span>
                      </td>

                      {/* Students */}
                      <td className="cm-td text-center font-medium" style={{ color: "#0f172a" }}>
                        {course.enrollments ?? 0}
                      </td>

                      {/* Status */}
                      <td className="cm-td text-center">
                        <span className={getStatus(course?.status)}>
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: course?.status === "PUBLISHED" ? "#10b981" : "#ca8a04",
                            display: "inline-block"
                          }} />
                          {course?.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="cm-td text-right">
                        <div className="flex justify-end gap-2">
                          {/* <button
                            onClick={() =>
                              navigate(`/admin/course/${course._id}`)
                            }
                            className="rounded-md bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
                          >
                            Edit
                          </button> */}

                          <button
                            onClick={() => deleteCourse(course?._id)}
                            className="btn-remove"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && CourseTableData?.length === 0 && (
          <div className="p-10 text-center text-sm" style={{ color: "#94a3b8" }}>
            No courses found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="h-16 flex items-center justify-center gap-1.5">
        {!hasPrevPage ? (
          <button disabled className="pg-btn">← Prev</button>
        ) : (
          <button className="pg-btn" onClick={() => goToPage(currentPage - 1)}>← Prev</button>
        )}

        {getPages().map((c, idx) =>
          c === "..." ? (
            <span key={idx} className="px-2 text-sm" style={{ color: "#94a3b8" }}>...</span>
          ) : (
            <button
              key={c}
              onClick={() => goToPage(c)}
              className={`pg-btn ${c === currentPage ? "active" : ""}`}
            >
              {c}
            </button>
          ),
        )}

        {hasNextPage && (
          <button onClick={() => goToPage(currentPage + 1)} className="pg-btn">
            Next →
          </button>
        )}
      </div>

      {/* CHART */}
      <div className="cm-card p-5 mt-2">
        <CourseTrendLineChart data={TopCategories?.TopCoursesData} />
      </div>
    </div>
  );
};

export default Course_mangment;
