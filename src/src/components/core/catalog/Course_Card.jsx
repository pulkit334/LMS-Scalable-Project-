/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, heihgt }) => {
  const [avgReviewCount, SetAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews);
    SetAvgReviewCount(count);
  }, [course]);
  return (
    <Link to={`/courses/${course?._id}`}>
      <div
        className="
          bg-[#161D29]
          rounded-xl
          border border-[#2C333F]
          overflow-hidden
          cursor-pointer
          transition-all duration-300
          hover:-translate-y-1
          hover:border-[#3A3F4B]
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]
        "
      >
        {/* Thumbnail */}
        <div className="overflow-hidden">
          <img
            src={course?.thumbnail}
            alt="course"
            className={`${heihgt} w-full object-cover transition-transform duration-300 hover:scale-105`}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          
          {/* Course Name */}
          <p className="text-[15px] font-semibold leading-snug text-[#F1F2FF] line-clamp-2">
            {course?.courseName}
          </p>

          {/* Instructor */}
          <p className="text-xs text-[#AFB2BF]">
            {course?.Insturctor?.firstName} {course?.Insturctor?.lastName}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-yellow-400">
              {avgReviewCount || 0}
            </span>
            <span className="text-[#6E727F] text-xs"> 
              ({course?.ratingAndReviews?.length} Ratings)
            </span>
          </div>

          {/* Price */}
          <p className="text-[17px] font-bold text-[#F1F2FF] mt-1">
            ₹{course?.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
