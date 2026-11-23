/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorData } from "../../../../services/operations/insturctor";
import { fetchInstructorCourses } from "../../../../Slices/instructorCoursesSlice";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";
import { BookOpen, Users, IndianRupee, Plus, ArrowRight } from "lucide-react";

const Instructor = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { loading, courseData } = useSelector((state) => state.instructor);
  const { courses } = useSelector((state) => state.instructorCourses);

  useEffect(() => {
    dispatch(fetchInstructorData());
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeStats = Array.isArray(courseData) ? courseData : [];

  const totalAmount = safeStats.length
    ? safeStats.reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0)
    : safeCourses.reduce(
        (acc, curr) =>
          acc + (curr?.studentEnrolled?.length || 0) * (curr?.price || 0),
        0
      );

  const totalStudents = safeStats.length
    ? safeStats.reduce(
        (acc, curr) => acc + (curr?.totalStudentEnrolled || 0),
        0
      )
    : safeCourses.reduce(
        (acc, curr) => acc + (curr?.studentEnrolled?.length || 0),
        0
      );

  if (loading && safeCourses.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading instructor analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hi {user?.firstName || "Instructor"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your course performance, student enrollments, and revenue
          </p>
        </div>
        <Link
          to="/dashboard/add-course"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-400/20 transition w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Courses
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{safeCourses.length}</p>
        </div>

        <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-400/15 border border-sky-400/25 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{totalStudents}</p>
        </div>

        <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {safeCourses.length > 0 ? (
        <>
          {/* Analytics Chart */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <InstructorChart courses={safeCourses} />
          </div>

          {/* Courses Preview */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Your Courses</h2>
              <Link
                to="/dashboard/my-courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {safeCourses.slice(0, 3).map((course) => (
                <Link
                  key={course._id}
                  to={`/dashboard/edit-course/${course._id}`}
                  className="group rounded-xl bg-[#0b1220] border border-white/[0.08] overflow-hidden hover:border-amber-400/40 transition"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-sm text-white line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                      <span>{course.studentEnrolled?.length || 0} students</span>
                      <span className="text-amber-400 font-semibold">
                        ₹{course.price || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl bg-[#0f172a] border border-dashed border-white/15 py-16 px-6 text-center">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">
            You haven&apos;t created any courses yet
          </h3>
          <p className="text-sm text-slate-400 mt-1 mb-5">
            Build your first course with video lectures, AI study notes, and conceptual quizzes.
          </p>
          <Link
            to="/dashboard/add-course"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Add Your First Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
