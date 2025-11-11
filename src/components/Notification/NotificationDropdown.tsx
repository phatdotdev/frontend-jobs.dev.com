import React, { useState, useEffect } from "react";
import type { NotificationPayload } from "../../hooks/useSocket";
import { formatDateTime } from "../../utils/helper";
import {
  Bell,
  MessageCircle,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Check,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocketContext } from "../../context/SocketContext";
import { useDispatch } from "react-redux";
import { markAsRead } from "../../redux/features/notificationSlice";

type NotificationDropdownProps = {
  notifications: NotificationPayload[];
  onClose?: () => void;
};

const getNotificationIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "message":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "friend_request":
      return <UserPlus className="w-5 h-5 text-green-500" />;
    case "application_accepted":
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "error":
      return <X className="w-5 h-5 text-red-500" />;
    default:
      return <Info className="w-5 h-5 text-teal-500" />;
  }
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  const { markNotificationAsRead } = useSocketContext();

  const dispatch = useDispatch();

  const handleClickNotification = async (id: string) => {
    markNotificationAsRead(id);
    dispatch(markAsRead(id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute right-0 mt-3 w-96 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 animate-pulse" />
            <h3 className="text-xl font-extrabold">Thông báo</h3>
            {
              <span className="px-3 py-1 bg-white/30 rounded-full text-sm font-bold backdrop-blur-md animate-pulse"></span>
            }
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <ul className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                Không có thông báo nào
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Bạn đã đọc hết rồi đấy! 🎉
              </p>
            </motion.li>
          ) : (
            notifications.map((noti, index) => {
              const isNew = index < 3 && !noti.isRead;

              return (
                <motion.li
                  key={noti.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-5 border-b border-gray-100 transition-all duration-300 group ${
                    noti.isRead
                      ? "bg-gray-50/50 opacity-75"
                      : "hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50"
                  }`}
                >
                  {/* Badge "Mới" */}
                  {isNew && (
                    <>
                      <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full" />
                    </>
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                          noti.isRead
                            ? "bg-gradient-to-br from-gray-300 to-gray-400"
                            : "bg-gradient-to-br from-teal-400 to-cyan-500 group-hover:scale-110"
                        }`}
                      >
                        {getNotificationIcon(noti.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-extrabold truncate ${
                          noti.isRead ? "text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {noti.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {noti.content}
                      </p>
                      <p className="text-xs text-teal-600 font-semibold mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(noti.timestamp as string)}
                      </p>
                    </div>

                    {/* Nút đánh dấu đã đọc */}
                    {!noti.isRead && (
                      <button
                        onClick={() => handleClickNotification(noti.id)}
                        className="self-start p-2 rounded-full bg-white/80 hover:bg-teal-100 shadow-md hover:shadow-lg transition-all duration-300 group"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition" />
                      </button>
                    )}
                    {noti.isRead && (
                      <div className="self-start p-2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })
          )}
        </AnimatePresence>
      </ul>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button className="text-teal-600 font-bold hover:text-teal-700 transition ml-auto">
            Xem tất cả →
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
