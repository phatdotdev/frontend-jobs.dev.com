import React, { useState } from "react";
import {
  ListChecks,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  Inbox,
  Clock,
  History,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import ApplicationInfo from "../../components/Application/ApplicationInfo";
import DataLoader from "../../components/UI/DataLoader";
import { useGetMyApplicationsQuery } from "../../redux/api/applicationSlice";

// Định nghĩa kiểu dữ liệu cơ bản cho Application và Paging (lặp lại từ giả định để code độc lập hơn)
interface ApplicationDetail {
  id: string;
  appliedAt: string;
  state: "SUBMITTED" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  resume: {
    id: string;
    title?: string;
  };
  post: {
    id: string;
    title: string;
    companyName: string;
    avatarUrl: string;
  };
}

interface PageData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-based)
  size: number;
}

// Card hiển thị thông tin ứng tuyển
const AppliedJobCard: React.FC<{ application: ApplicationDetail }> = ({
  application,
}) => {
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/job/${application.post.id}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col md:flex-row gap-6">
      {/* Cột thông tin công việc */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={getImageUrl(application.post.avatarUrl)}
            alt={application.post.companyName}
            className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
          />
          <div>
            <h3
              className="text-xl font-bold text-gray-800 hover:text-teal-600 cursor-pointer transition duration-150"
              onClick={handleNavigateToDetail}
            >
              {application.post.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {application.post.companyName}
            </p>
          </div>
        </div>

        {/* Thông tin nộp hồ sơ */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-teal-500 flex-shrink-0" />
            <span>
              **Thời gian nộp:** {formatDateTime(application.appliedAt)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Inbox size={16} className="text-teal-500 flex-shrink-0" />
            <span>
              **CV đã dùng:**{" "}
              {application.resume.title ||
                `(ID: ${application.resume.id.substring(0, 8)}...)`}
            </span>
          </div>
        </div>
      </div>

      {/* Cột trạng thái (Sử dụng component đã cải tiến ApplicationInfo) */}
      {/* Lưu ý: ApplicationInfo mong đợi một object application đơn giản hơn, ta cần cung cấp đúng cấu trúc. */}
      <div className="w-full md:w-80 flex-shrink-0">
        <ApplicationInfo
          application={{
            appliedAt: application.appliedAt,
            state: application.state,
            resume: application.resume,
          }}
        />
      </div>
    </div>
  );
};

const AppliedJobsView: React.FC = () => {
  const [page, setPage] = useState(0);
  const pageSize = 5; // Số lượng đơn ứng tuyển mỗi trang

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetMyApplicationsQuery({ page, size: pageSize });
  const appliedData: PageData<ApplicationDetail> | undefined = response?.data;

  const handleNextPage = () => {
    if (appliedData && page < appliedData.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
          <History className="mr-3 w-8 h-8 text-blue-600" /> Lịch sử ứng tuyển
        </h1>
      </div>

      <hr className="mt-6 border-gray-200" />

      {/* Thống kê nhanh */}
      <div className="bg-white p-6 shadow-xl border border-gray-100 flex items-center justify-between">
        <p className="text-xl font-semibold text-gray-700 flex items-center gap-3">
          <Briefcase size={24} className="text-blue-500" />
          Bạn đã nộp tổng cộng:
          <span className="text-blue-600 font-extrabold text-xl ml-2">
            {appliedData?.totalElements ?? 0}
          </span>
          đơn ứng tuyển
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition duration-150"
          disabled={isLoading}
        >
          {isLoading ? (
            <Clock size={16} className="animate-spin" />
          ) : (
            <ListChecks size={16} />
          )}
          {isLoading ? "Đang tải..." : "Cập nhật"}
        </button>
      </div>

      {/* KẾT QUẢ DANH SÁCH ỨNG TUYỂN */}
      <div className="space-y-6">
        {isLoading ? (
          <DataLoader />
        ) : isError ? (
          <div className="p-10 text-center bg-red-50 rounded-xl border border-red-300 shadow-md">
            <X size={32} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-semibold">
              Đã xảy ra lỗi khi tải danh sách ứng tuyển. Vui lòng thử lại.
            </p>
          </div>
        ) : appliedData?.content.length === 0 ? (
          <div className="p-10 text-center bg-yellow-50 rounded-xl border border-yellow-300 shadow-md">
            <Inbox size={32} className="text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold">
              Bạn chưa ứng tuyển công việc nào. Bắt đầu tìm kiếm ngay!
            </p>
          </div>
        ) : (
          <>
            {appliedData?.content.map((app) => (
              <AppliedJobCard key={app.id} application={app} />
            ))}
          </>
        )}
      </div>

      {/* PHÂN TRANG */}
      {(appliedData?.totalPages || 0) > 1 && (
        <div className="flex justify-center items-center gap-6 pt-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 0 || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-teal-500 rounded-full text-teal-600 font-bold hover:bg-teal-50 hover:shadow-lg disabled:opacity-50 transition duration-200"
          >
            <ChevronLeft size={20} />
            Trang trước
          </button>
          <span className="text-lg font-extrabold text-teal-700 bg-teal-100 px-4 py-2 rounded-lg min-w-[100px] text-center shadow-md">
            {page + 1} / {appliedData?.totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= (appliedData?.totalPages || 1) - 1 || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 hover:shadow-lg disabled:opacity-50 transition duration-200"
          >
            Trang sau
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppliedJobsView;
