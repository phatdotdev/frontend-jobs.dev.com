import { Link, useParams } from "react-router-dom";
import { useGetRequestByResumeQuery } from "../../redux/api/apiReviewSlice";
import { useGetResumeByIdQuery } from "../../redux/api/apiResumeSlice";
import {
  CheckCircle,
  Clock,
  ListCheck,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import dayjs from "dayjs";
import DataLoader from "../../components/UI/DataLoader";
import ReviewItem from "../../components/Item/ReviewItem";

const ResumeReviewView = () => {
  const { id } = useParams();
  const { data: requests, isLoading: requestLoading } =
    useGetRequestByResumeQuery(id);
  const { data: { data: resume } = {}, isLoading: resumeLoading } =
    useGetResumeByIdQuery(id);

  if (resumeLoading || requestLoading) return <DataLoader />;

  const getStatusBadge = (status: string) => {
    if (status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
          <Clock className="w-4 h-4" />
          Đang chờ góp ý
        </span>
      );
    }
    if (status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-4 h-4" />
          Đã hoàn thành
        </span>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header - nhẹ nhàng hơn */}
      <header className="mb-10">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 mb-3">
          <ListCheck className="w-5 h-5 text-purple-600" />
          Lịch sử yêu cầu góp ý CV
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          {resume.title}
        </h1>

        {resume.objectCareer && (
          <div className="mt-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-lg text-gray-800">
              <span className="font-bold text-purple-700">Mục tiêu:</span>{" "}
              {resume.objectCareer}
            </p>
          </div>
        )}
      </header>

      {/* Tiêu đề danh sách */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {requests?.length || 0} yêu cầu đã gửi
        </h2>
      </div>

      {/* Danh sách request - cải thiện nhẹ */}
      <div className="space-y-6">
        {requests?.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <CalendarDays className="w-14 h-14 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600">
              Chưa có yêu cầu nào
            </p>
            <p className="text-gray-500 mt-2">
              Khi bạn gửi góp ý, chúng sẽ xuất hiện ở đây
            </p>
          </div>
        ) : (
          requests?.map((request: any) => (
            <div
              key={request.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Ghi chú */}
                {request.notes && (
                  <div className="flex justify-between mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Ghi chú của bạn:
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {request.notes}
                        </p>
                      </div>
                    </div>

                    {/* Status + Ngày */}
                    <div className="flex items-center justify-between mb-5">
                      <div>{getStatusBadge(request.status)}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        {dayjs(request.createdAt).format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hoàn thành */}
                {request.status === "COMPLETED" && request.completedAt && (
                  <div className="text-sm text-emerald-600 font-medium mb-5 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Hoàn thành lúc:{" "}
                    {dayjs(request.completedAt).format("DD/MM/YYYY HH:mm")}
                  </div>
                )}

                {/* Danh sách review */}
                <div className="border-t pt-6">
                  {request.reviews?.length > 0 ? (
                    <div className="space-y-5">
                      {request.reviews.map((review: any) => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">Chưa có đánh giá nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResumeReviewView;
