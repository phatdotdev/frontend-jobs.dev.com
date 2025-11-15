import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  Send,
  AlertCircle,
  X,
  UploadCloud,
} from "lucide-react";
import { formatDateTime } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import type { ApplicationDetail } from "../../types/ApplicationProps";
import SupplementModal from "./SupplementModal";
import { useUpdateDocumentsMutation } from "../../redux/api/apiApplicationSlice";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const ApplicationInfo: React.FC<{
  application: ApplicationDetail;
  refetch?: () => void;
}> = ({ application, refetch }) => {
  const stateConfig = {
    SUBMITTED: {
      icon: Send,
      color: "blue",
      label: "Đã gửi",
      bg: "bg-blue-50",
      border: "border-blue-200",
      ring: "ring-blue-500",
      text: "text-blue-800",
    },
    REVIEWING: {
      icon: Clock,
      color: "yellow",
      label: "Đang xem xét",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      ring: "ring-yellow-500",
      text: "text-yellow-800",
    },
    ACCEPTED: {
      icon: CheckCircle,
      color: "green",
      label: "Được chấp nhận",
      bg: "bg-green-50",
      border: "border-green-200",
      ring: "ring-green-500",
      text: "text-green-800",
    },
    REJECTED: {
      icon: X,
      color: "red",
      label: "Đã từ chối",
      bg: "bg-red-50",
      border: "border-red-200",
      ring: "ring-red-500",
      text: "text-red-800",
    },
    REQUESTED: {
      icon: AlertCircle,
      color: "purple",
      label: "Yêu cầu bổ sung",
      bg: "bg-purple-50",
      border: "border-purple-200",
      ring: "ring-purple-500",
      text: "text-purple-800",
    },
  };

  const config = stateConfig[application.state] || stateConfig.SUBMITTED;
  const Icon = config.icon;

  const [updateDocuments, { isError, isSuccess }] =
    useUpdateDocumentsMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const formData = new FormData();
    documentFiles.forEach((file) => formData.append("documents", file));
    await updateDocuments({ id: application.id, formData }).unwrap();
    if (isSuccess) {
      dispatch(
        addToast({
          type: "success",
          title: "Bổ sung tài liệu thành công",
          message: "Tài liệu của bạn đã được gửi!",
        })
      );
    }
    if (isError) {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi khi bổ sung tài liệu",
          message: "Đã có lỗi xảy ra khi bổ sung tài liệu.",
        })
      );
    }
    setIsSubmitting(false);
    if (refetch) {
      refetch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`${config.bg} ${config.border} border-b-2 px-6 py-5`}>
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-full bg-white shadow-sm ring-4 ring-white ${config.ring}/20`}
          >
            <Icon className={`w-7 h-7 ${config.text}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Trạng thái đơn ứng tuyển
            </p>
            <p className={`text-xl font-bold ${config.text}`}>{config.label}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Thời gian nộp</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatDateTime(application.appliedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="font-medium">CV đã dùng</span>
          </div>
          <span
            className="font-semibold text-teal-700 truncate max-w-[250px] text-right"
            title={application.resume.title || `ID: ${application.resume.id}`}
          >
            {application.resume.title ||
              `CV ${application.resume.id.slice(0, 8)}...`}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 ${config.bg} border-t ${config.border}`}>
        {application.state === "REQUESTED" ? (
          <div className="flex flex-col items-center gap-3">
            <p className={`text-sm font-semibold text-center ${config.text}`}>
              Vui lòng bổ sung tài liệu theo yêu cầu của nhà tuyển dụng
            </p>
            <button
              onClick={() => setIsSubmitting(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              <UploadCloud className="w-5 h-5" />
              Bổ sung tài liệu ngay
            </button>
          </div>
        ) : (
          <p className={`text-sm font-semibold text-center ${config.text}`}>
            {application.state === "ACCEPTED" && "Chúc mừng bạn đã được chọn!"}
            {application.state === "REJECTED" && "Cảm ơn bạn đã ứng tuyển"}
            {application.state === "REVIEWING" &&
              "Nhà tuyển dụng đang xem hồ sơ của bạn"}
            {application.state === "SUBMITTED" &&
              "Hồ sơ đã được gửi thành công"}
          </p>
        )}
      </div>
      <SupplementModal
        onClose={() => setIsSubmitting(false)}
        onSubmit={handleSubmit}
        isOpen={isSubmitting}
        isSubmitting={false}
        documentFiles={documentFiles}
        setDocumentFiles={setDocumentFiles}
      />
    </div>
  );
};

export default ApplicationInfo;
