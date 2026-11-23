import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const EnrollmentContext = createContext(null);

export const EnrollmentProvider = ({ children }) => {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  return (
    <EnrollmentContext.Provider
      value={{ enrolledCourseIds, setEnrolledCourseIds }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
