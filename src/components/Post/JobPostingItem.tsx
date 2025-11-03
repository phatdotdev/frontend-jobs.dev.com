import React from "react";
import { MapPin, Calendar, Eye, Heart, DollarSign, Clock } from "lucide-react";
import { useGetPostImageQuery } from "../../redux/api/postApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";

const defaultPostImage =
  "https://placehold.co/600x400/155e75/FFFFFF?text=Job+Cover";

type JobPosting = {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP";
  description: string;
  promotedSalary: number | null;
  location: { id: string; name: string } | null;
  imageNames: string[];
  views: number;
  likes: number;
  expiredAt: string;
};

const typeLabel = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  INTERNSHIP: "Thực tập",
};

const formatSalary = (salary: number | null) =>
  salary ? `${salary.toLocaleString("vi-VN")} VNĐ` : "Thương lượng";

const JobPostingItem: React.FC<{ job: JobPosting }> = ({ job }) => {
  const {
    id,
    title,
    type,
    description,
    promotedSalary,
    location,
    imageNames,
    views,
    likes,
    expiredAt,
  } = job;

  const { data: imageUrl } = useGetPostImageQuery(
    imageNames?.length ? { postId: id, imageName: imageNames[0] } : skipToken
  );

  const expiryDate = new Date(expiredAt);
  const isExpired = expiryDate.getTime() < Date.now();
  const expiryDateString = expiryDate.toLocaleDateString("vi-VN");

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden border ${
        isExpired ? "border-red-300 opacity-80" : "border-gray-100"
      } hover:shadow-lg transition duration-300 ease-in-out cursor-pointer`}
    >
      {/* Ảnh */}
      <div className="relative">
        <img
          src={imageUrl || defaultPostImage}
          alt={`Ảnh cho ${title}`}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultPostImage;
            e.currentTarget.onerror = null;
          }}
        />
        <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {typeLabel[type]}
        </span>
      </div>

      {/* Nội dung */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-teal-800 line-clamp-2 hover:text-teal-600 transition">
          {title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        <div className="flex items-center text-sm text-gray-700 gap-x-4 flex-wrap border-t pt-2">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-teal-500" />
              {location.name}
            </span>
          )}
          <span
            className={`flex items-center gap-1 ${
              isExpired ? "text-red-600" : "text-gray-600"
            }`}
          >
            {isExpired ? (
              <>
                <Clock size={16} /> Đã hết hạn
              </>
            ) : (
              <>
                <Calendar size={16} /> Hạn nộp: {expiryDateString}
              </>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
          <span className="flex items-center gap-1 font-medium text-cyan-700">
            <DollarSign size={16} /> {formatSalary(promotedSalary)}
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Eye size={16} className="text-teal-400" />
              {views.toLocaleString("vi-VN")}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={16} className="text-red-400" fill="currentColor" />
              {likes.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingItem;
