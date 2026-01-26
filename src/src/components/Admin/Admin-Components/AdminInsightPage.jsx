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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-white">
        Loading insights...
      </div>
    );
  }

  const yearRevenue = insight?.charts?.YearRevenue || [];
  console.log(
    "the year reviewnu is",
    yearRevenue.map((i) => `${i._id.month}/${i._id.year}`),
  );
  const revenueLineData = {
    labels: yearRevenue.map((i) => `${MONTHS[i._id.month - 1]} ${i._id.year}`),
    datasets: [
      {
        label: "Revenue",
        data: yearRevenue.map((i) => i.total),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2937" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2937" },
      },
      
    },
  };

  const enrollmentData = {
    labels: insight?.charts?.CategoryEnrollments.map((data) => data?._id),
    datasets: [
      {
        data: insight?.charts?.CategoryEnrollments.map((data) => data?.total),
        backgroundColor: ["#38bdf8", "#22c55e", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "65%",
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto text-white">
      <div className="flex flex-col space-y-6 p-6 max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <h1 className="text-2xl font-semibold">Insights</h1>

        {/* ================= TOP CARDS ================= */}
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Registered Users", value: insight?.TotalUsers },
            { label: "Total Courses", value: insight?.TotalCourses },
            { label: "Total Revenue", value: `₹${insight?.TotalPrice}` },
            { label: "Total Enrollments", value: insight?.TotalStudents },
          ].map((item, i) => (
            <div
              key={i}
              className="flex-1 min-w-40 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-4 border border-slate-700"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <h2 className="text-2xl font-bold mt-1">{item.value ?? 0}</h2>
              <div className="mt-3 h-0.75 w-10 bg-sky-400 rounded" />
            </div>
          ))}
        </div>

        {/* ================= MIDDLE ================= */}
        <div className="flex   gap-4">
          <div className="flex-1 min-w-[300px] rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-5 border border-slate-700">
            <p className="text-sm text-slate-400">Active Instructors</p>
            <p className="text-3xl font-bold mt-2">{insight?.TotalIns ?? 0}</p>
            <p className="text-xs text-slate-400">Engaged Teachers</p>
            <div className="mt-3 h-0.75 w-[90%] bg-blue-500 rounded" />
          </div>

          <div className="flex-1 min-w-[320px] rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-5 border border-slate-700">
            <p className="text-sm text-slate-400">New Enrollments</p>
            <p className="text-3xl font-bold mt-2">
              {insight?.TotalStudents ?? 0}
            </p>
            <p className="text-xs text-slate-400">Last 7 Days</p>
            <div className="mt-3 h-0.75 w-full bg-orange-400 rounded" />
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="flex flex-wrap gap-4">
          {/* Revenue Growth */}
          <div className="flex-2 min-w-[320px] rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-5 border border-slate-700">
            <h3 className="text-sm font-medium mb-4">Revenue Growth</h3>
            <div className="h-64">
              <Line data={revenueLineData} options={lineOptions} />
            </div>
          </div>

          {/* Enrollments Overview */}
          <div className="flex-1 min-w-70 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-5 border border-slate-700">
            <h3 className="text-sm font-medium mb-4">Enrollments Overview</h3>

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
