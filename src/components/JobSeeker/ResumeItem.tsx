import { FileText, Loader2, Send } from "lucide-react";
import { type FC } from "react";
import type { ResumeProps as ResumeResponse } from "../../types/ResumeProps";

interface ResumeItemProps {
  resume: ResumeResponse;
  onSelect: (resumeId: string) => void;
  isSelected: boolean;
  isSubmitting: boolean;
}

const ResumeItem: FC<ResumeItemProps> = ({
  resume,
  onSelect,
  isSelected,
  isSubmitting,
}) => {
  const briefIntroduction = resume.introduction
    ? resume.introduction.substring(0, 50) +
      (resume.introduction.length > 50 ? "..." : "")
    : "Chưa có tóm tắt giới thiệu.";

  return (
    <div
      onClick={isSubmitting ? undefined : () => onSelect(resume.id as string)}
      className={`
                flex items-center p-4 mb-2 border-2 rounded-xl shadow-sm transition duration-200
                ${
                  isSubmitting
                    ? "cursor-not-allowed border-red-400 bg-red-50 opacity-80" // Đang nộp
                    : isSelected
                    ? "cursor-pointer border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-200" // Đã chọn
                    : "cursor-pointer border-gray-300 bg-white hover:border-teal-400 hover:shadow-md" // Bình thường
                }
            `}
      role="button"
      aria-disabled={isSubmitting}
    >
      {/* Icon hoặc Loader */}
      {isSubmitting ? (
        <Loader2
          size={24}
          className="animate-spin mr-4 text-red-600 flex-shrink-0"
        />
      ) : (
        <FileText
          size={24}
          className={`mr-4 flex-shrink-0 ${
            isSelected ? "text-teal-600" : "text-gray-500"
          }`}
        />
      )}

      {/* Nội dung */}
      <div className="flex-grow">
        <h4
          className={`text-lg font-bold ${
            isSelected ? "text-teal-800" : "text-gray-800"
          }`}
        >
          {resume.title || `CV của ${resume.lastname}`}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{briefIntroduction}</p>
      </div>

      {/* Trạng thái / Biểu tượng hành động */}
      {isSubmitting ? (
        <span className="ml-auto text-sm font-semibold text-red-600">
          Đang nộp...
        </span>
      ) : (
        <Send
          size={20}
          className={`ml-auto ${
            isSelected ? "text-teal-600" : "text-gray-400"
          }`}
        />
      )}
    </div>
  );
};
export default ResumeItem;
