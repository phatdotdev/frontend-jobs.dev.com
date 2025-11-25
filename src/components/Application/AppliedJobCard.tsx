// src/components/JobSeeker/AppliedJobCard.tsx
import { Link, useParams } from "react-router-dom";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import { Clock, Inbox, Eye } from "lucide-react";
import ApplicationInfo from "./ApplicationInfo";
import Timeline from "./TimeLine";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import type { ApplicationDetail } from "../../types/ApplicationProps";

const AppliedJobCard: React.FC<{
  application: ApplicationDetail;
  refetch?: () => void;
}> = ({ application, refetch }) => {
  const { id } = useParams<{ id?: string }>();
  const isDetailPage = !!id;

  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 overflow-hidden">
      {/* Gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-emerald-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative p-7 lg:p-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: Thông tin công việc + hành động */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header công việc */}
            <div className="flex items-center gap-5">
              <img
                src={getImageUrl(application.post.avatarUrl)}
                alt={application.post.companyName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() =>
                    window.open(`/jobs/${application.post.id}`, "_blank")
                  }
                  className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                >
                  {application.post.title}
                </h3>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {application.post.companyName}
                </p>
              </div>
            </div>

            {/* Thông tin nộp hồ sơ - gọn nhẹ khi ở danh sách */}
            <div
              className={`grid grid-cols-1 ${
                isDetailPage ? "md:grid-cols-2" : "sm:grid-cols-2"
              } gap-5 text-sm`}
            >
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-medium">Nộp ngày:</span>
                  <p className="font-bold text-gray-900">
                    {formatDateTime(application.appliedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Inbox className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-medium">CV đã dùng:</span>
                  <p className="font-bold text-emerald-700 truncate max-w-xs">
                    {application.resume.title || "CV mặc định"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hành động */}
            <div className="pt-4 border-t border-gray-100">
              {!isDetailPage ? (
                <Link
                  to={`/job-seeker/applied-jobs/${application.id}`}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Xem chi tiết ứng tuyển
                </Link>
              ) : (
                <div className="space-y-8">
                  {/* Timeline chỉ hiện ở trang chi tiết */}
                  <Timeline application={application} />
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Trạng thái */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            {isDetailPage ? (
              <div className="w-full max-w-sm">
                <ApplicationInfo application={application} refetch={refetch} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ApplicationStatusBadge state={application.state} size="lg" />
                <p className="text-sm text-gray-500 text-center">
                  Cập nhật gần nhất
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobCard;
