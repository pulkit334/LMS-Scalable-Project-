import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
import CatalogSpinner from "../../../utils/catalogSpinner";

const CourseDetailsPage = () => {
  const { Course } = useParams();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [otherReview, setOtherReview] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); 
        
        const courseRes = await GetPayCourse(Course);
        const contentRes = await GetCourseContent(Course);
        const reviewRes = await GetpaymentCourseData(Course);
        const otherRes = await paymentcoursereview(Course);
        
        setCourse(courseRes?.data);
        setContent(contentRes?.data || []);
        setReviews(reviewRes?.data || []);
        setOtherReview(otherRes || []);
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setLoading(false); 
      }
    };

    loadData();
  }, [Course]);

  //  Show spinner while loading

if (loading) {
  return (
    <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#2C333F] border-t-yellow-400 rounded-full animate-spin"></div>
        <p className="text-[#AFB2BF] mt-4 text-sm animate-pulse">Loading course...</p>
      </div>
    </div>
  );
}
  //  Show message if no course found
  if (!course) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <p className="text-[#AFB2BF] text-lg">Course not found</p>
      </div>
    );
  }

  //  Show course content
  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <CourseHeader course={course} reviews={reviews} />

      {/* MAIN data */}
      <div className="max-w-300 mx-auto px-6 flex gap-10 -mt-16">
        <div className="space-y-10">
          <WhatYouWillLearn text={course.whatyouwilllearn} />
          <CourseContent sections={content} />
          <Author instructor={course.Insturctor} />
          <Reviews reviews={otherReview} />
        </div>

        {/* right One Card */}
        <div className="flex justify-end -mt-24">
          <div className="sticky top-14">
            <BuyCard course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;