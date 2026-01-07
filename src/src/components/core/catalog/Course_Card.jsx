/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, heihgt }) => {
  const [avgReviewCount, SetAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.RatingAndReviews);
    SetAvgReviewCount(count);
  }, [course]);

  console.log("The course data in the Course Card Will Be", course);

  return (
    <Link to={`/courses/${course?._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        
        {/* Thumbnail */}
        <div className="overflow-hidden">
          <img
            src={course?.thumbnail}
            alt="course"
            className={`${heihgt} w-full object-cover hover:scale-105 transition-transform duration-300`}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          
          {/* Course Name */}
          <p className="text-lg font-semibold text-gray-800 line-clamp-2">
            {course?.courseName}
          </p>

          {/* Instructor */}
          <p className="text-sm text-gray-500">
            {course?.Insturctor?.firstName} {course?.Insturctor?.lastName}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-yellow-500">
              {avgReviewCount || 0}
            </span>
            <span className="text-gray-400">
              ({course?.RatingAndReviews?.length} Ratings)
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900 mt-1">
            ₹{course?.price}
          </p>

        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
