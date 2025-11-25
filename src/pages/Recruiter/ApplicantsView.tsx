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
  Filter,
  Upload,
  Edit2,
  Laptop,
} from "lucide-react";

import DataLoader from "../../components/UI/DataLoader";
import {
  useGetApplicantsByPostQuery,
  useUpdateApplicationStateMutation,
} from "../../redux/api/apiApplicationSlice";
import { useGetJobPostingDetailQuery } from "../../redux/api/apiPostSlice";
import type {
  ApplicationDetail,
  ApplicationState,
} from "../../types/ApplicationProps";
import ApplicantCard from "../../components/Application/ApplicationCard";

import {
  getApplicationStateNote,
  mapApplicationStateToVi,
} from "../../utils/helper";
import { FaFileExcel } from "react-icons/fa6";
import { exportApplicationsToExcel } from "../../utils/exportToExcel";

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
    value: "REQUESTED",
    label: "Thiếu tài liệu",
    icon: Upload,
    gradient: "from-purple-500 to-indigo-500",
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

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [newState, setNewState] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  const applicationsData: PageData<ApplicationDetail> | undefined =
    response?.data;

  const postTitle = postDetail?.data?.title || "Đang tải tên công việc...";

  const handleFilterChange = (state: ApplicationState) => {
    setFilterState(state);
    setPage(0);
  };

  const handleNextPage = () => {
    if (applicationsData && page < applicationsData.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const setApplicationChange = (
    id: string,
    newState: string,
    currentState: string
  ) => {
    setCurrentId(id);
    setNewState(newState);
    setCurrentState(currentState);
    setContent(getApplicationStateNote(newState));
  };

  const cancelUpdateState = () => {
    setCurrentId(null);
    setCurrentState(null);
    setContent("");
  };

  const [updateState] = useUpdateApplicationStateMutation();

  const updateApplicationState = async () => {
    await updateState({
      id: currentId,
      payload: { state: newState, content },
    }).unwrap();
    setCurrentId(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-6 px-4 md:px-10">
      {/* Header */}
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-teal-600" />
            Quản lý danh sách tuyển dụng
          </h1>
          <p className="ml-10 flex items-center gap-4 mt-4 font-extrabold text-3xl text-purple-600">
            {postTitle}
          </p>
        </div>
        <button
          onClick={() =>
            exportApplicationsToExcel(applicationsData?.content as any)
          }
          className="flex items-center gap-3 px-4 py-2 rounded-2xl 
             bg-emerald-500 text-white font-semibold text-base 
             shadow-md hover:bg-emerald-600 hover:shadow-lg 
             transition-all duration-200 border-4 border-green-300"
        >
          <FaFileExcel className="text-white text-xl" />
          Xuất file kết quả
        </button>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-6">
          <div className="flex flex-col flex-wrap items-start gap-4">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-700">
              <Filter className="w-8 h-8 text-purple-600" />
              Lọc theo trạng thái:
            </div>
            <div className="flex flex-wrap gap-4">
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
              Chưa có ứng viên nào
              {filterState &&
                `với trạng thái "${
                  STATE_OPTIONS.find((o) => o.value === filterState)?.label
                }"`}
            </p>
          </div>
        ) : (
          applicationsData?.content.map((app) => (
            <ApplicantCard
              key={app.id}
              application={app as ApplicationDetail}
              setApplicationChange={setApplicationChange}
            />
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
      {currentId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white text-gray-500 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
            {/* Nút Đóng */}
            <X
              onClick={cancelUpdateState}
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-red-500 transition-colors duration-200"
              size={24}
            />
            {/* Tiêu đề */}
            <div className="mb-6 border-b pb-2 border-gray-100">
              <h2 className="flex gap-2 items-center text-xl font-bold text-gray-800">
                <Edit2 /> Ghi Chú Cập Nhật Trạng Thái
              </h2>
              <div className="flex items-center justify-center gap-3 mt-4 mb-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm shadow-inner transition-colors duration-300">
                  {mapApplicationStateToVi(currentState as string)}
                </span>

                <ChevronRight
                  size={20}
                  className="text-gray-400 flex-shrink-0"
                />

                <span className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-md shadow-md transform scale-[1.05] transition-all duration-300">
                  {mapApplicationStateToVi(newState as string)}
                </span>
              </div>
            </div>
            {/* Textarea */}
            <textarea
              name="content"
              id="content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập lý do hoặc ghi chú chi tiết cho thay đổi trạng thái này..."
              className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-shadow duration-200 placeholder-gray-500 text-base"
            ></textarea>
            {/* Nút hành động */}
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-6 py-2 border bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                Hủy
              </button>

              <button
                onClick={updateApplicationState}
                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsByPostView;
