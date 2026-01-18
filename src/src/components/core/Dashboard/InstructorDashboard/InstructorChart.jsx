/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
);

import DetailAnalyticsModal from "./DetailAnalyticsModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorChart = ({ courses = [] }) => {
  const [currChart, setCurrChart] = useState("students");
  const [openModal, setOpenModal] = useState(false);
  // function to generate colors
  const getRandomColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(
        `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
          Math.random() * 256,
        )},${Math.floor(Math.random() * 256)})`,
      );
    }
    return colors;
  };

  // STUDENTS CHART DATA
  const chartDataForStudent = {
    labels: courses.map((course) => course?.courseName || "Untitled"),
    datasets: [
      {
        label: "Students",
        data: courses.map((course) => course?.studentEnrolled?.length || 0),
        backgroundColor: getRandomColors(courses.length),
        borderWidth: 1,
      },
    ],
  };

  // NCOME CHART DATA
  const chartDataForIncome = {
    labels: courses.map((course) => course?.courseName || "Untitled"),
    datasets: [
      {
        label: "Income",
        data: courses.map(
          (course) =>
            (course?.studentEnrolled?.length || 0) * (course?.price || 0),
        ),
        backgroundColor: getRandomColors(courses.length),
        borderWidth: 1,
      },
    ],
  };
  const radarData = {
    labels: courses.map((course) => course?.courseName || "Untitled"),
    datasets: [
      {
        label: "Students",
        data: courses.map((course) => course?.studentEnrolled?.length || 0),

        backgroundColor: getRandomColors(courses.length),
        borderColor: getRandomColors(courses.length),
        borderWidth: 2,
      },
      {
        label: "Income",
        data: courses.map(
          (course) =>
            (course?.studentEnrolled?.length || 0) * (course?.price || 0),
        ),
        backgroundColor: "rgba(255, 205, 86, 0.3)",
        borderColor: "rgba(255, 205, 86, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "#555" },
        grid: { color: "#444" },
        pointLabels: { color: "#fff" },
        ticks: { color: "#fff" },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#fff" },
      },
    },
  };

  console.log("thw course data is", courses?.[0]);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Buttons */}
      <div className="flex items-center relative  gap-4">
        <button
          onClick={() => setCurrChart("students")}
          className={`px-4 py-2 rounded-md border flex items-center gap-2
          ${
            currChart === "students"
              ? "bg-yellow-400 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          Students <span className="text-sm">›</span>
        </button>

        <button
          onClick={() => setCurrChart("income")}
          className={`px-4 py-2 rounded-md border flex items-center gap-2
          ${
            currChart === "income"
              ? "bg-yellow-400 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          Income <span className="text-sm">›</span>
        </button>
        <button
          onClick={() => setOpenModal(true)}
          className="absolute  right-[-2.4vw]  px-1 py-2  lg:right-1 cursor-pointer lg:px-4 lg:py-2  rounded-2xl flex bg-gradient-to-r from-blue-500 via-yellow-100/1 to-pink-500 "
        >
          Detail Analytics
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[340px] flex items-center justify-center">
        {courses.length === 0 ? (
          <p className="text-richblack-200">No data available</p>
        ) : (
          <Pie
            className="w-full h-[360px]"
            data={
              currChart === "students"
                ? chartDataForStudent
                : chartDataForIncome
            }
            options={options}
          />
        )}
      </div>
      <DetailAnalyticsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        radarData={radarData}
        radarOptions={radarOptions}
      />
    </div>
  );
};

export default InstructorChart;
