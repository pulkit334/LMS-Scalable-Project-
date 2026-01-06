/* eslint-disable no-unused-vars */
import { Edit2, Trash2 } from "lucide-react";
import { COURSE_STATUS } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const MyCourses = ({ courses = [], onEdit, onDelete, onAdd }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white px-8 py-10">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold">My Courses</h1>

        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Add Course +
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-xl border border-slate-800 bg-[#020617]/80 backdrop-blur">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-4 text-sm text-slate-400 border-b border-slate-800">
          <span>COURSE</span>
          <span>DURATION</span>
          <span>PRICE</span>
          <span>ACTIONS</span>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-slate-800">
          {courses.map((course) => {
            const isPublished =
              course.status?.toLowerCase() === COURSE_STATUS.PUBLISHED;

            return (
              <div
                key={course._id}
                className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-6 items-start"
              >
                {/* COURSE INFO */}
                <div className="flex gap-5">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-44 h-28 rounded-lg object-cover border border-slate-700"
                  />

                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">
                      {course.courseName}
                    </h2>

                    <p className="text-sm text-slate-400 line-clamp-2">
                      {course.courseDescription}
                    </p>

                    <p className="text-xs text-slate-500">
                      Created: {new Date(course.createdAt).toLocaleDateString()}{" "}
                      | {new Date(course.createdAt).toLocaleTimeString()}
                    </p>

                    {/* STATUS BADGE */}
                    {isPublished ? (
                      <span className="inline-flex items-center gap-2 text-xs bg-green-500/15 text-green-400 px-3 py-1 rounded-full w-fit">
                        ● Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs bg-red-500/15 text-red-400 px-3 py-1 rounded-full w-fit">
                        ● Drafted
                      </span>
                    )}
                  </div>
                </div>

                {/* DURATION */}
                <div className="text-sm text-slate-300 pt-2">
                  {course.totalDuration || "0 m 0 s"}
                </div>

                {/* PRICE */}
                <div className="text-sm font-medium pt-2">₹ {course.price}</div>

                {/* ACTIONS */}
                <div className="flex gap-5 pt-2 text-slate-400">
                  <button
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)     }
                    className="hover:text-yellow-400 transition"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(course._id)}
                    className="hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
