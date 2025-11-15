import React, { useState } from "react";
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
  MessageCircle,
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
    useGetRecentPostByRecruiterQuery(companyId);

  if (isCompanyLoading || postLoading) {
    return <DataLoader />;
  }

  if (isCompanyError || !company) {
    return <ErrorAlert />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Nút Quay lại - Nâng cấp hiệu ứng */}
        <button
          onClick={() => window.history.back()}
          className="group mb-8 flex items-center text-teal-700 hover:text-teal-900 font-semibold text-lg transition-all duration-200 transform hover:-translate-x-1"
        >
          <ArrowLeft
            size={22}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          Quay lại
        </button>

        {/* 1. HEADER & THÔNG TIN CƠ BẢN CÔNG TY */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-teal-100 mb-12 ring-1 ring-teal-100/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Logo - Nâng cấp viền và hiệu ứng */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <img
                src={getImageUrl(company.avatarUrl)}
                alt={`Logo ${company.companyName}`}
                className="relative w-32 h-32 object-contain bg-white border-2 border-teal-200 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105"
              />
            </div>

            {/* Tên và Xác minh */}
            <div className="flex justify-between items-center flex-1">
              <h1 className="text-4xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent leading-tight">
                {company.companyName || company.username}
              </h1>
              <div className="flex items-center gap-3">
                {company.verified ? (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100/80 border border-emerald-400 rounded-full text-emerald-700 text-sm font-bold shadow-sm">
                    <BadgeCheck size={16} className="text-emerald-600" />
                    Đã xác minh
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100/80 border border-amber-400 rounded-full text-amber-700 text-sm font-bold shadow-sm">
                    <OctagonAlert size={16} className="text-amber-600" />
                    Chưa xác minh
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="my-8 border-t border-teal-100/60" />

          {/* Thông tin liên hệ - Grid đẹp hơn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <InfoItem
              icon={Mail}
              label="Email liên hệ"
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

        {/* 2. MÔ TẢ CHI TIẾT CÔNG TY */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-gray-100 mb-12 ring-1 ring-gray-200/50">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-teal-800 mb-6 pb-3 border-b-2 border-teal-500/20">
            <FileText className="text-teal-600" />
            Mô tả doanh nghiệp
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
            {company.description || "Chưa cập nhật mô tả doanh nghiệp."}
          </p>
        </div>

        {/* 3. BÀI VIẾT TUYỂN DỤNG */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-gray-100 ring-1 ring-gray-200/50">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-teal-800 mb-6 pb-3 border-b-2 border-teal-500/20">
            <FileText className="text-teal-600" />
            Bài tuyển dụng gần đây
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs?.length === 0 ? (
              <div className="col-span-full">
                <ErrorAlert content="Chưa có bài tuyển dụng nào gần đây" />
              </div>
            ) : (
              jobs?.map((job: any, index: number) => (
                <div
                  key={index}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <JobPostingItem job={job} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ChatModal
        name={company.companyName || company.username}
        id={company.id}
      />
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
  value: string | number;
  href?: string;
}) => (
  <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl shadow-sm border border-teal-200/50 hover:shadow-md hover:border-teal-300 transition-all duration-300">
    <div className="p-2.5 bg-white rounded-lg shadow-inner group-hover:shadow group-hover:scale-110 transition-transform">
      <Icon size={22} className="text-teal-600" />
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
        <p className="text-base font-bold text-gray-800 break-words">{value}</p>
      )}
    </div>
  </div>
);

export default CompanyDetailPage;
