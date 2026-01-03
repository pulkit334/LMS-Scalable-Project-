/* Course.jsx */
import { useState } from "react";
import CourseInformation from "../components/core/coursePages/course1";
import CourseBuilder from "../components/core/coursePages/CourseBuilder";
import PublishCourse from "../components/core/coursePages/PublishCourse";

const Course = () => {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);
  const [sections, setSections] = useState([]);

  return (
    <>
      {step === 1 && (
        <CourseInformation
          onSuccess={(id) => {
            setCourseId(id);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <CourseBuilder
          courseId={courseId}
          sections={sections}
          setSections={setSections}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PublishCourse courseId={courseId} onBack={() => setStep(2)} />
      )}
    </>
  );
};

export default Course;
