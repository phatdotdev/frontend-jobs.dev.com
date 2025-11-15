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

import DataLoader from "../../components/UI/DataLoader";
import { useGetMyApplicationsQuery } from "../../redux/api/apiApplicationSlice";
import AppliedJobCard from "../../components/Application/AppliedJobCard";
import type { ApplicationDetail } from "../../types/ApplicationProps";

interface PageData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const AppliedJobsView: React.FC = () => {
  const [page, setPage] = useState(0);
  const pageSize = 5;

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
