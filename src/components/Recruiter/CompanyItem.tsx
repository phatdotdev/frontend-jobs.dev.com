import React from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  Calendar,
} from "lucide-react";

type Company = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  companyName: string;
  description: string;
  phone: string;
  address: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
};

const defaultAvatar = "https://placehold.co/80x80/009688/ffffff?text=LOGO";

// Helper Component cho hiển thị thông tin, tối giản hóa
const InfoPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  // Thiết kế InfoPill nhỏ gọn, chỉ hiển thị label và value trên hai dòng
  <div className="flex flex-col p-2 rounded-lg transition duration-150 border border-gray-200 bg-white hover:bg-gray-50">
    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 uppercase tracking-wider mb-0.5">
      <span className="text-teal-500">{icon}</span> {label}
    </p>
    <p className="text-sm font-semibold text-gray-800 truncate">
      {value || "---"}
    </p>
  </div>
);

const CompanyItem = ({ company }: { company: Company }) => {
  const formattedCreatedAt = new Date(company.createdAt).toLocaleDateString(
    "vi-VN"
  );
  const formattedUpdatedAt = new Date(company.updatedAt).toLocaleDateString(
    "vi-VN"
  );

  return (
    <div
      key={company.id}
      className="bg-white rounded-xl shadow-md transition duration-300 border border-gray-100 overflow-hidden transform hover:shadow-lg"
    >
      {/* CARD CONTENT */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Header: Logo, Name, Verification Badge (Gọn gàng) */}
        <div className="flex justify-between items-start pb-3 border-b border-gray-100">
          <div className="flex items-start gap-3">
            {/* Logo - Kích thước nhỏ gọn */}
            <img
              src={company.avatarUrl || defaultAvatar}
              alt={`Logo ${company.companyName}`}
              className="w-14 h-14 rounded-xl object-cover border-2 border-teal-400 p-0.5 shadow-sm flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
                e.currentTarget.onerror = null;
              }}
            />
            {/* Name và Metadata */}
            <div className="mt-0.5 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {company.companyName}
              </h3>
              <p className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-0.5 truncate">
                <Building2 size={14} /> {company.role} | ID:{" "}
                {company.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          {/* Verification Status Badge - Nhỏ gọn và tối giản */}
          <div className="flex-shrink-0 pt-1">
            {company.verified ? (
              <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                <ShieldCheck size={14} className="mr-1" /> Đã xác thực
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                <ShieldX size={14} className="mr-1" /> Chưa xác thực
              </span>
            )}
          </div>
        </div>

        {/* Description Block - Tối giản */}
        <div className="pt-1">
          <h4 className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
            Mô tả tóm tắt:
          </h4>
          <p className="text-sm text-gray-700 italic border-l-2 border-teal-500 pl-3 py-1">
            {company.description || "Chưa có mô tả chi tiết từ công ty."}
          </p>
        </div>

        {/* Contact Information - Grid 2 cột, InfoPill mới */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPill
            icon={<Mail size={14} />}
            label="Email Liên hệ"
            value={company.email}
          />
          <InfoPill
            icon={<Phone size={14} />}
            label="Điện thoại"
            value={company.phone}
          />
          <InfoPill
            icon={<MapPin size={14} />}
            label="Địa chỉ"
            value={company.address}
          />
          <InfoPill
            icon={<Calendar size={14} />}
            label="Ngày tạo"
            value={formattedCreatedAt}
          />
        </div>
      </div>

      {/* Footer: Contact Button (Sử dụng không gian footer để đặt nút) */}
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center rounded-b-xl border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Cập nhật:{" "}
          <span className="font-semibold text-gray-700">
            {formattedUpdatedAt}
          </span>
        </p>
        <a
          href={`mailto:${company.email}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-teal-600 transition"
          aria-label={`Liên hệ với ${company.companyName} qua email`}
        >
          <Mail size={16} /> Liên hệ
        </a>
      </div>
    </div>
  );
};

export default CompanyItem;
