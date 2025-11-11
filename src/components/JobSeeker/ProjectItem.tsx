// ProjectItem.tsx
import React, { type FC } from "react";
import { Layers, UserCheck, TrendingUp, Info } from "lucide-react";
import type { ProjectProps } from "../../types/ResumeProps"; // Giả định đường dẫn type

interface ProjectItemProps {
  project: ProjectProps;
}

const ProjectItem: FC<ProjectItemProps> = ({ project }) => (
  // Sử dụng nền màu trắng hoặc xám nhạt và border màu cam cho Dự án
  <div className="mb-4 p-5 border-l-4 border-orange-500 bg-orange-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tiêu đề chính */}
    <div className="flex justify-between items-start mb-3 border-b pb-2 border-orange-200">
      <h4 className="text-xl font-extrabold text-orange-700">
        <Layers size={20} className="inline mr-2 text-orange-600" />
        {project.name}
      </h4>
    </div>

    {/* Thông tin Vai trò và Kết quả */}
    <div className="text-sm text-gray-700 space-y-2">
      {/* Vai trò */}
      <p className="flex items-center font-semibold">
        <UserCheck size={14} className="mr-2 text-orange-500" />
        Vai trò: <span className="ml-1 font-medium">{project.role}</span>
      </p>

      {/* Kết quả */}
      <p className="flex items-center font-semibold">
        <TrendingUp size={14} className="mr-2 text-orange-500" />
        Kết quả đạt được:{" "}
        <span className="ml-1 font-medium text-teal-700">{project.result}</span>
      </p>
    </div>

    {/* Mô tả chi tiết */}
    {project.description && (
      <div className="pt-3 mt-3 border-t border-orange-100">
        <p className="font-semibold text-gray-700 mb-1 flex items-center">
          <Info size={14} className="mr-2 text-gray-500" />
          Mô tả dự án:
        </p>
        {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
        <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-orange-300 pl-3 ml-1">
          {project.description}
        </p>
      </div>
    )}
  </div>
);

export default ProjectItem;
