
import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighLightText from "./highlightext";
import CourseCardC from "./CourseCardC";
const tabsname = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];
const ExporeMore = () => {
  const [currentInfo, setcurrentInfo] = useState(tabsname[0]);

  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currnetCard, setCurrentCard] = useState(
    HomePageExplore[0]?.courses[0]?.heading
  );
  const setmyCard = (value) => {
    setcurrentInfo(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };
  return (
    <div className="p-2">
      <div className="text-4xl font-semibold text-center">
        Unlock The
        <HighLightText text={"Power of Code"}></HighLightText>
      </div>
      <p className="text-center text-[#0b1220] text-lg mt-3 text-[16px]">
        Learn To Build Anything You can Imagine
      </p>
      <div className="flex gap-3 justify-center mt-6 bg-gray-800 p-2 rounded-full">
        {tabsname.map((item, index) => (
          <div
            key={index}
            onClick={() => setmyCard(item)}
            className={`text-[14px] px-5 py-2 rounded-full cursor-pointer transition-all duration-200
        ${
          currentInfo === item
            ? "bg-[#0b1220] text-white font-medium"
            : "text-gray-300 hover:bg-richblack-700"
        }`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="lg:h-[40px]"></div>
      {/* course card ka group  */}
     <div className="w-full bg-[#0b1220] py-16">
  <div className="mx-auto max-w-maxContent">
    <div className="flex gap-8 justify-center">
      {courses.map((item, index) => (
        <CourseCardC
          key={index}
          cardData={item}
          currnetCard={currnetCard}
          setCurrentCard={setCurrentCard}
        />
      ))}
    </div>
  </div>
</div>

    </div>
  );
};

export default ExporeMore;
