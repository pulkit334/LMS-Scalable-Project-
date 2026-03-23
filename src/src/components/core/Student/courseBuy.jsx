import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  GetPayCourse,
  GetCourseContent,
  GetpaymentCourseData,
  paymentcoursereview,
} from "../../../services/payment";

import CourseHeader from "./CourseDeatilPage/Header";
import CourseContent from "./CourseDeatilPage/CourseContent";
import BuyCard from "./CourseDeatilPage/buyCard";
import Reviews from "./Reviews/Reviews";
import Author from "./CourseDeatilPage/Author";
import WhatYouWillLearn from "./CourseDeatilPage/CommonModal";
import { useSelector } from "react-redux";


const fetchCourseData = async (Course) => {

  const [courseRes, contentRes, reviewRes, otherRes] = await Promise.all([
    GetPayCourse(Course),
    GetCourseContent(Course),
    GetpaymentCourseData(Course),
    paymentcoursereview(Course),
  ]);

  return {
    course: courseRes?.data,
    content: contentRes?.data || [],
    reviews: reviewRes?.data || [],
    otherReview: otherRes || [],
  };
};

const CourseDetailsPage = () => {
    const token =useSelector((state)=> state.auth.token)

  const { Course } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courseDetails", Course], // Course in key so refetches when id changes
    queryFn: () => fetchCourseData(Course),
    staleTime: 5 * 60 * 1000, // cache for 5 mins, no refetch on revisit
    gcTime : 1000 * 60 * 10,
    enabled : !!token
  });

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#2C333F] border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="text-[#AFB2BF] mt-4 text-sm animate-pulse">Loading course...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.course) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <p className="text-[#AFB2BF] text-lg">Course not found</p>
      </div>
    );
  }

  const { course, content, reviews, otherReview } = data;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <CourseHeader course={course} reviews={reviews} />

      <div className="max-w-7xl mx-auto px-6 flex gap-10 -mt-16">
        <div className="flex-1 space-y-10 min-w-0">
          <WhatYouWillLearn text={course.whatyouwilllearn} />
          <CourseContent sections={content} />
          <Author instructor={course.Insturctor} />
        </div>

        <div className="flex-shrink-0 -mt-24">
          <div className="sticky top-14">
            <BuyCard course={course} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 pb-16">
        <Reviews reviews={otherReview} />
      </div>
    </div>
  );
};

export default CourseDetailsPage;