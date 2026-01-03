import { Edit2, Trash2 } from "lucide-react";
import { COURSE_STATUS } from "../../../utils/constants";

const MyCourses = ({ courses = [], onEdit, onDelete, onAdd }) => {
  console.log("🚨 MyCoursdasdasesPage FILE LOADED");
  console.log("teh coourses are ", courses);
  return (
    <div className="w-full px-8 py-10 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">My Courses</h1>

        <button
          onClick={onAdd}
          className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:bg-yellow-300 transition"
        >
          Add Course +
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-6 px-4 py-3 text-sm text-slate-400 border-b border-slate-700">
        <span>COURSE</span>
        <span>DURATION</span>
        <span>PRICE</span>
        <span>ACTIONS</span>
      </div>

      {/* COURSES */}
      <div className="divide-y divide-slate-800">
        {courses.map((course) => (
          <div
            key={course._id}
            className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-6 px-4 py-6 items-start"
          >
            {/* COURSE INFO */}
            <div className="flex gap-4">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-40 h-24 rounded-md object-cover border border-slate-700"
              />

              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{course.courseName}</h2>

                <p className="text-sm text-slate-400 line-clamp-2">
                  {course.courseDescription}
                </p>

                <p className="text-xs text-slate-500">
                  Created: {new Date(course.createdAt).toLocaleDateString()} |{" "}
                  {new Date(course.createdAt).toLocaleTimeString()}
                </p>

                {/* STATUS BADGE */}
                {course.status?.toLowerCase() === COURSE_STATUS.PUBLISHED ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    ● Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                    ● Drafted
                  </span>
                )}
              </div>
            </div>

            {/* DURATION */}
            <div className="text-sm text-slate-300">
              {course.totalDuration || "0 m 0 s"}
            </div>

            {/* PRICE */}
            <div className="text-sm font-medium">₹ {course.price}</div>

            {/* ACTIONS */}
            <div className="flex gap-4 text-slate-400">
              <button
                onClick={() => onEdit(course._id)}
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
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
