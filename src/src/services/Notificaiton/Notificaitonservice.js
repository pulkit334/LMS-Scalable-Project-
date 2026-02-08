import { api } from "../apiconnnector";

const NotificationService = {
  Auth: "/user/save-fcm-token",
};

export const NotificationAuth = async (data) => {
  const response = await api.post(NotificationService.Auth, data);
  return response;
};
