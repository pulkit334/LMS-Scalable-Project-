import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchNotification } from "../../../services/ThunkApi/NotificationThunk/notificaitonthunk";

const UserNotification = () => {
  const dispatch = useDispatch();
  const { loading, error, UserNotification } = useSelector(
    (state) => state.usernotification
  );
  const [filter, setFilter] = useState("all");
   const UserNotificationData = UserNotification?.data
  useEffect(() => {
    dispatch(FetchNotification());
  }, [dispatch]);

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get notification icon
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

  // Filter notifications
  const filteredNotifications = UserNotificationData?.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = UserNotificationData?.filter((n) => !n.read)?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-6 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "all"
                  ? "border-purple-600 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "unread"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "read"
                  ? "border-purple-600 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-sm text-red-500 font-medium">Failed to load notifications</p>
            <button
              onClick={() => dispatch(FetchNotification())}
              className="mt-4 px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : !filteredNotifications || filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">
              {filter === "unread" ? "✅" : filter === "read" ? "📭" : "🔔"}
            </div>
            <p className="text-lg font-medium text-gray-900">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === "all" && "We'll notify you when something arrives"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white rounded-lg px-6 py-5 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content - Takes full width */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Unread Indicator */}
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-base font-bold text-gray-900 flex-1">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                      )}
                    </div>

                    {/* Body */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {notification.body}
                    </p>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mb-3">
                      {getTimeAgo(notification.createdAt)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                      {!notification.read && (
                        <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">
                          Mark as read
                        </button>
                      )}
                      <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - If many notifications */}
        {filteredNotifications && filteredNotifications.length >= 20 && (
          <div className="flex justify-center mt-6 mb-8">
            <button className="px-6 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotification;