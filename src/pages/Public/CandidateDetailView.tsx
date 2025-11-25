import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { getImageUrl } from "../../utils/helper";
import ChatModal from "../../components/Modal/ChatModal";
import {
  useGetJobSeekerByApplicationIdQuery,
  useGetResumeByApplicationIdQuery,
} from "../../redux/api/apiApplicationSlice";
import {
  useGetEducationsByJobSeekerIdQuery,
  useGetExperiencesByJobSeekerIdQuery,
} from "../../redux/api/apiResumeSlice";
import ExperienceItem from "../../components/JobSeeker/ExperienceItem";
import EducationItem from "../../components/JobSeeker/EducationItem";
import { format } from "date-fns";

const CandidateDetailPage: React.FC = () => {
  const { id: applicationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: candidateRes,
    isLoading: isCandidateLoading,
    isError: isCandidateError,
  } = useGetJobSeekerByApplicationIdQuery(applicationId || skipToken);

  const candidate = candidateRes?.data;

  // Lấy resume và education chỉ khi có candidate.id
  const { data: educationRes } = useGetEducationsByJobSeekerIdQuery(
    candidate?.id || skipToken
  );
  const { data: experienceRes } = useGetExperiencesByJobSeekerIdQuery(
    candidate?.id || skipToken
  );
  const { data: resumeRes } = useGetResumeByApplicationIdQuery(
    applicationId || skipToken
  );

  const educations = educationRes?.data || [];
  const experiences = educationRes?.data || [];
  const resume = resumeRes?.data;

  if (isCandidateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DataLoader />
      </div>
    );
  }

  if (isCandidateError || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorAlert content="Không tìm thấy ứng viên" />
      </div>
    );
  }

  const fullName =
    `${candidate.firstname || ""} ${candidate.lastname || ""}`.trim() ||
    candidate.username;
  const age = candidate.dob
    ? `${new Date().getFullYear() - new Date(candidate.dob).getFullYear()} tuổi`
    : "Chưa cập nhật";
  const joinDate = candidate.createdAt
    ? format(new Date(candidate.createdAt), "dd 'tháng' MM, yyyy")
    : "Chưa rõ";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-bold text-lg transition-all hover:-translate-x-1"
        >
          <ArrowLeft
            size={24}
            className="transition-transform group-hover:-translate-x-1"
          />
          Quay lại
        </button>

        {/* Header: Cover + Avatar + Tên */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          {/* Cover */}
          <div className="h-56 sm:h-72 relative">
            {candidate.coverUrl ? (
              <img
                src={getImageUrl(candidate.coverUrl)}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-teal-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Avatar + Info */}
          <div className="relative -mt-20 sm:-mt-32 px-6 pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition" />
                <img
                  src={
                    getImageUrl(candidate.avatarUrl) || "/default-avatar.png"
                  }
                  alt={fullName}
                  className="relative w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full border-8 border-white shadow-2xl"
                />
                <div className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-white" />
                </div>
              </div>

              {/* Tên + Role */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
                  {fullName}
                </h1>
                <p className="text-2xl text-white/90 font-medium mt-2">
                  Ứng viên
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
                  <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white font-bold rounded-full text-sm">
                    Đang hoạt động
                  </span>
                  <span className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-full text-sm">
                    Ứng tuyển vị trí
                  </span>
                </div>
              </div>

              {/* Chat */}
              <div className="sm:ml-auto">
                <ChatModal name={fullName} id={candidate.id} color="purple" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin + Kinh nghiệm + Học vấn */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="text-indigo-600" size={28} />
                Thông tin cá nhân
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={candidate.email}
                  href={`mailto:${candidate.email}`}
                />
                <InfoItem
                  icon={Phone}
                  label="Điện thoại"
                  value={candidate.phone || "Chưa cung cấp"}
                  href={candidate.phone ? `tel:${candidate.phone}` : undefined}
                />
                <InfoItem
                  icon={MapPin}
                  label="Địa chỉ"
                  value={candidate.address || "Chưa cập nhật"}
                />
                <InfoItem
                  icon={Calendar}
                  label="Ngày sinh"
                  value={
                    candidate.dob
                      ? format(new Date(candidate.dob), "dd/MM/yyyy")
                      : "Chưa cập nhật"
                  }
                />
                <InfoItem
                  icon={User}
                  label="Giới tính"
                  value={
                    candidate.gender === "MALE"
                      ? "Nam"
                      : candidate.gender === "FEMALE"
                      ? "Nữ"
                      : "Khác"
                  }
                />
                <InfoItem icon={Award} label="Tuổi" value={age} />
                <InfoItem
                  icon={Calendar}
                  label="Tham gia từ"
                  value={joinDate}
                />
              </div>
            </div>

            {/* Kinh nghiệm */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <BriefcaseBusiness className="text-teal-600" size={28} />
                Kinh nghiệm làm việc
              </h2>
              {experiences?.length > 0 ? (
                <div className="space-y-6">
                  {experiences.map((exp: any) => (
                    <ExperienceItem key={exp.id} experience={exp} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">
                  Chưa có kinh nghiệm làm việc
                </p>
              )}
            </div>

            {/* Học vấn */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <GraduationCap className="text-purple-600" size={28} />
                Trình độ học vấn
              </h2>
              {educations.length > 0 ? (
                <div className="space-y-6">
                  {educations.map((edu: any) => (
                    <EducationItem key={edu.id} education={edu} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">
                  Chưa có thông tin học vấn
                </p>
              )}
            </div>
          </div>

          {/* Cột phải: CV */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="text-indigo-600" size={28} />
                Hồ sơ ứng tuyển
              </h2>
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
                {resume ? (
                  <div>
                    <FileText
                      size={64}
                      className="mx-auto text-indigo-600 mb-4"
                    />
                    <p className="text-xl font-bold text-indigo-800">
                      {resume.title || "CV đính kèm"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Đã tải lên{" "}
                      {resume.createdAt
                        ? format(new Date(resume.createdAt), "dd/MM/yyyy")
                        : ""}
                    </p>
                  </div>
                ) : (
                  <div>
                    <FileText
                      size={64}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500">Chưa tải lên CV</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.FC<any>;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50 hover:shadow-md transition group">
    <div className="p-3 bg-white rounded-xl shadow group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-indigo-600" />
    </div>
    <div>
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-indigo-800 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default CandidateDetailPage;
