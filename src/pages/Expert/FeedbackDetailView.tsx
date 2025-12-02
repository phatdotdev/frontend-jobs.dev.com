import { Star, User, BookOpen, Layers, Zap, CheckCircle } from "lucide-react";
import moment from "moment";
import ResumeViewer from "../JobSeeker/ResumeViewer";

const CompletedReviewDisplay = ({ review }: { reivew: any }) => {
  const renderCommentSection = (title, icon, comment) => (
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

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Kết Quả Review
        Đã Hoàn Thành
      </h2>

      {/* Thông tin chung */}
      <div className="flex justify-between items-center mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Đánh giá bởi: **{review.reviewer}**
          </p>
          <p className="text-sm font-medium text-gray-700">
            Ngày hoàn thành: **
            {moment(review.completedDate).format("HH:mm DD/MM/YYYY")}**
          </p>
        </div>
        {/* Điểm số */}
        <div className="text-center">
          <p className="text-xs font-bold text-gray-500 uppercase">Điểm</p>
          <p className="text-4xl font-extrabold text-red-600">
            {review.score}
            <span className="text-xl">/10</span>
          </p>
        </div>
      </div>

      {/* Các Bình luận chi tiết */}
      <div className="flex-grow overflow-y-auto pr-2">
        {renderCommentSection(
          "Nhận Xét Tổng Quan",
          <User className="w-4 h-4 text-purple-600" />,
          review.overallComment
        )}
        {renderCommentSection(
          "Nhận Xét Kinh Nghiệm",
          <Layers className="w-4 h-4 text-green-600" />,
          review.experienceComment
        )}
        {renderCommentSection(
          "Nhận Xét Kỹ Năng",
          <Zap className="w-4 h-4 text-blue-600" />,
          review.skillsComment
        )}
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

// --- Component Chính: CompletedReviewView ---
const FeedbackDetailView = () => {
  const { resume, review } = mockCompletedData;

  return (
    <div className="sm:mx-auto max-w-7xl mt-4 p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
        <CheckCircle className="w-10 h-10 mr-3 text-green-600 inline-block" />{" "}
        Hồ Sơ Đã Hoàn Thành Review
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[85vh]">
        {/* Cột 1: Thông tin CV */}
        <div className="shadow-2xl rounded-xl overflow-hidden bg-white">
          <ResumeViewer resume={resume} />
        </div>

        {/* Cột 2: Kết quả Review */}
        <div className="shadow-2xl rounded-xl overflow-hidden bg-white">
          <CompletedReviewDisplay review={review} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailView;
