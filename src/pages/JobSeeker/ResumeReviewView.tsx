import { Link, useParams } from "react-router-dom";
import { useGetRequestByResumeQuery } from "../../redux/api/apiReviewSlice";
import { useGetResumeByIdQuery } from "../../redux/api/apiResumeSlice";
import { CheckCircle, Clock, ListCheck, MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import DataLoader from "../../components/UI/DataLoader";
import type {
  FeedbackRequestProps,
  FeedbackReviewProps,
} from "../../types/FeedbackProps";
import ReviewItem from "../../components/Item/ReviewItem";

const ResumeReviewView = () => {
  const { id } = useParams();
  const { data: requests, isLoading: requestLoading } =
    useGetRequestByResumeQuery(id);
  const { data: { data: resume } = {}, isLoading: resumeLoading } =
    useGetResumeByIdQuery(id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-yellow-700 bg-yellow-100 ring-1 ring-inset ring-yellow-200">
            <Clock className="w-4 h-4 mr-1" /> Đang chờ
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-green-700 bg-green-100 ring-1 ring-inset ring-green-200">
            <CheckCircle className="w-4 h-4 mr-1" /> Đã hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-gray-700 bg-gray-100 ring-1 ring-inset ring-gray-200">
            {status}
          </span>
        );
    }
  };
  if (resumeLoading || requestLoading) {
    return <DataLoader />;
  }

  return (
    <div className="min-h-[45rem] sm:mx-auto max-w-7xl mt-4 p-4">
      <header className="border-b border-gray-200 pb-8 mb-8">
        <div className="flex flex-col gap-1">
          {/* Tiêu đề Chính (Danh sách yêu cầu đánh giá) */}
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
            <ListCheck className="w-5 h-5" />
            Danh sách yêu cầu đánh giá
          </div>

          {/* Tên Hồ sơ/CV (resume.title) - Tiêu đề phụ lớn hơn */}
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {resume.title}
          </h1>

          {/* Phần Giới thiệu và Mục tiêu nghề nghiệp */}
          <div className="mt-4 space-y-3 text-lg text-gray-700">
            {resume.introduction && (
              <p className="leading-relaxed">{resume.introduction}</p>
            )}
            {resume.objectCareer && (
              <p className="border-l-4 border-blue-400 pl-4 py-1 italic bg-blue-50/50">
                <span className="font-bold text-blue-700">
                  Mục tiêu nghề nghiệp:
                </span>{" "}
                {resume.objectCareer}
              </p>
            )}
          </div>
        </div>
      </header>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📝 {requests?.length} Yêu cầu đánh giá đã tạo
      </h2>

      {/* Danh sách các Request */}
      <div className="space-y-4">
        {requests?.map((request: FeedbackRequestProps) => (
          <div
            key={request.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="flex justify-between items-start mb-4">
              {/* Status Badge */}
              {getStatusBadge(request.status)}

              {/* Ngày tạo */}
              <div className="text-sm text-gray-500">
                Yêu cầu tạo ngày: **
                {dayjs(request.createdAt).format("DD/MM/YYYY HH:mm")}**
              </div>
            </div>

            {/* Notes/Ghi chú của người yêu cầu */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Ghi chú yêu cầu:
              </h3>
              <p className="text-gray-600 pl-7 italic">
                {request.notes || "Không có ghi chú nào được cung cấp."}
              </p>
            </div>

            {/* Thông tin hoàn thành (Chỉ hiển thị nếu đã hoàn thành) */}
            {request.status === "COMPLETED" && (
              <div className="text-sm text-green-600 mb-4">
                Hoàn thành vào: **
                {dayjs(request.completedAt).format("DD/MM/YYYY HH:mm")}**
              </div>
            )}

            {/* DANH SÁCH REVIEWS LỒNG VÀO */}
            <div className="pt-4 border-t border-gray-200">
              {request.reviews && request.reviews.length > 0 ? (
                <div className="space-y-3">
                  {request.reviews.map((review: FeedbackReviewProps) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                  Chưa có đánh giá nào được gửi cho yêu cầu này.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeReviewView;
