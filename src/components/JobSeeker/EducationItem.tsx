// EducationItem.tsx
import { type FC } from "react";
import { Calendar, GraduationCap, Trophy, BookOpen } from "lucide-react";
import type { EducationProps } from "../../types/ResumeProps";

interface EducationItemProps {
  education: EducationProps;
}

const EducationItem: FC<EducationItemProps> = ({ education }) => (
  <div className="mb-4 p-5 border-l-4 border-blue-500 bg-blue-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tiêu đề chính */}
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="text-xl font-extrabold text-blue-800">
          {education.schoolName}
        </h4>
        <p className="text-base font-semibold text-teal-600 mt-0.5">
          <GraduationCap size={16} className="inline mr-2" />
          {education.degree} - {education.major}
        </p>
      </div>

      {/* Điểm số/Thành tích (Grade) */}
      {education.grade && (
        <div className="flex items-center text-sm font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 shadow-inner">
          <Trophy size={14} className="mr-1.5" />
          {education.grade}
        </div>
      )}
    </div>

    <hr className="my-3 border-blue-200" />

    {/* Thông tin thời gian và chi tiết */}
    <div className="text-sm text-gray-600 space-y-2">
      {/* Thời gian */}
      <p className="flex items-center font-medium">
        <Calendar size={14} className="mr-2 text-blue-500" />
        Thời gian:{" "}
        <span className="ml-1 font-semibold">
          {education.startDate}
        </span> đến{" "}
        <span className="ml-1 font-semibold">{education.endDate}</span>
      </p>

      {/* Mô tả/Ghi chú */}
      {education.description && (
        <div className="pt-2 border-t border-blue-100">
          <p className="flex items-center font-semibold text-gray-700 mb-1">
            <BookOpen size={14} className="mr-2 text-blue-500" />
            Mô tả chi tiết:
          </p>
          {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
          <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-blue-300 pl-3 ml-1">
            {education.description}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default EducationItem;
