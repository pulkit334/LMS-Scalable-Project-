import React from "react";
import Logo1 from "/TimeLineLogo/Logo1.svg";
import Logo2 from "/TimeLineLogo/Logo2.svg";
import Logo3 from "/TimeLineLogo/Logo3.svg";
import Logo4 from "/TimeLineLogo/Logo4.svg";
import TimeLineimage from "/Images/TimelineImage.png";

const timelink = [
  {
    Logo: Logo1,
    heading: "Leadership",
    description: "Fully committed to the success company",
    bg: "bg-blue-100",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority",
    bg: "bg-pink-100",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    description: "The ability to switch is an important skill",
    bg: "bg-green-100",
  },
  {
    Logo: Logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution",
    bg: "bg-yellow-100",
  },
];

const TimeLineSection = () => {
  return (
    <div className="w-full mt-20  bg-white 10">
      <div className="w-11/12  max-w-maxContent mx-auto flex items-center">
        {/* LEFT TIMELINE */}
        <div className="w-[45%] relative">
          {/* soft background fade */}

          <div className="relative  flex flex-col gap-12 pl-1 lg:pl-2">
            {timelink.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                {/* icon */}
                <div
                  className={`w-[52px] h-[52px] rounded-full ${item.bg}
                  flex items-center justify-center z-10`}
                >
                  <img src={item.Logo} alt="" className="w-6 h-6" />
                </div>

                {/* text */}
                <div>
                  <h3 className="font-semibold text-[16px] text-black">
                    {item.heading}
                  </h3>
                  <p className="text-[14px] text-gray-600 max-w-[280px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        {/* RIGHT IMAGE */}
        <div className="lg:w-[55%] w-[70%] flex justify-end relative">
          <img
            src={TimeLineimage}
            alt="Timeline"
            className="rounded object-cover shadow-black"
          />

          {/* STATS BAR */}
          <div
            className="
      absolute 
      bottom-[-30px] 
      left-1/2 -translate-x-1/2
      bg-green-900
      flex  lg:p-3
      
      text-white 
      uppercase
      shadow-lg
    "
          >
            <div className="flex gap-5 items-center border-r border-green-500 px-8 py-4">
              <p className="text-3xl font-bold">10</p>
              <p className="text-green-200 text-sm leading-4">
                Years of <br /> Experience
              </p>
            </div>

            <div className="flex gap-5 items-center px-8 py-4">
              <p className="text-3xl font-bold">250</p>
              <p className="text-green-200 text-sm leading-4">
                Types of <br /> Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSection;

//   <div className="absolute left-[28px] top-6 bottom-6 border-l-2 border-dotted border-gray-300"></div>
