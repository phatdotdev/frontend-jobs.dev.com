import React from "react";
import { CheckCircle, Clock, FileText, Send, Info, X } from "lucide-react";
import { formatDateTime } from "../../utils/helper";

interface ApplicationProps {
  id?: string;
  appliedAt: string;
  state: "SUBMITTED" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  resume: {
    id: string;
    title?: string;
  };
}

const ApplicationInfo: React.FC<{ application: ApplicationProps }> = ({
  application,
}) => {
  const getStateDisplay = (state: string) => {
    switch (state) {
      case "SUBMITTED":
        return {
          icon: Send,
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          textColor: "text-blue-800",
          label: "Đã gửi",
        };
      case "REVIEWING":
        return {
          icon: Info, // Hoặc Clock, tuỳ bạn
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300",
          textColor: "text-yellow-800",
          label: "Đang xem xét",
        };
      case "ACCEPTED":
        return {
          icon: CheckCircle,
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          textColor: "text-green-800",
          label: "Được chấp nhận",
        };
      case "REJECTED":
        return {
          icon: X,
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          textColor: "text-red-800",
          label: "Đã từ chối",
        };
      default:
        return {
          icon: Info,
          iconColor: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          textColor: "text-gray-800",
          label: state, // Hiển thị trạng thái mặc định nếu không khớp
        };
    }
  };

  const display = getStateDisplay(application.state);
  const ResumeIcon = FileText; // Icon cho CV

  return (
    <div
      className={`w-full ${display.bgColor} border ${display.borderColor} ${display.textColor} p-6 rounded-xl shadow-lg 
            transition-all duration-300 ease-in-out`}
    >
      {/* Tiêu đề chính */}
      <div
        className="flex items-center gap-3 border-b pb-4 mb-4"
        style={{
          borderColor: display.borderColor.replace("border-", "border-"),
        }}
      >
        <display.icon
          size={28}
          className={`${display.iconColor} flex-shrink-0`}
        />
        <h3 className="text-2xl font-bold text-gray-800">Hồ sơ đã được gửi!</h3>
      </div>

      {/* Chi tiết ứng tuyển */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            <Clock size={20} className="text-gray-500" />
            <span>Thời gian nộp:</span>
          </div>
          <span className="font-medium text-gray-700">
            {formatDateTime(application.appliedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            <Send size={20} className="text-gray-500" />
            <span>Trạng thái:</span>
          </div>
          <span
            className={`px-3 py-1 text-sm font-bold rounded-full ${display.bgColor} ${display.textColor}`}
            style={{
              borderColor: display.borderColor.replace("border-", "border-"),
            }}
          >
            {display.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            <ResumeIcon size={20} className="text-gray-500" />
            <span>CV đã dùng:</span>
          </div>
          <span
            className="font-medium text-teal-700 truncate max-w-[55%] text-right"
            title={
              application.resume?.title || `CV ID: ${application.resume.id}`
            }
          >
            {application.resume?.title ||
              `CV ID: ${application.resume.id.substring(0, 8)}...`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfo;
