import { adminApi } from "../apiconnnector";

const Admin = {
  InsightPath: "/auth/admin/insight",
  InstructorPath: "/auth/admin/instructors",
  UserPath: "/auth/admin/user-mangment",
  COursePath: "/auth/admin/course-mangment",
  CharttrendPath: "/auth/admin/course-mangment-trend",
  TopCategories: "/admin/charts/top-categories",
  StatusPath: "/admin/instructors/:id/status",
};
export const AdminInsightApi = async () => {
  const response = await adminApi.get(Admin.InsightPath);
  console.log("the Admin Insight Data Insight is", response);
  return response?.data;
  
};

export const InstrctorApi = async (page, limit, search) => {
  const params = { page, limit };

  if (search && search.trim().length >= 2) {
    params.search = search.trim();
  }

  const response = await adminApi.get(Admin.InstructorPath, { params });

  return response?.data;
};

//User Path Data
export const UserApi = async (page, limit, search) => {
  const response = await adminApi.get(Admin.UserPath, {
    params: { page, limit, search },
  });
  return response?.data;
};
//Course Path Data
export const CourseApi = async (page, limit) => {
  const response = await adminApi.get(Admin.COursePath, {
    params: { page, limit },
  });
  return response?.data;
};
//Course Chart Mangment Trend

export const Coursetrend = async () => {
  const response = await adminApi.get(Admin.CharttrendPath);
  return response?.data;
};
//Categories Wise Trending Data
export const ToptrendingData = async () => {
  const response = await adminApi.get(Admin.TopCategories);
  return response?.data;
};
//Status Patch Requets
export const StatusPath = async ({ id, status }) => {
  console.log("Updating status:", id, status);

  const response = await adminApi.patch(Admin. StatusPath.replace(":id", id), {
    status,
  });
console.log("the repsosne of final data would be",response)
  return response.data;
};
