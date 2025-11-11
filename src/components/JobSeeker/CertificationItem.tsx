// CertificationItem.tsx
import React, { type FC } from "react";
import {
  Award,
  ShieldCheck,
  Calendar,
  Info,
  Link,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import type { CertificationProps } from "../../types/ResumeProps"; // Giả định đường dẫn type

interface CertificationItemProps {
  certification: CertificationProps;
}

const CertificationItem: FC<CertificationItemProps> = ({ certification }) => (
  // Sử dụng nền màu vàng nhạt và border màu vàng gold cho Chứng chỉ
  <div className="mb-4 p-5 border-l-4 border-yellow-500 bg-yellow-50/50 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
    {/* Tên chứng chỉ và Đơn vị cấp */}
    <div className="flex justify-between items-start mb-3 border-b pb-2 border-yellow-200">
      <div>
        <h4 className="text-xl font-extrabold text-yellow-800">
          <Award size={20} className="inline mr-2 text-yellow-600" />
          {certification.name}
        </h4>
        <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
          <ShieldCheck size={16} className="mr-2 text-yellow-600" />
          {certification.issuer}
        </p>
      </div>
    </div>

    {/* Thông tin Ngày cấp, Hết hạn và ID */}
    <div className="text-sm text-gray-700 space-y-2">
      <div className="flex flex-wrap items-center gap-4">
        {/* Ngày cấp */}
        <p className="flex items-center font-medium">
          <Calendar size={14} className="mr-2 text-yellow-600" />
          Cấp ngày:{" "}
          <span className="ml-1 font-semibold">{certification.issueDate}</span>
        </p>

        {/* Ngày hết hạn */}
        {certification.expirationDate && (
          <p className="flex items-center font-medium text-red-600">
            <Clock size={14} className="mr-2 text-red-500" />
            Hết hạn:{" "}
            <span className="ml-1 font-semibold">
              {certification.expirationDate}
            </span>
          </p>
        )}
      </div>

      {/* Credential ID */}
      {certification.credentialId && (
        <p className="flex items-center text-xs font-medium bg-yellow-100 p-1 rounded">
          <ClipboardCheck size={14} className="mr-2 text-yellow-700" />
          Credential ID:{" "}
          <span className="ml-1 font-semibold text-gray-800">
            {certification.credentialId}
          </span>
        </p>
      )}

      {/* Credential URL */}
      {certification.credentialUrl && (
        <p className="flex items-center">
          <Link size={14} className="mr-2 text-blue-500" />
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium text-sm"
            title="Xem chứng chỉ trực tuyến"
          >
            Xem Chứng chỉ (Link)
          </a>
        </p>
      )}
    </div>

    {/* Mô tả chi tiết */}
    {certification.description && (
      <div className="pt-3 mt-3 border-t border-yellow-100">
        <p className="font-semibold text-gray-700 mb-1 flex items-center">
          <Info size={14} className="mr-2 text-gray-500" />
          Mô tả:
        </p>
        {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
        <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-yellow-300 pl-3 ml-1">
          {certification.description}
        </p>
      </div>
    )}
  </div>
);

export default CertificationItem;
