/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { X, Bell } from "lucide-react";
import { FetchNotification } from "../services/ThunkApi/NotificationThunk/notificaitonthunk";

const NotificationModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, UserNotification } = useSelector(
    (state) => state.usernotification
  );

  useEffect(() => {
    dispatch(FetchNotification());
  }, [dispatch]);

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

  const getIconBgColor = (type) => {
    const colors = {
      COURSE: "bg-indigo-500/20 text-indigo-300",
      ASSIGNMENT: "bg-sky-500/20 text-sky-300",
      ANNOUNCEMENT: "bg-amber-500/20 text-amber-300",
      PURCHASE: "bg-emerald-500/20 text-emerald-300",
      SYSTEM: "bg-slate-500/20 text-slate-300",
    };
    return colors[type] || "bg-slate-500/20 text-slate-300";
  };

  return (
    <div className="w-[340px] max-h-[480px] rounded-2xl bg-[#0f172a] border border-white/10 text-slate-100 shadow-2xl shadow-black/60 z-[100] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#11192e]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/settings"
            onClick={onClose}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 transition"
          >
            Settings
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[380px]">
        {loading ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-r-transparent" />
          </div>
        ) : error ? (
          <div className="px-4 py-12 text-center">
            <p className="text-xs text-rose-400">Failed to load notifications</p>
          </div>
        ) : !UserNotification?.data || UserNotification?.data?.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Bell className="w-7 h-7 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">You&apos;re all caught up — no notifications</p>
          </div>
        ) : (
          <div>
            {UserNotification?.data.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-3 hover:bg-white/[0.04] transition cursor-pointer border-b border-white/[0.06] ${
                  !notification.read ? "bg-amber-400/[0.04]" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full ${getIconBgColor(notification.type)} flex items-center justify-center text-sm`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-100 leading-tight mb-0.5">
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-1">
                      {notification.body}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <span className="w-2 h-2 bg-amber-400 rounded-full block mt-1" />
                    </div>
                  )}
                </div>

                {notification.image && (
                  <div className="ml-11 mt-2">
                    <img
                      src={notification.image}
                      alt=""
                      className="rounded-lg w-full h-20 object-cover border border-white/10"
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
        <div className="border-t border-white/10 px-4 py-2.5 bg-[#11192e]">
          <Link
            to="/user/view-notifications"
            onClick={onClose}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 transition block text-center"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
