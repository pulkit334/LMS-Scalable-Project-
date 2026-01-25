
import {adminApi } from "../apiconnnector";

const Admin = {
  InsightData: "/auth/admin/insight",
};
export const AdminInsightApi = async () => {
  const response =await adminApi.get(Admin.InsightData);
  console.log("the admin Data Insight is", response);
  return response?.data;
};
