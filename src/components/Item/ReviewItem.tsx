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
} from "lucide-react";
import { useState, type JSX } from "react";
import { Link } from "react-router-dom";

type CommentSectionProps = {
  icon: JSX.Element;
  title: string;
  content: string;
  bgColor: string;
  borderColor: string;
  boldTitle?: boolean;
};

const CommentSection = ({
  icon,
  title,
  content,
  bgColor,
  borderColor,
  boldTitle = false,
}: CommentSectionProps) => (
  <div className={`p-4 rounded-lg ${bgColor} border-l-4 ${borderColor}`}>
    <h4
      className={`flex items-center gap-2 mb-2 text-md ${
        boldTitle ? "font-bold" : "font-semibold"
      } text-gray-800`}
    >
      {icon}
      {title}
    </h4>
    <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
  </div>
);
// --- Kết thúc Component helper CommentSection ---

type ReviewItemProps = {
  review: FeedbackReviewProps;
};

const ReviewItem = ({ review }: ReviewItemProps) => {
  // State để quản lý việc mở/đóng chi tiết nhận xét
  const [isOpen, setIsOpen] = useState(false);

  // Hàm toggle
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div
      key={review.id}
      className="bg-white border border-gray-300 rounded-xl shadow-lg p-5 space-y-4"
    >
      {/* PHẦN TÓM TẮT & THÔNG TIN CHUNG (LUÔN HIỂN THỊ) */}
      <div className="flex justify-between items-start pb-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-2xl">⭐️</div>
          <div>
            <p className="py-2 text-purple-600 hover:underline hover:cursor-pointer font-bold text-lg text-gray-900">
              <Link to={`/reviewers/${review.expertId}`}>
                {review.reviewerName || "Người đánh giá ẩn danh"}
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Đánh giá ngày: **
              {dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}**
            </p>
          </div>
        </div>

        {/* Điểm số */}
        <div className="flex flex-col items-end">
          <span className="text-3xl font-extrabold text-yellow-600">
            {review.score ?? "N/A"}
          </span>
          <span className="text-sm text-gray-500">/ 100 Điểm</span>
        </div>
      </div>

      {/* Tóm tắt Nhận xét Chung (Chỉ hiển thị tóm tắt, ví dụ: 50 ký tự đầu) */}
      <div className="text-gray-700 text-base italic line-clamp-2">
        **Nhận xét tổng thể:**{" "}
        {review.overallComment?.substring(0, 100) +
          (review.overallComment.length > 100 ? "..." : "") ||
          "Không có nhận xét tổng thể."}
      </div>

      {/* NÚT XEM CHI TIẾT (TOGGLE) */}
      <button
        onClick={toggleOpen}
        className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150 py-2 focus:outline-none"
      >
        {isOpen ? (
          <>
            <ChevronUp className="w-5 h-5" /> Ẩn chi tiết Nhận xét
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" /> Xem đầy đủ Chi tiết Nhận xét
          </>
        )}
      </button>

      {/* PHẦN CHI TIẾT NHẬN XÉT (HIỂN THỊ CÓ ĐIỀU KIỆN) */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-gray-100 mt-2">
          {/* Nhận xét Tổng thể (HIỂN THỊ LẠI TOÀN BỘ nếu mở) */}
          {review.overallComment && (
            <CommentSection
              icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
              title="Nhận xét Tổng thể"
              content={review.overallComment}
              bgColor="bg-indigo-50"
              borderColor="border-indigo-400"
            />
          )}

          {/* Nhận xét Kinh nghiệm */}
          {review.experienceComment && (
            <CommentSection
              icon={<Briefcase className="w-5 h-5 text-teal-600" />}
              title="Nhận xét Kinh nghiệm"
              content={review.experienceComment}
              bgColor="bg-teal-50"
              borderColor="border-teal-400"
            />
          )}

          {/* Nhận xét Kỹ năng */}
          {review.skillsComment && (
            <CommentSection
              icon={<Zap className="w-5 h-5 text-red-600" />}
              title="Nhận xét Kỹ năng"
              content={review.skillsComment}
              bgColor="bg-red-50"
              borderColor="border-red-400"
            />
          )}

          {/* Nhận xét Học vấn */}
          {review.educationComment && (
            <CommentSection
              icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
              title="Nhận xét Học vấn"
              content={review.educationComment}
              bgColor="bg-blue-50"
              borderColor="border-blue-400"
            />
          )}

          {/* Đề xuất/Khuyến nghị */}
          {review.recommendation && (
            <CommentSection
              icon={<Lightbulb className="w-5 h-5 text-yellow-700" />}
              title="Đề xuất/Khuyến nghị"
              content={review.recommendation}
              bgColor="bg-yellow-50"
              borderColor="border-yellow-400"
              boldTitle={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
