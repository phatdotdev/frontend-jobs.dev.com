import { Files, Clock, CheckCircle, Eye } from "lucide-react";
import { useGetActiveFeedbackRequestQuery } from "../../redux/api/apiReviewSlice";
import moment from "moment";
import { Link } from "react-router-dom";
import type { FeedbackRequestProps } from "../../types/FeedbackProps";

const FeedbackRequestView = () => {
  const { data: response, isLoading } = useGetActiveFeedbackRequestQuery({});

  // Loading gọn
  if (isLoading) {
    return (
      <div className="sm:mx-[100px] mt-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur border rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-72"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-8 bg-purple-200 rounded-full w-28"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state gọn xinh
  if (!response || response.data.totalElements === 0) {
    return (
      <div className="sm:mx-[100px] mt-12 text-center py-16 bg-gradient-to-b from-purple-50 to-white rounded-2xl border border-purple-200">
        <Files className="w-16 h-16 mx-auto text-purple-400 mb-4" />
        <p className="text-xl font-semibold text-gray-700">
          Chưa có yêu cầu góp ý
        </p>
        <p className="text-gray-500 mt-2">Các yêu cầu mới sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  const requests = response.data.content;

  const renderStatus = (status: string) => {
    if (status === "REVIEW")
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-300">
          <Clock className="w-3.5 h-3.5" />
          Đang review
        </span>
      );
    if (status === "COMPLETED")
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5" />
          Hoàn thành
        </span>
      );
    return <span className="text-xs text-gray-500">{status}</span>;
  };

  return (
    <div className="sm:mx-[100px] mt-6">
      {/* Header nhỏ gọn */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
          <Files className="w-7 h-7 text-purple-600" />
          Yêu cầu góp ý hồ sơ
        </h1>
        <span className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
          {response.data.totalElements} yêu cầu
        </span>
      </div>

      {/* Danh sách thẻ GỌN */}
      <div className="space-y-4">
        {requests.map((request: FeedbackRequestProps) => (
          <Link
            key={request.id}
            to={`/expert/requests/${request.id}`}
            className="block group"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300 group-hover:bg-purple-50/50">
              <div className="flex items-start justify-between gap-4">
                {/* Thông tin chính */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-purple-700">
                    {request.resume.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium truncate max-w-[200px]">
                      {request.resume.lastname} {request.resume.firstname}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs">
                      {moment(request.createdAt).format("DD/MM/YYYY")}
                    </span>
                    {request.completedAt && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span
                          className={`text-xs font-medium ${
                            request.status === "REVIEW"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {moment(request.completedAt).format("DD/MM/YYYY")}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Mục tiêu ngắn gọn */}
                  {request.resume.objectCareer && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-1 italic">
                      Mục tiêu: {request.resume.objectCareer}
                    </p>
                  )}
                </div>

                {/* Status + Nút xem */}
                <div className="flex items-center gap-3">
                  {renderStatus(request.status)}
                  <div className="p-2 bg-purple-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Ghi chú ngắn (nếu có) */}
              {request.notes && (
                <p className="mt-3 text-xs text-gray-500 line-clamp-2 border-t pt-3 border-gray-100">
                  Ghi chú: {request.notes}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeedbackRequestView;
