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

const CourseDetailsPage = () => {
  const { Course } = useParams();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [otherReview, setOtherReview] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const courseRes = await GetPayCourse(Course);
      const contentRes = await GetCourseContent(Course);
      const reviewRes = await GetpaymentCourseData(Course);
      const otherRes = await paymentcoursereview(Course);

      setCourse(courseRes?.data);
      setContent(contentRes?.data || []);
      setReviews(reviewRes?.data || []);
      setOtherReview(otherRes || []);
    };

    loadData();
  }, [Course]);

  if (!course) return null;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <CourseHeader course={course} reviews={reviews} />

      {/* MAIN GRID */}
      <div className="max-w-300 mx-auto px-6 grid grid-cols-12 gap-10 -mt-16">

        {/* LEFT CONTENT */}
        <div className="col-span-8 space-y-10">
          <WhatYouWillLearn text={course.whatyouwilllearn} />
          <CourseContent sections={content} />
          <Author instructor={course.Insturctor} />
          <Reviews reviews={otherReview} />
        </div>

        {/* RIGHT BUY CARD */}
        <div className="col-span-4 flex justify-end -mt-24">
          <div className="sticky top-14">
            <BuyCard course={course} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailsPage;
