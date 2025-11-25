import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Link,
  Building2,
  Users,
  Calendar,
  BadgeCheck,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetRecruiterByIdQuery } from "../../redux/api/apiUserSlice";
import { useGetRecentPostByRecruiterQuery } from "../../redux/api/apiPostSlice";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { getImageUrl } from "../../utils/helper";
import JobPostingItem from "../../components/Post/JobPostingCard";
import ChatModal from "../../components/Modal/ChatModal";
import { format } from "date-fns";

const CompanyDetailPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: companyRes,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useGetRecruiterByIdQuery(companyId || skipToken);

  const { data: jobsRes, isLoading: isJobsLoading } =
    useGetRecentPostByRecruiterQuery(companyId || skipToken);

  const company = companyRes?.data;
  const jobs = jobsRes?.data || [];

  if (isCompanyLoading || isJobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DataLoader />
      </div>
    );
  }

  if (isCompanyError || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorAlert content="Không tìm thấy doanh nghiệp này" />
      </div>
    );
  }

  const joinDate = company.createdAt
    ? format(new Date(company.createdAt), "dd 'tháng' MM, yyyy")
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

        {/* Header: Cover + Logo + Tên + Verified */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          {/* Cover Image */}
          <div className="h-56 sm:h-72 relative">
            {company.coverUrl ? (
              <img
                src={getImageUrl(company.coverUrl)}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-teal-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Logo + Info */}
          <div className="relative -mt-20 sm:-mt-32 px-6 pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition" />
                <div className="relative bg-white p-4 rounded-full shadow-2xl">
                  <img
                    src={
                      getImageUrl(company.avatarUrl) || "/default-company.png"
                    }
                    alt={company.companyName}
                    className="w-36 h-36 sm:w-48 sm:h-48 object-contain rounded-full"
                  />
                </div>
                {company.verified && (
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <BadgeCheck size={28} className="text-white" />
                  </div>
                )}
              </div>

              {/* Tên + Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
                  {company.companyName || company.username}
                </h1>
                <p className="text-2xl text-white/90 font-medium mt-2">
                  Nhà tuyển dụng
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
                  <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white font-bold rounded-full text-sm">
                    {company.verified ? "Đã xác minh" : "Chưa xác minh"}
                  </span>
                  <span className="px-5 py-2 bg-green-500 text-white font-bold rounded-full text-sm flex items-center gap-2">
                    <Users size={18} />
                    {jobs.length} tin đang tuyển
                  </span>
                </div>
              </div>

              {/* Chat Button */}
              <div className="sm:ml-auto">
                <ChatModal
                  name={company.companyName || company.username}
                  id={company.id}
                  color="teal"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cột trái: Thông tin & Giới thiệu */}
          <div className="lg:col-span-3 space-y-8">
            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Building2 className="text-indigo-600" size={28} />
                Thông tin doanh nghiệp
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={company.email}
                  href={`mailto:${company.email}`}
                />
                <InfoItem
                  icon={Phone}
                  label="Điện thoại"
                  value={company.phone || "Chưa cung cấp"}
                  href={company.phone ? `tel:${company.phone}` : undefined}
                />
                <InfoItem
                  icon={MapPin}
                  label="Địa chỉ"
                  value={company.address || "Chưa cập nhật"}
                />
                <InfoItem
                  icon={Link}
                  label="Website"
                  value={company.website || "Chưa có"}
                  href={company.website}
                />
                <InfoItem
                  icon={Calendar}
                  label="Tham gia từ"
                  value={joinDate}
                />
                <InfoItem
                  icon={Users}
                  label="Quy mô"
                  value={
                    company.companySize
                      ? `${company.companySize} nhân sự`
                      : "Chưa cập nhật"
                  }
                />
              </div>
            </div>

            {/* Giới thiệu */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="text-teal-600" size={28} />
                Giới thiệu doanh nghiệp
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {company.description ? (
                  <p className="whitespace-pre-wrap">{company.description}</p>
                ) : (
                  <p className="italic text-gray-500">
                    Doanh nghiệp chưa cập nhật phần giới thiệu.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Tin tuyển dụng gần đây */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="text-indigo-600" size={28} />
                Tin tuyển dụng gần đây
              </h2>

              {jobs.length > 0 ? (
                <div className="space-y-5">
                  {jobs.slice(0, 4).map((job: any) => (
                    <JobPostingItem key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-10">
                    <p className="text-gray-600 font-medium">
                      Chưa có tin tuyển dụng nào
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoItem – đồng bộ với Expert page
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
          className="text-lg font-bold text-indigo-800 hover:underline break-words"
        >
          {value.slice(0, 20)}
          {value.length > 20 && "..."}
        </a>
      ) : (
        <p className="text-lg font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default CompanyDetailPage;
