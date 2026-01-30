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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CourseTrendLineChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[320px] bg-[#0b1220] rounded-xl border border-white/5 flex items-center justify-center text-gray-400">
        No trend data available
      </div>
    );
  }

  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) =>
      a.year === b.year ? a.month - b.month : a.year - b.year
    );

    return {
      labels: sortedData.map(
        (i) => `${MONTHS[i.month - 1]} ${i.year}`
      ),
      datasets: [
        {
          label: `${sortedData[0]?.categoryName || "Course"} Enrollments`,
          data: sortedData.map((i) => i.totalEnrollments),
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.15)",
          tension: 0.45,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full h-[320px] bg-[#0b1220] rounded-xl border border-white/5 p-4">
      <h3 className="text-sm font-medium text-white mb-3">
        Monthly Course Trend
      </h3>

      <Line data={chartData} />
    </div>
  );
};  

export default CourseTrendLineChart;
