// eslint-disable-next-line react-refresh/only-export-components
import { useState } from "react";
import Section from "./Section";

const CourseContent = ({ sections = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const LIMIT = 10;

  const visibleSections = showAll
    ? sections
    : sections.slice(0, LIMIT);

  const remainingCount = sections.length - LIMIT;

  return (
    <div className="bg-[#020617] rounded-lg border border-gray-800">
      
      {/* HEADER */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-semibold">Course content</h2>
        <p className="text-sm text-gray-400 mt-1">
          {sections.length} section(s) •{" "}
          {sections.reduce(
            (acc, s) => acc + (s?.subsection?.length || 0),
            0
          )}{" "}
          lectures
        </p>
      </div>

      {/* SECTIONS */}
      {visibleSections.map((section, idx) => (
        <Section key={section._id || idx} section={section} />
      ))}

      {/* SHOW MORE SECTIONS */}
      {sections.length > LIMIT && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className="w-full px-6 py-3 text-sm text-blue-400 hover:underline border-t border-gray-800"
        >
          {showAll
            ? "Show less sections"
            : `+${remainingCount} more section(s)`}
        </button>
      )}
    </div>
  );
};

export default CourseContent;
