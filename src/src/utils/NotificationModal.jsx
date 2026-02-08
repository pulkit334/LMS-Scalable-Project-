import React from "react";
import { Link } from "react-router-dom";

const NotificationModal = () => {
  return (
    <div className="w-[300px] lg:w-[300px] bg-red-700 rounded-lg bg-white shadow-2xl border border-gray-200 z-[100]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Notifications
        </h3>
        <Link
          to="/notification-settings"
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
        >
          Settings
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-14 text-center">
        <p className="text-sm text-gray-500">
          No notifications.
        </p>
      </div>
    </div>
  );
};

export default NotificationModal;
