import { api } from "../apiconnnector";

const NotificationService = {
  Auth: "/user/save-fcm-token",
  Notificaiton: "/user/user-notification",
  StatusUpdation: "/user/status-updation",
  statusDeletion: "/user/status-deletion",
  MarkAllRead: "/user/mark-all-read",
};

export const NotificationAuth = async (fcmToken) => {
  const response = await api.post(NotificationService.Auth, fcmToken);
  return response;
};
export const Usernotification = async () => {
  const response = await api.get(NotificationService.Notificaiton);
  return response?.data;
};

export const MarkReadOperations = async (user) => {
  const response = await api.patch(NotificationService.StatusUpdation, user);
  return response?.data;
};
export const MarkdeletionOperations = async (user) => {
const response = await api.delete(NotificationService.statusDeletion, {
    data: {
      [user]: "",
    },
  });

  return response?.data;
};
export const MarkAllReadOperations = async (notificationIds) => {
  const response = await api.patch(NotificationService.MarkAllRead, {
    notificationIds: notificationIds  
  });
  return response?.data;
};