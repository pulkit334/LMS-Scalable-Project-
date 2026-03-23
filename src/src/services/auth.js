/* eslint-disable no-unused-vars */
import { api } from "./apiconnnector";
import { toast } from "react-hot-toast";
import { setloading, clearSinupData, setToken } from "../Slices/authslice";
export const categories = {
  GET_ALL: "/category/all",
};

export const AUTH = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  SEND_OTP: "/auth/send-otp",
  checkCurrentPassword: "/auth/check-password",
  FORGOT_PASSWORD: "/auth/reset-password-token",
  RESET_PASSWORD: "/auth/reset-password",
  Password_changer: "/auth/change-password",
  Delete_Account: "/profile/delete",
  Profile_Recovery: "/profile/recovery",
  EmailVerification: "/recover-account",
  RefreshVerification: "/refresh",
  google_auth_login: "/auth/google",
};

export const Course = {
  CreateCourse: "/course/create",
  categories: "/category/all",
  GetFUllCourseDetails: "/getFullCourseDetails/:courseId",
  DeleteCourse: "/course/:courseId",
  GetBuyCourse: "/course/:courseId",
  CourseLectureProgressMarker: "/course/updateCourseProgress",
};
export const Course_Section = {
  createsection: "/section/create",
  deleteSection: "/section/delete/:sectionId",
  GetInrtuctorCourse: "/courses",
  PublicationCourse: "/publish-courses",
  UpdateCourse: "/course/update/:courseId",
};
export const Subsection = {
  CreateSubsection: "/subsection/create",
  UpdateSubsection: "/subsection/:subSectionId",
};
export const Enqiry = {
  Enquiry: "/aboutus/submit-form",
};
export const PROFILE = {
  ME: "/profile/me",
  ImageUploader: "/profile/image-update",
  UpdateProfile: "/profile/update",
};
// USE CONSTANTS HERE
export const loginUser = async (data) => {
  try {
    const response = await api.post(AUTH.LOGIN, data);
    return response.data;
  } catch (error) {
    const code = error?.response?.data?.code;

    if (code === "ACCOUNT_DELETED") {
      //  hard redirect (cannot go back)
      toast.error("Your Account Have Been deleted");
      window.location.replace("/");
      return;
    }

    if (code === "USER_NOT_FOUND") {
      toast("User Does Not Exist");
      throw new Error("User does not exist");
    }
    throw error;
  }
};

export const getMyProfile = async () => {
  const response = await api.get(PROFILE.ME);
  return response.data;
};
export const sendotp = async (email) => {
  const toastId = toast.loading("Sending Mail");

  const response = await api.post(AUTH.SEND_OTP, email);
  if (response) {
    toast.success("successfully Sent the Otp", toastId);
  }
  return response.data;
};

export const SinupUser = (data, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(setloading(true));

      const response = await api.post(AUTH.SIGNUP, data);

      if (response?.data?.success) {
        dispatch(setToken(response.data.token));
        dispatch(clearSinupData());
        toast.success("Successfully created the account. Please login");
        navigate("/login");
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message}`);
      throw error;
    } finally {
      dispatch(setloading(false));
    }
  };
};

//General Enquiry Form Data

export const submitEnquiry = async (data) => {
  try {
    const response = await api.post(Enqiry.Enquiry, data);
    
    toast.success("Message sent successfully");
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send message";

    toast.error(message); //  USER SEES THIS
  }
};
//

export const deleteAccount = async () => {
  try {
    const response = await api.delete(AUTH.Delete_Account);

    return response;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send message";

    toast.error(message); //  USER SEES THIS
  }
};

//Setting Image upladar
export const ImageUploader = async (data) => {
  try {
    const response = await api.patch(PROFILE.ImageUploader, data);
    return response.data;
  } catch (error) {
    toast.error(`${error}`);
    throw error;
  }
};
//update profile
export const ProfileUpdater = async (data) => {
  try {
    const response = await api.patch(PROFILE.UpdateProfile, data);
    return response.data;
  } catch (error) {
    toast.error(`${error}`);
    throw error;
  }
};
//change Password
export const changePassword = async (data) => {
  try {
    const response = await api.post(AUTH.Password_changer, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const UndoAccount = async (email) => {
  try {
    const response = await api.post(AUTH.Profile_Recovery, { email });
    localStorage.setItem(response, JSON.stringify(response));
    return response?.data;
  } catch (error) {
    toast.error(`${error.message}`);
    // throw new Error(error);
  }
};
export const verifyRecoveryToken = (token) => {
  return api.get(`/profile/recover-account/${token}`);
};

export const CreateCourse = async (formData) => {
  const response = await api.post(Course.CreateCourse, formData);
  return response.data;
};

export const GetCategorires = async () => {
  const response = await api.get(Course.categories);
  return response?.data?.AllCategory;
};

export const createCourseSection = async (data) => {
  const response = await api.post(Course_Section.createsection, data);

  return response?.data;
};
export const deleteSection = async (sectionId) => {
  return api.delete(
    Course_Section.deleteSection.replace(":sectionId", sectionId),
  );
};
export const createSubsection = async (formData, config = {}) => {
  const response = await api.post(
    Subsection.CreateSubsection,
    formData,
    config,
  );
  return response;
};

export const GetInsturctorCourse = async () => {
  const response = await api.get(Course_Section.GetInrtuctorCourse);

  return response?.data;
};

//public the course or private

export const CoursePublication = async (courseId, isPublic) => {
  const response = await api.post(Course_Section.PublicationCourse, {
    courseId,
    isPublic,
  });

  return response.data;
};

export const UpdateSubsection = async (subSectionId, formData, config = {}) => {
  const response = await api.patch(
    Subsection.UpdateSubsection.replace(":subSectionId", subSectionId),
    formData,
    config,
  );

  return response;
};

export const getFullCourseDetails = async (courseId) => {
 
  const res = await api.get(
    Course.GetFUllCourseDetails.replace(":courseId", courseId),
  );

  return res.data;
};

export const UpdateUser = async (courseId, formData) => {
  const res = await api.patch(
    Course_Section.UpdateCourse.replace(":courseId", courseId),
    formData,
  );
 
  return res?.data;
};

export const CourseDelete = async (courseId) => {


  const response = await api.delete(
    Course.DeleteCourse.replace(":courseId", courseId),
  );


  return response?.data;
};

export const CompleteLectureMarker = async (courseId, subSectionId, token) => {
  const response = await api.post(
    Course.CourseLectureProgressMarker,
    {
      courseId,
      subSectionId,
    },
    token,
  );
  return response?.data;
};

export const RefreshVerification = async (data) => {
  const response = await api.post(AUTH.RefreshVerification);
  // const token = response.data?.token || [];
  // localStorage.setItem("token", token);
  return response?.data;
};
export const CategoryResponse = async (data) => {
  const response = await api.get(categories.GET_ALL);
  return response?.data;
};

//for google 
export const googleauth = async (code,accountType) => {
  try {
    const response = await api.get(`${AUTH.google_auth_login}?code=${code}&accountType=${accountType}`);
    return response.data;

  } catch (err) {
    console.error("Google Auth Error : ", err);
    
    throw err;
  }
};