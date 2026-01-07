/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { createSubsection, UpdateSubsection } from "../../../services/auth";
import { useEffect, useState } from "react";
import { getVideoDuration } from "../../../utils/TimeDurationcalc";
import toast from "react-hot-toast";

const AddLectureModal = ({ isOpen, onClose, sectionId, lecture = null }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(lecture);
  const MAX_VIDEO_MB = 100;
  const subSectionId = lecture?._id;

  const [videoPreview, setVideoPreview] = useState(false);
  const [timeDuration, setTimeDuration] = useState(0);

  /* -------------------- RHF -------------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  /* -------------------- PREFILL (EDIT) -------------------- */
  useEffect(() => {
    if (lecture) {
      reset({
        tittle: lecture.tittle,
        description: lecture.description,
      });
      setTimeDuration(lecture.timeduration || 0);
      setVideoPreview(lecture.videoUrl || false);
    }
  }, [lecture, reset]);

  /* -------------------- VIDEO PREVIEW -------------------- */
  const handleVideoPreview = async (file) => {
    if (!file) return;

    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video must be under ${MAX_VIDEO_MB}MB`);
      return;
    }

    if (!file.type.startsWith("video/")) return;

    const duration = await getVideoDuration(file);
    setTimeDuration(duration);
    setVideoPreview(URL.createObjectURL(file));
  };

  /* -------------------- SAFE CLOSE -------------------- */
  const handleModalClose = () => {
    onClose(null); // ✅ IMPORTANT
  };

  /* -------------------- SAVE -------------------- */
  const handleSave = async (data) => {
    let toastId;
    try {
      const formData = new FormData();

      formData.append("sectionId", sectionId);
      formData.append("timeDuration", timeDuration);

      Object.entries(data).forEach(([key, value]) => {
        if (key === "videoFile" && value?.length) {
          formData.append("videoFile", value[0]);
        } else if (key !== "videoFile") {
          formData.append(key, value);
        }
      });

      toastId = isEdit
        ? toast.loading("Updating")
        : toast.loading("Creating Subsection");

      const response = isEdit
        ? await UpdateSubsection(subSectionId, formData)
        : await createSubsection(formData);
      if (response?.data?.success) {
        toast.success("Updated successfully", { id: toastId });
      }
      onClose({
        isEdit,
        sectionId,
        updatedSection: response?.data?.UpdatedData || null,
        lecture: response?.data?.subsection || null,
      });

      toast.success("Updated successfully", { id: toastId });
      reset();
      setVideoPreview(false);
    } catch (err) {
      toast.error("Failed Try Again", { id: toastId });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={handleModalClose} // ✅ FIX
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
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Lecture" : "Adding Lecture"}
          </h2>
          <button onClick={handleModalClose}>
            {" "}
            {/* ✅ FIX */}
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* FORM */}
        <form className="flex flex-col" onSubmit={handleSubmit(handleSave)}>
          <div className="px-6 py-6 space-y-6 flex-1">
            {/* VIDEO */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Lecture Video{" "}
                {!isEdit && <span className="text-yellow-400">*</span>}
              </label>

              <label className="flex flex-col items-center justify-center border border-dashed border-slate-600 rounded-lg p-6 cursor-pointer bg-[#020617]">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-65 rounded-md bg-black"
                  />
                ) : (
                  <>
                    <Upload className="text-yellow-400 mb-2" />
                    <p className="text-sm text-slate-300">
                      Drag & drop or{" "}
                      <span className="text-yellow-400">Browse</span>
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="video/*"
                  hidden
                  {...register("videoFile", {
                    required: !isEdit && "Lecture video is required",
                    onChange: (e) => handleVideoPreview(e.target.files[0]),
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
              <label className="text-sm font-medium text-white mb-1 block">
                Lecture Title <span className="text-yellow-400">*</span>
              </label>
              <input
                {...register("tittle", {
                  required: "Lecture title is required",
                })}
                className="w-full h-11 rounded-md bg-[#020617] border border-slate-600 px-4 text-white"
              />
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
                className="w-full rounded-md bg-[#020617] border border-slate-600 px-4 py-3 text-white resize-none"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end px-6 py-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold disabled:opacity-60"
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
