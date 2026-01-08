const CourseHeader = ({ course, reviews }) => {
  console.log("The courseheader Reviews Data is ");
  return (
    <div className="bg-[#020617] pt-8 pb-[140px]">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-12 gap-10">
        {/* LEFT */}
        <div className="col-span-8">
          <p className="text-sm text-gray-400 mb-1">
            Home / Learning /{" "}
            <span className="text-yellow-400">{course.category?.name}</span>
          </p>

          <h1 className="text-[32px] font-bold leading-tight">
            {course.courseName}
          </h1>

          <p className="text-gray-300 mt-2 max-w-[680px]">
            {course.courseDescription}
          </p>

          <div className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <span className="text-yellow-400 font-semibold">
              {reviews?.data?.[0]?.rating}
            </span>
            ⭐⭐⭐⭐⭐
            <span>({reviews?.ratingStats?.totalRatings} ratings)</span>
            <span>{course.studentEnrolled?.length} students</span>
          </div>

          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>Created by {course.Insturctor?.firstName}</span>
            <span>English</span>
          </div>
        </div>

        {/* RIGHT PLACEHOLDER */}
        <div className="col-span-4"></div>
      </div>
    </div>
  );
};

export default CourseHeader;
