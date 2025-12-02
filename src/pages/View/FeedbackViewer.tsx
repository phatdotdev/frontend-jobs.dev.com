import React from "react";
import {
  CheckCircle,
  Star,
  User,
  Layers,
  Zap,
  BookOpen,
  Calendar,
} from "lucide-react";
import moment from "moment";
import type { FeedbackReviewProps } from "../../types/FeedbackProps";

type FeedbackViewerProps = {
  review: FeedbackReviewProps;
};

const FeedbackViewer: React.FC<FeedbackViewerProps> = ({ review }) => {
  console.log(review);
  const renderCommentSection = (
    title: string,
    icon: React.ReactNode,
    comment: string
  ) => (
    <div className="mb-5 p-4 border border-gray-200 rounded-lg bg-white">
      <h4 className="flex items-center text-sm font-bold text-gray-800 mb-2">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <p className="text-sm text-gray-700 italic border-l-2 pl-3 border-purple-400">
        {comment}
      </p>
    </div>
  );

  const expertName = `${review.reviewerName}` || "Chuyên gia ẩn danh";

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Đánh Giá Đã Hoàn
        Thành
      </h2>

      {/* Thông tin chung và Điểm số */}
      <div className="flex justify-between items-center mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2" /> Đánh giá bởi: **{expertName}**
          </p>
          <p className="text-sm font-medium text-gray-700 flex items-center mt-1">
            <Calendar className="w-4 h-4 mr-2" /> Ngày đánh giá: **
            {moment(review.createdAt).format("HH:mm DD/MM/YYYY")}**
          </p>
        </div>

        {/* Điểm số */}
        <div className="text-center">
          <p className="text-xs font-bold text-gray-500 uppercase">Điểm</p>
          <p className="text-4xl font-extrabold text-red-600">
            {review.score}
            <span className="text-xl">/100</span>
          </p>
        </div>
      </div>

      {/* Các Bình luận chi tiết (Sử dụng tên trường từ interface FeedbackReviewProps) */}
      <div className="flex-grow overflow-y-auto pr-2">
        {/* Nhận xét Tổng quan */}
        {renderCommentSection(
          "Nhận Xét Tổng Quan",
          <User className="w-4 h-4 text-purple-600" />,
          review.overallComment
        )}

        {/* Nhận xét Kinh nghiệm */}
        {renderCommentSection(
          "Nhận Xét Kinh Nghiệm",
          <Layers className="w-4 h-4 text-green-600" />,
          review.experienceComment
        )}

        {/* Nhận xét Kỹ năng */}
        {renderCommentSection(
          "Nhận Xét Kỹ Năng",
          <Zap className="w-4 h-4 text-blue-600" />,
          review.skillsComment
        )}

        {/* Nhận xét Học vấn */}
        {renderCommentSection(
          "Nhận Xét Học Vấn",
          <BookOpen className="w-4 h-4 text-yellow-600" />,
          review.educationComment
        )}

        {/* Khuyến nghị */}
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="flex items-center text-md font-bold text-red-700 mb-2">
            <Star className="w-5 h-5 mr-2" /> Khuyến Nghị / Lời Khuyên
          </h4>
          <p className="text-sm text-red-800">{review.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackViewer;
