import toast from "react-hot-toast";
import { api } from "../apiconnnector";
import { AUTH } from "../auth";

const Profile = {
  Mycourse: "/enrolled-courses",
  InstructorCourse: "/instructor/course",
};

export const UserEnrolledCourses = async () => {
  const toastId = toast.loading("Loading enrolled courses...");
  try {
    const response = await api.get(Profile.Mycourse);

    if (!response?.data?.success) {
      toast.dismiss(toastId);
      return [];
    }

    toast.dismiss(toastId); //
    return response.data.courses;
  } catch (error) {
    toast.error("Something went wrong", { id: toastId });
    throw error;
  }
};

export const InstructorCourse = async () => {
  const response = await api.get(Profile.InstructorCourse);
  console.log("The data for InstructorCourse is ", response);
  return response?.data?.courses;
};
