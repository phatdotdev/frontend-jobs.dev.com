import React from "react";
import { formatDateTime } from "../../utils/helper";
import {
  Bell,
  Briefcase,
  FileText,
  Star,
  Megaphone,
  Clock,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";
import { useSocketContext } from "../../context/SocketContext";
import { useDispatch } from "react-redux";
import { markAsRead } from "../../redux/features/notificationSlice";
import { Link } from "react-router-dom";

type NotificationPayload = {
  id: string;
  title: string;
  content: string;
  type:
    | "APPLICATION_STATUS_CHANGED"
    | "APPLICATION_ACTIVITY"
    | "REVIEW_RECEIVED"
    | "SYSTEM_ANNOUNCEMENT";
  timestamp: string;
  isRead: boolean;
  link?: string;
};

type NotificationDropdownProps = {
  notifications: NotificationPayload[];
  onClose?: () => void;
};

const getNotificationInfo = (type: string) => {
  switch (type) {
    case "APPLICATION_STATUS_CHANGED":
      return {
        icon: <Briefcase className="w-5 h-5" />,
        color: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
      };
    case "APPLICATION_ACTIVITY":
      return {
        icon: <FileText className="w-5 h-5" />,
        color: "from-blue-400 to-cyan-500",
        bg: "bg-blue-100",
        text: "text-blue-700",
      };
    case "REVIEW_RECEIVED":
      return {
        icon: <Star className="w-5 h-5" />,
        color: "from-yellow-400 to-amber-500",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };
    case "SYSTEM_ANNOUNCEMENT":
      return {
        icon: <Megaphone className="w-5 h-5" />,
        color: "from-purple-400 to-pink-500",
        bg: "bg-purple-100",
        text: "text-purple-700",
      };
    default:
      return {
        icon: <Bell className="w-5 h-5" />,
        color: "from-gray-400 to-gray-500",
        bg: "bg-gray-100",
        text: "text-gray-700",
      };
  }
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  const { markNotificationAsRead } = useSocketContext();
  const dispatch = useDispatch();

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    dispatch(markAsRead(id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <h3 className="text-xl font-bold">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-white/30 rounded-full text-sm font-bold">
              {unreadCount} mới
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Danh sách */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Không có thông báo</p>
          </div>
        ) : (
          <ul>
            {notifications.map((noti) => {
              const info = getNotificationInfo(noti.type);
              const isNew = !noti.isRead;

              return (
                <li
                  key={noti.id}
                  className={`p-5 border-b border-gray-100 hover:bg-gray-50 transition-all ${
                    isNew ? "bg-teal-50/30" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${info.color}`}
                    >
                      <div className="text-white">{info.icon}</div>
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold ${
                          isNew ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {noti.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {noti.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(noti.timestamp)}
                      </p>
                    </div>

                    {/* Đánh dấu đã đọc */}
                    {!noti.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(noti.id)}
                        className="self-start p-2 rounded-full hover:bg-teal-100 transition"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle2 className="w-5 h-5 text-gray-400 hover:text-teal-600" />
                      </button>
                    )}
                    {noti.isRead && (
                      <div className="self-start p-2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50 border-t text-center">
          <Link to="/notifications">
            <button className="text-teal-600 font-bold hover:text-teal-700">
              Xem tất cả thông báo →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
