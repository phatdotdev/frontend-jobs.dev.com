import React, { useState } from "react";
import { Building2, Search, RotateCw, Loader } from "lucide-react";
import { useSearchCompaniesQuery } from "../../redux/api/apiUserSlice";
import DataLoader from "../../components/UI/DataLoader";
import CompanyItem from "../../components/Recruiter/CompanyItem";

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

const CompanyView: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 space-y-10">
      <h1 className="text-4xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
        <Building2 className="text-teal-600 w-8 h-8" />
        <span className="text-teal-600">Tìm kiếm</span> Doanh nghiệp
      </h1>

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
        {/* Input Field */}
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Tìm kiếm công ty, vị trí, hoặc từ khóa..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                       transition duration-200 placeholder-gray-500 text-gray-800 shadow-inner"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-teal-500 text-white px-8 py-2.5 rounded-xl font-bold 
                   hover:bg-teal-700 transition duration-200 disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : (
            <Search size={20} />
          )}
          {isLoading ? "Đang tìm..." : "Tìm kiếm"}
        </button>

        {/* Nút Đặt lại (Reset) */}
        <button
          onClick={handleReset}
          disabled={isLoading || (!searchQuery && !searchTerm)}
          // 🎯 Nút phụ: Thiết kế tối giản, viền nhẹ
          className="flex items-center justify-center gap-2 bg-white text-gray-600 px-6 py-2.5 rounded-xl font-semibold 
                   border border-gray-300 hover:bg-gray-100 transition duration-200 disabled:opacity-50"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default CompanyView;
