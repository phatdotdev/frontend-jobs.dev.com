// src/components/Notification/NotificationView.tsx
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  Bell,
  Briefcase,
  Mail,
  Clock,
  CheckCircle,
  Building2,
  Megaphone,
  AlertCircle,
} from "lucide-react";
import { useGetAllMyNotificationQuery } from "../../redux/api/apiCommunication";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotifications,
  markAsRead,
} from "../../redux/features/notificationSlice";
import type { RootState } from "../../redux/features/store";
import DataLoader from "../../components/UI/DataLoader";
import { useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";

type Notification = {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  applicationId?: string | null;
  postId?: string | null;
  requestId?: string | null;
};

const getTypeConfig = (type: string) => {
  const config = {
    APPLICATION_ACTIVITY: {
      icon: Mail,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "bg-emerald-500",
      label: "Hồ sơ ứng tuyển",
    },
    APPLICATION_STATUS_CHANGED: {
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "bg-purple-500",
      label: "Cập nhật trạng thái",
    },
    INTERVIEW_RESULT: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "bg-green-500",
      label: "Kết quả phỏng vấn",
    },
    JOB_OFFER: {
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "bg-amber-500",
      label: "Offer việc làm",
    },
    SYSTEM_ANNOUNCEMENT: {
      icon: Megaphone,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "bg-pink-500",
      label: "Thông báo hệ thống",
    },
  };

  return (
    config[type as keyof typeof config] || {
      icon: AlertCircle,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "bg-gray-500",
      label: "Thông báo",
    }
  );
};

const NotificationView = () => {
  const dispatch = useDispatch();
  const { data: response, isLoading, isError } = useGetAllMyNotificationQuery();
  const notifications = useSelector(
    (state: RootState) => state.notifications || []
  );

  const { markNotificationAsRead } = useSocketContext();

  // Cập nhật danh sách thông báo từ API
  useEffect(() => {
    if (response?.data) {
      dispatch(setNotifications(response.data));
    }
  }, [response, dispatch]);

  const handleClick = (noti: Notification) => {
    if (!noti.isRead) {
      dispatch(markAsRead(noti.id));
      markNotificationAsRead(noti.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <DataLoader />
      </div>
    );
  }

  // Lỗi
  if (isError) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-bold text-gray-700">
          Không thể tải thông báo
        </p>
        <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
      </div>
    );
  }

  // Không có thông báo
  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl">
        <Bell className="w-20 h-20 text-gray-300 mx-auto mb-5" />
        <p className="text-2xl font-bold text-gray-600">
          Chưa có thông báo nào
        </p>
        <p className="text-gray-500 mt-3 text-lg">
          Chúng tôi sẽ thông báo ngay khi có cập nhật mới!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-4">
          <Bell className="w-10 h-10 text-teal-600" />
          Trung tâm thông báo
        </h2>
        {unreadCount > 0 && (
          <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-bold text-sm">
            {unreadCount} chưa đọc
          </span>
        )}
      </div>

      <div className="space-y-6">
        {notifications.map((noti: any) => {
          const config = getTypeConfig(noti.type);
          const Icon = config.icon;
          const timeAgo = formatDistanceToNow(new Date(noti.timestamp), {
            addSuffix: true,
            locale: vi,
          });

          return (
            <div
              key={noti.id}
              onClick={() => handleClick(noti)}
              className={`
                group relative rounded-2xl border-2 cursor-pointer transition-all duration-300
                ${
                  noti.isRead
                    ? "bg-white border-gray-200 hover:shadow-md"
                    : "bg-gradient-to-r from-teal-50 to-blue-50 border-teal-300 shadow-lg hover:shadow-xl"
                }
              `}
            >
              {/* Viền trái màu */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-2 ${config.border} group-hover:w-4 transition-all duration-500`}
              />

              <div className="p-6 pl-10 flex gap-5">
                {/* Icon loại */}
                <div
                  className={`p-4 rounded-2xl ${config.bg} shadow-md flex-shrink-0`}
                >
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </div>

                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {config.label}
                  </p>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                    {noti.title}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {noti.content}
                  </p>

                  {/* Link chi tiết */}
                  {(noti.applicationId || noti.postId) && (
                    <Link
                      to={
                        noti.applicationId
                          ? `/job-seeker/applied-jobs/${noti.applicationId}`
                          : `/jobs/${noti.postId}`
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 mt-4 text-teal-600 font-bold hover:underline"
                    >
                      Xem chi tiết →
                    </Link>
                  )}

                  <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {timeAgo}
                  </p>
                </div>

                {/* Chấm chưa đọc */}
                {!noti.isRead && (
                  <div className="absolute top-6 right-6 w-4 h-4 bg-teal-600 rounded-full shadow-lg animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationView;
