
import { api } from "../apiconnnector";

const Admin = {
  InsightData: "/auth/admin-login",
};
export const AdminInsights = async () => {
  const response =await api.get(Admin.InsightData);
  console.log("the admin Data Insight is", response);
  return response?.data;
};
