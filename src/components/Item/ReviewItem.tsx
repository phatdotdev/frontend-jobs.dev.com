import dayjs from "dayjs";
import type { FeedbackReviewProps } from "../../types/FeedbackProps";
import {
  MessageSquare,
  Briefcase,
  Zap,
  GraduationCap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ReviewItem = ({ review }: { review: FeedbackReviewProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header: Tên + Điểm + Ngày */}
      <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-7 h-7 text-white" fill="currentColor" />
            </div>

            <div className="flex-1">
              <Link
                to={`/reviewers/${review.expertId}`}
                className="font-bold text-lg text-gray-900 hover:text-purple-700 transition-colors inline-block"
              >
                {review.reviewerName || "Chuyên gia ẩn danh"}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                {dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}
              </div>
            </div>
          </div>

          {/* Điểm số nổi bật */}
          <div className="text-right">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {review.score ?? "--"}
            </div>
            <div className="text-xs text-gray-500 font-medium">/100 điểm</div>
          </div>
        </div>
      </div>

      {/* Tóm tắt nhận xét (luôn hiển thị) */}
      <div className="px-6 py-4">
        <p className="text-gray-700 line-clamp-2 italic">
          “{review.overallComment || "Chưa có nhận xét tổng quan."}”
        </p>
      </div>

      {/* Nút toggle chi tiết */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-800 transition-colors text-sm"
        >
          {isOpen ? (
            <>
              <ChevronUp className="w-4 h-4" /> Ẩn chi tiết
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Xem toàn bộ góp ý
            </>
          )}
        </button>
      </div>

      {/* Chi tiết khi mở */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-100">
          {review.overallComment && (
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
              <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-2">
                <MessageSquare className="w-5 h-5" />
                Nhận xét tổng quan
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {review.overallComment}
              </p>
            </div>
          )}

          {review.experienceComment && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
              <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-2">
                <Briefcase className="w-5 h-5" />
                Kinh nghiệm làm việc
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {review.experienceComment}
              </p>
            </div>
          )}

          {review.skillsComment && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
              <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-2">
                <Zap className="w-5 h-5" />
                Kỹ năng chuyên môn
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {review.skillsComment}
              </p>
            </div>
          )}

          {review.educationComment && (
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
              <h4 className="flex items-center gap-2 font-bold text-sky-800 mb-2">
                <GraduationCap className="w-5 h-5" />
                Học vấn & Chứng chỉ
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {review.educationComment}
              </p>
            </div>
          )}

          {review.recommendation && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg shadow-sm">
              <h4 className="flex items-center gap-2 font-extrabold text-amber-900 mb-3 text-lg">
                <Lightbulb className="w-6 h-6" />
                Lời khuyên từ chuyên gia
              </h4>
              <p className="text-gray-800 font-medium leading-relaxed">
                {review.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
