// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from "react";
// import { UserEnrolledCourses } from "../../../services/operations/Profileapi";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { MoreVertical } from "lucide-react";

// const EnrolledCourses = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState(null);

//   const getEnrolledCourse = async () => {
//     try {
//       const response = await UserEnrolledCourses();
//       setEnrolledCourses(response);
//     } catch (error) {
//       console.log("Error fetching enrolled courses", error);
//       setEnrolledCourses([]);
//     }
//   };

//   useEffect(() => {
//     getEnrolledCourse();
//   }, []);

//   if (enrolledCourses === null) {
//     return <div className="text-white">Loading...</div>;
//   }

//   if (enrolledCourses.length === 0) {
//     return <p className="text-white">You have not enrolled in any courses</p>;
//   }

//   return (
//     <div className="rounded-xl bg-[#0F172A] p-6 text-white">
//       {/* HEADER */}
//       <div className="grid grid-cols-3 border-b border-slate-700 pb-3 text-sm text-slate-300">
//         <p>Course Name</p>
//         <p>Duration</p>
//         <p>Progress</p>
//       </div>

//       {/* COURSES */}
//       <div className="mt-4 space-y-4">
//         {enrolledCourses.map((course) => (
//           <div
//             key={course._id}
//             className="grid grid-cols-3 items-center gap-4 border-b border-slate-800 pb-4"
//           >
//             {/* COURSE INFO */}
//             <div className="flex items-center gap-4">
//               <img
//                 src={course.thumbnail}
//                 alt={course.courseName}
//                 className="h-12 w-20 rounded-md object-cover"
//               />
//               <div>
//                 <p className="font-medium">{course.courseName}</p>
//                 <p className="text-sm text-slate-400 line-clamp-1">
//                   {course.courseDescription}
//                 </p>
//               </div>
//             </div>

//             {/* DURATION */}
//             <p className="text-slate-300">{course.totalDuration}</p>

//             {/* PROGRESS */}
//             <div className="flex items-center gap-4">
//               <div className="flex-1">
//                 {course.progressPercentage === 100 ? (
//                   <p className="mb-1 text-sm text-green-400">Completed</p>
//                 ) : (
//                   <p className="mb-1 text-sm text-slate-300">
//                     Progress {course.progressPercentage || 0}%
//                   </p>
//                 )}

//                 <ProgressBar
//                   completed={course.progressPercentage || 0}
//                   height="6px"
//                   isLabelVisible={false}
//                   bgColor={
//                     course.progressPercentage === 100 ? "#22c55e" : "#38bdf8"
//                   }
//                   baseBgColor="#1e293b"
//                 />
//               </div>

//               {/* MENU ICON */}
//               <button className="rounded-md p-2 hover:bg-slate-800">
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EnrolledCourses;
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { UserEnrolledCourses } from "../../../services/operations/Profileapi";
import ProgressBar from "@ramonak/react-progress-bar";
import { MoreVertical, Check, Trash2 } from "lucide-react";

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const getEnrolledCourse = async () => {
    try {
      const response = await UserEnrolledCourses();
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Error fetching enrolled courses", error);
      setEnrolledCourses([]);
    }
  };

  useEffect(() => {
    getEnrolledCourse();
  }, []);

  if (enrolledCourses === null) {
    return <div className="text-white">Loading...</div>;
  }

  if (enrolledCourses.length === 0) {
    return <p className="text-white">You have not enrolled in any courses</p>;
  }

  // 🔹 FILTER BASED ON TAB
  const filteredCourses = enrolledCourses.filter((course) => {
    if (activeTab === "completed") return course.progressPercentage === 100;
    if (activeTab === "pending") return course.progressPercentage < 100;
    return true;

  });

  return (
    <div className="rounded-xl bg-[#0F172A] p-6 text-white">
      {/* TITLE */}
      <h2 className="mb-4 text-2xl font-semibold">Enrolled Courses</h2>

      {/* TABS */}
      <div className="mb-6 flex w-fit gap-2 rounded-full bg-[#1E293B] p-1">
        {["all", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1 text-sm capitalize transition ${
              activeTab === tab
                ? "bg-[#020617] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-3 rounded-t-lg bg-[#1E293B] px-4 py-3 text-sm text-slate-300">
        <p>Course Name</p>
        <p>Durations</p>
        <p>Progress</p>
      </div>

      {/* COURSES */}
      <div className="rounded-b-lg border border-slate-800">
        {filteredCourses.map((course) => (
          
          <div
            key={course._id}
            className="grid grid-cols-3 items-center gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0"
          >
            {/* COURSE INFO */}
            <div className="flex items-center gap-4">
           {course.thumbnail.endsWith(".mp4") ? (
  <video
    src={course.thumbnail}
    className="h-12 w-20 rounded-md object-cover"
    muted
    preload="metadata"
  />
) : (
  <img
    src={course.thumbnail}
    alt={course.courseName}
    className="h-12 w-20 rounded-md object-cover"
  />
)}
              <div>
                <p className="font-medium">{course.courseName}</p>
                <p className="text-sm text-slate-400 line-clamp-1">
                  {course.courseDescription}
                </p>
              </div>
            </div>

            {/* DURATION */}
            <p className="text-slate-300">{course.totalDuration}</p>

            {/* PROGRESS */}
            <div className="relative flex items-center gap-4">
              <div className="flex-1">
                {course.progressPercentage === 100 ? (
                  <p className="mb-1 text-sm text-green-400">Completed</p>
                ) : (
                  <p className="mb-1 text-sm text-slate-300">
                    Progress {course.progressPercentage || 0}%
                  </p>
                )}

                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="6px"
                  isLabelVisible={false}
                  bgColor={
                    course.progressPercentage === 100
                      ? "#22c55e"
                      : "#38bdf8"
                  }
                  baseBgColor="#1e293b"
                />
              </div>

              {/* MENU BUTTON */}
              <button
                onClick={() =>
                  setOpenMenu(
                    openMenu === course._id ? null : course._id
                  )
                }
                className="rounded-md p-2 hover:bg-slate-800"
              >
                <MoreVertical size={18} />
              </button>

              {/* DROPDOWN */}
              {openMenu === course._id && (
                <div className="absolute right-0 top-10 z-10 w-44 rounded-lg bg-[#1E293B] shadow-lg">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-700">
                    <Check size={16} /> Mark as Completed
                  </button>
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700">
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
