// SkillItem.tsx
import React, { type FC } from "react";
import {
  Zap,
  TrendingUp,
  Code,
  User,
  Sun,
  Award,
  Star,
  Info,
} from "lucide-react";
import type { SkillProps } from "../../types/ResumeProps"; // Giả định đường dẫn type

interface SkillItemProps {
  skill: SkillProps;
}

// Hàm tiện ích để xác định màu và biểu tượng dựa trên Level
const getLevelDisplay = (level: SkillProps["level"]) => {
  switch (level) {
    case "EXPERT":
      return {
        color: "bg-red-500",
        text: "text-red-900",
        label: "Chuyên gia",
        icon: Award,
      };
    case "ADVANCED":
      return {
        color: "bg-green-500",
        text: "text-green-900",
        label: "Nâng cao",
        icon: TrendingUp,
      };
    case "INTERMEDIATE":
      return {
        color: "bg-yellow-500",
        text: "text-yellow-900",
        label: "Trung cấp",
        icon: Star,
      };
    case "BEGINNER":
    default:
      return {
        color: "bg-gray-400",
        text: "text-gray-900",
        label: "Cơ bản",
        icon: Sun,
      };
  }
};

// Hàm tiện ích để xác định màu và biểu tượng dựa trên Category
const getCategoryDisplay = (category: SkillProps["category"]) => {
  switch (category) {
    case "CORE_SKILL":
      return { icon: Code, label: "Chuyên môn" };
    case "LEADERSHIP_SKILL":
      return { icon: Zap, label: "Lãnh đạo" };
    case "SOFT_SKILL":
    default:
      return { icon: User, label: "Kỹ năng mềm" };
  }
};

const SkillItem: FC<SkillItemProps> = ({ skill }) => {
  const levelDisplay = getLevelDisplay(skill.level);
  const categoryDisplay = getCategoryDisplay(skill.category);
  const LevelIcon = levelDisplay.icon;
  const CategoryIcon = categoryDisplay.icon;

  return (
    // Sử dụng nền màu trung tính và shadow cho component Kỹ năng
    <div className="mb-4 p-5 bg-white border border-gray-200 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
      {/* Tên kỹ năng và Cấp độ */}
      <div className="flex justify-between items-start mb-3 border-b pb-2 border-gray-100">
        <h4 className="text-xl font-extrabold text-gray-800">{skill.name}</h4>

        {/* Cấp độ kỹ năng (Level Badge) */}
        <div
          className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${levelDisplay.color} ${levelDisplay.text} bg-opacity-20 shadow-inner`}
          title={`Cấp độ: ${levelDisplay.label}`}
        >
          <LevelIcon size={14} className="mr-1.5" />
          {levelDisplay.label}
        </div>
      </div>

      {/* Thông tin Danh mục */}
      <p className="text-sm text-gray-600 mb-3 flex items-center">
        <CategoryIcon size={14} className="mr-2 text-teal-600" />
        **Danh mục:** {categoryDisplay.label}
      </p>

      {/* Mô tả chi tiết */}
      {skill.description && (
        <div className="pt-2 border-t border-gray-100">
          <p className="font-semibold text-gray-700 mb-1 flex items-center">
            <Info size={14} className="mr-2 text-gray-500" />
            Mô tả:
          </p>
          {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
          <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-gray-300 pl-3 ml-1">
            {skill.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillItem;
