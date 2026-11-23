/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import toast from "react-hot-toast";
import {
  Search,
  X,
  Star,
  Download,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchInstructorInsight({ page: 1, limit: 8 }));
    dispatch(fetchCourseChartPath());
    dispatch(fetchcategoriesTrend());
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 250);
    return () => clearTimeout(handler);
  }, [value]);

  useEffect(() => {
    const trimmed = debouncedValue.trim();
    if (trimmed.length === 0) {
      dispatch(fetchInstructorInsight({ page: 1, limit: 8 }));
      return;
    }
    if (trimmed.length < 2) return;
    dispatch(fetchInstructorInsight({ page: 1, limit: 8, search: trimmed }));
  }, [debouncedValue]);

  const filteredInstructors = useMemo(() => {
    if (statusFilter === "ALL") return instructors;
    return instructors.filter((inst) => {
      const st = (inst.status || "Active").toUpperCase();
      return st === statusFilter;
    });
  }, [instructors, statusFilter]);

  const handleStatusChange = async (inst) => {
    const nextstatus = inst?.status === "Blocked" ? "Active" : "Blocked";
    try {
      await dispatch(
        fetchUserState({
          id: inst._id,
          status: nextstatus,
        })
      ).unwrap();
      toast.success(`Instructor marked as ${nextstatus}`);
    } catch (err) {
      toast.error("Failed to update instructor status");
    }
  };

  const getPages = () => {
    const pages = [];
    const chunkSize = 8;
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
      dispatch(fetchInstructorInsight({ page, limit: 8, search: trimmed }));
    } else {
      dispatch(fetchInstructorInsight({ page, limit: 8 }));
    }
  };

  const monthlyTotals = useMemo(() => {
    const totals = new Array(12).fill(0);
    coursetrend.forEach((item) => {
      const monthIndex = (item._id?.month || 1) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        totals[monthIndex] += item.totalEnrollments || 0;
      }
    });
    return totals;
  }, [coursetrend]);

  const handleExportCSV = () => {
    const header = ["Name", "Email", "Courses", "Avg Rating", "Status"];
    const rows = filteredInstructors.map((i) => [
      `"${i.firstName || ""} ${i.lastName || ""}"`,
      `"${i.email || ""}"`,
      i.CourseCount || 0,
      (i.AvgRating || 0).toFixed(1),
      i.status || "Active",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-instructors-page-${currentPage}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Faculty
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-0.5">
            Instructor Management
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#11151f] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-medium transition cursor-pointer w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search instructors..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#11151f] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          {value && (
            <button
              onClick={() => setValue("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-[#11151f] border border-white/[0.08] p-1 w-fit">
          {["ALL", "ACTIVE", "BLOCKED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === st
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st === "ALL" ? "All" : st === "ACTIVE" ? "Active" : "Blocked"}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-[#11151f] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0d1017]">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Instructor
                </th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Courses
                </th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Rating
                </th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Status
                </th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-slate-400">
                    <Result loading={true} text="Loading instructors..." />
                  </td>
                </tr>
              ) : filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">
                    No instructors found
                  </td>
                </tr>
              ) : (
                filteredInstructors.map((inst) => {
                  const isBlocked = inst.status === "Blocked";
                  const avatar =
                    inst.image?.url ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
                      inst.firstName || "I"
                    )}`;
                  return (
                    <tr
                      key={inst._id}
                      className="hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={inst.firstName}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15 shrink-0"
                          />
                          <div>
                            <p className="font-medium text-sm text-slate-100">
                              {inst.firstName} {inst.lastName}
                            </p>
                            <p className="text-xs text-slate-400">{inst.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono tabular-nums text-slate-200 text-sm">
                        {inst.CourseCount || 0}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-mono tabular-nums text-slate-200">
                            {(inst.AvgRating || 0).toFixed(1)}
                          </span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isBlocked
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBlocked ? "bg-rose-400" : "bg-emerald-400"
                            }`}
                          />
                          {inst.status || "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleStatusChange(inst)}
                          disabled={actionLoadingId === inst._id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer disabled:opacity-50 ${
                            isBlocked
                              ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-400"
                              : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-400"
                          }`}
                        >
                          {actionLoadingId === inst._id ? (
                            "Updating..."
                          ) : isBlocked ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <ShieldBan className="w-3.5 h-3.5" />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-1.5">
        <button
          disabled={!hasPrevPage}
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#11151f] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {getPages().map((c, idx) =>
          c === "..." ? (
            <span key={idx} className="px-2 text-xs text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={c}
              onClick={() => goToPage(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                c === currentPage
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-[#11151f] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              {c}
            </button>
          )
        )}

        <button
          disabled={!hasNextPage}
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#11151f] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Monthly Enrollments
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Student enrollments across all months
            </p>
          </div>
          <EnrollmentBarChart
            labels={MONTHS}
            values={monthlyTotals}
            height={240}
            title="Monthly Enrollments"
          />
        </div>

        <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5 overflow-y-auto max-h-[320px]">
          <TopCoursesProgress data={TopCategories?.TopCoursesData} />
        </div>
      </div>
    </div>
  );
};

export default Instructormangment;
