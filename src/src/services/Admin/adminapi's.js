import { adminApi } from "../apiconnnector";

const Admin = {
  InsightPath: "/auth/admin/insight",
  InstructorPath: "/auth/admin/instructors",
  UserPath: "/auth/admin/user-mangment",
  COursePath : "/auth/admin/course-mangment",
  CharttrendPath : "/auth/admin/course-mangment-trend",
  TopCategories : "/admin/charts/top-categories"
};
export const AdminInsightApi = async () => {
  const response = await adminApi.get(Admin.InsightPath);
  console.log("the Admin Insight Data Insight is", response);
  return response?.data;
};

export const InstrctorApi = async (page,limit) => {
  const response = await adminApi.get(Admin.InstructorPath,{params :{page,limit}});
  return response?.data;
};
//User Path Data 
export const UserApi = async () => {
  const response = await adminApi.get(Admin.UserPath);
  console.log("the User Data Insight is", response?.data);
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
//Categories Wise Trending Data 
export const ToptrendingData = async () => {
  const response = await adminApi.get(Admin.TopCategories);
  console.log("the Course Chart Data  Insight is", response);
  return response?.data;
};
