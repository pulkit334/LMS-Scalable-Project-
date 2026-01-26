import { adminApi } from "../apiconnnector";

const Admin = {
  InsightPath: "/auth/admin/insight",
  InstructorPath: "/auth/admin/instructors",
  UserPath: "/auth/admin/user-mangment",
  COursePath : "/auth/admin/course-mangment",
  CharttrendPath : "/auth/admin/course-mangment-trend"
};
export const AdminInsightApi = async () => {
  const response = await adminApi.get(Admin.InsightPath);
  console.log("the Admin Insight Data Insight is", response);
  return response?.data;
};

export const InstrctorApi = async () => {
  const response = await adminApi.get(Admin.InstructorPath);
  console.log("the instrcutor Data Insight is", response);
  return response?.data;
};
//User Path Data 
export const UserApi = async () => {
  const response = await adminApi.get(Admin.UserPath);
  console.log("the User Data Insight is", response);
  return response?.data;
};
//Course Path Data 
export const CourseApi= async () => {
  const response = await adminApi.get(Admin.COursePath);
  console.log("the Course Data Insight is", response);
  return response?.data;
};
//Course Chart Mangment Trend

export const Coursetrend = async () => {
  const response = await adminApi.get(Admin.CharttrendPath);
  console.log("the Course Chart Data  Insight is", response);
  return response?.data;
};
