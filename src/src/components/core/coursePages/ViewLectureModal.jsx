

import { X } from "lucide-react";
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
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f172a] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between px-6 py-4 border-b">
          <h2 className="text-white"> </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          {lecture.videoUrl ? (
            <video src={lecture.videoUrl} controls className="w-full" />
          ) : (
            <p>No video</p>
          )}

          <input value={lecture.tittle} disabled className="w-full mt-4" />
          <textarea
            value={lecture.description}
            disabled
            rows={5}
            className="w-full mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewLectureModal;
