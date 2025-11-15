import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import { Clock, Eye, Inbox } from "lucide-react";
import ApplicationInfo from "./ApplicationInfo";
import type { ApplicationDetail } from "../../types/ApplicationProps";
import Timeline from "./TimeLine";

const AppliedJobCard: React.FC<{
  application: ApplicationDetail;
  refetch?: () => void;
}> = ({ application, refetch }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNavigateToDetail = () => {
    navigate(`/jobs/${application.post.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6 flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Job Header */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
            <img
              src={getImageUrl(application.post.avatarUrl)}
              alt={application.post.companyName}
              className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
            />
            <div>
              <h3
                onClick={handleNavigateToDetail}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {application.post.title}
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-0.5">
                {application.post.companyName}
              </p>
            </div>
          </div>

          {/* Application Info */}
          <div
            className={`space-y-3 ${
              id ? "text-lg font-bold" : "text-sm"
            } text-gray-800`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Thời gian nộp:{" "}
                <span className="font-semibold text-blue-600">
                  {formatDateTime(application.appliedAt)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Hồ sơ đã dùng:{" "}
                <span className="font-semibold text-blue-600">
                  {application.resume.title ||
                    `(ID: ${application.resume.id.substring(0, 8)}...)`}
                </span>
              </span>
            </div>
          </div>

          {/* Action Button or Timeline */}
          <div className="pt-2">
            {!id ? (
              <Link
                to={`/job-seeker/applied-jobs/${application.id}`}
                className="inline-flex items-center gap-2.5 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </Link>
            ) : (
              <Timeline application={application} />
            )}
          </div>
        </div>

        {/* Right Section - Status */}
        <div className="lg:w-120 shrink-0">
          <ApplicationInfo refetch={refetch} application={application} />
        </div>
      </div>
    </div>
  );
};

export default AppliedJobCard;
