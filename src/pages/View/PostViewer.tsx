import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Clock,
  Calendar,
} from "lucide-react";
import { formatDateTime, getImageUrl } from "../../utils/helper";
import ImageCarousel from "../../components/UI/ImageCarosel";
import type { JobFormData } from "../../redux/features/postSlice";
import { getFileIconFromName, renderContent } from "../../utils/helpRender";

const formatSalary = (min: string | null, max: string | null) => {
  if (!min && !max) return "Thương lượng";
  if (min && max)
    return `${min.toLocaleString()} - ${max.toLocaleString()} VND`;
  if (min) return `Từ ${min.toLocaleString()} VND`;
  if (max) return `Đến ${max.toLocaleString()} VND`;
  return "Thương lượng";
};

type PostViewerProps = {
  formData: JobFormData;
};

const PostViewer: React.FC<PostViewerProps> = ({ formData }) => {
  const {
    title,
    companyName,
    avatarUrl,
    location,
    type,
    minSalary,
    maxSalary,
    description,
    experience,
    expiredAt,
    imageUrls,
    newImageUrls,
    newDocumentUrls,
    documents,
  } = formData;
  console.log(documents.map((doc) => getImageUrl(doc.fileName)));

  const allImages = [...imageUrls.map(getImageUrl), ...newImageUrls];
  const [currentTab, setCurrentTab] = useState("description");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <header className="bg-white shadow-xl py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={getImageUrl(avatarUrl)}
              alt={companyName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-teal-500 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              Preview
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {title || "Chưa có tiêu đề"}
            </h1>
            <p className="text-xl font-semibold text-teal-600 mt-1">
              {companyName}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-gray-600">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-teal-500" />
                {location.name}
              </span>
              <span className="flex items-center gap-2 font-bold text-lg text-red-600">
                <DollarSign size={18} className="text-red-600" />
                {formatSalary(minSalary, maxSalary)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Nội dung */}
        <div className="space-y-8">
          {/* Carousel */}
          {allImages.length > 0 && <ImageCarousel images={allImages} />}

          {/* Tabs */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 -mb-px">
                {["description", "requirements", "benefits"]?.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`py-3 px-1 font-bold text-lg text-teal-700 ${
                      currentTab === tab ? "border-b-4 border-teal-600" : ""
                    }`}
                  >
                    {tab === "description" && "Mô tả công việc"}
                    {tab === "requirements" && "Yêu cầu"}
                    {tab === "benefits" && "Quyền lợi"}
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-8">
              {renderContent(description || "Chưa có mô tả")}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-8">
          {/* Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-5">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-3 flex items-center gap-2">
              <Building2 size={24} className="text-teal-600" />
              Thông tin công việc
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-4">
                <Briefcase size={22} className="text-teal-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Kinh nghiệm
                  </p>
                  <p className="text-base font-medium">
                    {experience || "Không yêu cầu"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Clock size={22} className="text-teal-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Loại hình
                  </p>
                  <p className="text-base font-medium">{type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Calendar size={22} className="text-teal-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">Hạn nộp</p>
                  <p className="text-base font-bold text-red-600">
                    {expiredAt ? formatDateTime(expiredAt) : "Chưa đặt"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-2xl shadow-xl text-center">
            <h3 className="text-2xl font-bold mb-2">Sẵn sàng ứng tuyển?</h3>
            <p className="text-sm opacity-90">Chỉ mất 1 phút để nộp hồ sơ!</p>
            <button className="mt-4 w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition">
              Ứng tuyển ngay
            </button>
          </div>

          {/* Files đã thêm */}
          <div className="bg-white p-4 pb-6">
            {[...documents, ...newDocumentUrls]?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Tài liệu đã thêm ({documents.length}/5):
                </p>
                {documents?.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2 px-2 text-sm">
                      {getFileIconFromName(document.originalName)}
                      <span className="truncate max-w-xs font-medium">
                        {document.originalName}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                {newDocumentUrls?.map((fileName, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2 px-2 text-sm">
                      {getFileIconFromName(fileName)}
                      <span className="truncate max-w-xs font-medium">
                        {fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostViewer;
