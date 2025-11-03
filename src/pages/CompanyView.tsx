import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  User,
  Search,
  RotateCw,
  Loader,
} from "lucide-react";
import DataLoader from "../components/UI/DataLoader";
import CompanyItem from "../components/Recruiter/CompanyItem";
import { useSearchCompaniesQuery } from "../redux/api/userApiSlice";

// --- Type Definitions ---
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

const CompanyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const size = 6;

  const {
    data: { data: { content: companies = [], totalPages = 1 } = {} } = {},
    isLoading,
  } = useSearchCompaniesQuery({
    search: searchQuery,
    page,
    size,
  });

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight flex items-center gap-3">
        <Building2 className="text-teal-500" size={28} />
        Danh sách Công ty Tuyển dụng
      </h1>

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-3 border border-gray-100">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Nhập tên công ty cần tìm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
          />
        </div>

        {/* Nút Tìm kiếm */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-600 transition duration-200 shadow-md shadow-teal-600/30 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : (
            <Search size={20} />
          )}
          {isLoading ? "Đang tìm..." : "Tìm kiếm"}
        </button>

        {/* Nút Đặt lại */}
        <button
          onClick={handleReset}
          disabled={isLoading || (!searchQuery && !searchTerm)}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-200 disabled:opacity-50"
        >
          <RotateCw size={20} /> Đặt lại
        </button>
      </div>

      {/* Hiển thị danh sách */}
      {isLoading ? (
        <DataLoader />
      ) : !companies || companies.length === 0 ? (
        <p className="text-center text-xl font-medium text-gray-500 p-8 border border-dashed rounded-lg bg-white">
          Không tìm thấy công ty nào phù hợp với từ khóa "{searchQuery}".
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company: Company) => (
            <CompanyItem key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      {companies.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || isLoading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trang trước
          </button>
          <span className="text-sm font-medium text-gray-700">
            Trang <span className="text-teal-500">{page + 1}</span> /{" "}
            {totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1 || isLoading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
