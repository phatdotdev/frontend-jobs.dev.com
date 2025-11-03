import React from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Users,
  Link,
  Loader2,
  ArrowLeft,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";

// --- Giả định các Hooks RTK Query của bạn ---
// import { useGetCompanyDetailQuery, useGetCompanyJobPostingsQuery } from "../../redux/api/companyApiSlice";
// import JobPostingCard from './JobPostingCard'; // Component đã cải tiến ở trên

// --- Khai báo Types (Giả định) ---
type CompanyDetail = {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  size: number;
  website: string;
  address: string;
  description: string;
  email: string;
  phone: string;
};

// Sử dụng Type đã có từ component trước
type JobPosting = {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP";
  promotedSalary: number | null;
  location: { id: string; name: string } | null;
  imageNames: string[];
  views: number;
  likes: number;
  expiredAt: string;
  description: string; // Thêm vào để dùng trong JobPostingCard (nếu cần)
  // ... các trường khác
};

// --- MOCK DATA và Hooks giả định (Bạn cần thay thế bằng Hooks RTK thật) ---
const mockCompany: CompanyDetail = {
  id: "comp1",
  name: "AgriTech Solutions VN",
  logoUrl: "https://via.placeholder.com/150/20B2AA/FFFFFF?text=AT",
  industry: "Công nghệ Nông nghiệp (AgriTech)",
  size: 55,
  website: "https://agritech.vn",
  address: "Tầng 10, Tòa nhà Innovation, TP.HCM",
  description:
    "AgriTech Solutions là công ty tiên phong trong việc áp dụng Trí tuệ Nhân tạo (AI) và Big Data vào sản xuất nông nghiệp thông minh tại Việt Nam, với mục tiêu tối ưu hóa năng suất và giảm thiểu rủi ro cho người nông dân.",
  email: "hr@agritech.vn",
  phone: "0901 234 567",
};

const mockJobs: JobPosting[] = [
  {
    id: "job1",
    title: "Kỹ sư AI nhận diện bệnh cây trồng",
    type: "FULL_TIME",
    promotedSalary: 25000000,
    location: { id: "loc1", name: "TP.HCM" },
    imageNames: ["img1"],
    views: 120,
    likes: 15,
    expiredAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    description:
      "Phát triển các mô hình học sâu (Deep Learning) cho hệ thống nhận dạng và phân loại bệnh thực vật...",
  },
  {
    id: "job2",
    title: "Thực tập sinh Marketing Nông nghiệp",
    type: "INTERNSHIP",
    promotedSalary: 4000000,
    location: { id: "loc2", name: "Hà Nội" },
    imageNames: ["img2"],
    views: 80,
    likes: 5,
    expiredAt: new Date(Date.now() + 86400000 * 60).toISOString(),
    description:
      "Hỗ trợ đội ngũ Marketing trong việc xây dựng nội dung số và quản lý các chiến dịch truyền thông trên mạng xã hội...",
  },
  // ... thêm nhiều bài đăng khác
];

const useGetCompanyDetailQuery = (companyId: string) => ({
  data: mockCompany,
  isLoading: false,
  isError: false,
});
const useGetCompanyJobPostingsQuery = (companyId: string) => ({
  data: mockJobs,
  isLoading: false,
  isError: false,
});

// Giả định JobPostingCard component (Cần được import thật nếu không mock)
const JobPostingCard = ({ job }: { job: JobPosting }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
    <h4 className="text-lg font-bold text-teal-700">{job.title}</h4>
    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-3">
      <span className="flex items-center gap-1">
        <Briefcase size={14} /> {job.type.replace("_", " ")}
      </span>
      {job.location && (
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location.name}
        </span>
      )}
    </div>
    <p className="text-teal-600 font-semibold mt-2">
      {job.promotedSalary
        ? `${job.promotedSalary.toLocaleString("vi-VN")} VND`
        : "Lương thỏa thuận"}
    </p>
  </div>
);
// --- Hết MOCK ---

const CompanyDetailPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>(); // Lấy ID từ URL

  // Lấy dữ liệu công ty
  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useGetCompanyDetailQuery(companyId || skipToken);

  // Lấy danh sách bài tuyển dụng
  const {
    data: jobPostings,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useGetCompanyJobPostingsQuery(companyId || skipToken);

  if (isCompanyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="ml-3 text-lg text-teal-600">
          Đang tải thông tin công ty...
        </p>
      </div>
    );
  }

  if (isCompanyError || !company) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center mt-10">
        <p className="text-2xl font-bold text-red-600">
          ❌ Không tìm thấy thông tin công ty!
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 flex items-center justify-center mx-auto text-teal-600 hover:text-teal-800 transition"
        >
          <ArrowLeft size={20} className="mr-1" /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Nút Quay lại */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center text-teal-600 hover:text-teal-800 font-medium transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Quay lại
        </button>

        {/* 1. HEADER & THÔNG TIN CƠ BẢN CÔNG TY */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-teal-100 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <img
              src={company.logoUrl}
              alt={`Logo ${company.name}`}
              className="w-28 h-28 object-contain border border-gray-200 rounded-lg p-2 shadow-inner"
            />

            {/* Tên và Mô tả ngắn */}
            <div>
              <h1 className="text-4xl font-extrabold text-teal-800 mb-1">
                {company.name}
              </h1>
              <p className="text-gray-600 text-lg">
                <Building size={18} className="inline mr-1 text-teal-500" />{" "}
                {company.industry}
              </p>
            </div>
          </div>

          <hr className="my-6 border-teal-100" />

          {/* Chi tiết liên hệ và quy mô */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
            <InfoItem icon={MapPin} label="Địa chỉ" value={company.address} />
            <InfoItem
              icon={Users}
              label="Quy mô"
              value={`${company.size}+ nhân viên`}
            />
            <InfoItem
              icon={Link}
              label="Website"
              value={company.website}
              href={company.website}
            />
            <InfoItem
              icon={Mail}
              label="Email HR"
              value={company.email}
              href={`mailto:${company.email}`}
            />
            <InfoItem
              icon={Phone}
              label="Điện thoại"
              value={company.phone}
              href={`tel:${company.phone}`}
            />
          </div>
        </div>

        {/* 2. MÔ TẢ CHI TIẾT CÔNG TY */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold text-teal-700 mb-4 border-b pb-2 border-teal-100">
            📖 Về {company.name}
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {company.description}
          </p>
        </div>

        {/* 3. CÁC BÀI TUYỂN DỤNG HIỆN TẠI */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-teal-800 mb-6 flex items-center gap-2">
            <Briefcase size={28} />{" "}
            {jobPostings && jobPostings.length > 0
              ? `Các vị trí đang tuyển (${jobPostings.length})`
              : "Hiện không có vị trí nào đang tuyển"}
          </h2>

          {isJobsLoading ? (
            <div className="text-center p-6 bg-white rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin inline text-teal-500" />{" "}
              Đang tải bài đăng...
            </div>
          ) : isJobsError || !jobPostings ? (
            <p className="text-red-500 p-4 bg-red-50 rounded-lg">
              Không thể tải danh sách tuyển dụng.
            </p>
          ) : jobPostings.length === 0 ? (
            <p className="text-gray-500 italic p-6 bg-white rounded-lg shadow-sm">
              Công ty hiện chưa có bài tuyển dụng nào đang hoạt động.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobPostings.map((job) => (
                // Thay thế bằng component JobPostingCard thật của bạn
                <JobPostingCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Component: Dùng để hiển thị từng mục thông tin nhỏ
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
  <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg shadow-sm">
    <Icon size={20} className="text-teal-600 flex-shrink-0" />
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-700 hover:text-teal-600 break-all"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-semibold text-gray-800 break-words">
          {value}
        </p>
      )}
    </div>
  </div>
);

export default CompanyDetailPage;
