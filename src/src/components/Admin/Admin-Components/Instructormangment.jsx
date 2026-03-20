/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  fetchCourseChartPath,
  fetchInstructorInsight,
  fetchUserState,
  fetchcategoriesTrend,
} from "../../../Slices/Admin/ownerSlice";

import Result from "../../../utils/Spinnre";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import EnrollmentBarChart from "../../../utils/BarChart";
import TopCoursesProgress from "../../../utils/PorgressBar";
import { Search } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Instructormangment = () => {
  const dispatch = useDispatch();

  const {
    InstructorData,
    loading,
    Coursetrend,
    TopCategories,
    actionLoadingId,
  } = useSelector((state) => state.admin);

  const coursetrend = Coursetrend?.data || [];

  const pagination = InstructorData?.data?.pagination || {};
  const instructors = InstructorData?.data?.instructors || [];

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const hasNextPage = pagination.hasNextPage || false;
  const hasPrevPage = pagination.hasPrevPage || false;

  const ImgApi = () => `https://picsum.photos/400/300?random=${Date.now()}`;

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    dispatch(fetchInstructorInsight({ page: 1, limit: 5 }));
    dispatch(fetchCourseChartPath());
    dispatch(fetchcategoriesTrend());
  }, []);
useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 200); // 300–500ms is ideal

    return () => clearTimeout(handler);
  }, [value]);

  /* ---------------- SEARCH EFFECT ---------------- */
  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      dispatch(fetchInstructorInsight({ page: 1, limit: 5 }));
      return;
    }

    if (trimmed.length < 2) return;

    dispatch(fetchInstructorInsight({ page: 1, limit: 5, search: trimmed }));
  }, [debouncedValue]);

  /*-----------------Status Logic ----------------- */
  const hanldeStatusChange = async (inst) => {
    const nextstatus = inst?.status === "Blocked" ? "Active" : "Blocked";

    await dispatch(
      fetchUserState({
        id: inst._id,
        status: nextstatus,
      }),
    ).unwrap();
  };

  /* ---------------- PAGINATION LOGIC ---------------- */
  const getPages = () => {
    const pages = [];
    const chunkSize = 10;
    const currentChunk = Math.floor((currentPage - 1) / chunkSize);
    const startPage = currentChunk * chunkSize + 1;
    const endPage = Math.min(startPage + chunkSize - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    const trimmed = value.trim();

    if (trimmed.length >= 2) {
      dispatch(fetchInstructorInsight({ page, limit: 5, search: trimmed }));
    } else {
      dispatch(fetchInstructorInsight({ page, limit: 5 }));
    }
  };

  // ************************************************Months**************************************************//
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyTotals = useMemo(() => {
    const totals = new Array(12).fill(0);
    coursetrend.forEach((item) => {
      const monthIndex = item._id.month - 1;
      totals[monthIndex] += item.totalEnrollments;
    });
    return totals;
  }, [coursetrend]);

  return (
    <div
      className="min-h-screen w-full p-6"
      style={{ background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .im-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .im-search {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: border-color 0.2s;
        }
        .im-search:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .im-th {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          padding: 12px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .im-tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .im-tr:hover { background: #f8fafc; }
        .im-tr:last-child { border-bottom: none; }

        .im-td { padding: 14px 20px; font-size: 13px; color: #334155; }

        .badge-active {
          display: inline-flex; align-items: center; gap: 5px;
          background: #ecfdf5; color: #10b981;
          border: 1px solid #a7f3d0;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
        }
        .badge-blocked {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fef2f2; color: #ef4444;
          border: 1px solid #fecaca;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
        }

        .btn-block {
          font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid #fecaca;
          background: #fef2f2; color: #ef4444;
          transition: all 0.15s ease; cursor: pointer;
        }
        .btn-block:hover { background: #fee2e2; }

        .btn-unblock {
          font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid #a7f3d0;
          background: #ecfdf5; color: #10b981;
          transition: all 0.15s ease; cursor: pointer;
        }
        .btn-unblock:hover { background: #d1fae5; }

        .btn-unblock:disabled, .btn-block:disabled {
          opacity: 0.5; cursor: not-allowed;
        }

        .pg-btn {
          padding: 6px 12px; border-radius: 7px; font-size: 13px;
          border: 1px solid #e2e8f0; background: #fff; color: #64748b;
          transition: all 0.15s ease; cursor: pointer;
        }
        .pg-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; font-weight: 600; }
      `}</style>

      {/* Page header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94a3b8" }}>Admin</p>
        <h1 className="text-xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>Instructor Management</h1>
      </div>

      {/* SEARCH */}
      <div className="im-search mb-4 w-80 px-4 py-2.5 flex items-center gap-2">
        <Search className="w-4 h-4" style={{ color: "#94a3b8" }} />
        <input
          type="text"
          placeholder="Search instructors..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: "#0f172a" }}
        />
      </div>

      {/* TABLE */}
      <div className="im-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="im-th text-left">Instructor</th>
                <th className="im-th text-center">Courses</th>
                <th className="im-th text-center">Rating</th>
                <th className="im-th text-center">Status</th>
                <th className="im-th text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="im-td text-center" style={{ color: "#94a3b8" }}>
                    <Result loading={true} text="Loading" />
                  </td>
                </tr>
              ) : instructors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="im-td text-center" style={{ color: "#94a3b8", padding: "40px" }}>
                    No instructors found
                  </td>
                </tr>
              ) : (
                instructors.map((inst) => (
                  <tr key={inst._id} className="im-tr">
                    {/* Instructor */}
                    <td className="im-td">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.image?.url || ImgApi()}
                          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                          style={{ border: "1.5px solid #e2e8f0" }}
                        />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                            {inst.firstName} {inst.lastName}
                          </p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>{inst.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Courses */}
                    <td className="im-td text-center font-medium" style={{ color: "#0f172a" }}>
                      {inst.CourseCount || 0}
                    </td>

                    {/* Rating */}
                    <td className="im-td text-center">
                      <span className="flex items-center justify-center gap-1">
                        <span style={{ color: "#f59e0b" }}>★</span>
                        <span className="font-medium" style={{ color: "#0f172a" }}>
                          {(inst.AvgRating || 0).toFixed(1)}
                        </span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="im-td text-center">
                      <span className={inst.status === "Blocked" ? "badge-blocked" : "badge-active"}>
                        <span style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: inst.status === "Blocked" ? "#ef4444" : "#10b981",
                          display: "inline-block"
                        }} />
                        {inst.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="im-td text-center">
                      <button
                        onClick={() => hanldeStatusChange(inst)}
                        disabled={actionLoadingId === inst._id}
                        className={inst.status === "Blocked" ? "btn-unblock" : "btn-block"}
                      >
                        {actionLoadingId === inst._id
                          ? "Updating..."
                          : inst.status === "Blocked"
                            ? "Unblock"
                            : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="h-16 flex items-center justify-center gap-1.5 mt-2">
        <button
          disabled={!hasPrevPage}
          className="pg-btn"
          onClick={() => goToPage(currentPage - 1)}
        >
          ← Prev
        </button>

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

        <button
          disabled={!hasNextPage}
          className="pg-btn"
          onClick={() => goToPage(currentPage + 1)}
        >
          Next →
        </button>
      </div>

      {/* CHARTS */}
      <div className="flex gap-5 mt-2">
        <div className="im-card flex-1 p-5" style={{ height: 280 }}>
          <EnrollmentBarChart
            labels={MONTHS}
            values={monthlyTotals}
            title="Monthly Enrollments"
          />
        </div>

        <div className="im-card flex-1 p-5 overflow-y-auto" style={{ height: 280 }}>
          <TopCoursesProgress data={TopCategories?.TopCoursesData} />
        </div>
      </div>
    </div>
  );
};

export default Instructormangment;
