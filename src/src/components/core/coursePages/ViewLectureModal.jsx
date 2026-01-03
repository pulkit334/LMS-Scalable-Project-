import { X } from "lucide-react";

const ViewLectureModal = ({ lecture, onClose }) => {
  if (!lecture) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* MODAL CONTAINER */}
      <div
        className="
          w-full max-w-2xl
          max-h-[90vh]
          bg-[#0f172a]
          rounded-xl
          border border-slate-700
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER (STICKY) ===== */}
        <div
          className="
          flex justify-between items-center
          px-6 py-4
          border-b border-slate-700
          sticky top-0
          bg-[#0f172a]
          z-10
        "
        >
          <h2 className="text-lg font-semibold text-white">Viewing Lecture</h2>

          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white transition" />
          </button>
        </div>

        {/* ===== BODY (SCROLLABLE) ===== */}
        <div
          className="
          flex-1
          overflow-y-auto
          px-6 py-6
          space-y-6
          
    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-[#0f172a]
    [&::-webkit-scrollbar-thumb]:bg-slate-600
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:hover:bg-slate-500
    
        "
        >
          {/* VIDEO */}
          {lecture.videoUrl ? (
            <video
              src={lecture.videoUrl}
              controls
              preload="metadata"
              className="
                w-full
                max-h-[420px]
                rounded-md
                bg-black
              "
            />
          ) : (
            <div className="text-center text-slate-400 text-sm py-16">
              Video not available for this lecture
            </div>
          )}

          {/* TITLE */}
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Lecture Title
            </label>
            <input
              value={lecture.tittle}
              disabled
              className="
                w-full mt-1
                bg-[#020617]
                border border-slate-700
                px-4 py-2
                rounded-md
                text-slate-200
              "
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Lecture Description
            </label>
            <textarea
              value={lecture.description}
              disabled
              rows={5}
              className="
                w-full mt-1
                bg-[#020617]
                border border-slate-700
                px-4 py-2
                rounded-md
                resize-none
                text-slate-200
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLectureModal;
