
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Layers, PlayCircle } from "lucide-react";
import Section from "./Section";

const CourseContent = ({ sections = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const LIMIT = 10;

  const totalLectures = useMemo(() => {
    return sections.reduce((acc, s) => acc + (s?.subsection?.length || 0), 0);
  }, [sections]);

  const visibleSections = showAll ? sections : sections.slice(0, LIMIT);
  const remainingCount = Math.max(0, sections.length - LIMIT);

  return (
    <div className="bg-[#020617]/90 rounded-2xl border border-slate-800 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-b from-slate-950/40 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100">
              Course content
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1">
                <Layers size={14} className="text-slate-400" />
                {sections.length} section(s)
              </span>

              <span className="text-slate-600">•</span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1">
                <PlayCircle size={14} className="text-slate-400" />
                {totalLectures} lectures
              </span>
            </div>
          </div>

          {/* Indictor*/}
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-400">Updated</span>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="px-2 sm:px-3 py-3 space-y-2">
        {visibleSections.map((section, idx) => (
          <div
            key={section._id || idx}
            className="rounded-xl border border-slate-800/70 bg-slate-950/40 hover:bg-slate-950/60 transition"
          >
            <Section section={section} />
          </div>
        ))}
      </div>

      {/* SHOW MORE / LESS */}
      {sections.length > LIMIT && (
        <div className="border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 transition"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} className="text-slate-400" />
                Show less sections
              </>
            ) : (
              <>
                <ChevronDown size={16} className="text-slate-400" />
                Show {remainingCount} more section(s)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseContent;
