import React from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Home,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { getImageUrl } from "../../utils/helper";
import ChatModal from "../../components/Modal/ChatModal";
import { useGetJobSeekerByApplicationIdQuery } from "../../redux/api/apiApplicationSlice";
import { format } from "date-fns";

const CandidateDetailPage: React.FC = () => {
  const { id: candidateId } = useParams<{ id: string }>();

  const {
    data: { data: candidate } = {},
    isLoading: isCandidateLoading,
    isError: isCandidateError,
  } = useGetJobSeekerByApplicationIdQuery(candidateId || skipToken);

  if (isCandidateLoading) {
    return <DataLoader />;
  }

  if (isCandidateError || !candidate) {
    return <ErrorAlert />;
  }

  const fullName =
    `${candidate.firstname || ""} ${candidate.lastname || ""}`.trim() ||
    candidate.username;
  const age = candidate.dob
    ? `${new Date().getFullYear() - new Date(candidate.dob).getFullYear()} tuổi`
    : "Chưa cập nhật";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nút Quay lại */}
        <button
          onClick={() => window.history.back()}
          className="group mb-6 sm:mb-8 flex items-center text-purple-700 hover:text-purple-900 font-semibold text-base sm:text-lg transition-all duration-200 transform hover:-translate-x-1"
        >
          <ArrowLeft
            size={20}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          Quay lại
        </button>

        {/* HEADER: Avatar + Tên + Nút Chat */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-xl border border-purple-100 mb-8 ring-1 ring-purple-100/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
              <img
                src={getImageUrl(candidate.avatarUrl) || "/default-avatar.png"}
                alt={fullName}
                className="relative w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-4 border-white shadow-xl transition-transform group-hover:scale-105"
              />
            </div>

            {/* Tên + Thông tin cơ bản */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                {fullName}
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                @{candidate.username}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                  {candidate.role === "JOB_SEEKER"
                    ? "Ứng viên"
                    : candidate.role}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    candidate.status === "ACTIVE"
                      ? "text-green-700 bg-green-100"
                      : "text-amber-700 bg-amber-100"
                  }`}
                >
                  {candidate.status === "ACTIVE"
                    ? "Đang hoạt động"
                    : "Tạm khóa"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* THÔNG TIN CƠ BẢN - Grid 4 cột */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="text-purple-600" size={24} />
            Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoItem
              icon={Mail}
              label="Email"
              value={candidate.email}
              href={`mailto:${candidate.email}`}
            />
            <InfoItem
              icon={Phone}
              label="Số điện thoại"
              value={candidate.phone || "Chưa cập nhật"}
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
          </div>
        </div>

        {/* KINH NGHIỆM & HỌC VẤN (Placeholder - bạn có thể mở rộng) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Kinh nghiệm */}
          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="text-teal-600" size={24} />
              Kinh nghiệm làm việc
            </h2>
            <p className="text-gray-600 italic">Chưa có dữ liệu kinh nghiệm</p>
          </div>

          {/* Học vấn */}
          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GraduationCap className="text-purple-600" size={24} />
              Trình độ học vấn
            </h2>
            <p className="text-gray-600 italic">Chưa có dữ liệu học vấn</p>
          </div>
        </div>

        {/* CV / Hồ sơ đính kèm */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="text-purple-600" size={24} />
            Hồ sơ ứng tuyển
          </h2>
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/50">
            <p className="text-gray-500 text-center">
              CV sẽ được hiển thị tại đây khi ứng viên tải lên
            </p>
          </div>
        </div>
      </div>
      {/* Nút Chat */}
      <ChatModal name={fullName} id={candidate.id} color="purple" />
    </div>
  );
};

// Component InfoItem - tái sử dụng
const InfoItem = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.FC<any>;
  label: string;
  value: string | number;
  href?: string;
}) => (
  <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl shadow-sm border border-purple-200/50 hover:shadow-md hover:border-purple-300 transition-all duration-300">
    <div className="p-2.5 bg-white rounded-lg shadow-inner group-hover:shadow group-hover:scale-110 transition-transform">
      <Icon size={20} className="text-purple-600" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-bold text-purple-800 hover:text-purple-600 break-all transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-base font-medium text-gray-800 break-words">
          {value}
        </p>
      )}
    </div>
  </div>
);

export default CandidateDetailPage;
