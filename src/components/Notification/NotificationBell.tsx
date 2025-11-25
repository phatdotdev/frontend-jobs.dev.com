import React from "react";
import { Bell } from "lucide-react";

type NotificationBellProps = {
  unreadCount: number;
  onClick: () => void;
};

const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
}) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {/* Icon chuông */}
      <Bell className="w-7 h-7 text-gray-700 hover:text-teal-600 transition-colors" />

      {/* Badge đỏ đơn giản - chỉ hiện khi có thông báo */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
