import React, { useState } from "react";
import {
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Clock,
  Zap,
  CheckCircle,
  X,
  Send,
  Loader2,
  Calendar,
  type LucideIcon,
  Layers,
} from "lucide-react";
import { useGetJobPostingDetailQuery } from "../redux/api/postApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import DataLoader from "../components/UI/DataLoader";
import { formatDateTime, getImageUrl } from "../utils/helper";
import ImageCarousel from "../components/UI/ImageCarosel";
import { useGetUserInfoQuery } from "../redux/api/userApiSlice";
import { useLazyGetAllResumesQuery } from "../redux/api/apiResumeSlice";

import CvSelectionModal from "../components/Post/CvSelectModal";
import {
  useApplyJobMutation,
  useSearchApplyQuery,
} from "../redux/api/applicationSlice";
import ApplicationInfo from "../components/Application/ApplicationInfo"; // Component đã cải tiến
import InteractionItem from "../components/Post/InteractionItem";
import type { PostingProps } from "../types/PostingProps";

// Định nghĩa lại Icon Loader cho đồng bộ
const Loader = Loader2;

const formatSalary = (min: number, max: number) => {
  const formatNumber = (num: number) => num.toLocaleString("en-US");
  return `${formatNumber(min)} - ${formatNumber(max)} USD`;
};

interface JobDetailListItemProps {
  text: string;
  Icon: LucideIcon;
  iconClassName: string;
}

const JobDetailListItem: React.FC<JobDetailListItemProps> = ({
  text,
  Icon,
  iconClassName,
}) => (
  <li className="flex items-start text-gray-700 leading-relaxed">
    <Icon size={18} className={`flex-shrink-0 mt-1 mr-3 ${iconClassName}`} />
    <span className="text-base">{text}</span>
  </li>
);

const JobDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: jobData,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useGetJobPostingDetailQuery(id as string);
  const job: PostingProps = jobData?.data;

  const { data: userDataResponse, isLoading: isUserLoading } =
    useGetUserInfoQuery();
  const isAuthenticated = !!userDataResponse?.data;

  const [resumes, setResumes] = useState<any[]>([]);
  const [triggerGetResumes, { isFetching: isResumesFetching }] =
    useLazyGetAllResumesQuery();

  const [activeTab, setActiveTab] = useState("description");
  const [showCvModal, setShowCvModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sử dụng useSearchApplyQuery để kiểm tra application
  const { data: { data: application } = {} } = useSearchApplyQuery({
    postId: id,
  });

  const [applyJob, { isLoading: isApplyingApi }] = useApplyJobMutation();

  const currentPathEncoded = encodeURIComponent(
    location.pathname + location.search
  );

  const fetchResumes = async () => {
    try {
      const { data } = await triggerGetResumes();
      if (data && data.data) {
        setResumes(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi fetch Resumes:", error);
    }
  };

  const renderTabContent = (
    content: string,
    Icon: LucideIcon,
    iconClass: string
  ) => {
    const items = content.split("\n").filter((line) => line.trim().length > 0);

    if (items.length <= 1) {
      return (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      );
    }

    return (
      <ul className="space-y-4 pt-4">
        {items.map((item, index) => (
          <JobDetailListItem
            key={index}
            text={item.trim()}
            Icon={Icon}
            iconClassName={iconClass}
          />
        ))}
      </ul>
    );
  };

  const handleApply = async () => {
    if (isProcessing) return;

    if (!isAuthenticated) {
      setIsProcessing(true);
      navigate(`/login?redirect=${currentPathEncoded}`);
      return;
    }
    setIsProcessing(true);
    setShowCvModal(true);

    // 3. Thực hiện fetch CV
    await fetchResumes();

    setIsProcessing(false);
  };

  const handleConfirmApply = async (resumeId: string) => {
    if (!job?.id) return;

    try {
      await applyJob({ postId: job.id, resumeId }).unwrap();
      alert("Ứng tuyển thành công!");
      // Sau khi nộp thành công, Modal đóng và useSearchApplyQuery sẽ tự động refetch (nếu invalidate tag đúng)
      setShowCvModal(false);
    } catch (error) {
      alert("Lỗi khi nộp hồ sơ. Vui lòng kiểm tra lại.");
      console.error("Apply error:", error);
    }
  };

  const handleCreateCvRedirect = () => {
    navigate(`/job-seeker/resume?redirect=${currentPathEncoded}`);
    setShowCvModal(false);
  };

  const buttonLoading =
    isJobLoading ||
    isUserLoading ||
    isProcessing ||
    isResumesFetching ||
    isApplyingApi;

  if (isJobLoading) {
    return <DataLoader />;
  }

  if (isJobError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-red-200">
          <X className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600">
            Không tìm thấy công việc
          </h2>
          <p className="text-gray-600 mt-2">
            ID công việc không hợp lệ hoặc đã hết hạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* 1. Header Section */}
      <header className="bg-white shadow-xl py-8 md:py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={getImageUrl(job.avatarUrl)}
            alt={job.companyName}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-teal-500 shadow-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-xl font-semibold text-teal-600 mt-1 hover:text-teal-700 transition duration-200 cursor-pointer">
              {job.companyName}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-gray-600 text-base font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-teal-500" />
                <span className="text-gray-700">{job.location.name}</span>
              </span>
              <span className="flex items-center gap-2 font-bold text-lg text-red-600">
                <DollarSign size={18} className="text-red-600" />
                {formatSalary(job.minSalary, job.maxSalary)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- */}

      {/* 2. Main Content and Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT COLUMN - Job Tabs */}
        <div className="lg:col-span-1  space-y-8">
          <ImageCarousel images={job.imageNames} />

          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
                {/* Tab: Mô tả công việc */}
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-3 px-1 font-bold text-lg transition-colors duration-200 
                                        ${
                                          activeTab === "description"
                                            ? "border-b-4 border-teal-600 text-teal-700"
                                            : "text-gray-500 hover:text-teal-600"
                                        }`}
                >
                  <Layers size={20} className="inline mr-2 -mt-0.5" /> Mô tả
                  công việc
                </button>
                {/* Tab: Yêu cầu */}
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`py-3 px-1 font-bold text-lg transition-colors duration-200 
                                        ${
                                          activeTab === "requirements"
                                            ? "border-b-4 border-teal-600 text-teal-700"
                                            : "text-gray-500 hover:text-teal-600"
                                        }`}
                >
                  <CheckCircle size={20} className="inline mr-2 -mt-0.5" /> Yêu
                  cầu
                </button>
                {/* Tab: Quyền lợi */}
                <button
                  onClick={() => setActiveTab("benefits")}
                  className={`py-3 px-1 font-bold text-lg transition-colors duration-200 
                                        ${
                                          activeTab === "benefits"
                                            ? "border-b-4 border-teal-600 text-teal-700"
                                            : "text-gray-500 hover:text-teal-600"
                                        }`}
                >
                  <Zap size={20} className="inline mr-2 -mt-0.5" /> Quyền lợi
                </button>
              </nav>
            </div>
            {/* Tab Content */}
            <div className="pt-8">
              {activeTab === "description" &&
                renderTabContent(job.description, CheckCircle, "text-teal-500")}
              {activeTab === "requirements" &&
                renderTabContent(
                  job.requirements,
                  CheckCircle,
                  "text-teal-500"
                )}
              {activeTab === "benefits" &&
                renderTabContent(job.benefits, Zap, "text-orange-500")}
            </div>
          </div>
        </div>

        {/* --- */}

        {/* RIGHT COLUMN - Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Job Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-5">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-3 flex items-center gap-2">
              <Building2 size={24} className="text-teal-600" />
              Thông tin công việc
            </h3>

            <div className="space-y-4 text-gray-700">
              {/* Kinh nghiệm */}
              <div className="flex items-center gap-4">
                <Briefcase size={22} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Kinh nghiệm
                  </p>
                  <p className="text-base font-medium">{job.experience}</p>
                </div>
              </div>

              {/* Loại hình */}
              <div className="flex items-center gap-4">
                <Clock size={22} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Loại hình
                  </p>
                  <p className="text-base font-medium">{job.type}</p>
                </div>
              </div>

              {/* Hạn nộp hồ sơ */}
              <div className="flex items-center gap-4">
                <Calendar size={22} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Hạn nộp hồ sơ
                  </p>
                  <p className="text-base font-bold text-red-600">
                    {formatDateTime(job.expiredAt)}
                  </p>
                </div>
              </div>
              {/* Tương tác  */}
              <InteractionItem
                likes={job?.likes as number}
                views={job?.views as number}
              />
            </div>
          </div>

          {/* Quick Apply Button / Applied Info - Sticky */}
          <div className="sticky top-24">
            {/* Conditional Rendering: Nếu đã nộp (application tồn tại) thì hiển thị thông tin */}
            {application ? (
              <ApplicationInfo application={application} />
            ) : (
              // Ngược lại, hiển thị nút Ứng tuyển
              <>
                <button
                  onClick={handleApply}
                  disabled={buttonLoading}
                  className="w-full flex items-center justify-center gap-3 bg-teal-600 text-white text-xl font-bold py-4 rounded-2xl shadow-2xl shadow-teal-600/40 hover:bg-teal-700 transition duration-300 transform hover:scale-[1.005] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buttonLoading ? (
                    <>
                      <Loader className="animate-spin h-6 w-6" />
                      {isProcessing || isResumesFetching || isApplyingApi
                        ? "Đang tải dữ liệu..."
                        : "Đang xác thực..."}
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      Ứng tuyển ngay
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Nộp hồ sơ trực tuyến chỉ trong 1 phút.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- */}

      {/* CvSelectionModal */}
      {/* Modal chỉ hiện khi application == null (Chưa nộp) và showCvModal == true */}
      {application == null && showCvModal && (
        <CvSelectionModal
          jobId={job.id}
          resumes={resumes}
          onClose={() => setShowCvModal(false)}
          onCreateNewCv={handleCreateCvRedirect}
          onConfirmApply={handleConfirmApply}
          isResumesLoading={isResumesFetching} // Trạng thái loading
        />
      )}
    </div>
  );
};

export default JobDetailView;
