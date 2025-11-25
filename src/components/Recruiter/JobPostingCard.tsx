// src/components/Recruiter/JobPostingCard.tsx
import {
  Briefcase,
  Calendar,
  Captions,
  CaptionsOff,
  CircleCheck,
  Edit3,
  Eye,
  Flame,
  MapPin,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, getImageUrl } from "../../utils/helper";
import { useUpdateJobPostingStateMutation } from "../../redux/api/apiPostSlice";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { useState } from "react";

type JobPosting = {
  imageUrls: any;
  id: string;
  title: string;
  type:
    | "FULL_TIME"
    | "PART_TIME"
    | "INTERNSHIP"
    | "FREELANCE"
    | "CONTRACT"
    | "TEMPORARY"
    | "REMOTE";
  minSalary: number | null;
  maxSalary: number | null;
  views: number;
  applicantsCount?: number;
  state: "DRAFT" | "PUBLISHED" | "CLOSED";
  location?: { name: string } | null;
  expiredAt?: string | null;
  createdAt: string;
  applications?: any[];
  imageUrl?: string | null;
  companyName?: string;
};

// Modal xác nhận hành động - Cải thiện
const ActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Hủy",
  icon: Icon,
  color,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  icon: any;
  color: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 ${color}`} />
        <div className="p-4">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`p-2 rounded-2xl ${color} bg-opacity-15 flex-shrink-0`}
            >
              <Icon className={`w-7 h-7 ${color.replace("bg-", "text-")}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-8 py-3.5 ${color} text-white font-bold rounded-xl hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobPostingCard = ({
  job,
  onUpdate,
}: {
  job: JobPosting;
  onUpdate?: () => void;
}) => {
  const dispatch = useDispatch();
  const [updateJobPostingState] = useUpdateJobPostingStateMutation();

  const isDraft = job.state === "DRAFT";
  const isPublished = job.state === "PUBLISHED";
  const isClosed = job.state === "CLOSED";
  const isHot = job.views > 500;
  const hasApplicants =
    (job.applicantsCount ?? job.applications?.length ?? 0) > 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>(null);

  const stateConfig = {
    DRAFT: {
      label: "Nháp",
      icon: Edit3,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      bgColor: "bg-amber-500",
    },
    PUBLISHED: {
      label: "Đang đăng",
      icon: Eye,
      color: "bg-teal-50 text-teal-700 border-teal-200",
      bgColor: "bg-teal-500",
    },
    CLOSED: {
      label: "Đã đóng",
      icon: XCircle,
      color: "bg-slate-50 text-slate-700 border-slate-200",
      bgColor: "bg-slate-500",
    },
    COMPLETED: {
      label: "Hoàn thành",
      icon: CircleCheck,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      bgColor: "bg-blue-500",
    },
  };

  const config = stateConfig[job.state];
  const StateIcon = config.icon;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  const typeText = job.type
    .replace("_", " ")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const salaryText =
    job.minSalary && job.maxSalary
      ? `${formatCurrency(job.minSalary)} - ${formatCurrency(job.maxSalary)}`
      : job.maxSalary
      ? `Lên đến ${formatCurrency(job.maxSalary)}`
      : "Thỏa thuận";

  const openModal = (config: any) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  const handleAction = async () => {
    try {
      await updateJobPostingState({
        id: job.id,
        state: modalConfig.nextState,
      }).unwrap();

      dispatch(
        addToast({ type: "success", message: modalConfig.successMessage })
      );
      onUpdate?.();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Cập nhật thất bại. Vui lòng thử lại!",
        })
      );
    } finally {
      setModalOpen(false);
      setModalConfig(null);
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-teal-400 overflow-hidden">
        {/* Gradient overlay khi hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-teal-50/30 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thanh màu trên cùng theo trạng thái */}
        <div className={`h-1.5 ${config.bgColor}`} />

        <div className="relative p-6">
          {/* Header Section */}
          <div className="flex gap-5 mb-5">
            {/* Hình ảnh công ty */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-teal-400 transition-all duration-300 shadow-md group-hover:shadow-xl">
                <img
                  src={
                    job.imageUrls?.[0]
                      ? getImageUrl(job.imageUrls?.[0])
                      : "https://dummyimage.com/96x96/10b981/ffffff&text=HIRE"
                  }
                  alt={job.companyName || job.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full border ${config.color} shadow-sm`}
                >
                  <StateIcon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
                {isClosed && (
                  <span className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                    Đang xét duyệt
                  </span>
                )}
                {isHot && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 rounded-full border border-orange-200 shadow-sm">
                    <Flame className="w-3.5 h-3.5" />
                    Hot
                  </span>
                )}
              </div>

              {/* Tiêu đề */}
              <h3 className="text-xl font-black text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300 mb-2 leading-tight">
                {job.title}
              </h3>

              {/* Tên công ty */}
              {job.companyName && (
                <p className="text-sm text-gray-600 font-semibold flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                  {job.companyName}
                </p>
              )}
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-3 mb-5 bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Briefcase className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-semibold text-sm">{typeText}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Wallet className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-bold text-sm text-teal-700">
                {salaryText}
              </span>
            </div>

            {job.location?.name && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-sm font-medium">{job.location.name}</span>
              </div>
            )}
          </div>

          {/* Thống kê */}
          <div className="flex items-center justify-between text-xs text-gray-500 py-4 border-y border-gray-200 mb-5">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-full">
                <Eye className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-teal-700">
                  {job.views.toLocaleString("vi-VN")}
                </span>
                <span className="text-gray-600">lượt xem</span>
              </div>

              {hasApplicants && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-700">
                    {job.applicantsCount ?? job.applications?.length ?? 0}
                  </span>
                  <span className="text-gray-600">ứng viên</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {isDraft
                  ? formatDate(job.createdAt)
                  : job.expiredAt
                  ? `Đóng: ${new Date(job.expiredAt).toLocaleDateString(
                      "vi-VN"
                    )}`
                  : formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-3">
            {/* Nút chính */}
            <Link
              to={`/recruiter/jobs/${job.id}`}
              className="flex-1 min-w-[140px]"
            >
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-600 to-teal-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isDraft ? (
                  <>
                    <Edit3 className="w-5 h-5" />
                    Chỉnh sửa
                  </>
                ) : isClosed ? (
                  <>
                    <Eye className="w-5 h-5" />
                    Xem chi tiết
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5" />
                    Quản lý tin
                  </>
                )}
              </button>
            </Link>

            {/* Hành động theo trạng thái */}
            {isDraft && (
              <button
                onClick={() =>
                  openModal({
                    title: "Công khai tin tuyển dụng",
                    message:
                      "Sau khi công khai, ứng viên sẽ thấy và có thể nộp hồ sơ ngay lập tức.",
                    confirmText: "Công khai ngay",
                    icon: Captions,
                    color: "bg-teal-600",
                    nextState: "PUBLISHED",
                    successMessage: "Tin đã được công khai thành công!",
                  })
                }
                className="px-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Captions className="w-5 h-5" />
                <span className="hidden sm:inline">Công khai</span>
              </button>
            )}

            {isPublished && (
              <button
                onClick={() =>
                  openModal({
                    title: "Đóng tin tuyển dụng",
                    message:
                      "Tin sẽ không nhận thêm hồ sơ mới. Bạn vẫn có thể xem và xử lý hồ sơ hiện tại.",
                    confirmText: "Đóng tin",
                    icon: CaptionsOff,
                    color: "bg-red-500",
                    nextState: "CLOSED",
                    successMessage: "Tin đã được đóng thành công!",
                  })
                }
                className="px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <CaptionsOff className="w-5 h-5" />
                <span className="hidden sm:inline">Đóng tin</span>
              </button>
            )}

            {isClosed && (
              <button
                onClick={() =>
                  openModal({
                    title: "Kết thúc tuyển dụng",
                    message:
                      "Tin sẽ được đánh dấu là hoàn tất và chuyển vào lưu trữ.",
                    confirmText: "Kết thúc",
                    icon: CircleCheck,
                    color: "bg-indigo-600",
                    nextState: "COMPLETED",
                    successMessage: "Tin đã được kết thúc thành công!",
                  })
                }
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <CircleCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Kết thúc</span>
              </button>
            )}

            {/* Xem ứng viên */}
            {(isPublished || isClosed || hasApplicants) && (
              <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                <button className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-bold">
                    {job.applicantsCount ?? job.applications?.length ?? 0}
                  </span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ActionConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAction}
        title={modalConfig?.title || ""}
        message={modalConfig?.message || ""}
        confirmText={modalConfig?.confirmText || "Xác nhận"}
        icon={modalConfig?.icon || CircleCheck}
        color={modalConfig?.color || "bg-gray-600"}
      />
    </>
  );
};

export default JobPostingCard;
