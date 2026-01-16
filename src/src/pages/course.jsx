/* eslint-disable no-unused-vars */


// export default Course;
/* Course.jsx */
import { useSelector, useDispatch } from "react-redux";
import CourseInformation from "../components/core/coursePages/course1";
import CourseBuilder from "../components/core/coursePages/CourseBuilder";
import PublishCourse from "../components/core/coursePages/PublishCourse";
import { setStep, setCourseId } from "../Slices/courseSlice";

const Course = () => {
  const dispatch = useDispatch();
  const { step, courseId } = useSelector((state) => state.course);

  return (
    <>
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
    </>
  );
};

export default Course;
