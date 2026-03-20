/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Upload, ChevronRight, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateCourse, UpdateUser } from "../../../services/auth";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Asideinformation from "../../../utils/Asideinformation";
import { setCourseId, setStep } from "../../../Slices/courseSlice";

const CourseInformation = () => {
  const dispatch = useDispatch(); // ADDED
  const { categories } = useSelector((state) => state.profile);
  const [preview, setPreview] = useState(null);
  const [loading, setloading] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      courseName: "",
      courseDescription: "",
      whatyouwilllearn: "",
      price: 0,
      category: "",
      tag: "",
      thumbnail: null,
      benefits: "",
      requirements: "",
    },
  });
  const { course, isEdit, resetCourse, courseId } = useSelector(
    (state) => state.course,
  );

  useEffect(() => {
    // If not editing, ensure no stale data
    if (!isEdit && course) {
      dispatch(resetCourse());
    }
  }, []);

  useEffect(() => {
    if (isEdit && course) {
      reset({
        courseName: course.courseName ?? "",
        courseDescription: course.courseDescription ?? "",
        price: course.price ?? 0,
        file: course.thumbnail,
        // category is an OBJECT in backend
        category: course.category?._id ?? "",
        tag: course.tag ?? "",
        whatyouwilllearn: course.whatyouwilllearn ?? "",
        //  backend key is "requirement"
        requirements: course.requirement ?? "",
        benefits: "",
      });
      if (course.thumbnail) {
        setPreview(course?.thumbnail);
      }
    }
  }, [course, isEdit, reset]);

  let toastId;
  const onSubmit = async (data) => {
    if (!isEdit) {
      toastId = toast.loading("Creating course...");
      setloading(true);
    } else {
      toastId = toast.loading("Updating...");
      setloading(true);
    }

    try {
      //  Convert to FormData
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "thumbnail") {
          formData.append("thumbnailImage", value[0]); // FileList → File
        } else {
          formData.append(key, value);
        }
      });
      let response;
      if (!isEdit) {
        response = await CreateCourse(formData);
      } else {
        response = await UpdateUser(courseId, formData);
      }

      if (!response?.success) {
        throw new Error("No response from server");
      }
