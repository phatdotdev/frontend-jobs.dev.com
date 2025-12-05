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
  XCircle,
  Download,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Mic,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import ApplicationProgressBar from "../../components/Application/ApplicationProgressBar";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className={`h-1.5 ${action?.color || "bg-gray-500"}`} />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {action?.label}
          </h3>
          <p className="text-gray-600 mb-5">
            Chuyển trạng thái ứng viên sang <strong>"{action?.label}"</strong>
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            placeholder="Ghi chú (không bắt buộc)..."
          />

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(note)}
              disabled={loading}
              className={`px-7 py-3 ${action?.color} text-white font-bold rounded-xl hover:shadow-lg transition flex items-center gap-2`}
            >
              {loading ? "Đang xử lý..." : <>Xác nhận</>}
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
    icon: Clock,
    ring: "ring-blue-200",
  },
  REVIEWING: {
    label: "Đang xem xét",
    color: "bg-orange-500",
    icon: Eye,
    ring: "ring-orange-200",
  },
  REQUESTED: {
    label: "Yêu cầu bổ sung",
    color: "bg-purple-500",
    icon: RotateCw,
    ring: "ring-purple-200",
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    color: "bg-indigo-500",
    icon: Mic,
    ring: "ring-indigo-200",
  },
  ACCEPTED: {
    label: "Được chấp nhận",
    color: "bg-emerald-500",
    icon: CheckCircle2,
    ring: "ring-emerald-200",
  },
  HIRED: {
    label: "Được tuyển dụng",
    color: "bg-green-600",
    icon: UserCheck,
    ring: "ring-green-300",
  },
  REJECTED: {
    label: "Bị từ chối",
    color: "bg-red-600",
    icon: XCircle,
    ring: "ring-red-300",
  },
};

const NEXT_ACTIONS: any = {
  SUBMITTED: [
    { label: "Bắt đầu xem xét", state: "REVIEWING", color: "bg-orange-500" },
    { label: "Yêu cầu bổ sung", state: "REQUESTED", color: "bg-purple-500" },
  ],
  REVIEWING: [
    { label: "Hồ sơ đạt", state: "ACCEPTED", color: "bg-emerald-500" },
    { label: "Từ chối", state: "REJECTED", color: "bg-red-600" },
    { label: "Yêu cầu bổ sung", state: "REQUESTED", color: "bg-purple-500" },
  ],
  REQUESTED: [
    { label: "Đã nhận hồ sơ", state: "REVIEWING", color: "bg-orange-500" },
    { label: "Từ chối", state: "REJECTED", color: "bg-red-600" },
  ],
  INTERVIEW: [
    { label: "Tuyển dụng", state: "HIRED", color: "bg-green-600" },
    { label: "Loại", state: "REJECTED", color: "bg-red-600" },
  ],
  ACCEPTED: [
    { label: "Phỏng vấn", state: "INTERVIEW", color: "bg-indigo-500" },
    { label: "Yêu cầu bổ sung", state: "REQUESTED", color: "bg-purple-500" },
  ],
};

const ApplicantDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resp, isLoading, refetch } = useGetApplicationByIdQuery(id!);
  const [updateState, { isLoading: isUpdating }] =
    useUpdateApplicationStateMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const dispatch = useDispatch();

  const application = resp?.data;
  if (isLoading || !application) return <DataLoader />;

  const state = STATE_CONFIG[application.state] || STATE_CONFIG.REJECTED;
  const nextActions = NEXT_ACTIONS[application.state] || [];
  const StateIcon = state.icon;

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
        payload: { state: selectedAction.state, content: note || null },
      }).unwrap();
      refetch();
      setModalOpen(false);
      setSelectedAction(null);
    } catch (err) {}
  };

  const handleDownload = async (resume: any) => {
    try {
      const file = await generateResumeFile(
        resume,
        getImageUrl(resume?.avatarUrl as string)
      );
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      dispatch(addToast({ type: "success", message: "Tải CV thành công!" }));
    } catch (err) {
      dispatch(addToast({ type: "error", message: "Lỗi tải CV!" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back + Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/applications"
            className="p-3 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Chi tiết ứng viên
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <ApplicationProgressBar app={application} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Info + Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-28 h-28 rounded-full p-1.5 ring-8 ring-purple-100 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <img
                      className="h-full w-full rounded-full"
                      src={getImageUrl(application.resume.avatarUrl)}
                      alt="avatar"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      {/* Tên ứng viên */}
                      <h2 className="text-3xl font-extrabold text-gray-900">
                        {fullName}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-gray-600">
                        {application.resume.email && (
                          <a
                            href={`mailto:${application.resume.email}`}
                            className="flex items-center gap-3 hover:text-blue-600 transition"
                          >
                            <Mail className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">
                              {application.resume.email}
                            </span>
                          </a>
                        )}
                        {application.resume.phone && (
                          <a
                            href={`tel:${application.resume.phone}`}
                            className="flex items-center gap-3 hover:text-orange-600 transition"
                          >
                            <Phone className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">
                              {application.resume.phone}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Trạng thái */}
                    <div
                      className={`flex items-center gap-3 px-5 py-3 rounded-full ${state.color} text-white font-bold shadow-lg ring-4 ${state.ring}`}
                    >
                      <StateIcon className="w-5 h-5" />
                      {state.label}
                    </div>
                  </div>
                </div>
              </div>
              {/* Giới thiệu và mục tiêu */}
              <div className="mt-5">
                <p className="font-bold bg-blue-100 px-4 py-2 rounded-lg text-blue-500">
                  Giới thiệu ứng viên
                </p>
                <p className="py-2 text-justify text-md font-medium text-gray-600 mt-1">
                  {application.resume.introduction || "Chưa xác định"}
                </p>
                <p className="font-bold bg-blue-100 px-4 py-2 rounded-lg text-blue-500">
                  Mục tiêu nghề nghiệp
                </p>
                <p className="py-2 text-justify text-md font-medium text-gray-600 mt-1">
                  {application.resume.objectCareer || "Chưa xác định"}
                </p>
                {/* Timestamp */}
                <div className="flex items-center mt-4 font-bold text-blue-500 gap-3 col-span-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Nộp lúc: {formatDateTime(application.appliedAt)}</span>
                </div>
              </div>
            </div>

            {/* Next Actions */}
            {nextActions.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                  Hành động tiếp theo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nextActions.map((action: any) => (
                    <button
                      key={action.state}
                      onClick={() => openModal(action)}
                      className={`flex items-center justify-center gap-3 py-5 ${action.color} text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                    >
                      {action.state === "REVIEWING" && (
                        <Eye className="w-6 h-6" />
                      )}
                      {action.state === "ACCEPTED" && (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                      {action.state === "REQUESTED" && (
                        <RotateCw className="w-6 h-6" />
                      )}
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

                  {application.state === "REQUESTED" &&
                    application.acceptedAt && (
                      <button
                        onClick={() =>
                          openModal({
                            label: "Phỏng vấn",
                            state: "INTERVIEW",
                            color: "bg-indigo-500",
                          })
                        }
                        className={`flex items-center justify-center gap-3 py-5 bg-indigo-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                      >
                        <Mic className="w-6 h-6" />
                        Gọi phỏng vấn
                      </button>
                    )}
                </div>
              </div>
            )}

            {/* Final Status */}
            {(application.state === "REJECTED" ||
              application.state === "HIRED") && (
              <div
                className={`rounded-3xl p-10 text-center ${
                  application.state === "REJECTED"
                    ? "bg-red-50 border-2 border-red-300"
                    : "bg-green-50 border-2 border-green-400"
                }`}
              >
                {application.state === "REJECTED" ? (
                  <>
                    <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-red-700">
                      Ứng viên đã bị từ chối
                    </p>
                  </>
                ) : (
                  <>
                    <FaUserCheck className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-green-700">
                      Ứng viên đã được tuyển dụng!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Documents */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Tài liệu ứng tuyển
              </h3>

              {/* Main CV */}
              <button
                onClick={() => handleDownload(application.resume)}
                className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition group"
              >
                <FaFileWord className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800">
                    {application.resume.title}
                  </p>
                  <p className="text-sm text-gray-500">Nhấn để tải CV</p>
                </div>
                <Download className="w-6 h-6 text-blue-600 group-hover:translate-y-1 transition" />
              </button>

              {/* Attached Files */}
              {application.documents.length > 0 && (
                <div className="mt-8">
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
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
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
    </div>
  );
};

export default ApplicantDetailView;
