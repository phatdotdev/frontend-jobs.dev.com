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
  Layers,
  FileText,
  Download,
} from "lucide-react";
import {
  useGetJobPostingDetailQuery,
  useGetSimilarJobsQuery,
} from "../../redux/api/apiPostSlice";
import { useNavigate, useParams } from "react-router-dom";
import DataLoader from "../../components/UI/DataLoader";
import {
  formatDateTime,
  getImageUrl,
  mapJobTypeVietnamese,
} from "../../utils/helper";
import ImageCarousel from "../../components/UI/ImageCarosel";
import { useGetUserInfoQuery } from "../../redux/api/apiUserSlice";
import { useLazyGetAllResumesQuery } from "../../redux/api/apiResumeSlice";
import CvSelectionModal from "../../components/Modal/CvSelectModal";
import {
  useApplyJobMutation,
  useSearchApplyQuery,
} from "../../redux/api/apiApplicationSlice";
import ApplicationInfo from "../../components/Application/ApplicationInfo";
import InteractionItem from "../../components/Post/InteractionItem";
import type { PostingProps } from "../../types/PostingProps";
import { getFileIconFromName, renderTabContent } from "../../utils/helpRender";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { differenceInDays } from "date-fns";

const Loader = Loader2;

const formatSalary = (min: number, max: number) => {
  const formatNumber = (num: number) => num.toLocaleString("en-US");
  return `${formatNumber(min)} - ${formatNumber(max)} USD`;
};

const JobDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const { data: similarJobsData } = useGetSimilarJobsQuery(id as string, {
    skip: !id,
  });
  const similarJobs = similarJobsData?.data;

  const { data: { data: application } = {}, refetch: refetchApply } =
    useSearchApplyQuery({ postId: id });
  const [applyJob, { isLoading: isApplyingApi }] = useApplyJobMutation();

  const currentPathEncoded = encodeURIComponent(
    location.pathname + location.search
  );

  const daysLeft = job?.expiredAt
    ? differenceInDays(new Date(job.expiredAt), new Date())
    : null;

  const fetchResumes = async () => {
    try {
      const { data } = await triggerGetResumes();
      if (data && data.data) setResumes(data.data);
    } catch (error) {
      console.error("Lỗi khi fetch Resumes:", error);
    }
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
    await fetchResumes();
    setIsProcessing(false);
  };

  const handleConfirmApply = async (resumeId: string, files: File[]) => {
    if (!job?.id) return;
    try {
      const formData = new FormData();
      formData.append("postId", job.id);
      formData.append("resumeId", resumeId);
      files.forEach((file) => formData.append("documents", file));

      await applyJob(formData).unwrap();
      dispatch(
        addToast({
          type: "success",
          title: "Ứng tuyển thành công!",
          message: "Hồ sơ của bạn đã được ghi nhận.",
        })
      );
      setShowCvModal(false);
      refetchApply();
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          title: "Ứng tuyển thất bại!",
          message: "Đã có lỗi xảy ra, vui lòng thử lại!",
        })
      );
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

  if (isJobLoading) return <DataLoader />;
  if (isJobError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-red-200 text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-red-600">
            Không tìm thấy công việc
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            ID công việc không hợp lệ hoặc đã hết hạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white shadow-2xl py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          <img
            src={getImageUrl(job.avatarUrl)}
            alt={job.companyName}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-teal-500 shadow-2xl ring-4 ring-white"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-2xl font-bold text-teal-600 mt-3 group cursor-pointer">
              <span className="transition-all duration-300 group-hover:text-teal-700 group-hover:underline underline-offset-4">
                {job.companyName}
              </span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 mt-5 text-gray-700">
              <span className="flex items-center gap-2 text-lg">
                <MapPin size={22} className="text-teal-600" />
                <span className="font-semibold">{job.location.name}</span>
              </span>
              <span className="flex items-center gap-2 text-lg font-bold text-red-600">
                <DollarSign size={24} className="text-red-600" />
                {formatSalary(job.minSalary, job.maxSalary)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-9 gap-10">
        {/* Left: Tabs & Description */}
        <div className="lg:col-span-5 space-y-8">
          <ImageCarousel images={job.imageUrls.map(getImageUrl)} />

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  {
                    key: "description",
                    label: "Mô tả công việc",
                    icon: Layers,
                  },
                  { key: "requirements", label: "Yêu cầu", icon: CheckCircle },
                  { key: "benefits", label: "Quyền lợi", icon: Zap },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex-1 py-5 px-6 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      activeTab === tab.key
                        ? "text-teal-700"
                        : "text-gray-500 hover:text-teal-600"
                    }`}
                  >
                    <tab.icon size={22} />
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-t-full"></span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-8 md:p-10">
              {activeTab === "description" &&
                renderTabContent(job.description, CheckCircle, "text-teal-600")}
              {activeTab === "requirements" &&
                renderTabContent(
                  job.requirements,
                  CheckCircle,
                  "text-teal-600"
                )}
              {activeTab === "benefits" &&
                renderTabContent(job.benefits, Zap, "text-orange-600")}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Job Info */}
          <div className="bg-white p-7 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6 pb-4 border-b">
              <Building2 size={28} className="text-teal-600" />
              Thông tin công việc
            </h3>
            <div className="space-y-6 text-gray-700">
              <div className="flex items-center gap-4">
                <Briefcase size={24} className="text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Kinh nghiệm
                  </p>
                  <p className="text-lg font-semibold">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={24} className="text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Loại hình</p>
                  <p className="text-lg font-semibold">
                    {mapJobTypeVietnamese(job.type)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FileText size={24} className="text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Hồ sơ yêu cầu
                  </p>
                  <p className="text-lg font-semibold">
                    {job.requiredDocuments || "Không yêu cầu cụ thể"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar
                  size={24}
                  className={`${
                    daysLeft !== null && daysLeft <= 7
                      ? "text-red-600"
                      : "text-teal-600"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Hạn nộp hồ sơ
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      daysLeft !== null && daysLeft <= 7
                        ? "text-red-600 animate-pulse"
                        : "text-red-600"
                    }`}
                  >
                    {formatDateTime(job.expiredAt)}
                    {daysLeft !== null && daysLeft <= 3 && (
                      <span className="ml-3 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-bold">
                        Sắp hết hạn!
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <InteractionItem
                  likes={job?.likes as number}
                  views={job?.views as number}
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          {job.documents?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <p className="text-lg font-bold text-gray-800 mb-4">
                Tài liệu đính kèm ({job.documents.length})
              </p>
              <div className="space-y-3">
                {job.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIconFromName(doc.originalName)}
                      <span className="font-medium text-gray-700 truncate max-w-[200px]">
                        {doc.originalName}
                      </span>
                    </div>
                    <a
                      href={getImageUrl(doc.fileName as string)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download
                        size={20}
                        className="text-blue-600 hover:text-blue-700 transition"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button - Sticky */}
          <div className="sticky top-24 z-10">
            {application ? (
              <ApplicationInfo application={application} />
            ) : (
              <>
                <button
                  onClick={handleApply}
                  disabled={buttonLoading}
                  className="relative overflow-hidden w-full group flex items-center justify-center gap-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xl font-bold py-6 rounded-3xl shadow-2xl shadow-teal-600/50 transform hover:scale-[1.02] active:scale-98 transition-all duration-300 disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {buttonLoading ? (
                      <>
                        <Loader className="animate-spin h-8 w-8" />
                        <span>Đang chuẩn bị...</span>
                      </>
                    ) : (
                      <>
                        <Send
                          size={28}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                        Ứng tuyển ngay
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
                </button>
                <p className="text-center text-gray-600 mt-4 font-medium">
                  Nộp hồ sơ chỉ trong{" "}
                  <span className="text-teal-600 font-bold">30 giây</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      {similarJobs && similarJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 flex items-center gap-4">
            <Layers size={36} className="text-teal-600" />
            Công việc tương tự
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarJobs.map((sJob: PostingProps) => (
              <div
                key={sJob.id}
                onClick={() => navigate(`/jobs/${sJob.id}`)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-teal-200 cursor-pointer group transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={getImageUrl(sJob.avatarUrl)}
                        alt={sJob.companyName}
                        className="w-16 h-16 rounded-xl object-cover ring-4 ring-gray-50 group-hover:ring-teal-100 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition line-clamp-2">
                        {sJob.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {sJob.companyName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-3 bg-gray-50/70 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {sJob.location.name}
                    </span>
                    <span className="font-bold text-red-600">
                      {formatSalary(sJob.minSalary, sJob.maxSalary)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {application == null && showCvModal && (
        <CvSelectionModal
          jobId={job.id}
          resumes={resumes}
          onClose={() => setShowCvModal(false)}
          onCreateNewCv={handleCreateCvRedirect}
          onConfirmApply={handleConfirmApply}
          isResumesLoading={isResumesFetching}
        />
      )}
    </div>
  );
};

export default JobDetailView;
