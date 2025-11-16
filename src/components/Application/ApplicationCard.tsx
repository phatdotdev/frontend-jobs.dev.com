import {
  Check,
  Clock,
  Download,
  Eye,
  Mail,
  Phone,
  RotateCw,
  User,
  X,
} from "lucide-react";
import type {
  ApplicationDetail,
  ApplicationState,
} from "../../types/ApplicationProps";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import { getFileIconFromName } from "../../utils/helpRender";
import { FaFileWord } from "react-icons/fa";
import { Link } from "react-router-dom";

const getStateConfig = (state: ApplicationState) => {
  switch (state) {
    case "SUBMITTED":
      return {
        label: "Mới nộp",
        icon: Clock,
        colorClass: "bg-blue-500", // Màu đơn sắc
      };
    case "REVIEWING":
      return {
        label: "Đang xem",
        icon: Eye,
        colorClass: "bg-orange-500", // Màu đơn sắc
      };
    case "ACCEPTED":
      return {
        label: "Chấp nhận",
        icon: Check,
        colorClass: "bg-green-500", // Màu đơn sắc
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        icon: X,
        colorClass: "bg-red-500", // Màu đơn sắc
      };
    case "REQUESTED":
      return {
        label: "Yêu cầu bổ sung",
        icon: RotateCw,
        colorClass: "bg-purple-500", // Màu đơn sắc
      };
    default:
      return {
        label: "Không rõ",
        icon: User,
        colorClass: "bg-gray-500", // Màu đơn sắc
      };
  }
};

const ApplicantCard: React.FC<{
  application: ApplicationDetail;
  setApplicationChange: (
    id: string,
    newState: string,
    currentState: string
  ) => void;
}> = ({ application, setApplicationChange }) => {
  const config = getStateConfig(application.state as ApplicationState);
  const fullName =
    `${application.resume.firstname} ${application.resume.lastname}`.trim();

  return (
    <div className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-blue-300">
      {/* Glow hover effect (Tối ưu - Sử dụng màu nền đơn giản cho hiệu ứng hover) */}

      <div className="absolute inset-0 bg-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Left: Candidate Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-5">
              {/* Avatar - Đã loại bỏ gradient, sử dụng màu tím đơn giản */}

              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-purple-500 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Name & Title - Giữ lại gradient cho tên để nổi bật (hoặc có thể thay bằng màu text đơn sắc nếu cần) */}

              <div className="flex-1">
                <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* Tên ứng viên - nổi bật với gradient */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                    {fullName || "Ứng viên"}
                  </h3>

                  {/* Nút xem thông tin - kiểu badge hiện đại */}
                  <Link
                    to={`/candidates/${application.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-semibold text-purple-700 bg-purple-50 border border-purple-300 rounded-full hover:bg-purple-100 hover:border-purple-400 hover:scale-105 transition-all duration-200 ease-out shadow-sm hover:shadow-md"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    Xem thông tin ứng viên
                  </Link>
                </div>

                <p className="text-base font-semibold text-gray-700 mt-1">
                  <span className="text-purple-600">
                    {application.resume.objectCareer || "Chưa xác định"}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Ứng tuyển lúc:
                  {formatDateTime(application.appliedAt)}
                </p>
              </div>
            </div>
            {/* Contact Info */}
            <div className="pl-20 flex flex-wrap gap-x-6 border-t pt-4 border-gray-100">
              {application.resume.email && (
                <a
                  href={`mailto:${application.resume.email}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <Mail size={16} className="text-blue-500" />
                  {application.resume.email}
                </a>
              )}

              <a
                href={`tel:${application.resume.phone}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-600 transition font-medium"
              >
                <Phone size={16} className="text-orange-500" />
                {application.resume.phone}
              </a>
            </div>
            {/* Resume and Documents */}
            <div className="pl-20 space-y-4">
              {/* CV Link */}
              <p className="text-sm font-semibold text-gray-600 mt-2">
                Tài liệu chính:
              </p>

              {/* Đã loại bỏ border-2 và dùng border-1 đơn giản hơn */}

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <FaFileWord size={24} className="text-blue-500" />

                <span className="font-bold text-gray-800 flex-1">
                  {application.resume.title}
                </span>
              </div>
              {/* Additional Documents */}
              {application.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 mt-2">
                    Tài liệu đính kèm ({application.documents.length}):
                  </p>

                  {application.documents.map((document, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      {getFileIconFromName(document.originalName)}

                      <span className="ml-2 text-sm font-medium text-gray-700 truncate flex-1">
                        {document.originalName}
                      </span>

                      <a
                        href={getImageUrl(document.fileName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1 ml-4"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Right: Status + Actions */}
          <div className="flex flex-col items-end gap-5 lg:w-64 flex-shrink-0 pt-1">
            {/* Current Status Badge - Đã thay đổi để sử dụng colorClass (màu đơn sắc) */}

            <div className="text-right w-full">
              <p className="text-xs text-center font-bold text-gray-500 uppercase tracking-widest mb-3">
                Trạng thái hiện tại
              </p>

              <div
                className={`inline-flex items-center justify-center w-full gap-3 px-5 py-3.5 rounded-xl ${config.colorClass} text-white font-extrabold shadow-lg transition-all duration-300 transform scale-100`}
              >
                <config.icon size={22} className="flex-shrink-0" />
                <span className="text-lg">{config.label}</span>
              </div>
            </div>

            {/* Action Buttons - Giữ nguyên các thay đổi màu đơn sắc và style nút đã thống nhất */}

            <div className="flex flex-wrap justify-end gap-3 w-full pt-2">
              <p className="text-xs text-center font-bold text-gray-500 uppercase tracking-widest mb-1 w-full">
                Các hành động
              </p>

              {application.state === "SUBMITTED" && (
                <>
                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REVIEWING",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <Eye size={20} /> Nhận hồ sơ (Đang xem)
                  </button>

                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REQUESTED",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <RotateCw size={20} /> Yêu cầu bổ sung
                  </button>
                </>
              )}
              {application.state === "REVIEWING" && (
                <>
                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REQUESTED",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <RotateCw size={20} /> Yêu cầu bổ sung
                  </button>

                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "ACCEPTED",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <Check size={20} /> Duyệt hồ sơ (Accepted)
                  </button>

                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REJECTED",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <X size={20} /> Từ chối
                  </button>
                </>
              )}
              {application.state === "REQUESTED" && (
                <>
                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REQUESTED",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <RotateCw size={20} /> Yêu cầu bổ sung
                  </button>
                  <button
                    onClick={() =>
                      setApplicationChange(
                        application.id,
                        "REVIEWING",
                        application.state
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    <Eye size={20} /> Nhận hồ sơ (Đang xem)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
