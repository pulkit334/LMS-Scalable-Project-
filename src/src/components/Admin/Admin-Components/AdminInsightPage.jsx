import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataInsight } from "../../../Slices/Admin/ownerSlice";
import { CreateAdminCategory } from "../../../services/Admin/adminapi's";
import toast from "react-hot-toast";
import {
  Users,
  BookOpen,
  IndianRupee,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Download,
  FolderPlus,
  X,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AdminInsights = () => {
  const dispatch = useDispatch();
  const { Data, loading } = useSelector((state) => state.admin);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    dispatch(fetchDataInsight());
  }, [dispatch]);

  const insight = Data?.data;

  const handleRefresh = () => {
    dispatch(fetchDataInsight());
    toast.success("Insights refreshed");
  };

  const handleExportSummary = () => {
    const rows = [
      ["Metric", "Value"],
      ["Registered Users", insight?.TotalUsers ?? 0],
      ["Total Courses", insight?.TotalCourses ?? 0],
      ["Active Instructors", insight?.TotalIns ?? 0],
      ["Total Enrollments", insight?.TotalStudents ?? 0],
      ["Total Revenue (INR)", insight?.TotalPrice ?? 0],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-insights-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim() || !catDesc.trim()) {
      toast.error("Both category name and description are required");
      return;
    }
    setCreatingCat(true);
    try {
      const res = await CreateAdminCategory({
        name: catName.trim(),
        description: catDesc.trim(),
      });
      if (res?.success) {
        toast.success("Category created");
        setCatName("");
        setCatDesc("");
        setCatModalOpen(false);
        dispatch(fetchDataInsight());
      } else {
        toast.error(res?.message || "Failed to create category");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    } finally {
      setCreatingCat(false);
    }
  };

  if (loading && !insight) {
    return (
      <div className="flex flex-1 min-h-[70vh] items-center justify-center bg-[#090b10]">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading platform metrics...</p>
        </div>
      </div>
    );
  }

  const yearRevenue = insight?.charts?.YearRevenue || [];
  const revenueLineData = {
    labels: yearRevenue.map((i) => `${MONTHS[(i._id?.month || 1) - 1]} ${i._id?.year}`),
    datasets: [
      {
        label: "Revenue (₹)",
        data: yearRevenue.map((i) => i.total),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 3.5,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#11151f",
        pointBorderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0d1017",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

  const catEnrollments = insight?.charts?.CategoryEnrollments || [];
  const enrollmentData = {
    labels: catEnrollments.map((d) => d?._id || "Category"),
    datasets: [
      {
        data: catEnrollments.map((d) => d?.total || 0),
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#38bdf8", "#a855f7"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "72%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 16,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#0d1017",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
      },
    },
  };

  const kpiCards = [
    {
      label: "Total Revenue",
      value: `₹${Number(insight?.TotalPrice || 0).toLocaleString("en-IN")}`,
      sub: "Cumulative gross sales",
      icon: IndianRupee,
      tint: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Registered Users",
      value: Number(insight?.TotalUsers || 0).toLocaleString("en-IN"),
      sub: "Students, instructors & admins",
      icon: Users,
      tint: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Total Courses",
      value: Number(insight?.TotalCourses || 0).toLocaleString("en-IN"),
      sub: "Published & draft catalog",
      icon: BookOpen,
      tint: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Total Enrollments",
      value: Number(insight?.TotalStudents || 0).toLocaleString("en-IN"),
      sub: "Active course seats",
      icon: TrendingUp,
      tint: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Active Instructors",
      value: Number(insight?.TotalIns || 0).toLocaleString("en-IN"),
      sub: "Verified course authors",
      icon: GraduationCap,
      tint: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-0.5">
            Platform Insights
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCatModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Category
          </button>

          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#11151f] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#11151f] hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  {item.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${item.tint}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">
                {item.value}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl bg-[#11151f] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Revenue Growth
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly settled payment totals across all courses
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-medium">
              Monthly
            </span>
          </div>
          <div className="h-64">
            {yearRevenue.length > 0 ? (
              <Line data={revenueLineData} options={lineOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No revenue history recorded yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Enrollments by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Share of student seats across catalog
            </p>
          </div>
          <div className="flex-1 min-h-[240px] flex items-center justify-center">
            {catEnrollments.length > 0 ? (
              <Doughnut data={enrollmentData} options={doughnutOptions} />
            ) : (
              <p className="text-xs text-slate-500">No category enrollments yet</p>
            )}
          </div>
        </div>
      </div>

      {/* NEW CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#11151f] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Create Course Category
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g., System Design"
                  className="w-full rounded-lg bg-[#090b10] border border-white/10 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief summary of courses in this category..."
                  className="w-full rounded-lg bg-[#090b10] border border-white/10 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCat}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white cursor-pointer"
                >
                  {creatingCat ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInsights;
