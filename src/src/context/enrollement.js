import { useContext } from "react";
import { EnrollmentContext } from "./EnrollmentCourseContext";

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);

  if (!context) {
    throw new Error("useEnrollment must be used inside EnrollmentProvider");
  }

  return context;
};
