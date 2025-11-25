// src/pages/ApplicantDetailView.tsx
import { useParams, Link } from "react-router-dom";
import {
  useGetApplicationByIdQuery,
  useUpdateApplicationStateMutation,
} from "../../redux/api/apiApplicationSlice";
import DataLoader from "../../components/UI/DataLoader";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import { getFileIconFromName } from "../../utils/helpRender";
import { FaFileWord, FaUserCheck, FaMicrophone } from "react-icons/fa";
import {
  Clock,
  Eye,
  RotateCw,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  ArrowLeft,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import ApplicationProgressBar from "../../components/Application/ApplicationProgressBar";
import { addToast } from "../../redux/features/toastSlice";
import { useDispatch } from "react-redux";
import { generateResumeFile } from "../../utils/getResumeDocument";

const ChangeStateModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  action: { label: string; state: string; color: string };
  loading: boolean;
}) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`h-2 ${action?.color || "bg-gray-500"}`} />

        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {action?.label || "Chuyển trạng thái"}
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn đang chuyển trạng thái ứng viên sang{" "}
            <span className="font-bold text-gray-900">"{action?.label}"</span>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú <span className="text-gray-400">(không bắt buộc)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition"
              placeholder="VD: Ứng viên cần bổ sung chứng chỉ IELTS 7.0... / Phỏng vấn vòng 1 đạt, mời vòng 2..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(note)}
              disabled={loading}
              className={`px-8 py-3 ${
                action?.color || "bg-gray-500"
              } text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2 min-w-44 justify-center`}
            >
              {loading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Xác nhận
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const STATE_CONFIG: any = {
  SUBMITTED: {
    label: "Đã nộp",
    color: "bg-blue-500",
    ring: "ring-blue-300",
    icon: Clock,
    next: [
      { label: "Bắt đầu xem xét", state: "REVIEWING", color: "bg-orange-500" },
      { label: "Yêu cầu bổ sung", state: "REQUESTED", color: "bg-purple-500" },
    ],
  },
  REVIEWING: {
    label: "Đang xem xét",
    color: "bg-orange-500",
    ring: "ring-orange-300",
    icon: Eye,
    next: [
      { label: "Mời phỏng vấn", state: "INTERVIEW", color: "bg-indigo-500" },
      { label: "Yêu cầu bổ sung", state: "REQUESTED", color: "bg-purple-500" },
      { label: "Hồ sơ đạt", state: "ACCEPTED", color: "bg-emerald-500" },
      { label: "Từ chối", state: "REJECTED", color: "bg-red-600" },
    ],
  },
  REQUESTED: {
    label: "Yêu cầu bổ sung",
    color: "bg-purple-500",
    ring: "ring-purple-300",
    icon: RotateCw,
    next: [
      {
        label: "Đã nhận hồ sơ",
        state: "REVIEWING",
        color: "bg-orange-500",
      },
    ],
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    color: "bg-indigo-500",
    ring: "ring-indigo-300",
    icon: FaMicrophone,
    next: [
      { label: "Loại ứng viên", state: "REJECTED", color: "bg-red-600" },
      { label: "Tuyển ứng viên", state: "HIRED", color: "bg-emerald-600" },
    ],
  },
  ACCEPTED: {
    label: "Được chấp nhận",
    color: "bg-emerald-500",
    ring: "ring-emerald-300",
    icon: CheckCircle,
    next: [
      {
        label: "Yêu cầu thêm hồ sơ",
        state: "REQUESTED",
        color: "bg-purple-600",
      },
      { label: "Gọi phỏng vấn", state: "INTERVIEW", color: "bg-purple-600" },
      { label: "Tuyển nhân viên", state: "HIRED", color: "bg-green-600" },
      { label: "Loại ứng viên", state: "REJECTED", color: "bg-red-600" },
    ],
  },
  HIRED: {
    label: "Được tuyển dụng",
    color: "bg-green-600",
    ring: "ring-green-400",
    icon: FaUserCheck,
    next: [],
  },
  REJECTED: {
    label: "Bị từ chối",
    color: "bg-red-600",
    ring: "ring-red-400",
    icon: XCircle,
    next: [],
  },
};

const ApplicantDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resp, isLoading, refetch } = useGetApplicationByIdQuery(id!);
  const [updateState, { isLoading: isUpdating }] =
    useUpdateApplicationStateMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const application = resp?.data;
  if (isLoading || !application) return <DataLoader />;

  const config = STATE_CONFIG[application.state] || STATE_CONFIG.REJECTED;
  const isRejected = application.state === "REJECTED";
  const isHired = application.state === "HIRED";

  const fullName =
    `${application.resume.firstname} ${application.resume.lastname}`.trim();

  const openModal = (action: any) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async (note: string) => {
    try {
      await updateState({
        id: application.id,
        payload: {
          state: selectedAction.state,
          content: note.trim() || null,
        },
      }).unwrap();

      setModalOpen(false);
      setSelectedAction(null);
      refetch();
    } catch (err) {}
  };

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

  const StateIcon = config.icon;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/applications"
              className="p-3 hover:bg-gray-200 rounded-xl transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Chi tiết ứng viên
            </h1>
          </div>

          <ApplicationProgressBar app={application} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Info + Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Candidate Info */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 ring-8 ring-purple-100">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <User className="w-14 h-14 text-purple-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-5 mb-4">
                      <h2 className="text-3xl font-extrabold text-gray-800">
                        {fullName}
                      </h2>
                      <div
                        className={`flex items-center gap-3 px-5 py-2.5 rounded-full ${config.color} text-white font-bold shadow-lg ring-4 ${config.ring} ring-opacity-40`}
                      >
                        <StateIcon className="w-5 h-5" />
                        <span>{config.label}</span>
                      </div>
                    </div>

                    <p className="text-xl font-semibold text-purple-600 mb-5">
                      {application.resume.objectCareer ||
                        "Chưa xác định vị trí"}
                    </p>

                    <div className="space-y-4 text-gray-600">
                      {application.resume.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <a
                            href={`mailto:${application.resume.email}`}
                            className="hover:text-blue-600"
                          >
                            {application.resume.email}
                          </a>
                        </div>
                      )}
                      {application.resume.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-orange-500" />
                          <a
                            href={`tel:${application.resume.phone}`}
                            className="hover:text-orange-600"
                          >
                            {application.resume.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>
                          Nộp lúc: {formatDateTime(application.appliedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons + Modal */}
              {config.next.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Hành động tiếp theo
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {config.next.map((action: any) => (
                      <button
                        key={action.state}
                        onClick={() => openModal(action)}
                        className={`flex items-center justify-center gap-3 px-6 py-5 ${action.color} text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg`}
                      >
                        {action.state === "INTERVIEW" && (
                          <FaMicrophone className="w-6 h-6" />
                        )}
                        {action.state === "HIRED" && (
                          <FaUserCheck className="w-6 h-6" />
                        )}
                        {action.state === "REJECTED" && (
                          <XCircle className="w-6 h-6" />
                        )}
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Status */}
              {isRejected && (
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-10 text-center">
                  <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-red-700">
                    Ứng viên đã bị từ chối
                  </p>
                </div>
              )}
              {isHired && (
                <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-10 text-center">
                  <FaUserCheck className="w-20 h-20 text-green-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-green-700">
                    Ứng viên đã được tuyển dụng
                  </p>
                </div>
              )}
            </div>

            {/* Right: Documents */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Tài liệu ứng tuyển
                </h3>

                {/* CV chính */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-600 mb-3">
                    CV chính
                  </p>
                  <button
                    onClick={() => handleDownload(application.resume)}
                    className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border-2 border-blue-200 hover:bg-blue-100 transition"
                  >
                    <FaFileWord className="w-12 h-12 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {application.resume.title}
                      </p>
                      <p className="text-sm text-gray-500">Nhấn để xem</p>
                    </div>
                    <Download className="w-6 h-6 text-blue-600" />
                  </button>
                </div>

                {/* Tài liệu đính kèm */}
                {application.documents.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-4">
                      Đính kèm ({application.documents.length})
                    </p>
                    <div className="space-y-3">
                      {application.documents.map((doc: any) => (
                        <a
                          key={doc.id}
                          href={getImageUrl(doc.fileName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getFileIconFromName(doc.originalName)}
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {doc.originalName}
                            </span>
                          </div>
                          <Download className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ChangeStateModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAction(null);
        }}
        onConfirm={handleConfirm}
        action={selectedAction}
        loading={isUpdating}
      />
    </>
  );
};

export default ApplicantDetailView;
