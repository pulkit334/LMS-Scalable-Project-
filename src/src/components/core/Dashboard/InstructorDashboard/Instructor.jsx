/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorData } from "../../../../services/operations/insturctor";
import { fetchInstructorCourses } from "../../../../Slices/instructorCoursesSlice";
import Result from "../../../../utils/Spinnre";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { loading, courseData } = useSelector((state) => state.instructor);
  const { courses } = useSelector((state) => state.instructorCourses);

  useEffect(() => {
    dispatch(fetchInstructorData());
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  const totalAmount =
    (courseData ?? []).reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0) ||
    0;

  const totalStudents =
    (courseData ?? []).reduce(
      (acc, curr) => acc + (curr?.totalStudentEnrolled || 0),
      0
    ) || 0;
    
console.log("the insturctireo course are sjefjksdjkfjskd",courseData?.totalStudentEnrolled , "the Totla Amount is",courseData?.amou)
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden text-white">
      {/* Background Gradient (UI only) */}
      <div className="absolute inset-0 bg-linear-to-b from-[#050B19] via-[#050817] to-[#01040D]" />

      {/* Soft Glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-10 -right-40 h-125 w-125 rounded-full bg-cyan-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-[20%] h-112.5 w-112.5 rounded-full bg-indigo-500/10 blur-[160px]" />

      {/* Content */}
      <div className="relative px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-richblack-5">
            Hi {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-richblack-200">
            Let&apos;s start something new
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <Result loading={true} text="Loading.." />
        ) : courses?.length > 0 ? (
          <div className="flex flex-col gap-8">
            {/* Top Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Chart Box */}
              <div className="lg:col-span-8  rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <InstructorChart courses={courses} />
              </div>

              {/* Stats Box */}
              <div className="lg:col-span-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <p className="text-lg font-semibold text-richblack-5">Statics</p>

                <div className="mt-6 flex flex-col gap-5">
                  <div>
                    <p className="text-sm text-richblack-200">Total Courses</p>
                    <p className="mt-1 text-2xl font-bold text-richblack-5">
                      {courses.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-richblack-200">Total Students</p>
                    <p className="mt-1 text-2xl font-bold text-richblack-5">
                      {totalStudents}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-richblack-200">Total Income</p>
                    <p className="mt-1 text-2xl font-bold text-richblack-5">
                      ₹ {totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-richblack-5">
                    Your Courses
                  </p>
                  <p className="text-sm text-richblack-200">
                    Manage your courses like an industry-level LMS
                  </p>
                </div>

                <Link
                  to="/dashboard/my-courses"
                  className="rounded-lg border border-white/10 bg-richblack-900/40 px-4 py-2 text-sm font-medium text-richblack-5 hover:bg-richblack-700/30 transition-all"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course?._id}
                    className="group rounded-2xl overflow-hidden border border-white/5 bg-richblack-900/40 hover:bg-richblack-900/60 hover:border-white/10 transition-all"
                  >
                    <div className="relative h-[170px] w-full overflow-hidden">
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-full w-full object-cover group-hover:scale-[1.06] transition-transform duration-300"
                      />

                      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold border border-white/10 backdrop-blur-md">
                        ₹ {course?.price || 0}
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-base font-semibold text-richblack-5 line-clamp-1">
                        {course?.courseName}
                      </p>

                      <p className="mt-1 text-sm text-richblack-200 line-clamp-2">
                        {course?.courseDescription || "No description added yet."}
                      </p>

                      <div className="my-4 h-[1px] w-full bg-white/5" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col gap-1">
                          <p className="text-richblack-300">Students</p>
                          <p className="font-semibold text-richblack-5">
                            {course?.studentEnrolled?.length || 0}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-richblack-300">Lessons</p>
                          <p className="font-semibold text-richblack-5">
                            {course?.courseContent?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5  flex items-center justify-center">
                        <Link
                          to={`/course/${course?._id}`}
                          className="text-sm font-medium text-yellow-50 hover:text-yellow-25"
                        >
                          Preview
                        </Link>

                        <Link
                          to={`/dashboard/edit-course/${course?._id}`}
                          className="rounded-lg bg-richblack-700/50 px-4 py-2 text-sm font-semibold text-richblack-5 hover:bg-richblack-600/60 transition-all border border-white/5"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-lg font-semibold text-richblack-5">
              No courses found
            </p>
            <p className="mt-2 text-sm text-richblack-200">
              Start by creating your first course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructor;
