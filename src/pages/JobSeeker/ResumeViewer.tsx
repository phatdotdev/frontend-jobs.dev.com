import { useState, type FC } from "react";
import { Link, useParams } from "react-router-dom"; // Dùng để lấy ID từ URL
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  BookOpen,
  Target,
  Award,
  GraduationCap,
  Code,
  Loader2,
  Layers,
  Users,
  Star,
  HeartPlus,
  CheckCircle2,
  X,
} from "lucide-react";

import type {
  ResumeProps,
  EducationProps,
  SkillProps,
  CertificationProps,
  ActivityProps,
  ProjectProps,
} from "../../types/ResumeProps";
import {
  useGetResumeByIdQuery,
  useGetSuggestionJobsMutation,
} from "../../redux/api/apiResumeSlice";
import ExperienceItem from "../../components/JobSeeker/ExperienceItem";
import EducationItem from "../../components/JobSeeker/EducationItem";
import SkillItem from "../../components/JobSeeker/SkillItem";
import ProjectItem from "../../components/JobSeeker/ProjectItem";
import CertificationItem from "../../components/JobSeeker/CertificationItem";
import AwardItem from "../../components/JobSeeker/AwardItem";
import ActivityItem from "../../components/JobSeeker/ActivityItem";
import {
  formatDate,
  getImageUrl,
  mapGenderToVietnamese,
} from "../../utils/helper";
import { useCreateFeedbackRequestMutation } from "../../redux/api/apiReviewSlice";
import FeedbackRequestModal from "../../components/Modal/FeedbackRequestModal";
import DataLoader from "../../components/UI/DataLoader";
import { useDispatch } from "react-redux";

