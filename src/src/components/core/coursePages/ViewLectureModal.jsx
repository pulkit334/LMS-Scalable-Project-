import { X, Clock, FileText, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setViewLecture } from "../../../Slices/courseSlice";

const ViewLectureModal = () => {
  const dispatch = useDispatch();
  const lecture = useSelector((state) => state.course.viewLecture);

  if (!lecture) return null;

  const onClose = () => {
    dispatch(setViewLecture(null));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(2,6,23,0.88)", backdropFilter: "blur(12px)", fontFamily: "'DM Sans', sans-serif" }}
      onClick={onClose}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .vlm-card {
          background: linear-gradient(135deg, #0d1526 0%, #080f1e 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03);
          width: 100%; max-width: 680px;
          border-radius: 20px;
          overflow: hidden;
        }

        .vlm-close {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .vlm-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .vlm-video {
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .vlm-field {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          resize: none;
          outline: none;
          cursor: default;
        }

        .vlm-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 6px;
        }
      `}</style>

      <div
        className="vlm-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="min-w-0 flex-1 pr-4">
            <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(251,191,36,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Lecture Preview
            </p>
            <h2
              className="text-sm font-bold truncate"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
            >
              {lecture.tittle || "Untitled Lecture"}
            </h2>
          </div>
          <button className="vlm-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Video */}
          {lecture.videoUrl ? (
            <div className="vlm-video">
              <video src={lecture.videoUrl} controls className="w-full" style={{ display: "block" }} />
            </div>
          ) : (
            <div
              className="vlm-video flex flex-col items-center justify-center py-12"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Play size={32} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No video available</p>
            </div>
          )}

          {/* Title field */}
          <div>
            <p className="vlm-label">
              <FileText size={11} /> Title
            </p>
            <input value={lecture.tittle} disabled className="vlm-field" />
          </div>

          {/* Description field */}
          <div>
            <p className="vlm-label">
              <FileText size={11} /> Description
            </p>
            <textarea
              value={lecture.description}
              disabled
              rows={5}
              className="vlm-field"
            />
          </div>

          {/* Duration badge */}
          {typeof lecture.timeduration === "number" && (
            <div className="flex items-center gap-2">
              <Clock size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                Duration: <span style={{ color: "#fbbf24", fontWeight: 600 }}>{lecture.timeduration}s</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLectureModal;
