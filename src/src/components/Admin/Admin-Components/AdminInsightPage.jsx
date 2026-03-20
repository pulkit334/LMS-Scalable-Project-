import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataInsight } from "../../../Slices/Admin/ownerSlice";

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

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

const AdminInsights = () => {
  const dispatch = useDispatch();
  const { Data, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDataInsight());
  }, [dispatch]);

  const insight = Data?.data;

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center"
        style={{ background: "#f8fafc" }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "2px solid #e2e8f0",
            borderTopColor: "#3b82f6",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading insights...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const yearRevenue = insight?.charts?.YearRevenue || [];
const revenueLineData = {
    labels: yearRevenue.map((i) => `${MONTHS[i._id.month - 1]} ${i._id.year}`),
    datasets: [
      {
        label: "Revenue",
        data: yearRevenue.map((i) => i.total),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.06)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },7
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { size: 11 } },
        grid: { color: "#f1f5f9" },
        border: { color: "#e2e8f0" },
      },
      y: {
        ticks: { color: "#94a3b8", font: { size: 11 } },
        grid: { color: "#f1f5f9" },
        border: { color: "#e2e8f0" },
      },
    },
  };

  const enrollmentData = {
    labels: insight?.charts?.CategoryEnrollments.map((data) => data?._id),
    datasets: [
      {
        data: insight?.charts?.CategoryEnrollments.map((data) => data?.total),
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#64748b",
          font: { size: 12 },
          padding: 16,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
      },
    },
  };

  const topCards = [
    { label: "Registered Users",  value: insight?.TotalUsers,       accent: "#3b82f6", bg: "#eff6ff" },
    { label: "Total Courses",     value: insight?.TotalCourses,     accent: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Total Revenue",     value: `₹${insight?.TotalPrice}`, accent: "#10b981", bg: "#ecfdf5" },
    { label: "Total Enrollments", value: insight?.TotalStudents,    accent: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div
      className="flex flex-col flex-1 overflow-y-auto"
      style={{ background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", color: "#0f172a" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .dash-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04);
        }
      `}</style>

      <div className="flex flex-col space-y-5 p-6 max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <div className="mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#94a3b8" }}
          >
            Admin
          </p>
          <h1 className="text-xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>
            Insights
          </h1>
        </div>

        {/* ================= TOP CARDS ================= */}
        <div className="flex flex-wrap gap-4">
          {topCards.map((item, i) => (
            <div key={i} className="dash-card flex-1 min-w-40 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: "#64748b" }}>
                  {item.label}
                </p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: item.accent }} />
                </div>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                {item.value ?? 0}
              </h2>
              <div className="mt-3 h-1 rounded-full" style={{ background: item.bg }}>
                <div className="h-full rounded-full" style={{ width: "60%", background: item.accent }} />
              </div>
            </div>
          ))}
        </div>

        {/* ================= MIDDLE ================= */}
        <div className="flex gap-4">
          <div className="dash-card flex-1 min-w-[300px] p-5">
            <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>
              Active Instructors
            </p>
            <p className="text-3xl font-bold" style={{ color: "#0f172a" }}>
              {insight?.TotalIns ?? 0}
            </p>
            <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Engaged Teachers</p>
            <div className="mt-4 h-1.5 rounded-full" style={{ background: "#eff6ff" }}>
              <div className="h-full rounded-full" style={{ width: "72%", background: "#3b82f6" }} />
            </div>
          </div>

          <div className="dash-card flex-1 min-w-[320px] p-5">
            <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>
              New Enrollments
            </p>
            <p className="text-3xl font-bold" style={{ color: "#0f172a" }}>
              {insight?.TotalStudents ?? 0}
            </p>
            <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Last 7 Days</p>
            <div className="mt-4 h-1.5 rounded-full" style={{ background: "#fff7ed" }}>
              <div className="h-full rounded-full" style={{ width: "88%", background: "#f97316" }} />
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="flex flex-wrap gap-4">
          {/* Revenue Growth */}
          <div className="dash-card flex-2 min-w-[320px] p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                Revenue Growth
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#eff6ff", color: "#3b82f6" }}
              >
                Monthly
              </span>
            </div>
            <div className="h-64">
              <Line data={revenueLineData} options={lineOptions} />
            </div>
          </div>

          {/* Enrollments Overview */}
          <div className="dash-card flex-1 min-w-70 p-5">
            <h3 className="text-sm font-semibold mb-5" style={{ color: "#0f172a" }}>
              Enrollments Overview
            </h3>
            <div className="h-57 flex items-center justify-center">
              <Doughnut data={enrollmentData} options={doughnutOptions} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminInsights;
