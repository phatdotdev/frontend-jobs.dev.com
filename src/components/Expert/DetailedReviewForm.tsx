import { useState, type FormEvent, type JSX } from "react";
import {
  Send,
  Star,
  User,
  BookOpen,
  Layers,
  Zap,
  Lightbulb,
  Target,
} from "lucide-react";
import { useSubmitReviewMutation } from "../../redux/api/apiReviewSlice";
import { cn } from "../../utils/helper";

type ReviewFormProps = {
  resumeTitle: string;
  requestId: string;
};

const DetailedReviewForm = ({ resumeTitle, requestId }: ReviewFormProps) => {
  const [score, setScore] = useState("");
  const [overallComment, setOverallComment] = useState("");
  const [experienceComment, setExperienceComment] = useState("");
  const [skillsComment, setSkillsComment] = useState("");
  const [educationComment, setEducationComment] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitReview] = useSubmitReviewMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewData = {
      score: parseInt(score, 10),
      overallComment,
      experienceComment,
      skillsComment,
      educationComment,
      recommendation,
    };

    try {
      await submitReview({ id: requestId, payload: reviewData }).unwrap();
      alert(`Đã gửi đánh giá thành công cho hồ sơ "${resumeTitle}"!`);
      // Reset form
      setScore("");
      setOverallComment("");
      setExperienceComment("");
      setSkillsComment("");
      setEducationComment("");
      setRecommendation("");
    } catch (error) {
      alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextarea = (
    label: string,
    icon: JSX.Element,
    value: string,
    setValue: (val: string) => void,
    placeholder: string,
    required = true
  ) => (
    <div className="mb-6 group">
      <label className="flex items-center gap-3 text-sm font-bold text-gray-800 mb-3">
        {icon}
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 resize-none text-sm bg-gray-50/70 hover:bg-gray-50 focus:bg-white shadow-sm"
      />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-4">
              <Star className="w-9 h-9 text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Đánh Giá & Góp Ý Hồ Sơ
            </h2>
            <p className="text-lg text-purple-700 font-medium mt-2">
              {resumeTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Điểm số 1-100 – PHIÊN BẢN DỄ NHẬP NHẤT */}
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <label className="block text-center text-2xl font-bold text-gray-800 mb-8">
                Điểm Tổng Quan:{" "}
                <span className="text-6xl text-purple-600">
                  {score || "--"}
                </span>
                /100
              </label>

              <div className="max-w-2xl mx-auto">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={score || 50}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full h-8 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #f59e0b ${score}%, #ef4444 ${score}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>Yếu</span>
                  <span>Trung bình</span>
                  <span>Khá</span>
                  <span>Xuất sắc</span>
                </div>
              </div>
            </div>

            {/* Các phần nhận xét */}
            <div className="space-y-8 bg-white/70 backdrop-blur rounded-3xl p-8 shadow-xl border border-purple-100">
              {renderTextarea(
                "Nhận xét tổng quan",
                <User className="w-6 h-6 text-purple-600" />,
                overallComment,
                setOverallComment,
                "Ấn tượng chung, độ chuyên nghiệp, mức độ phù hợp với vị trí..."
              )}

              {renderTextarea(
                "Đánh giá kinh nghiệm làm việc",
                <Layers className="w-6 h-6 text-emerald-600" />,
                experienceComment,
                setExperienceComment,
                "Chất lượng dự án, vai trò, thành tựu nổi bật..."
              )}

              {renderTextarea(
                "Đánh giá kỹ năng chuyên môn",
                <Zap className="w-6 h-6 text-blue-600" />,
                skillsComment,
                setSkillsComment,
                "Mức độ thành thạo công nghệ, kỹ năng mềm, chứng chỉ..."
              )}

              {renderTextarea(
                "Đánh giá học vấn & chứng chỉ",
                <BookOpen className="w-6 h-6 text-amber-600" />,
                educationComment,
                setEducationComment,
                "Trường học, GPA, chứng chỉ quốc tế, khóa học nổi bật..."
              )}

              {renderTextarea(
                "Lời khuyên & khuyến nghị",
                <Lightbulb className="w-6 h-6 text-yellow-500" />,
                recommendation,
                setRecommendation,
                "Những điểm cần cải thiện, cách trình bày tốt hơn, chuẩn bị phỏng vấn..."
              )}
            </div>

            {/* Nút gửi */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting || !score}
                className="w-full group flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi đánh giá...
                  </>
                ) : (
                  <>
                    <Send className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                    Hoàn Tất & Gửi Đánh Giá
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailedReviewForm;
