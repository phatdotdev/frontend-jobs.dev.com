import React, { useMemo } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  DollarSign,
  Pencil,
  Trash2,
  ExternalLink,
  Clock,
  Settings,
} from "lucide-react";
import { useGetPostImageQuery } from "../../redux/api/postApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";

const defaultPostImage =
  "https://placehold.co/600x400/155e75/FFFFFF?text=Job+Cover";

type JobPosting = {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP";
  description: string;
  requirements: string;
  benefits: string;
  promotedSalary: number | null;
  location: { id: string; name: string } | null;
  imageNames: string[];
  views: number;
  likes: number;
  state: string;
  expiredAt: string;
  createdAt: string;
};

type Props = {
  job: JobPosting;
  showActions: boolean;
};

const stateLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đang hoạt động",
  ARCHIVED: "Đã lưu trữ",
};

const getStateClasses = (state: string) => {
  switch (state) {
    case "DRAFT":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "PUBLISHED":
      return "bg-teal-100 text-teal-800 border-teal-300";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const JobPostingCard: React.FC<Props> = ({ job, showActions }) => {
  if (!job) return null;
  const {
    id,
    title,
    type,
    description,
    promotedSalary,
    location,
    imageNames,
    views,
    state,
    likes,
    expiredAt,
  } = job;

  const typeLabel = {
    FULL_TIME: "Toàn thời gian",
    PART_TIME: "Bán thời gian",
    INTERNSHIP: "Thực tập",
  };

  const { data: imageUrl } = useGetPostImageQuery(
    imageNames
      ? {
          postId: id,
          imageName: imageNames[0],
        }
      : skipToken
  );

  const expiryDate = new Date(expiredAt);
  const isExpired = expiryDate.getTime() < Date.now() && state === "PUBLISHED"; // Chỉ coi là hết hạn nếu trạng thái là PUBLISHED
  const expiryDateString = expiryDate.toLocaleDateString("vi-VN");

  const formatSalary = (salary: number | null) => {
    if (salary === null) return "Thương lượng";
    return salary.toLocaleString("vi-VN") + " VNĐ";
  };

  const stateClasses = getStateClasses(state);

  return (
    <div
      className={`
      bg-white rounded-2xl shadow-xl overflow-hidden 
      transform hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer
      ${
        isExpired
          ? "border-2 border-red-400 opacity-90"
          : "border-2 border-teal-100 hover:scale-[1.03]"
      }
    `}
    >
      {/* 1. Khu vực hình ảnh và Badges */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Hình ảnh cho ${title}`}
          className="w-full h-40 object-cover brightness-95"
          onError={(e) => {
            e.currentTarget.src = defaultPostImage;
            e.currentTarget.onerror = null;
          }}
        />

        {/* Thông tin nổi bật: Lương & Loại hình */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8 flex justify-between items-end">
          {/* Lương: Nổi bật bằng màu vàng sáng/cyan */}
          <span className="flex items-center text-lg font-extrabold text-cyan-300 drop-shadow-lg">
            <DollarSign size={20} className="mr-1" />
            {promotedSalary ? formatSalary(promotedSalary) : "Thương lượng"}
          </span>
          {/* Loại hình: Teal đậm */}
          <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {typeLabel[type]}
          </span>
        </div>
      </div>

      {/* 2. Khu vực nội dung */}
      <div className="p-5 space-y-3">
        {/* Tiêu đề */}
        <h3 className="text-xl font-extrabold text-slate-800 line-clamp-2 leading-snug hover:text-teal-600 transition mb-2">
          {title}
        </h3>

        {/* TRẠNG THÁI (MỚI: Đặt ngay dưới tiêu đề) */}
        <span
          className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border shadow-sm transition-all ${stateClasses}`}
        >
          {stateLabel[state] || state}
        </span>

        {/* Thông tin chính (Location & Deadline) */}
        <div className="flex items-center text-sm text-gray-700 gap-x-4 gap-y-2 flex-wrap pt-2 pb-3 border-b border-gray-100">
          {location && (
            <span className="flex items-center gap-1 font-medium text-gray-600">
              <MapPin size={16} className="text-teal-500" /> {location.name}
            </span>
          )}

          <span
            className={`flex items-center gap-1 font-medium ${
              isExpired ? "text-red-600" : "text-gray-600"
            }`}
          >
            {isExpired ? (
              <>
                <Clock size={16} className="text-red-500" /> Đã HẾT HẠN
              </>
            ) : (
              <>
                <Calendar size={16} className="text-gray-400" /> Hạn nộp:{" "}
                {expiryDateString}
              </>
            )}
          </span>
        </div>

        {/* Mô tả ngắn */}
        <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
          {description || "Không có mô tả ngắn."}
        </p>

        {/* Lượt xem & Lượt thích */}
        <div className="flex items-center justify-start gap-4 text-sm text-gray-500 pt-1 border-t border-gray-50">
          <span className="flex items-center gap-1 font-medium">
            <Eye size={16} className="text-teal-400" />
            {views.toLocaleString("vi-VN")}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Heart size={16} className="text-red-400" fill="currentColor" />
            {likes.toLocaleString("vi-VN")}
          </span>
        </div>

        {/* 3. Khu vực Hành động */}
        {showActions && (
          <div className="pt-4 flex flex-col gap-3">
            {/* KHU VỰC QUẢN LÝ TRẠNG THÁI (Tách biệt) */}
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center text-sm font-semibold text-teal-700">
                <Settings size={16} className="mr-2" /> Quản lý Trạng thái:
              </div>
              <select
                className="text-sm border border-teal-400 bg-white rounded px-2 py-1 text-gray-700 focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) =>
                  console.log("Chuyển sang trạng thái:", e.target.value)
                }
                defaultValue={state}
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đang hoạt động</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>

            {/* KHU VỰC HÀNH ĐỘNG KHÁC */}
            <div className="flex justify-end gap-3 pt-2">
              {/* Nút Xem Chi Tiết */}
              <button
                className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-800 transition duration-200"
                onClick={() => console.log("Xem chi tiết", id)}
              >
                <ExternalLink size={16} /> Xem
              </button>

              {/* Nút Chỉnh Sửa */}
              <button
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition duration-200"
                onClick={() => console.log("Chỉnh sửa", id)}
              >
                <Pencil size={16} /> Sửa
              </button>

              {/* Nút Xóa */}
              <button
                className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-800 transition duration-200"
                onClick={() => console.log("Xóa", id)}
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingCard;
