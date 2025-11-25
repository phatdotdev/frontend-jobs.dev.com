// ActivityItem.tsx
import { type FC } from "react";
import { Users, Calendar, UserCheck, Info, MapPin } from "lucide-react";
import type { ActivityProps } from "../../types/ResumeProps";
import { formatDate } from "../../utils/helper";

interface ActivityItemProps {
  activity: ActivityProps;
}

const ActivityItem: FC<ActivityItemProps> = ({ activity }) => (
  // Sử dụng nền màu xanh dương nhạt và border màu xanh dương cho Hoạt động
  <div className="mb-4 p-5 border-l-4 border-cyan-500 bg-cyan-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tên hoạt động và Tổ chức */}
    <div className="flex justify-between items-start mb-3 border-b pb-2 border-cyan-200">
      <div>
        <h4 className="text-xl font-extrabold text-cyan-800">
          <Users size={20} className="inline mr-2 text-cyan-600" />
          {activity.name}
        </h4>
        <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
          <MapPin size={16} className="mr-2 text-cyan-600" />
          {activity.organization}
        </p>
      </div>
    </div>

    {/* Thông tin Vai trò và Thời gian */}
    <div className="text-sm text-gray-700 space-y-2">
      {/* Vai trò */}
      <p className="flex items-center font-semibold">
        <UserCheck size={14} className="mr-2 text-cyan-500" />
        Vai trò:{" "}
        <span className="ml-1 font-medium text-teal-700">{activity.role}</span>
      </p>

      {/* Thời gian */}
      <p className="flex items-center font-medium">
        <Calendar size={14} className="mr-2 text-cyan-500" />
        Thời gian:{" "}
        <span className="ml-1 font-semibold">
          {formatDate(activity.startDate)}
        </span>{" "}
        đến{" "}
        <span className="ml-1 font-semibold">
          {formatDate(activity.endDate)}
        </span>
      </p>
    </div>

    {/* Mô tả chi tiết */}
    {activity.description && (
      <div className="pt-3 mt-3 border-t border-cyan-100">
        <p className="font-semibold text-gray-700 mb-1 flex items-center">
          <Info size={14} className="mr-2 text-gray-500" />
          Mô tả hoạt động:
        </p>
        {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
        <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-cyan-300 pl-3 ml-1">
          {activity.description}
        </p>
      </div>
    )}
  </div>
);

export default ActivityItem;