const ResumeViewer: FC = () => {
  const { id: resumeId } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetResumeByIdQuery(resumeId as string, {
    skip: !resumeId,
  });

  const resume: ResumeProps | undefined = response?.data;

  const [isRequesting, setIsRequesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getSuggestions] = useGetSuggestionJobsMutation();

  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState<any[] | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [createFeedbackRequest] = useCreateFeedbackRequestMutation();

  const dispatch = useDispatch();
  const createRequest = async (notes: string, completedAt: string) => {
    if (!resumeId) return;

    setIsSubmitting(true);
    try {
      await createFeedbackRequest({
        resumeId: resumeId,
        notes: notes,
        completedAt: completedAt,
      }).unwrap();

      setIsRequesting(false);
    } catch (err) {
      console.error("Lỗi gửi yêu cầu đánh giá:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-teal-600 mb-3" />
        <p className="text-gray-600">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (isError || !resume) {
    console.error("Lỗi tải Resume:", error);
    return (
      <div className="text-center p-10 text-red-600 border border-red-200 bg-red-50 rounded-lg">
        <p className="font-semibold">Lỗi tải dữ liệu!</p>
        <p className="text-sm mt-1">
          Không tìm thấy Resume có ID: {resumeId} hoặc đã xảy ra lỗi máy chủ.
        </p>
      </div>
    );
  }

  const fetchJobSuggestions = async () => {
    // Chỉ gọi 1 lần (có cache)
    if (jobSuggestions !== null) return;

    setLoadingJobs(true);
    try {
      const res = await getSuggestions(resumeId).unwrap();

      let suggestedJobs: any[] = [];

      if (res.success && res.data) {
        // Trường hợp 1: backend trả chuỗi JSON (hiện tại của bạn)
        if (typeof res.data === "string") {
          try {
            const parsed = JSON.parse(res.data);
            suggestedJobs = parsed.suggested_jobs || [];
          } catch (e) {
            console.error("Parse JSON từ backend thất bại:", e);
            suggestedJobs = [];
          }
        }
        // Trường hợp 2: backend đã trả object thật (tương lai)
        else if (res.data.suggested_jobs) {
          suggestedJobs = res.data.suggested_jobs;
        }
      }

      // LỌC BỎ những job rỗng (id null, title rỗng, score = 0)
      const validJobs = suggestedJobs.filter(
        (job: any) =>
          job.id && job.title && job.title.trim() !== "" && job.match_score > 0
      );

      setJobSuggestions(validJobs);
    } catch (err) {
      setJobSuggestions([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleOpenJobSuggestions = () => {
    setShowJobSuggestions(true);
    fetchJobSuggestions();
  };

  const fullName = `${resume.firstname} ${resume.lastname}`;

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white shadow-2xl rounded-xl overflow-hidden">
      {/* Header: Cover + Avatar + Tên */}
      <div className="relative bg-white rounded-xl shadow overflow-hidden mb-10">
        {/* Cover */}
        <div className="h-28 sm:h-36 relative">
          <div className="w-full h-full bg-teal-500" />
        </div>

        {/* Avatar + Info */}
        <div className="relative -mt-20 sm:-mt-32 px-6 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full transition" />
              <img
                src={getImageUrl(resume.avatarUrl) || "/default-avatar.png"}
                alt={fullName}
                className="relative w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full border-8 border-white shadow-2xl"
              />
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle2 size={28} className="text-white" />
              </div>
            </div>

            {/* Tên + Role */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg pb-8">
                {fullName}
              </h1>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 drop-shadow-lg pb-3">
                {resume.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Thông tin Liên hệ */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="flex items-center text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              <Phone className="w-4 h-4 mr-2 text-teal-600" /> Thông tin Liên hệ
            </h3>
            <div className="text-sm space-y-2 text-gray-700">
              <p className="flex items-center">
                <Mail size={16} className="mr-2 text-teal-600" /> {resume.email}
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-2 text-teal-600" />{" "}
                {resume.phone}
              </p>
              <p className="flex items-center">
                <MapPin size={16} className="mr-2 text-teal-600" />{" "}
                {resume.address}
              </p>
              <p className="flex items-center">
                <Calendar size={16} className="mr-2 text-teal-600" />{" "}
                {formatDate(resume.dob)} ({mapGenderToVietnamese(resume.gender)}
                )
              </p>
            </div>
          </div>

          {/* Mục tiêu Nghề nghiệp */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="flex items-center text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              <Target className="w-4 h-4 mr-2 text-teal-600" /> Mục tiêu
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {resume.objectCareer}
            </p>
          </div>

          {/* Giới thiệu */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="flex items-center text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              <BookOpen className="w-4 h-4 mr-2 text-teal-600" /> Giới thiệu
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {resume.introduction}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Học vấn (Đã tách component) */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <GraduationCap className="w-5 h-5 mr-2" /> Học vấn
            </h3>
            <div className="space-y-4">
              {resume.educations?.length > 0 ? (
                resume.educations.map((edu) => (
                  <EducationItem
                    key={edu.id}
                    education={edu as EducationProps}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có thông tin học vấn.
                </p>
              )}
            </div>
          </div>

          {/* Kinh nghiệm làm việc (Đã tách component) */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Briefcase className="w-5 h-5 mr-2" /> Kinh nghiệm làm việc
            </h3>
            <div className="space-y-4">
              {resume.experiences?.length > 0 ? (
                resume.experiences.map((exp) => (
                  <ExperienceItem key={exp.id} experience={exp as any} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có kinh nghiệm làm việc nào được liệt kê.
                </p>
              )}
            </div>
          </div>

          {/* HIỂN THỊ KỸ NĂNG */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Code className="w-5 h-5 mr-2" /> Kỹ năng
            </h3>
            <div className="space-y-4">
              {resume.skills?.length > 0 ? (
                // Dữ liệu kỹ năng phải là type SkillProps
                resume.skills.map((skill) => (
                  <SkillItem key={skill.id} skill={skill as SkillProps} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có kỹ năng nào được liệt kê.
                </p>
              )}
            </div>
          </div>

          {/* HIỂN THỊ DỰ ÁN CÁ NHÂN */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Layers className="w-5 h-5 mr-2" /> Dự án cá nhân
            </h3>
            <div className="space-y-4">
              {resume.projects?.length > 0 ? (
                resume.projects.map((proj) => (
                  <ProjectItem key={proj.id} project={proj as ProjectProps} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có dự án cá nhân nào được liệt kê.
                </p>
              )}
            </div>
          </div>

          {/* Chứng chỉ và Giải thưởng */}

          {/* HIỂN THỊ CHỨNG CHỈ */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Award className="w-5 h-5 mr-2" /> Chứng chỉ
            </h3>
            <div className="space-y-4">
              {resume.certifications?.length > 0 ? (
                // Dữ liệu chứng chỉ phải là type CertificationProps
                resume.certifications.map((cert) => (
                  <CertificationItem
                    key={cert.id}
                    certification={cert as CertificationProps}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có chứng chỉ nào được liệt kê.
                </p>
              )}
            </div>
          </div>
          {/* HIỂN THỊ GIẢI THƯỞNG */}

          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Award className="w-5 h-5 mr-2" /> Giải thưởng
            </h3>
            <div className="space-y-4">
              {resume.awards?.length > 0 ? (
                // Dữ liệu giải thưởng phải là type AwardProps
                resume.awards.map((item) => (
                  <AwardItem key={item.id} award={item as any} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có giải thưởng nào được liệt kê.
                </p>
              )}
            </div>
          </div>

          {/* HIỂN THỊ HOẠT ĐỘNG KHÁC */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="flex items-center text-xl font-bold text-teal-700 mb-3 border-b pb-2">
              <Users className="w-5 h-5 mr-2" /> Hoạt động khác
            </h3>
            <div className="space-y-4">
              {resume.activities?.length > 0 ? (
                // Dữ liệu hoạt động phải là type ActivityProps
                resume.activities.map((act) => (
                  <ActivityItem key={act.id} activity={act as ActivityProps} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có hoạt động nào được liệt kê.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Xem đánh giá và yêu cầu đánh giá */}
      <div className="flex gap-6 py-6 px-10 justify-end">
        {/* Nút 1: Yêu cầu đánh giá */}
        <button
          className="
      flex items-center gap-2 
      bg-gradient-to-r from-purple-600 to-indigo-600 
      text-white p-3 rounded-xl font-bold text-base 
      shadow-lg shadow-indigo-500/50 
      hover:scale-105 hover:shadow-xl 
      transition-all duration-300 ease-in-out 
      focus:outline-none focus:ring-4 focus:ring-indigo-300
    "
          onClick={() => setIsRequesting(true)}
        >
          <HeartPlus className="w-5 h-5" />
          Yêu cầu đánh giá
        </button>

        {/* Nút 2: Xem đánh giá (Link) */}
        <Link to={`/job-seeker/resume/${resume.id}/reviews`}>
          <button
            className="
        flex items-center gap-2 
        bg-gradient-to-r from-blue-500 to-cyan-500 
        text-white p-3 rounded-xl font-bold text-base 
        shadow-lg shadow-blue-500/50 
        hover:scale-105 hover:shadow-xl 
        transition-all duration-300 ease-in-out 
        focus:outline-none focus:ring-4 focus:ring-blue-300
      "
          >
            <Star className="w-5 h-5" />
            Xem đánh giá
          </button>
        </Link>

        {/* Nút 3: GỢI Ý CÔNG VIỆC – MỚI */}
        <button
          onClick={handleOpenJobSuggestions}
          className="
      flex items-center gap-2 
      bg-gradient-to-r from-emerald-500 to-teal-600 
      text-white p-3 rounded-xl font-bold text-base 
      shadow-lg shadow-teal-500/50 
      hover:scale-105 hover:shadow-xl 
      transition-all duration-300 ease-in-out
    "
        >
          <Target className="w-5 h-5" />
          Gợi ý công việc phù hợp
        </button>
      </div>

      <footer className="p-4 text-xs text-right text-gray-500 border-t">
        Tạo lúc: {new Date(resume.createdAt).toLocaleDateString()} | Cập nhật:{" "}
        {new Date(resume.updatedAt).toLocaleDateString()}
      </footer>

      <FeedbackRequestModal
        isOpen={isRequesting}
        onClose={() => setIsRequesting(false)}
        onSubmit={createRequest}
        isLoading={isSubmitting}
      />

      {/* Suggest modal */}
      {showJobSuggestions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-teal-500 border-b p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Công việc phù hợp với hồ sơ của bạn
              </h2>
              <button
                onClick={() => setShowJobSuggestions(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X size={24} className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              {loadingJobs ? (
                <div className="text-center py-16">
                  <DataLoader content="Đang tạo câu trả lời, mong bạn chờ trong giây lát..." />
                </div>
              ) : jobSuggestions && jobSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {jobSuggestions.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-xl p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-teal-700">
                            {job.title}
                          </h3>
                          <p className="text-gray-700 font-medium">
                            {job.companyName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {job.location || "Không rõ địa điểm"} • Lương:{" "}
                            {job.promotedSalary || job.salary || "Thoả thuận"}
                          </p>
                          {job.reason && (
                            <p className="text-xs text-gray-600 mt-1">
                              Lý do: {job.reason}
                            </p>
                          )}
                        </div>
                        {job.matchScore && (
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              {job.matchScore}%
                            </span>
                            <p className="text-xs text-gray-500">phù hợp</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requiredSkills
                          ?.slice(0, 6)
                          .map((skill: string) => (
                            <span
                              key={skill}
                              className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>

                      <div className="flex gap-3">
                        <Link to={`/jobs/${job.id}`}>
                          <button className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition">
                            Xem chi tiết
                          </button>
                        </Link>
                        <button className="border border-teal-600 text-teal-600 px-5 py-2 rounded-lg hover:bg-teal-50 transition">
                          Ứng tuyển ngay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg">Chưa có công việc phù hợp.</p>
                  <p className="text-sm mt-2">
                    Hãy bổ sung thêm kỹ năng và kinh nghiệm nhé!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --- */}
    </div>
  );
};

export default ResumeViewer;
