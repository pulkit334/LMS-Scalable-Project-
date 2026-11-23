import { useSelector, useDispatch } from "react-redux";
import CourseInformation from "../components/core/coursePages/course1";
import CourseBuilder from "../components/core/coursePages/CourseBuilder";
import PublishCourse from "../components/core/coursePages/PublishCourse";
import { setStep, setCourseId } from "../Slices/courseSlice";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, title: "Course Information" },
  { id: 2, title: "Course Builder" },
  { id: 3, title: "Publish" },
];

const Course = () => {
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.course);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8 flex items-center justify-between gap-2 rounded-2xl bg-[#0f172a] border border-white/10 px-6 py-4">
        {STEPS.map((item, idx) => {
          const isCompleted = step > item.id;
          const isCurrent = step === item.id;
          return (
            <div key={item.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : isCurrent
                        ? "bg-amber-400 border-amber-300 text-slate-950"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.id}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isCurrent || isCompleted ? "text-white" : "text-slate-400"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded ${
                    step > item.id ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <CourseInformation
          onSuccess={(id) => {
            dispatch(setCourseId(id));
            dispatch(setStep(2));
          }}
        />
      )}

      {step === 2 && <CourseBuilder />}

      {step === 3 && <PublishCourse />}
    </div>
  );
};

export default Course;
