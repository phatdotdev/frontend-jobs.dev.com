import {
  Download,
  Eye,
  Mail,
  Phone,
  User,
  FileText,
  ArrowBigRight,
  Clock,
  EyeIcon,
  RotateCw,
  Mic, // Phỏng vấn
  CheckCircle,
  UserCheck,
  XCircle,
  NotebookPen,
  Calendar,
} from "lucide-react";
import type {
  ApplicationDetail,
  ApplicationState,
} from "../../types/ApplicationProps";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import { getFileIconFromName } from "../../utils/helpRender";
import { FaFileWord } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addToast } from "../../redux/features/toastSlice";
import { generateResumeFile } from "../../utils/getResumeDocument";
import { useDispatch } from "react-redux";

// CẬP NHẬT ĐẦY ĐỦ 7 TRẠNG THÁI + ICON + MÀU ĐẸP
const getStateConfig = (state: ApplicationState) => {
  switch (state) {
    case "SUBMITTED":
      return {
        label: "Đã nộp",
        icon: Clock,
        color: "bg-blue-500",
        ring: "ring-blue-300",
      };
    case "REVIEWING":
      return {
        label: "Đang xem xét",
        icon: EyeIcon,
        color: "bg-orange-500",
        ring: "ring-orange-300",
      };
    case "REQUESTED":
      return {
        label: "Yêu cầu bổ sung",
        icon: RotateCw,
        color: "bg-purple-500",
        ring: "ring-purple-300",
      };
    case "INTERVIEW":
      return {
        label: "Phỏng vấn",
        icon: Mic,
        color: "bg-indigo-500",
        ring: "ring-indigo-300",
      };
    case "ACCEPTED":
      return {
        label: "Được chấp nhận",
        icon: CheckCircle,
        color: "bg-emerald-500",
        ring: "ring-emerald-300",
      };
    case "HIRED":
      return {
        label: "Được tuyển dụng",
        icon: UserCheck,
        color: "bg-green-600",
        ring: "ring-green-400",
      };
    case "REJECTED":
      return {
        label: "Bị từ chối",
        icon: XCircle,
        color: "bg-red-600",
        ring: "ring-red-400",
      };
    default:
      return {
        label: "Không xác định",
        icon: User,
        color: "bg-gray-500",
        ring: "ring-gray-300",
      };
  }
};

const ApplicantCard: React.FC<{
  application: ApplicationDetail;
  setApplicationChange?: (
    id: string,
    newState: string,
    currentState: string
  ) => void;
}> = ({ application }) => {
  const { state, resume, appliedAt, documents } = application;
  const config = getStateConfig(state as ApplicationState);
  const fullName = `${resume.firstname} ${resume.lastname}`.trim();
  const StateIcon = config.icon;

  const dispatch = useDispatch();

  const handleDownload = async (resume: any) => {
    try {
      console.log(resume);
      const file = await generateResumeFile(
        resume,
        getImageUrl(resume?.avatarUrl as string)
      );

      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      dispatch(
        addToast({
          type: "success",
          message: "Xuất file thành công!",
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Lỗi khi tạo file!",
        })
      );
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:border-gray-300">
      {/* Hiệu ứng nền nhẹ khi hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* CỘT CHÍNH: Thông tin ứng viên */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 border border-purple-600 rounded-lg">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <img
                      src={`${getImageUrl(application.resume?.avatarUrl)}`}
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-2 mr-4">
                  <h3 className="text-2xl font-bold text-gray-900 truncate">
                    {fullName || "Ứng viên"}
                  </h3>

                  {/* Badge trạng thái - nổi bật, có icon */}
                  <div
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-full ${config.color} text-white font-bold text-sm shadow-lg ring-4 ${config.ring} ring-opacity-40`}
                  >
                    <StateIcon className="w-4.5 h-4.5" />
                    <span>{config.label}</span>
                  </div>
                </div>

                <p className="text-lg text-justify font-semibold text-gray-600 w-[80%] line-clamp-3">
                  {resume.objectCareer || "Chưa xác định vị trí"}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
                  {resume.email && (
                    <a
                      href={`mailto:${resume.email}`}
                      className="flex items-center gap-2 hover:text-blue-600 transition"
                    >
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="truncate max-w-xs">{resume.email}</span>
                    </a>
                  )}
                  {resume.phone && (
                    <a
                      href={`tel:${resume.phone}`}
                      className="flex items-center gap-2 hover:text-orange-600 transition"
                    >
                      <Phone className="w-4 h-4 text-orange-500" />
                      {resume.phone}
                    </a>
                  )}
                </div>

                <p className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Nộp hồ sơ lúc:{" "}
                  <span className="text-purple-600 font-bold">
                    {formatDateTime(appliedAt)}
                  </span>
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="ml-20 flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <Link
                to={`/candidates/${application.id}`}
                target="_blank"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-md text-sm"
              >
                <Eye className="w-4.5 h-4.5" />
                Xem hồ sơ ứng viên
              </Link>

              <Link
                target="_blank"
                to={`${application.id}`}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition shadow-md text-sm"
              >
                <ArrowBigRight className="w-4.5 h-4.5" />
                Xem chi tiết ứng tuyển
              </Link>
            </div>
          </div>

          {/* CỘT TÀI LIỆU */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">CV chính</p>
              <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition cursor-pointer">
                <FaFileWord className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-800 truncate flex-1">
                  {resume.title}
                </span>
                <button
                  onClick={() => handleDownload(resume)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {documents.length > 0 ? (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Đính kèm ({documents.length})
                </p>
                <div className="space-y-2.5">
                  {documents.slice(0, 2).map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition group/file"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {getFileIconFromName(doc.originalName)}
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {doc.originalName}
                        </span>
                      </div>
                      <a
                        href={getImageUrl(doc.fileName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 opacity-0 group-hover/file:opacity-100 transition ml-2"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                  {documents.length > 2 && (
                    <p className="text-xs text-gray-500 text-right mt-2">
                      + {documents.length - 2} tệp khác
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                <FileText className="w-9 h-9 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Không có tài liệu đính kèm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
