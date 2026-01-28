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

  //state compontnent
  const getStatus = (status) => {
    return status === "PUBLISHED"
      ? "bg-green-500/10 text-green-400"
      : "bg-red-500/10 text-red-400";
  };

  useEffect(() => {
    dispatch(fetchCourseInsight());
    dispatch(fetchcategoriesTrend());
  }, [dispatch]);
  console.log("the course table data would be ", CourseTableData);
  console.log("the categoires  table data would be ", TopCategories);
  return (
    <div className="w-full gap-3 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Course Management</h2>
      </div>

      <div className="w-[90%] mx-auto bg-[#0b1220] rounded-xl border border-white/5">
        {/* Loading */}
        {loading && (
          <div className="p-6 text-gray-400">
            <Result loading={true} text="Loading data..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 text-red-400">Failed to load courses</div>
        )}

        {/* Table */}
        {!loading && CourseTableData?.length > 0 && (
          <div className="overflow-x-auto px-6 ring-indigo-800  rounded-2xl ring-1">
            <table className="w-full text-sm border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-400">
                  <th className="py-4 text-left">Course</th>
                  <th className="py-4 text-center">Categories</th>
                  <th className="py-4 text-center">Students</th>
                  <th className="py-4 text-center">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {CourseTableData.slice(0, 5).map((course) => {
                  return (
                    <tr
                      key={course._id}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      {/* Course */}
                      <td className="py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {course?.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold">
                                {course?.courseName?.charAt(0)}
                              </span>
                            )}
                          </div>

                          <span className="text-white font-medium">
                            {course?.courseName}
                          </span>
                        </div>
                      </td>

                      {/* Categories  */}
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-1 text-white text-sm">
                          {course?.category?.name}
                        </div>
                      </td>

                      {/* Students */}
                      <td className="py-4 text-center text-gray-300">
                        {course.enrollments ?? 0}
                      </td>

                      {/* Status */}
                      <td className="py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                            ${getStatus(course?.status)}`}
                        >
                          {course?.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/course/${course._id}`)
                            }
                            className="rounded-md bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
                          >
                            Edit
                          </button>

                          <button className="rounded-md bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-red-500/20 hover:text-red-400">
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
          <div className="p-6 text-gray-400">No courses found</div>
        )}
      </div>

   <div className="w-full flex justify-center px-6">
  <div className="w-full max-w-6xl">
    <CourseTrendLineChart data={TopCategories?.TopCoursesData} />
  </div>
</div>

    </div>
  );
};

export default Course_mangment;
