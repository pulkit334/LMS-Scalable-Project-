// eslint-disable-next-line react-refresh/only-export-components
import { useState } from "react";
import Lecture from "./LectureComponent";

const Section = ({ section }) => {
  const [open, setOpen] = useState(false);

  const lectures = section?.subsection || [];

  return (
    <div className="border-t border-gray-800">

      {/* SECTION HEADER */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="w-full flex justify-between items-center px-6 py-4 
                   bg-[#020617] hover:bg-[#020617]/80 transition"
      >
        <div className="flex items-center gap-3 text-left">
          <span
            className={`transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>

          <span className="font-semibold">
            {section.sectionName}
          </span>
        </div>

        <span className="text-sm text-yellow-400">
          {lectures.length} lecture(s)
        </span>
      </button>

      {/* LECTURES (Accordion Body) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        {lectures.length >=1 ? (
          lectures.map((lec) => (
            <Lecture key={lec._id} lecture={lec} />
          ))
        ) : (
          <p className="px-10 py-3 text-sm text-gray-500">
            No lectures available
          </p>
        )}
      </div>
    </div>
  );
};

export default Section;
