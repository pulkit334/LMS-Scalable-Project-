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
actionLoadingId
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
  console.log(
    "the current status of my Instructor Dashbaord will be ",
    instructors,
  );
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
      className="min-h-screen w-full text-white p-6
bg-[#070b16]
bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_60%)]"
    >
      {/* SEARCH */}
      <div className="mb-4 w-80 px-4 py-3 flex items-center gap-2 rounded-xl bg-[#0f172a] ring-1 ring-indigo-500">
        <Search className="text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search instructors..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0f172a]">
        <table className="w-full table-auto border-collapse">
          <thead className="border-b border-white/10">
            <tr className="text-gray-300 text-sm">
              <th className="text-left px-6 py-4 font-semibold">Instructor</th>
              <th className="text-center px-6 py-4 font-semibold">Courses</th>
              <th className="text-center px-6 py-4 font-semibold">Rating</th>
              <th className="text-center px-6 py-4 font-semibold">Status</th>
              <th className="text-center px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-400">
                  <Result loading={true} text="Loading" />
                </td>
              </tr>
            ) : instructors.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-400">
                  No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr
                  key={inst._id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  {/* Instructor */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={inst.image?.url || ImgApi()}
                        className="h-10 w-10 rounded-full ring-1 ring-red-500"
                      />
                      <div>
                        <p className="font-medium">
                          {inst.firstName} {inst.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{inst.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Courses */}
                  <td className="px-6 py-4 text-center">
                    {inst.CourseCount || 0}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4 text-center">
                    ★ {(inst.AvgRating || 0).toFixed(1)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center text-green-400">
                    {inst.status || "Active"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => hanldeStatusChange(inst)}
                        disabled={actionLoadingId=== inst._id}
                        className={`px-4 py-1 ring-1 rounded-md bg-white/10 cursor-pointer
    ${inst.status === "Blocked" ? "ring-green-500" : "ring-red-500"}
  `}
                      >
                        {actionLoadingId === inst._id
                          ? "Updating..."
                          : inst.status === "Blocked"
                            ? "Unblock"
                            : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="h-16 m-2 flex items-center justify-center gap-1 text-gray-400">
        <button
          disabled={!hasPrevPage}
          className="px-3 py-1 hover:bg-gray-700 rounded disabled:opacity-40"
          onClick={() => goToPage(currentPage - 1)}
        >
          Prev Page
        </button>

        {getPages().map((c, idx) =>
          c === "..." ? (
            <span key={idx} className="px-3">
              ...
            </span>
          ) : (
            <button
              key={c}
              onClick={() => goToPage(c)}
              className={`px-4 py-2 rounded-md ${
                c === currentPage
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ),
        )}

        <button
          disabled={!hasNextPage}
          className="px-3 py-1 hover:bg-gray-700 rounded disabled:opacity-40"
          onClick={() => goToPage(currentPage + 1)}
        >
          Next Page
        </button>
      </div>

      {/* CHARTS */}
      <div className="flex gap-10">
        <div className="mt-6 h-64 w-full rounded-xl bg-[#0f172a] ring-1 ring-indigo-500 p-4">
          <EnrollmentBarChart
            labels={MONTHS}
            values={monthlyTotals}
            title="Monthly Enrollments"
          />
        </div>

        <div className="mt-6 h-64 w-full rounded-xl bg-[#0f172a] ring-1 ring-red-500 p-4 overflow-y-auto">
          <TopCoursesProgress data={TopCategories?.TopCoursesData} />
        </div>
      </div>
    </div>
  );
};

export default Instructormangment;
