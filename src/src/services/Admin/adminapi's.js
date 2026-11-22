import { adminApi, api } from "../apiconnnector";

const Admin = {
  InsightPath: "/auth/admin/insight",
  InstructorPath: "/auth/admin/instructors",
  UserPath: "/auth/admin/user-mangment",
  COursePath: "/auth/admin/course-mangment",
  CharttrendPath: "/auth/admin/course-mangment-trend",
  TopCategories: "/admin/charts/top-categories",
  StatusPath: "/admin/instructors/:id/status",
  CourseStatusPath: "/admin/courses/:id/status",
  CourseDeletePath: "/admin/courses/:id",
};

export const AdminInsightApi = async () => {
  const response = await adminApi.get(Admin.InsightPath);
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

export const UserApi = async (page, limit, search) => {
  const response = await adminApi.get(Admin.UserPath, {
    params: { page, limit, search },
  });
  return response?.data;
};

export const CourseApi = async (page, limit) => {
  const response = await adminApi.get(Admin.COursePath, {
    params: { page, limit },
  });
  return response?.data;
};

export const Coursetrend = async () => {
  const response = await adminApi.get(Admin.CharttrendPath);
  return response?.data;
};

export const ToptrendingData = async () => {
  const response = await adminApi.get(Admin.TopCategories);
  return response?.data;
};

export const StatusPath = async ({ id, status }) => {
  const response = await adminApi.patch(Admin.StatusPath.replace(":id", id), {
    status,
  });
  return response.data;
};

export const ToggleAdminCourseStatus = async (courseId, status) => {
  const response = await adminApi.patch(
    Admin.CourseStatusPath.replace(":id", courseId),
    { status }
  );
  return response.data;
};

export const DeleteAdminCourse = async (courseId) => {
  const response = await adminApi.delete(
    Admin.CourseDeletePath.replace(":id", courseId)
  );
  return response.data;
};

export const CreateAdminCategory = async ({ name, description }) => {
  const response = await api.post("/category/create", { name, description });
  return response.data;
};
