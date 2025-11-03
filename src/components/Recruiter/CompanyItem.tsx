import React from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  User,
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

// Helper Component for structured information display
const InfoPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
    <span className="flex-shrink-0 text-teal-600">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">
        {value || "---"}
      </p>
    </div>
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
      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-50 overflow-hidden transform hover:scale-[1.01]"
    >
      {/* CARD CONTENT */}
      <div className="p-6 space-y-5">
        {/* Header: Logo, Name, Verification Badge */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-100">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <img
              src={company.avatarUrl || defaultAvatar}
              alt={`Logo ${company.companyName}`}
              className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500 p-0.5 shadow-md flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
                e.currentTarget.onerror = null;
              }}
            />
            {/* Name */}
            <div className="mt-1">
              <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">
                {company.companyName}
              </h3>
              <p className="text-sm text-teal-600 font-semibold flex items-center gap-1 mt-0.5">
                <Building2 size={16} /> Ứng tuyển: {company.role}
              </p>
            </div>
          </div>

          {/* Verification Status Badge */}
          <div className="flex-shrink-0 pt-1">
            {company.verified ? (
              <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700 shadow-sm border border-teal-300">
                <ShieldCheck size={16} className="mr-1" /> Đã xác thực
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700 shadow-sm border border-yellow-300">
                <ShieldX size={16} className="mr-1" /> Chưa xác thực
              </span>
            )}
          </div>
        </div>

        {/* Description Block */}
        <div className="pt-2">
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Mô tả tóm tắt:
          </h4>
          <p className="text-base text-gray-700 italic border-l-4 border-teal-500 pl-4 py-1 bg-gray-50 rounded-r-lg">
            {company.description || "Chưa có mô tả chi tiết từ công ty."}
          </p>
        </div>

        {/* Contact Information - Grid Layout */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPill
            icon={<User size={16} />}
            label="Tên đăng nhập"
            value={company.username}
          />
          <InfoPill
            icon={<Mail size={16} />}
            label="Email"
            value={company.email}
          />
          <InfoPill
            icon={<Phone size={16} />}
            label="Điện thoại"
            value={company.phone}
          />
          <InfoPill
            icon={<MapPin size={16} />}
            label="Địa chỉ"
            value={company.address}
          />
        </div>
      </div>

      {/* Contact Button */}
      <div className="px-6 pb-5 pt-3 flex justify-end">
        <a
          href={`mailto:${company.email}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-teal-700 transition"
        >
          <Mail size={16} /> Liên hệ
        </a>
      </div>

      {/* Footer: Dates */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 flex justify-between rounded-b-2xl border-t border-gray-100">
        <div>
          <span className="font-semibold">Ngày tạo:</span> {formattedCreatedAt}
        </div>
        <div>
          <span className="font-semibold">Cập nhật:</span> {formattedUpdatedAt}
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;
