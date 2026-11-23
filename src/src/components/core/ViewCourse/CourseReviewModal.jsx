/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CreateRating, UpdationApi } from "../../../services/operations/Rating";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fetchCourseReviews } from "../../../Slices/RatingSlice";
import { X } from "lucide-react";

// Minimalist Star Icon
const StarIcon = ({ filled, onClick, className = "" }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`cursor-pointer transition-colors ${className}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CourseReviewModal = ({
  setReviewModal,
  isEdit = false,
  defaultData = null,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  let UpdationResponse;
  
  const disptach = useDispatch();
  const { courseId } = useParams();

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      courseRating: 0,
      courseExperince: "",
    },
  });

  useEffect(() => {
    if (isEdit && defaultData) {
      setCurrentRating(defaultData.courseRating || 0);
      setValue("courseRating", defaultData.courseRating || 0);
      setValue("courseExperince", defaultData.courseExperince || "");
    } else {
      setCurrentRating(0);
      setValue("courseRating", 0);
      setValue("courseExperince", "");
    }
  }, [isEdit, defaultData, setValue]);

  const onSubmit = async (data) => {
    let toastid;
    try {
      toastid = isEdit
        ? toast.loading("Updating....")
        : toast.loading("Submitting....");

      if (!isEdit) {
        const response = await CreateRating(
          {
            courseId: courseEntireData?._id,
            data: {
              rating: currentRating,
              review: data.courseExperince,
            },
          },
          token
        );
      } else {
        UpdationResponse = await UpdationApi(
          {
            reviewId: defaultData?.reviewId,
            data: {
              rating: currentRating,
              review: data.courseExperince,
            },
          },
          token
        );
      }

      if (UpdationResponse?.success) {
        toast.success(`${UpdationResponse?.message}`, { id: toastid });
      } else toast.success("Review submitted successfully", { id: toastid });

      disptach(fetchCourseReviews(courseId));
      
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error("Something went wrong");
    }
  };

  const ratingChange = (rating) => {
    setCurrentRating(rating);
    setValue("courseRating", rating);
  };

  useEffect(() => {
    setValue("courseRating", 0);
    setValue("courseExperince", "");
    setCurrentRating(0);
  }, [setValue]);

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  const activeRating = hoveredRating || currentRating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(12px)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .modal-card {
          background: linear-gradient(135deg, #0d1526 0%, #080f1e 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04);
          font-family: 'DM Sans', sans-serif;
        }

        .star-item {
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .star-item:hover { transform: scale(1.15); }

        .review-textarea {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: border-color 0.2s ease, background 0.2s ease;
          resize: none;
          outline: none;
        }
        .review-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .review-textarea:focus {
          border-color: rgba(251,191,36,0.4);
          background: rgba(255,255,255,0.05);
        }

        .cancel-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .cancel-btn:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.8);
        }

        .submit-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(251,191,36,0.25);
          transition: all 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 12px 32px rgba(251,191,36,0.4);
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .close-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        /* ===== MOBILE RESPONSIVE ===== */
        @media (max-width: 640px) {
          .modal-card {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 16px !important;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-inner-padding {
            padding: 16px !important;
          }

          .modal-header-padding {
            padding: 14px 16px !important;
          }

          .modal-actions-row {
            flex-direction: column !important;
            gap: 10px !important;
          }

          .modal-actions-row button {
            width: 100% !important;
            justify-content: center;
          }

          .star-item svg {
            width: 28px !important;
            height: 28px !important;
          }

          .review-textarea {
            min-height: 100px !important;
            font-size: 13px !important;
          }

          .modal-user-avatar {
            width: 36px !important;
            height: 36px !important;
          }
        }

        @media (max-width: 380px) {
          .star-item svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}</style>

      <div className="modal-card w-full max-w-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div
          className="modal-header-padding flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
            >
              {isEdit ? "Update Review" : "Write a Review"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              {courseEntireData?.courseName || "Share your experience"}
            </p>
          </div>
          <button
            onClick={() => setReviewModal(false)}
            className="close-btn w-8 h-8 flex items-center justify-center rounded-lg text-slate-400"
          >
            <X size={15} />
          </button>
        </div>

        <div className="modal-inner-padding p-6">
          {/* User */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={user?.image?.url}
              alt="user"
              className="modal-user-avatar h-10 w-10 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid rgba(255,255,255,0.08)" }}
            />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#f0f4ff" }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Posting as public review</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                Rating
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star-item">
                      <StarIcon
                        filled={star <= activeRating}
                        onClick={() => ratingChange(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`h-8 w-8 ${
                          star <= activeRating
                            ? "text-yellow-400"
                            : "text-slate-700 hover:text-slate-600"
                        }`}
                      />
                    </span>
                  ))}
                </div>
                {activeRating > 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md"
                    style={{
                      background: "rgba(251,191,36,0.1)",
                      color: "#fbbf24",
                    }}
                  >
                    {ratingLabels[activeRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Review */}
            <div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                Your Experience
              </label>
              <textarea
                {...register("courseExperince", { required: true })}
                placeholder="Share what you loved, what could be improved, and who this course is best for..."
                className="review-textarea w-full rounded-xl p-4 min-h-[130px]"
              />
              {errors.courseExperince && (
                <p className="mt-1.5 text-xs" style={{ color: "#f87171" }}>
                  Please share your experience before submitting.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="modal-actions-row flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="cancel-btn px-4 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || currentRating === 0}
                className="submit-btn px-6 py-2.5 rounded-xl text-sm"
              >
                {isEdit ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
