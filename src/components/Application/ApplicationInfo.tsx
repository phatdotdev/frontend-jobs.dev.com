// src/components/Application/ApplicationInfo.tsx
import React, { useState } from "react";
import {
  Send,
  Clock,
  Eye,
  AlertCircle,
  Mic,
  CheckCircle,
  UserCheck,
  XCircle,
  Upload,
  Calendar,
  FileText,
} from "lucide-react";
import { formatDateTime } from "../../utils/helper";
import SupplementModal from "./SupplementModal";
import {
  useCancelApplicationMutation,
  useUpdateDocumentsMutation,
} from "../../redux/api/apiApplicationSlice";
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

  const [cancel, { isLoading: canceling }] = useCancelApplicationMutation();

  const statusConfig = {
    SUBMITTED: {
      label: "Đã nộp",
      icon: Send,
      color: "blue",
      message: "Hồ sơ đã được gửi thành công",
    },
    REVIEWING: {
      label: "Đang xét duyệt",
      icon: Eye,
      color: "yellow",
      message: "Nhà tuyển dụng đang xem xét",
    },
    REQUESTED: {
      label: "Yêu cầu bổ sung",
      icon: AlertCircle,
      color: "purple",
      message: "Vui lòng bổ sung tài liệu",
    },
    INTERVIEW: {
      label: "Mời phỏng vấn",
      icon: Mic,
      color: "indigo",
      message: "Chúc mừng! Bạn được mời phỏng vấn",
    },
    ACCEPTED: {
      label: "Được chấp nhận",
      icon: CheckCircle,
      color: "emerald",
      message: "Hồ sơ đã được duyệt",
    },
    HIRED: {
      label: "Đã nhận việc",
      icon: UserCheck,
      color: "green",
      message: "Chúc mừng bạn đã chính thức được nhận!",
    },
    REJECTED: {
      label: "Không đạt",
      icon: XCircle,
      color: "red",
      message: "Rất tiếc, bạn chưa phù hợp lần này",
    },
    CANCELLED: {
      label: "Đã hủy",
      icon: XCircle,
      color: "gray",
      message: "Bạn đã hủy đơn ứng tuyển này",
    },
  };

  const status = statusConfig[application.state] || statusConfig.SUBMITTED;
  const Icon = status.icon;

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const bgClass = colorClasses[status.color as keyof typeof colorClasses];

  const handleSubmitDocuments = async () => {
    if (!documentFiles.length) {
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
          title: "Thành công!",
          message: "Tài liệu bổ sung đã được gửi",
        })
      );
      setIsModalOpen(false);
      setDocumentFiles([]);
      refetch?.();
    } catch {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi",
          message: "Không thể gửi tài liệu. Vui lòng thử lại.",
        })
      );
    }
  };

  const cancelApplication = async () => {
    try {
      await cancel(application.id).unwrap();
      dispatch(
        addToast({
          type: "success",
          title: "Thành công!",
          message: "Đã hủy đơn ứng tuyển",
        })
      );
      await refetch?.();
    } catch {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi",
          message: "Không thể hủy đơn ứng tuyển.",
        })
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header - Trạng thái nổi bật */}
        <div
          className={`px-6 py-5 border-b-4 ${bgClass.split(" ")[0]} border-${
            status.color
          }-500`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-white shadow-md ring-4 ring-${status.color}-100`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Trạng thái ứng tuyển
              </p>
              <p className="text-xl font-bold">{status.label}</p>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="p-6 space-y-5">
          {/* Thời gian nộp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Thời gian nộp</span>
            </div>
            <span className="font-semibold text-gray-900">
              {formatDateTime(application.appliedAt)}
            </span>
          </div>

          {/* CV đã dùng */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-700">
              <FileText className="w-5 h-5 text-teal-600" />
              <span className="font-medium">CV ứng tuyển</span>
            </div>
            <span
              className="font-medium text-teal-700 truncate max-w-[200px]"
              title={application.resume.title}
            >
              {application.resume.title || "CV mặc định"}
            </span>
          </div>

          {/* Các mốc thời gian đặc biệt */}
          {(application.acceptedAt ||
            application.hiredAt ||
            application.rejectedAt) && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {(application.acceptedAt as any) && (
                <div className="flex items-center gap-3 text-indigo-700">
                  <Mic className="w-5 h-5" />
                  <span className="font-medium">Hồ sơ chấp nhận:</span>
                  <span className="font-semibold">
                    {new Date(
                      application.updatedAt as string
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {application.hiredAt && (
                <div className="flex items-center gap-3 text-emerald-700 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  <span>Nhận việc:</span>
                  <span className="font-bold">
                    {new Date(application.hiredAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {application.rejectedAt && (
                <div className="flex items-center gap-3 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Từ chối:</span>
                  <span className="font-semibold">
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
        <div className={`px-6 py-5 ${bgClass.split(" ")[0]} border-t`}>
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">{status.message}</p>

            {/* Nút hành động */}
            {application.state === "REQUESTED" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                Bổ sung tài liệu
              </button>
            )}

            {application.state !== "HIRED" &&
              application.state !== "REJECTED" &&
              application.state !== "CANCELLED" && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn hủy đơn ứng tuyển này không?\nHành động này không thể hoàn tác."
                        )
                      ) {
                        cancelApplication();
                      }
                    }}
                    disabled={canceling}
                    className={`
              group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-medium
              transition-all duration-300 transform hover:-translate-y-0.5
              ${
                canceling
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-red-600 border-2 border-red-500 hover:border-red-600 hover:bg-red-50 hover:shadow-lg"
              }
            `}
                  >
                    {canceling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Đang hủy...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Hủy đơn ứng tuyển</span>
                      </>
                    )}
                    {/* Hiệu ứng viền đỏ lan tỏa khi hover */}
                    <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-400 pointer-events-none transition-all"></span>
                  </button>
                </div>
              )}

            {application.state === "HIRED" && (
              <div className="inline-flex items-center gap-3 bg-green-600 text-white px-7 py-4 rounded-xl font-bold">
                <UserCheck className="w-6 h-6" />
                Chúc mừng bạn đã được nhận việc!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal bổ sung */}
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
