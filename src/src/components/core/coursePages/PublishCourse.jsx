/* eslint-disable react-hooks/immutability */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Asideinformation from "../../../utils/Asideinformation";
import { CoursePublication } from "../../../services/auth";
import toast from "react-hot-toast";
import { setIsPublic, setStep, resetCourse } from "../../../Slices/courseSlice";
import { Check, Globe, ChevronRight, ChevronLeft } from "lucide-react";

const PublishCourse = ({ onBack }) => {
  const dispatch = useDispatch();
  let toastId;

  //  GET EVERYTHING FROM REDUX
  const { courseId, isPublic } = useSelector((state) => state.course);

  const onPublish = async () => {
    //blocking the user if not make published
    if (!isPublic) {
      toast.error("Please mark the course as public before publishing");
      return;
    }

    try {
      toastId = toast.loading("Publishing....");

      const res = await CoursePublication(courseId, isPublic);

      if (res.success) {
        toast.success("Course published successfully", { id: toastId });

        //  CLEAN STATE AFTER SUCCESS
        dispatch(resetCourse());

        setTimeout(() => {
          window.location.href = "/dashboard/my-courses";
        }, 1500);
      }
    } catch (err) {
toast.error("Course publish failed", { id: toastId });
    }
  };

  return (
    <section className="min-h-screen text-white px-4 sm:px-6 py-12"
      style={{ background: "linear-gradient(160deg, #060d1a 0%, #080f1e 60%, #060d1a 100%)", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .stepper-connector { height: 1px; width: 48px; border-top: 1.5px dashed; }
        .step-done { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 16px rgba(251,191,36,0.3); }
        .step-active { border: 1.5px solid #fbbf24; color: #fbbf24; box-shadow: 0 0 12px rgba(251,191,36,0.15); }
        .step-inactive { border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.3); }

        .publish-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }

        .toggle-track {
          width: 44px; height: 24px;
          border-radius: 99px;
          transition: background 0.25s ease;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 99px;
          background: #fff;
          transition: transform 0.25s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .btn-back {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-back:hover { background: rgba(255,255,255,0.09); color: #fff; }

        .btn-publish {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-weight: 700;
          box-shadow: 0 4px 20px rgba(251,191,36,0.2);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-publish:hover {
          box-shadow: 0 8px 28px rgba(251,191,36,0.35);
          transform: translateY(-1px);
        }

        .visibility-box {
          border-radius: 14px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1.5px solid;
        }
        .visibility-box.active {
          background: rgba(251,191,36,0.07);
          border-color: rgba(251,191,36,0.4);
        }
        .visibility-box.inactive {
          background: rgba(255,255,255,0.02);
          border-color: rgba(255,255,255,0.07);
        }
        .visibility-box.inactive:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
        }
      `}</style>

      <h1 className="text-2xl font-bold text-center mb-10"
        style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
      >
        Add Course
      </h1>

      {/* STEPPER */}
      <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-5 text-sm">
        <StepperItem label="Course Information" done />
        <div className="hidden sm:block stepper-connector" style={{ borderColor: "#fbbf24" }} />
        <StepperItem label="Course Builder" done />
        <div className="hidden sm:block stepper-connector" style={{ borderColor: "#fbbf24" }} />
        <StepperItem label="Publish" active />
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="publish-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}
            >
              Publish Settings
            </h2>
            <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
              Control how your course appears to students
            </p>

            {/* Visibility toggle — replaces plain checkbox */}
            <div
              className={`visibility-box ${isPublic ? "active" : "inactive"}`}
              onClick={() => dispatch(setIsPublic(!isPublic))}
            >
              <div
                className="toggle-track"
                style={{ background: isPublic ? "#f59e0b" : "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="toggle-thumb"
                  style={{ transform: isPublic ? "translateX(20px)" : "translateX(0)" }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color: isPublic ? "#fbbf24" : "rgba(255,255,255,0.4)" }} />
                  <span className="text-sm font-semibold" style={{ color: isPublic ? "#fbbf24" : "rgba(255,255,255,0.6)" }}>
                    Make this course public
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {isPublic ? "Visible to all students on the platform" : "Only you can see this course"}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onBack?.();
                  dispatch(setStep(2));
                }}
                className="btn-back px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <ChevronLeft size={15} /> Back
              </button>

              <button
                onClick={onPublish}
                className="btn-publish px-8 py-2.5 rounded-xl text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Publish Course <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <Asideinformation />
      </div>
    </section>
  );
};

export default PublishCourse;


/* ===== STEPPER ITEM ===== */
const StepperItem = ({ label, done, active }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs
          ${done ? "step-done" : active ? "step-active" : "step-inactive"}
        `}
      >
        {done ? <Check size={13} /> : "3"}
      </span>
      <span className="text-xs sm:text-sm text-center"
        style={{ color: done ? "rgba(255,255,255,0.7)" : active ? "#fbbf24" : "rgba(255,255,255,0.3)", fontWeight: active ? 600 : 400 }}
      >
        {label}
      </span>
    </div>
  );
};
