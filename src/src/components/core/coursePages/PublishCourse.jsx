import React from "react";
import Asideinformation from "../../../utils/Asideinformation";
import { CoursePublication } from "../../../services/auth";
import toast from "react-hot-toast";
const PublishCourse = ({ onBack, courseId }) => {
  const [isPublic, setIsPublic] = React.useState(false);

  const onPublish = async () => {
    if (!isPublic) {
window.location.href = "/dashboard/my-coursesF"
    }
    try {
      const Toastid = toast.loading("Publishing....");
      const res = await CoursePublication(courseId, isPublic);
      if (res.success) {
        toast.success("Course published successfully", { id: Toastid });

        setTimeout(() => {
          window.location.href = "/dashboard/my-courses";
        }, 2000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Publish failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-12">
      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-semibold text-center mb-10">Add Course</h1>

      {/* ===== STEPPER ===== */}
      <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
        <StepperItem label="Course Information" done />
        <div className="hidden sm:block h-px w-14 border-t border-dashed border-yellow-400" />
        <StepperItem label="Course Builder" done />
        <div className="hidden sm:block h-px w-14 border-t border-dashed border-yellow-400" />
        <StepperItem label="Publish" active />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT PANEL ===== */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-6">Publish Settings</h2>

            <label className="flex items-start gap-3 text-slate-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 h-4 w-4 accent-yellow-400"
              />z
              <span>Make this course as public</span>
            </label>

            {/* ACTION BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBack}
                className="bg-slate-600 px-6 py-2 rounded-md w-full sm:w-auto"
              >
                ← Back
              </button>

              <button
                onClick={onPublish}
                className="bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        {/* <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 sm:p-8 h-fit">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                ⚡ Course Upload Tips
            </h3>

            <ul className="text-sm text-slate-300 space-y-3 list-disc pl-5">
                <li>Set the Course Price option or make it free.</li>
                <li>Standard size for the course thumbnail is 1024×576.</li>
                <li>Video section controls the course overview video.</li>
                <li>Course Builder is where you create & organize a course.</li>
                <li>Add Topics to create lessons, quizzes, and assignments.</li>
                <li>Additional Data shows on the course single page.</li>
                <li>Send announcements to all enrolled students.</li>
            </ul>
            </div> */}
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
        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold
          ${
            done
              ? "bg-yellow-400 text-black"
              : active
              ? "border border-yellow-400 text-yellow-400"
              : "border border-slate-600 text-slate-400"
          }
        `}
      >
        {done ? "✓" : "3"}
      </span>
      <span className="text-xs sm:text-sm text-center">{label}</span>
    </div>
  );
};
