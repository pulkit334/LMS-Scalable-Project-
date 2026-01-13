/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CreateRating } from "../../../services/operations/Rating";
import toast from "react-hot-toast";

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

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const [currentRating, setCurrentRating] = useState(0);

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

  const onSubmit = async (data) => {
    try {
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

      toast.success("Review submitted successfully");

      reset();
      setCurrentRating(0);
      setReviewModal(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[500px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Write a Review
          </h2>
          <button
            onClick={() => setReviewModal(false)}
            className="text-slate-400 hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* User */}
          <div className="mb-6 flex items-center gap-4">
            <img
              src={user?.image?.url}
              alt="user"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400">Public review</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= currentRating}
                    onClick={() => ratingChange(star)}
                    className={`h-8 w-8 ${
                      star <= currentRating
                        ? "text-yellow-500"
                        : "text-slate-600 hover:text-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Your experience
              </label>
              <textarea
                {...register("courseExperince", { required: true })}
                placeholder="Share your thoughts about the course..."
                className="min-h-[130px] w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
              {errors.courseExperince && (
                <p className="mt-1 text-xs text-red-500">
                  This field is required
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || currentRating === 0}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
         {!isSubmitting ? "Submit review" : "Submitting"}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;






