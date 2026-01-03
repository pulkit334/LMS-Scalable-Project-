import toast from "react-hot-toast";
import { api } from "../apiconnnector";
import { AUTH } from "../auth";

const Profile = {
  Mycourse: "/enrolled-courses",
};

export const UserEnrolledCourses = async () => {
  const toastId = toast.loading("Loading enrolled courses...");
  try {
    const response = await api.get(Profile.Mycourse);

    if (!response?.data?.success) {
      toast.error(response?.data?.message || "Failed to fetch courses", {
        id: toastId,
      });
      return [];
    }

    toast.success("Courses loaded", { id: toastId });

    //  THIS is what you want
    return response.data.courses;
  } catch (error) {
    toast.error("Something went wrong", { id: toastId });
    throw error;
  }
};
