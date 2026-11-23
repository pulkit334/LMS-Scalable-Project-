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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newVideoFile, setNewVideoFile] = useState(null); // Track new video file

  /* -------------------- RHF -------------------- */
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  /* -------------------- Phele se Bari hui hai  -------------------- */
  useEffect(() => {
    if (lecture) {
      reset({
        tittle: lecture.tittle,
        description: lecture.description,
      });
      setTimeDuration(lecture.timeduration || 0);
      setVideoPreview(lecture.videoUrl || false);
      setNewVideoFile(null); // Reset new video file
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
    setNewVideoFile(file); //  Store the new file
};

  /* -------------------- SAFE CLOSE -------------------- */
  const handleModalClose = () => {
    onClose(null);
  };

  /* -------------------- SAVE -------------------- */
  const handleSave = async (data) => {
    let toastId;
    try {
      const formData = new FormData();

      formData.append("sectionId", sectionId);
      formData.append("timeDuration", timeDuration);

      //  Check if there's a new video file (from state, not form data)
      const hasNewVideo = newVideoFile !== null;

      if (hasNewVideo) {
        formData.append("videoFile", newVideoFile);
}

      // Add other form fields
      formData.append("tittle", data.tittle);
      formData.append("description", data.description);

      // Show appropriate loading message
      if (hasNewVideo) {
        toastId = toast.loading(isEdit ? "Uploading new video..." : "Uploading video...");
        setIsUploading(true);
        setUploadProgress(0);
      } else {
        toastId = toast.loading(isEdit ? "Updating lecture..." : "Creating lecture...");
      }

      const response = isEdit
        ? await UpdateSubsection(subSectionId, formData, {
            onUploadProgress: (progressEvent) => {
              if (hasNewVideo) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
                toast.loading(`Uploading... ${percent}%`, { id: toastId });
              }
            }
          })
        : await createSubsection(formData, {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
              toast.loading(`Uploading... ${percent}%`, { id: toastId });
            }
          });

      setIsUploading(false);
if (response?.data?.success) {
        toast.success(isEdit ? "Lecture updated!" : "Lecture created!", { id: toastId });
        
        onClose({
          isEdit,
          sectionId,
          updatedSection: response?.data?.UpdatedData,
          lecture: response?.data?.subsection,
        });

        reset();
        setVideoPreview(false);
        setUploadProgress(0);
        setNewVideoFile(null);
      }
    } catch (err) {
      console.error("❌ Save error:", err);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error("Failed. Try again.", { id: toastId });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={handleModalClose}
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

              {videoPreview ? (
                // WHEN VIDEO EXISTS
                <div className="space-y-3">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-65 rounded-md bg-black border border-slate-600"
                  />
                  
                  {/* CHANGE VIDEO BUTTON */}
                  <label className="flex items-center justify-center gap-2 border border-yellow-400 text-yellow-400 rounded-md px-4 py-2 cursor-pointer hover:bg-yellow-400/10 transition">
                    <Upload size={18} />
                    <span>Change Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleVideoPreview(file);
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                // WHEN NO VIDEO
                <label className="flex flex-col items-center justify-center border border-dashed border-slate-600 rounded-lg p-6 cursor-pointer bg-[#020617]">
                  <Upload className="text-yellow-400 mb-2" />
                  <p className="text-sm text-slate-300">
                    Drag & drop or{" "}
                    <span className="text-yellow-400">Browse</span>
                  </p>
                  
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
              )}

              {/* PROGRESS BAR */}
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-yellow-400 mt-2 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

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