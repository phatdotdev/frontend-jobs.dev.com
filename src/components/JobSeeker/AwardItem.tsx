// AwardItem.tsx
import React, { type FC } from "react";
import { Award, Building2, Calendar, Gem, Info, Star } from "lucide-react";
import type { AwardProps } from "../../types/ResumeProps"; // Giả định đường dẫn type

interface AwardItemProps {
  award: AwardProps;
}

const AwardItem: FC<AwardItemProps> = ({ award }) => (
  // Sử dụng nền màu tím nhạt và border màu tím đậm cho Giải thưởng
  <div className="mb-4 p-5 border-l-4 border-purple-600 bg-purple-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tên giải thưởng và Tổ chức trao giải */}
    <div className="flex justify-between items-start mb-3 border-b pb-2 border-purple-200">
      <div>
        <h4 className="text-xl font-extrabold text-purple-800">
          <Gem size={20} className="inline mr-2 text-purple-600" />
          {award.name}
        </h4>
        <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
          <Building2 size={16} className="mr-2 text-purple-600" />
          {award.organization}
        </p>
      </div>

      {/* Ngày nhận giải */}
      <div className="flex items-center text-sm font-bold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 shadow-inner">
        <Calendar size={14} className="mr-1.5" />
        {award.receivedDate}
      </div>
    </div>

    {/* Thành tựu chính */}
    <div className="text-sm text-gray-700 space-y-2">
      <p className="flex items-start font-semibold border-l-2 border-purple-400 pl-3 pt-1">
        <Star size={16} className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
        <span className="font-bold text-gray-800">Thành tựu chính:</span>
        <span className="ml-1 font-medium">{award.achievement}</span>
      </p>
    </div>

    {/* Mô tả chi tiết */}
    {award.description && (
      <div className="pt-3 mt-3 border-t border-purple-100">
        <p className="font-semibold text-gray-700 mb-1 flex items-center">
          <Info size={14} className="mr-2 text-gray-500" />
          Mô tả thêm:
        </p>
        {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
        <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-purple-300 pl-3 ml-1">
          {award.description}
        </p>
      </div>
    )}
  </div>
);

export default AwardItem;
