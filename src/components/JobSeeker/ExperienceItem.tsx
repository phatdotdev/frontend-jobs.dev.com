import { type FC } from "react";
import { Briefcase, Calendar, Info, MapPin } from "lucide-react";
import type { ExperienceProps } from "../../types/ResumeProps";

interface ExperienceItemProps {
  experience: ExperienceProps;
}

const ExperienceItem: FC<ExperienceItemProps> = ({ experience }) => (
  // Sử dụng nền màu nhẹ và border màu xanh lá/teal cho phần Kinh nghiệm
  <div className="mb-4 p-5 border-l-4 border-teal-600 bg-teal-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tiêu đề chính */}
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="text-xl font-extrabold text-teal-800">
          {experience.position}
        </h4>
        <p className="text-base font-semibold text-gray-700 mt-0.5">
          <Briefcase size={16} className="inline mr-2 text-teal-600" />
          {experience.companyName}
        </p>
      </div>
    </div>

    <hr className="my-3 border-teal-200" />

    {/* Thông tin thời gian */}
    <div className="text-sm text-gray-600 space-y-2">
      <p className="flex items-center font-medium">
        <Calendar size={14} className="mr-2 text-teal-600" />
        Thời gian:{" "}
        <span className="ml-1 font-semibold">
          {experience.startDate}
        </span> đến{" "}
        <span className="ml-1 font-semibold">{experience.endDate}</span>
      </p>

      {/* Mô tả/Trách nhiệm */}
      {experience.description && (
        <div className="pt-2 border-t border-teal-100">
          <p className="flex items-center font-semibold text-gray-700 mb-1">
            <Info size={14} className="mr-2 text-teal-600" />
            Mô tả & Thành tựu:
          </p>
          {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
          <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-teal-300 pl-3 ml-1">
            {experience.description}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ExperienceItem;
