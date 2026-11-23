/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CourseTrendLineChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const sortedData = [...(Array.isArray(data) ? data : [])].sort((a, b) =>
      a.year === b.year ? a.month - b.month : a.year - b.year
    );

    return {
      labels: sortedData.map((i) => `${MONTHS[i.month - 1]} ${i.year}`),
      datasets: [
        {
          label: `${sortedData[0]?.categoryName || "Course"} Enrollments`,
          data: sortedData.map((i) => i.totalEnrollments),
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.12)",
          tension: 0.35,
          fill: true,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#11151f",
          pointBorderWidth: 2,
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { size: 11 },
          boxWidth: 10,
        },
      },
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
        ticks: { color: "#64748b", font: { size: 11 }, precision: 0 },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[260px] rounded-xl bg-[#0d1017] border border-white/[0.06] flex items-center justify-center text-xs text-slate-500">
        No enrollment trend data available yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Monthly Course Enrollment Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Top-performing category enrollments across recent months
          </p>
        </div>
      </div>
      <div className="h-[280px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CourseTrendLineChart;
