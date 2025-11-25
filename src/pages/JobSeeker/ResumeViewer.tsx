import { useState, type FC } from "react";
import { Link, useParams } from "react-router-dom"; // Dùng để lấy ID từ URL
import {
  User,
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
} from "lucide-react";

import type {
  ResumeProps,
  EducationProps,
  ExperienceProps,
  SkillProps,
  CertificationProps,
  AwardProps,
  ActivityProps,
  ProjectProps,
} from "../../types/ResumeProps";
import { useGetResumeByIdQuery } from "../../redux/api/apiResumeSlice";
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
  const userAvatarUrl: string | undefined = undefined;

  console.log(resume);

  const [isRequesting, setIsRequesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state quản lý loading khi submit

  const [createFeedbackRequest] = useCreateFeedbackRequestMutation();

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

  // 3. Xử lý trạng thái Loading và Error
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
    </div>
  );
};

export default ResumeViewer;
