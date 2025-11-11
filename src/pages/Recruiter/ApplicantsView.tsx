import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Briefcase,
  User,
  Eye,
  Check,
  X,
  Clock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  Download,
  Mail,
  Phone,
} from "lucide-react";

import DataLoader from "../../components/UI/DataLoader";
import {
  useGetApplicantsByPostQuery,
  useUpdateApplicationStateMutation,
} from "../../redux/api/applicationSlice";
import { useGetJobPostingDetailQuery } from "../../redux/api/postApiSlice";
import { formatDateTime } from "../../utils/helper";

type ApplicationState =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "";

interface ApplicationDetail {
  id: string;
  appliedAt: string;
  state: ApplicationState;
  resume: {
    id: string;
    title: string;
    fileUrl: string;
    firstname: string;
    lastname: string;
    objectCareer: string;
    phone: string;
    email?: string;
  };
  post: {
    id: string;
    title: string;
    companyName: string;
    description: string;
  };
}

interface PageData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const STATE_OPTIONS = [
  {
    value: "",
    label: "Tất cả",
    icon: User,
    gradient: "from-gray-400 to-gray-600",
  },
  {
    value: "SUBMITTED",
    label: "Mới nộp",
    icon: Clock,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    value: "IN_REVIEW",
    label: "Đang xem",
    icon: Eye,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    value: "ACCEPTED",
    label: "Chấp nhận",
    icon: Check,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    value: "REJECTED",
    label: "Từ chối",
    icon: X,
    gradient: "from-red-500 to-pink-500",
  },
];

const getStateConfig = (state: ApplicationState) => {
  switch (state) {
    case "SUBMITTED":
      return {
        label: "Mới nộp",
        icon: Clock,
        gradient: "from-blue-500 to-cyan-500",
      };
    case "IN_REVIEW":
      return {
        label: "Đang xem",
        icon: Eye,
        gradient: "from-yellow-500 to-orange-500",
      };
    case "ACCEPTED":
      return {
        label: "Chấp nhận",
        icon: Check,
        gradient: "from-green-500 to-emerald-500",
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        icon: X,
        gradient: "from-red-500 to-pink-500",
      };
    default:
      return {
        label: "Không rõ",
        icon: User,
        gradient: "from-gray-400 to-gray-600",
      };
  }
};

