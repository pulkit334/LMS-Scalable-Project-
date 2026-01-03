/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { createSubsection } from "../../../services/auth";
import { useState } from "react";
import { getVideoDuration } from "../../../utils/TimeDurationcalc";
import toast from "react-hot-toast";

const AddLectureModal = ({ isOpen, onClose, sectionId }) => {
  if (!isOpen) return null;
  const [videoPreview, setVideoPreview] = useState(false);
  const [timeDuration, setTimeDuration] = useState(0); // in seconds
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm();
  const handleVideoPreview = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) return;
    const duration = await getVideoDuration(file);
    setTimeDuration(duration);
    setVideoPreview(URL.createObjectURL(file));
  };
  let toastId;
  const handleSave = async (data) => {
    const formData = new FormData();
    // toastId = toast.loading("loading");
    // manual fields (not in RHF)
    formData.append("sectionId", sectionId);
    formData.append("timeDuration", timeDuration);

    // RHF fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === "videoFile") {
        formData.append("videoFile", value[0]); // FileList → File
      } else {
        formData.append(key, value);
      }
    });

    const response = await createSubsection(formData);
    const newLecture = response.data.updatedSection.subsection.at(-1);

    onClose(newLecture);
    // toast.success("successfully Saved", toastId);
    reset();
    setVideoPreview(false);
  };
  return (
    <div
      className="fixed inset-0 z-50  bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="
        w-full max-w-170
        max-h-[85vh]
        bg-[#0f172a]
        rounded-xl
        border border-slate-700
        shadow-xl
        flex flex-col
        overflow-y-auto
    "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Adding Lecture</h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* FORM */}
        <form className="flex flex-col" onSubmit={handleSubmit(handleSave)}>
          <div className="px-6 py-6 space-y-6 flex-1">
            {/* VIDEO */}
            {/* VIDEO */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Lecture Video <span className="text-yellow-400">*</span>
              </label>

              <label
                className="
        flex flex-col items-center justify-center
        border border-dashed border-slate-600
        rounded-lg p-6
        cursor-pointer
        hover:border-yellow-400
        transition
        overflow-hidden
        bg-[#020617]
        "
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleVideoPreview(e.dataTransfer.files[0]);
                }}
              >
                {/* PREVIEW */}
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="
            w-full
            max-h-[260px]
            aspect-video
            rounded-md
            object-contain
            bg-black
            "
                  />
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center mb-3">
                      <Upload className="text-yellow-400" />
                    </div>

                    <p className="text-sm text-slate-300 text-center">
                      Drag and drop a video, or{" "}
                      <span className="text-yellow-400 font-medium">
                        Browse
                      </span>
                    </p>

                    <div className="flex gap-6 text-xs text-slate-400 mt-3">
                      <span>• Aspect ratio 16:9</span>
                      <span>• Recommended size 1024×576</span>
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept="video/*"
                  hidden
                  {...register("videoFile", {
                    required: "Lecture video is required",
                    onChange: (e) => {
                      handleVideoPreview(e.target.files[0]);
                    },
                  })}
                />
              </label>

              {errors.videoFile && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.videoFile.message}
                </p>
              )}
            </div>

            {/* TITLE */}
            <div>
              <label className="text-sm  font-medium text-white mb-1 block">
                Lecture Title <span className="text-yellow-400">*</span>
              </label>
              <input
                {...register("tittle", {
                  required: "Lecture title is required",
                })}
                placeholder="Enter Lecture Title"
                className="w-full h-11 rounded-md bg-[#020617] border border-slate-600 px-4 text-white focus:outline-none focus:border-yellow-400"
              />
              {errors.tittle && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.tittle.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium text-white mb-1 block">
                Lecture Description <span className="text-yellow-400">*</span>
              </label>
              <textarea
                rows={4}
                {...register("description", {
                  required: "Lecture description is required",
                })}
                placeholder="Enter Lecture Description"
                className="w-full rounded-md bg-[#020617] border border-slate-600 px-4 py-3 text-white resize-none focus:outline-none focus:border-yellow-400"
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end px-6 py-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-300 transition disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLectureModal;
