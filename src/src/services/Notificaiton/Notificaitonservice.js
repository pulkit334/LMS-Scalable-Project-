import { api } from "../apiconnnector";

const NotificationService = {
  Auth: "/user/save-fcm-token",
  Notificaiton: "/user/user-notification",
};

export const NotificationAuth = async (fcmToken) => {
  const response = await api.post(NotificationService.Auth, fcmToken);
  return response;
};
export const Usernotification = async () => {
  const response = await api.get(NotificationService.Notificaiton);
  return response?.data;
};
