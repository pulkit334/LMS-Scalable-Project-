/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FetchNotification } from "../services/ThunkApi/NotificationThunk/notificaitonthunk";

const NotificationModal = () => {
  const dispatch = useDispatch();
  const { loading, error, UserNotification } = useSelector(
    (state) => state.usernotification
  );

  useEffect(() => {
    dispatch(FetchNotification());
  }, [dispatch]);

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      COURSE: "🎓",
      ASSIGNMENT: "📝",
      ANNOUNCEMENT: "📢",
      PURCHASE: "🎉",
      SYSTEM: "⚙️",
    };
    return icons[type] || "🔔";
  };

  // Get icon background color
  const getIconBgColor = (type) => {
    const colors = {
      COURSE: "bg-purple-500",
      ASSIGNMENT: "bg-blue-500",
      ANNOUNCEMENT: "bg-orange-500",
      PURCHASE: "bg-green-500",
      SYSTEM: "bg-gray-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="w-[340px] max-h-[480px] rounded-lg bg-white shadow-xl border border-gray-200 z-[100] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
        <Link
          to="/notification-settings"
          className="text-xs font-medium text-purple-600 hover:text-purple-700 transition"
        >
          Settings
        </Link>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[380px]">
        {loading ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-r-transparent"></div>
          </div>
        ) : error ? (
          <div className="px-4 py-12 text-center">
            <p className="text-xs text-red-500">Failed to load</p>
          </div>
        ) : !UserNotification?.data || UserNotification?.data?.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-xs text-gray-400">No notifications</p>
          </div>
        ) : (
          <div>
            {UserNotification?.data.map((notification, index) => (
              <div
                key={notification._id}
                className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 ${
                  !notification.read ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon - Smaller with solid color */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full ${getIconBgColor(notification.type)} flex items-center justify-center text-white text-sm`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-tight mb-0.5">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-1">
                      {notification.body}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full block mt-1"></span>
                    </div>
                  )}
                </div>

                {/* Image - if available */}
                {notification.image && (
                  <div className="ml-11 mt-2">
                    <img
                      src={notification.image}
                      alt=""
                      className="rounded-md w-full h-20 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && UserNotification?.data && UserNotification?.data?.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2.5 bg-white">
          <Link
            to="/user/view-notifications"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 transition block text-center"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;