import { Star, Users, Globe, User } from "lucide-react";

const CourseHeader = ({ course, reviews }) => {
  const ratingValue = Number(
    reviews?.ratingStats?.averageRating || reviews?.data?.[0]?.rating || 0
  );
  const totalRatings = reviews?.ratingStats?.totalRatings ?? 0;

  return (
    <div className="bg-gradient-to-b from-[#0f172a] via-[#091022] to-[#020617] border-b border-white/[0.08] pt-10 pb-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-8">
          <p className="text-xs font-medium text-slate-400 mb-3 tracking-wide">
            Home / Learning /{" "}
            <span className="text-amber-400 font-semibold">
              {course.category?.name || "Course"}
            </span>
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white tracking-tight">
            {course.courseName}
          </h1>

          <p className="text-slate-300 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
            {course.courseDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">
                {ratingValue.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-3.5 h-3.5 ${
                      n <= Math.round(ratingValue)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400">({totalRatings} ratings)</span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{course.studentEnrolled?.length || 0} students enrolled</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Created by{" "}
              <strong className="text-slate-200 font-medium">
                {course.Insturctor?.firstName} {course.Insturctor?.lastName}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              English
            </span>
          </div>
        </div>

        {/* RIGHT PLACEHOLDER */}
        <div className="hidden lg:block lg:col-span-4" />
      </div>
    </div>
  );
};

export default CourseHeader;