const ApplicantsByPostView: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();

  const [page, setPage] = useState(0);
  const [filterState, setFilterState] = useState<ApplicationState>("");
  const pageSize = 10;

  const { data: postDetail } = useGetJobPostingDetailQuery(postId!, {
    skip: !postId,
  });
  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetApplicantsByPostQuery(
    { postId: postId, page, size: pageSize, state: filterState },
    { skip: !postId }
  );

  const [updateState, { isLoading: isUpdating }] =
    useUpdateApplicationStateMutation();

  const applicationsData: PageData<ApplicationDetail> | undefined =
    response?.data;
  const postTitle = postDetail?.data?.title || "Đang tải tên công việc...";

  const handleFilterChange = (state: ApplicationState) => {
    setFilterState(state);
    setPage(0);
  };

  const handleChangeAppState = async (
    applicationId: string,
    newState: "IN_REVIEW" | "ACCEPTED" | "REJECTED"
  ) => {
    try {
      await updateState({
        id: applicationId,
        payload: { state: newState, content: "Trạng thái đã được cập nhật!" },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleNextPage = () => {
    if (applicationsData && page < applicationsData.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const ApplicantCard: React.FC<{ application: ApplicationDetail }> = ({
    application,
  }) => {
    const config = getStateConfig(application.state as ApplicationState);
    const fullName =
      `${application.resume.firstname} ${application.resume.lastname}`.trim();

    return (
      <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:-translate-y-2">
        {/* Glow hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            {/* Left: Candidate Info */}
            <div className="flex-1 space-y-5">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <User className="w-9 h-9 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                    {fullName || "Ứng viên"}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    <span className="font-bold text-purple-600">
                      {application.resume.objectCareer || "Chưa xác định"}
                    </span>{" "}
                    • Ứng tuyển lúc: {formatDateTime(application.appliedAt)}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {application.resume.email && (
                      <a
                        href={`mailto:${application.resume.email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition"
                      >
                        <Mail size={16} /> {application.resume.email}
                      </a>
                    )}
                    <a
                      href={`tel:${application.resume.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition"
                    >
                      <Phone size={16} /> {application.resume.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pl-20 space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-800">
                    CV: {application.resume.title}
                  </span>
                </div>
                <a
                  href={application.resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Download size={18} /> Tải CV ngay
                </a>
              </div>
            </div>

            {/* Right: Status + Actions */}
            <div className="flex flex-col items-end gap-5">
              {/* Current Status Badge */}
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Trạng thái hiện tại
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold shadow-lg`}
                >
                  <config.icon size={20} />
                  {config.label}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3">
                {application.state === "SUBMITTED" && (
                  <button
                    onClick={() =>
                      handleChangeAppState(application.id, "IN_REVIEW")
                    }
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 disabled:opacity-70"
                  >
                    <Eye size={20} /> Nhận hồ sơ
                  </button>
                )}

                {application.state === "IN_REVIEW" && (
                  <>
                    <button
                      onClick={() =>
                        handleChangeAppState(application.id, "ACCEPTED")
                      }
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 disabled:opacity-70"
                    >
                      <Check size={20} /> Duyệt
                    </button>
                    <button
                      onClick={() =>
                        handleChangeAppState(application.id, "REJECTED")
                      }
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 disabled:opacity-70"
                    >
                      <X size={20} /> Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-6 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-left mb-12">
        <h1 className="mt-4 flex items-center gap-4 font-extrabold justify-center my-4 text-4xl font-bold text-center text-gray-800">
          <Briefcase className="w-16 h-16" />
          Quản lý Ứng viên
        </h1>
        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
          {postTitle}
        </h2>
        <p className="mt-3 text-xl font-bold text-gray-600">
          Tổng:{" "}
          <span className="font-bold text-purple-600">
            {applicationsData?.totalElements ?? "..."}
          </span>{" "}
          ứng viên
        </p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-700">
              <Filter className="w-8 h-8 text-purple-600" />
              Lọc theo trạng thái:
            </div>
            <div className="flex flex-wrap gap-3">
              {STATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handleFilterChange(option.value as ApplicationState)
                  }
                  disabled={isFetching}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    filterState === option.value
                      ? `bg-gradient-to-r ${option.gradient} ring-4 ring-white/50`
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <option.icon size={20} />
                  {option.label}
                  {filterState === option.value &&
                    ` (${applicationsData?.totalElements ?? "..."})`}
                </button>
              ))}
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="ml-auto p-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              {isFetching ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <RefreshCw className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      <div className="max-w-7xl mx-auto space-y-8">
        {isLoading && page === 0 ? (
          <DataLoader />
        ) : isError ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-red-200">
            <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-red-700">
              Lỗi tải dữ liệu. Vui lòng thử lại!
            </p>
          </div>
        ) : applicationsData?.content.length === 0 ? (
          <div className="text-center py-20 bg-yellow-50 rounded-3xl border-2 border-yellow-200">
            <User className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-700">
              Chưa có ứng viên nào{" "}
              {filterState &&
                `với trạng thái "${
                  STATE_OPTIONS.find((o) => o.value === filterState)?.label
                }"`}
            </p>
          </div>
        ) : (
          applicationsData?.content.map((app) => (
            <ApplicantCard key={app.id} application={app} />
          ))
        )}
      </div>

      {/* Pagination */}
      {(applicationsData?.totalPages || 0) > 1 && (
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6 mt-16">
          <button
            onClick={handlePrevPage}
            disabled={page === 0 || isFetching}
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-purple-600 rounded-full text-purple-600 font-bold hover:bg-purple-50 shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all duration-300"
          >
            <ChevronLeft size={24} /> Trang trước
          </button>

          <div className="px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-extrabold text-xl rounded-full shadow-2xl">
            {page + 1} / {applicationsData?.totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={
              page >= (applicationsData?.totalPages || 1) - 1 || isFetching
            }
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all duration-300"
          >
            Trang sau <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantsByPostView;
