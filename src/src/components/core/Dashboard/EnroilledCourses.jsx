// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEnrolledCourses } from "../../../Slices/EnroilledCourseSlice";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { MoreVertical, Check, Trash2 } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";

// const EnrolledCourses = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { enrolledCourses, loading, error } = useSelector(
//     (state) => state.enrollment
//   );

//   const [activeTab, setActiveTab] = useState("all");
//   const [openMenu, setOpenMenu] = useState(null);

//   useEffect(() => {
//     dispatch(fetchEnrolledCourses());
//   }, [location.pathname, dispatch]);

//   //  LOADING (same behavior as before)
//   if (loading || enrolledCourses === null) {
//     return <div className="text-white">Loading...</div>;
//   }

//   //  ERROR
//   if (error) {
//     return <p className="text-red-400">{error}</p>;
//   }

//   //  EMPTY
//   if (enrolledCourses.length === 0) {
//     return <p className="text-white">You have not enrolled in any courses</p>;
//   }

//   //  FILTER BASED ON TAB
//   const filteredCourses = enrolledCourses.filter((course) => {
//     if (activeTab === "completed") return course.progressPercentage === 100;
//     if (activeTab === "pending") return course.progressPercentage < 100;
//     return true;
//   });
// // console.log("the filterdata is ",filteredCourses._id);
// console.log("The Enrolled Course data is  ",enrolledCourses)
//   return (
//     <div className="rounded-xl bg-[#0F172A] p-6 text-white">
//       {/* TITLE */}
//       <h2 className="mb-4 text-2xl font-semibold">Enrolled Courses</h2>

//       {/* TABS */}
//       <div className="mb-6 flex w-fit gap-2 rounded-full bg-[#1E293B] p-1">
//         {["all", "pending", "completed"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`rounded-full px-4 py-1 text-sm capitalize transition ${
//               activeTab === tab
//                 ? "bg-[#020617] text-white"
//                 : "text-slate-400 hover:text-white"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* HEADER */}
//       <div className="grid grid-cols-3 rounded-t-lg bg-[#1E293B] px-4 py-3 text-sm text-slate-300">
//         <p>Course Name</p>
//         <p>Durations</p>
//         <p>Progress</p>
//       </div>

//       {/* COURSES */}
//       <div
//         onClick={() => {
//           navigate(
//             `view-course/${enrolledCourses._id}/section/${filteredCourses?.courseContent?.[0]?._id}/sub-section/${filteredCourses?.courseContent?.[0]?.subsection?.[0]?._id}`
//           );
//         }}
//         className="  rounded-b-lg border border-slate-800"
//       >
//         {filteredCourses.map((course) => (
//           <div
//             key={course._id}
//             className="grid grid-cols-3 items-center gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0"
//           >
//             {/* COURSE INFO */}
//             <div className="flex items-center gap-4">
//               {course.thumbnail.endsWith(".mp4") ? (
//                 <video
//                   src={course.thumbnail}
//                   className="h-12 w-20 rounded-md object-cover"
//                   muted
//                   preload="metadata"
//                 />
//               ) : (
//                 <img
//                   src={course.thumbnail}
//                   alt={course.courseName}
//                   className="h-12 w-20 rounded-md object-cover"
//                 />
//               )}
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
//             <div className="relative flex items-center gap-4">
//               <div className="flex-1">
//                 {course.progressPercentage === 100 ? (
//                   <p className="mb-1 text-sm text-green-400">Completed</p>
//                 ) : (
//                   <p className="mb-1 text-sm text-slate-300">
//                     Progress {course.progressPercentage || 0}
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

//               {/* MENU BUTTON */}
//               <button
//                 onClick={() =>
//                   setOpenMenu(openMenu === course._id ? null : course._id)
//                 }
//                 className="rounded-md p-2 hover:bg-slate-800"
//               >
//                 <MoreVertical size={18} />
//               </button>

//               {/* DROPDOWN */}
//               {openMenu === course._id && (
//                 <div className="absolute right-0 top-10 z-10 w-44 rounded-lg bg-[#1E293B] shadow-lg">
//                   <button className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-700">
//                     <Check size={16} /> Mark as Completed
//                   </button>
//                   <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700">
//                     <Trash2 size={16} /> Remove
//                   </button>
//                 </div>
//               )}
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
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrolledCourses } from "../../../Slices/EnroilledCourseSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import { MoreVertical, Check, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { enrolledCourses, loading, error } = useSelector(
    (state) => state.enrollment
  );

  const [activeTab, setActiveTab] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [location.pathname, dispatch]);

  if (loading || enrolledCourses === null) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (enrolledCourses.length === 0) {
    return <p className="text-white">You have not enrolled in any courses</p>;
  }

  const filteredCourses = enrolledCourses.filter((course) => {
    if (activeTab === "completed") return course.progressPercentage === 100;
    if (activeTab === "pending") return course.progressPercentage < 100;
    return true;
  });
  console.log(
    "the fiteredcourse are ",
    filteredCourses?.[0]?.courseContent?.[0]?.subsection
  );
  console.log("the result is ", filteredCourses);
  return (
    <div className="rounded-xl bg-[#0F172A] p-6 text-white">
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
            onClick={() => {
              navigate(
                `/view-course/${course._id}/section/${course.courseContent?.[0]}`
              );
            }}
            className="grid grid-cols-3 items-center gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0 cursor-pointer"
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
                    course.progressPercentage === 100 ? "#22c55e" : "#38bdf8"
                  }
                  baseBgColor="#1e293b"
                />
              </div>

              {/* MENU BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === course._id ? null : course._id);
                }}
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
