import React from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Link,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  OctagonAlert,
  Building2,
  Users,
  Calendar,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetRecruiterByIdQuery } from "../../redux/api/apiUserSlice";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { getImageUrl } from "../../utils/helper";
import { useGetRecentPostByRecruiterQuery } from "../../redux/api/apiPostSlice";
import JobPostingItem from "../../components/Post/JobPostingCard";
import ChatModal from "../../components/Modal/ChatModal";

const CompanyDetailPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();

  const {
    data: { data: company } = {},
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useGetRecruiterByIdQuery(companyId || skipToken);

  const { data: { data: jobs } = {}, isLoading: postLoading } =
    useGetRecentPostByRecruiterQuery(companyId || skipToken);

  if (isCompanyLoading || postLoading) return <DataLoader />;
  if (isCompanyError || !company) return <ErrorAlert />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nút Quay lại */}
        <button
          onClick={() => window.history.back()}
          className="group mb-6 sm:mb-8 flex items-center text-teal-700 hover:text-teal-900 font-semibold text-base sm:text-lg transition-all duration-200 transform hover:-translate-x-1"
        >
          <ArrowLeft
            size={20}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          Quay lại
        </button>

        {/* HEADER: Logo + Tên + Xác minh + Chat */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-xl border border-teal-100 mb-8 ring-1 ring-teal-100/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
              <img
                src={getImageUrl(company.avatarUrl) || "/default-company.png"}
                alt={company.companyName}
                className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain bg-white border-4 border-white rounded-2xl p-3 shadow-xl transition-transform group-hover:scale-105"
              />
            </div>

            {/* Tên công ty + Xác minh */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  {company.companyName || company.username}
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  @{company.username}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {company.verified ? (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-700 text-sm font-bold shadow-sm">
                    <BadgeCheck size={16} className="text-emerald-600" />
                    Đã xác minh
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-sm font-bold shadow-sm">
                    <OctagonAlert size={16} className="text-amber-600" />
                    Chưa xác minh
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* THÔNG TIN LIÊN HỆ */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-teal-100 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2">
            <Building2 className="text-teal-600" size={24} />
            Thông tin doanh nghiệp
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <InfoItem
              icon={Mail}
              label="Email"
              value={company.email}
              href={`mailto:${company.email}`}
            />
            <InfoItem
              icon={Phone}
              label="Điện thoại"
              value={company.phone || "Chưa cập nhật"}
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
              value={company.website || "Chưa cập nhật"}
              href={company.website}
            />
          </div>
        </div>

        {/* MÔ TẢ DOANH NGHIỆP */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-teal-100 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2">
            <FileText className="text-teal-600" size={24} />
            Giới thiệu doanh nghiệp
          </h2>
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
            {company.description ||
              "Doanh nghiệp chưa cập nhật phần giới thiệu."}
          </p>
        </div>

        {/* BÀI TUYỂN DỤNG GẦN ĐÂY */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-teal-100">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2">
            <FileText className="text-teal-600" size={24} />
            Bài tuyển dụng gần đây
          </h2>

          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job: any) => (
                <div
                  key={job.id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden"
                >
                  <JobPostingItem job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-teal-50 border-2 border-dashed border-teal-200 rounded-2xl p-8">
                <p className="text-teal-600 font-medium">
                  Chưa có bài tuyển dụng nào
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatModal
        name={company.companyName || company.username}
        id={company.id}
      />
    </div>
  );
};

// InfoItem Component - đồng bộ màu teal
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
  <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-sm border border-teal-200/50 hover:shadow-md hover:border-teal-300 transition-all duration-300">
    <div className="p-2.5 bg-white rounded-lg shadow-inner group-hover:shadow group-hover:scale-110 transition-transform">
      <Icon size={20} className="text-teal-600" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-bold text-teal-800 hover:text-teal-600 break-all transition-colors"
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

export default CompanyDetailPage;
