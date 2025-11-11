import { useState, type FormEvent, type JSX } from "react";
import { Send, Star, User, BookOpen, Layers, Zap } from "lucide-react";
import { useSubmitReviewMutation } from "../../redux/api/apiReviewSlice";

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
      alert(`Đã gửi nhận xét cho hồ sơ "${resumeTitle}" thành công!`);
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
    <div className="mb-4">
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
        {icon}
        <span className="ml-2">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        required={required}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-sm resize-none"
      />
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
        <Star className="w-5 h-5 mr-2 text-yellow-500" /> Nhập Bình Luận & Đánh
        Giá
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-between"
      >
        <div>
          {/* Điểm số */}
          <div className="mb-4">
            <label className="flex items-center text-md font-bold text-gray-800 mb-2">
              <Zap className="w-4 h-4 mr-2 text-red-500" /> Điểm Đánh Giá (1-10)
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="1"
              max="10"
              required
              placeholder="7"
              className="w-20 text-center p-2 text-xl font-bold border-2 border-red-400 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Các ô nhận xét */}
          {renderTextarea(
            "Nhận Xét Tổng Quan",
            <User className="w-4 h-4 text-purple-600" />,
            overallComment,
            setOverallComment,
            "Ấn tượng chung và mức độ phù hợp..."
          )}
          {renderTextarea(
            "Nhận Xét Kinh Nghiệm",
            <Layers className="w-4 h-4 text-green-600" />,
            experienceComment,
            setExperienceComment,
            "Đánh giá các dự án, vai trò..."
          )}
          {renderTextarea(
            "Nhận Xét Kỹ Năng",
            <Zap className="w-4 h-4 text-blue-600" />,
            skillsComment,
            setSkillsComment,
            "Đánh giá về Java, Spring Boot, v.v..."
          )}
          {renderTextarea(
            "Nhận Xét Học Vấn",
            <BookOpen className="w-4 h-4 text-yellow-600" />,
            educationComment,
            setEducationComment,
            "Đánh giá GPA, thành tích..."
          )}
          {renderTextarea(
            "Khuyến Nghị",
            <Send className="w-4 h-4 text-red-600" />,
            recommendation,
            setRecommendation,
            "Lời khuyên cải thiện hồ sơ/chuẩn bị phỏng vấn..."
          )}
        </div>

        {/* Nút Gửi */}
        <div className="mt-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center w-full px-4 py-2 font-semibold rounded-md transition duration-300 shadow-md ${
              isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? (
              "Đang Gửi..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Hoàn Tất Gửi Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailedReviewForm;