if (response?.courseId || response?.course?._id) {
        // ONLY CHANGE (Redux instead of prop)
        dispatch(setCourseId(response.courseId));
        dispatch(setStep(2));

        if (!isEdit)
          toast.success("Successfully created course 🎉", { id: toastId });
        else toast.success("Successfully Updated 🎉", { id: toastId });

        setloading(false);
      }

      return response;
    } catch (err) {
      setloading(false);
      toast.error("Error occurred. Try again.", { id: toastId });
    }
  };

  return (
    <section className="min-h-screen text-white px-1 py-1"
      style={{ background: "linear-gradient(160deg, #060d1a 0%, #080f1e 60%, #060d1a 100%)", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .ci-input, .ci-textarea, .ci-select {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e2e8f0;
          transition: border-color 0.2s ease, background 0.2s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          border-radius: 10px;
          padding: 0 16px;
        }
        .ci-input { height: 44px; }
        .ci-textarea { padding: 12px 16px; resize: none; }
        .ci-select { height: 44px; padding: 0 16px; }
        .ci-input:focus, .ci-textarea:focus, .ci-select:focus {
          border-color: rgba(251,191,36,0.45);
          background: rgba(255,255,255,0.05);
        }
        .ci-input::placeholder, .ci-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .ci-select option { background: #0f172a; color: #e2e8f0; }

        .ci-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.35);
          display: block;
          margin-bottom: 8px;
        }

        .field-error { color: #f87171; font-size: 11px; margin-top: 4px; }

        .thumbnail-zone {
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: rgba(255,255,255,0.02);
        }
        .thumbnail-zone:hover {
          border-color: rgba(251,191,36,0.4);
          background: rgba(251,191,36,0.03);
        }

        .btn-submit {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-weight: 700;
          border-radius: 12px;
          padding: 10px 28px;
          font-size: 14px;
          box-shadow: 0 4px 20px rgba(251,191,36,0.2);
          transition: all 0.2s ease;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 8px 28px rgba(251,191,36,0.35);
          transform: translateY(-1px);
        }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .form-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }

        .stepper-connector-ci { height: 1px; width: 36px; background: rgba(255,255,255,0.1); }
        .step-done-ci { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .step-inactive-ci { border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.3); }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="mb-8 px-4 pt-8">
        <p className="text-sm cursor-pointer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>
          <Link to="/login" style={{ display: "flex", alignItems: "center", gap: 6 }}> ← Back to Dashboard</Link>
        </p>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="step-done-ci h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs">
              1
            </span>
            <span style={{ color: "#fbbf24", fontWeight: 600, fontSize: 13 }}>Course Information</span>
          </div>

          <div className="stepper-connector-ci" />

          <div className="flex items-center gap-2">
            <span className="step-inactive-ci h-6 w-6 rounded-full flex items-center justify-center text-xs">
              2
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Course Builder</span>
          </div>

          <div className="stepper-connector-ci" />

          <div className="flex items-center gap-2">
            <span className="step-inactive-ci h-6 w-6 rounded-full flex items-center justify-center text-xs">
              3
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Publish</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-12">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-card lg:col-span-2 rounded-2xl p-6 space-y-5"
        >
          {/* Course Title */}
          <div>
            <label className="ci-label">
              Course Title <span className="text-yellow-400">*</span>
            </label>
            <input
              {...register("courseName", {
                required: "Course title is required",
              })}
              placeholder="Enter Course Title"
              className="ci-input"
            />
            {errors.courseName && (
              <p className="field-error">{errors.courseName.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="ci-label">
              Course Short Description <span className="text-yellow-400">*</span>
            </label>
            <textarea
              {...register("courseDescription", { required: true })}
              rows={4}
              placeholder="Enter Description"
              className="ci-textarea"
            />
          </div>

          {/* What you will learn */}
          <div>
            <label className="ci-label">What you will learn</label>
            <textarea
              {...register("whatyouwilllearn")}
              rows={3}
              placeholder="List key outcomes..."
              className="ci-textarea"
            />
          </div>

          {/* Price */}
          <div>
            <label className="ci-label">Price</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="0"
              className="ci-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="ci-label">
              Category <span className="text-yellow-400">*</span>
            </label>
            <select
              {...register("category", { required: true })}
              className="ci-select"
            >
              <option value="">Choose a Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="ci-label">Tags</label>
            <input
              {...register("tag")}
              placeholder="e.g. javascript, react, web"
              className="ci-input"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="ci-label">
              Course Thumbnail <span className="text-yellow-400">*</span>
            </label>

            <label className={`thumbnail-zone flex flex-col items-center justify-center ${preview ? "p-2" : "p-16"}`}>
              {preview ? (
                <img src={preview || course?.thumbnail} className="rounded-lg max-h-52 object-cover w-full" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
                  >
                    <ImagePlus size={22} style={{ color: "#fbbf24" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Drag & drop or{" "}
                      <span style={{ color: "#fbbf24", fontWeight: 600 }}>browse</span>
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                      PNG, JPG, WEBP recommended
                    </p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                {...register("thumbnail", {
                  required: !isEdit,
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  },
                })}
              />
            </label>
          </div>

          {/* Benefits */}
          <div>
            <label className="ci-label">Benefits of the course</label>
            <textarea
              {...register("benefits")}
              rows={3}
              placeholder="What will students gain?"
              className="ci-textarea"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="ci-label">
              Requirements / Instructions
            </label>
            <input
              {...register("requirements")}
              placeholder="Any prerequisites?"
              className="ci-input"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {isEdit ? "Save Changes" : "Continue"} <ChevronRight size={15} />
            </button>
          </div>
        </form>


        <Asideinformation />
      </div>
    </section>
  );
};

export default CourseInformation;
