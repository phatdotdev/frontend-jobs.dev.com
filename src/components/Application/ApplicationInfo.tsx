// src/components/Application/ApplicationInfo.tsx
import React, { useState } from "react";
import {
  Send,
  Clock,
  Eye,
  RotateCw,
  Mic,
  CheckCircle,
  UserCheck,
  XCircle,
  UploadCloud,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { formatDateTime } from "../../utils/helper";
import SupplementModal from "./SupplementModal";
import { useUpdateDocumentsMutation } from "../../redux/api/apiApplicationSlice";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import type { ApplicationDetail } from "../../types/ApplicationProps";

const ApplicationInfo: React.FC<{
  application: ApplicationDetail;
  refetch?: () => void;
}> = ({ application, refetch }) => {
  const dispatch = useDispatch();
  const [updateDocuments] = useUpdateDocumentsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const stateConfig = {
    SUBMITTED: {
      label: "Đã gửi hồ sơ",
      icon: Send,
      color: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      ring: "ring-blue-300",
      text: "text-blue-800",
      message: "Hồ sơ của bạn đã được gửi thành công!",
    },
    REVIEWING: {
      label: "Đang xét duyệt",
      icon: Eye,
      color: "amber",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-300",
      text: "text-amber-800",
      message: "Nhà tuyển dụng đang xem xét hồ sơ của bạn",
    },
    REQUESTED: {
      label: "Yêu cầu bổ sung",
      icon: AlertCircle,
      color: "purple",
      bg: "bg-purple-50",
      border: "border-purple-200",
      ring: "ring-purple-300",
      text: "text-purple-800",
      message: "Nhà tuyển dụng yêu cầu bạn bổ sung thêm tài liệu",
    },
    INTERVIEW: {
      label: "Đã mời phỏng vấn",
      icon: Mic,
      color: "indigo",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      ring: "ring-indigo-300",
      text: "text-indigo-800",
      message: "Chúc mừng! Bạn đã được mời phỏng vấn",
    },
    ACCEPTED: {
      label: "Được chấp nhận",
      icon: CheckCircle,
      color: "emerald",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-300",
      text: "text-emerald-800",
      message: "Tuyệt vời! Hồ sơ của bạn đã được chấp nhận",
    },
    HIRED: {
      label: "Đã nhận việc",
      icon: UserCheck,
      color: "green",
      bg: "bg-green-50",
      border: "border-green-200",
      ring: "ring-green-300",
      text: "text-green-800",
      message: "Chúc mừng bạn đã chính thức được nhận vào làm!",
    },
    REJECTED: {
      label: "Không đạt",
      icon: XCircle,
      color: "red",
      bg: "bg-red-50",
      border: "border-red-200",
      ring: "ring-red-300",
      text: "text-red-800",
      message: "Rất tiếc, bạn chưa phù hợp với vị trí này lần này",
    },
  };

  const config = stateConfig[application.state] || stateConfig.SUBMITTED;
  const Icon = config.icon;

  const handleSubmitDocuments = async () => {
    if (documentFiles.length === 0) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng chọn ít nhất 1 tệp" })
      );
      return;
    }

    const formData = new FormData();
    documentFiles.forEach((file) => formData.append("documents", file));

    try {
      await updateDocuments({ id: application.id, formData }).unwrap();
      dispatch(
        addToast({
          type: "success",
          title: "Gửi thành công!",
          message: "Tài liệu bổ sung đã được gửi đến nhà tuyển dụng",
        })
      );
      setIsModalOpen(false);
      setDocumentFiles([]);
      refetch?.();
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          title: "Gửi thất bại",
          message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        })
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header - Trạng thái nổi bật */}
        <div className={`${config.bg} ${config.border} border-b-4 px-8 py-6`}>
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-full bg-white shadow-lg ring-8 ${config.ring} ring-opacity-30`}
            >
              <Icon className={`w-10 h-10 ${config.text}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Trạng thái ứng tuyển
              </p>
              <p className={`text-2xl font-extrabold ${config.text}`}>
                {config.label}
              </p>
            </div>
          </div>
        </div>

        {/* Body - Thông tin chi tiết */}
        <div className="p-8 space-y-6">
          {/* Thời gian nộp */}
          <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gray-500" />
              <span className="font-semibold text-gray-700">Thời gian nộp</span>
            </div>
            <span className="font-bold text-gray-900">
              {formatDateTime(application.appliedAt)}
            </span>
          </div>

          {/* CV đã dùng */}
          <div className="flex items-center justify-between py-4 px-6 bg-teal-50 rounded-2xl border border-teal-200">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-teal-600" />
              <span className="font-semibold text-gray-700">
                CV đã ứng tuyển
              </span>
            </div>
            <span
              className="font-bold text-teal-800 truncate max-w-xs"
              title={application.resume.title}
            >
              {application.resume.title || "CV của bạn"}
            </span>
          </div>

          {/* Thời gian đặc biệt */}
          {(application.interviewAt ||
            application.hiredAt ||
            application.rejectedAt) && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {application.interviewAt && (
                <div className="flex items-center gap-3 text-indigo-700 font-medium">
                  <Mic className="w-5 h-5" />
                  <span>Lịch phỏng vấn:</span>
                  <span className="font-bold">
                    {new Date(application.interviewAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              )}
              {application.hiredAt && (
                <div className="flex items-center gap-3 text-emerald-700 font-bold">
                  <UserCheck className="w-5 h-5" />
                  <span>Ngày nhận việc:</span>
                  <span>
                    {new Date(application.hiredAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {application.rejectedAt && (
                <div className="flex items-center gap-3 text-red-700 font-medium">
                  <XCircle className="w-5 h-5" />
                  <span>Ngày từ chối:</span>
                  <span>
                    {new Date(application.rejectedAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Thông báo & hành động */}
        <div className={`px-8 py-6 ${config.bg} ${config.border} border-t-4`}>
          <div className="text-center space-y-4">
            <p className={`text-lg font-bold ${config.text}`}>
              {config.message}
            </p>

            {/* Nút bổ sung tài liệu */}
            {application.state === "REQUESTED" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 bg-purple-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-purple-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl text-lg"
              >
                <UploadCloud className="w-6 h-6" />
                Bổ sung tài liệu ngay
              </button>
            )}

            {/* Thông báo thành công */}
            {application.state === "HIRED" && (
              <div className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg">
                <UserCheck className="w-7 h-7" />
                Chúc mừng bạn đã được nhận!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal bổ sung tài liệu */}
      <SupplementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDocumentFiles([]);
        }}
        onSubmit={handleSubmitDocuments}
        documentFiles={documentFiles}
        setDocumentFiles={setDocumentFiles}
        isSubmitting={false}
      />
    </>
  );
};

export default ApplicationInfo;
