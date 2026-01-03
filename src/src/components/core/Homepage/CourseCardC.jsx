import React from "react";
import { FaUser, FaBook } from "react-icons/fa";

const CourseCardC = ({ cardData, currnetCard, setCurrentCard }) => {
  const isActive = currnetCard === cardData.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData.heading)}
      className={`relative w-90 cursor-pointer rounded-lg p-6 transition-all duration-300
        ${
          isActive
            ? "bg-white text-[#0b1220]"
            : "bg-[#0b1220] text-slate-400"
        }`}
    >
      {/* Yellow strip */}
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1.5 bg-yellow-400 rounded-l-lg" />
      )}

      {/* Title */}
      <h3
        className={`text-xl font-semibold mb-3 ${
          isActive ? "text-[#0b1220]" : "text-slate-200"
        }`}
      >
        {cardData.heading}
      </h3>

      {/* Description */}
      <p
        className={`text-sm leading-6 mb-8 ${
          isActive ? "text-slate-600" : "text-slate-400"
        }`}
      >
        {cardData.description}
      </p>

      {/* Divider */}
      <div className="border-t border-slate-600 mb-4" />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <FaUser className="text-purple-400" />
          <span>{cardData.level}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaBook className="text-blue-400" />
          <span>{cardData.lessionNumber} Lessons</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCardC;
