import React, { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Loader,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useSearchJobPostingsQuery } from "../../redux/api/apiPostSlice";
import DataLoader from "../../components/UI/DataLoader";
import JobPostingCard from "../../components/Post/JobPostingCard";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";

type JobPosting = {
  id: string;
  title: string;
  companyName: string;
  location: { id: string; name: string };
  salary: number;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  createdAt: string;
  avatarUrl: string;
};
type SearchParams = {
  keyword: string;
  salary: number | undefined;
  locationId: string;
  type: string;
  page: number;
  size: number;
};

const JobView: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    locationId: "",
    type: "",
    salary: undefined,
    page: 0,
    size: 9,
  });

  const { data: locationResponse } = useGetAllLocationsQuery();
  const locations = locationResponse?.data || [];

  const { data, isLoading, isError } = useSearchJobPostingsQuery(searchParams);

  const handleChange = (field: keyof SearchParams, value: any) => {
    if (field === "salary") {
      value = value === "" ? undefined : Number(value);
    }
    setSearchParams((prev) => ({ ...prev, [field]: value, page: 0 }));
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      locationId: "",
      type: "",
      salary: undefined,
      page: 0,
      size: 9,
    });
  };

  const hasFilters =
    searchParams.keyword ||
    searchParams.locationId ||
    searchParams.type ||
    searchParams.salary;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 space-y-10">
      {/* HEADER */}
      <h1 className="text-4xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
        <Briefcase className="text-teal-600 w-8 h-8" />
        <span className="text-teal-600">Tìm kiếm</span> Công việc
      </h1>

      {/* --- */}
      {/* Thanh tìm kiếm chính - 4 ô đẹp */}
      <div className="max-w-8xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-12">
        <div className="space-y-6">
          {/* 1. Từ khóa công việc - nổi bật nhất */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-teal-600" />
            <input
              type="text"
              value={searchParams.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder="Tên công việc, kỹ năng, công ty..."
              className="w-full pl-16 pr-6 py-5 text-lg font-medium border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* 2. Vị trí + Loại hình + Mức lương - 3 ô ngang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vị trí - Select */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 z-10" />
              <select
                value={searchParams.locationId}
                onChange={(e) => handleChange("locationId", e.target.value)}
                className="w-full pl-14 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all appearance-none text-gray-700 font-medium cursor-pointer hover:border-teal-300"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Loại hình */}
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 z-10" />
              <select
                value={searchParams.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full pl-14 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all appearance-none text-gray-700 font-medium cursor-pointer hover:border-teal-300"
              >
                <option value="">Tất cả loại hình</option>
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="INTERNSHIP">Thực tập</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Mức lương */}
            <div className="relative flex items-center gap-3">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 z-10" />
              <input
                type="number"
                value={searchParams.salary ?? ""}
                onChange={(e) => handleChange("salary", e.target.value)}
                placeholder="Mức lương mong muốn"
                className="w-full pl-14 pr-3 py-4 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all text-gray-700 font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Nút Tìm kiếm & Reset */}
          <div className="flex justify-center gap-6 pt-4">
            <button
              onClick={() => setSearchParams((prev) => ({ ...prev, page: 0 }))}
              className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Search className="w-6 h-6 group-hover:translate-x-1 transition" />
              Tìm Ngay
            </button>
            {hasFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition border border-gray-300"
              >
                <Filter className="w-5 h-5" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- */}

      {/* Tiêu đề Kết quả */}
      <h2 className="text-2xl font-bold text-gray-800 pt-6">
        Kết quả tìm kiếm ({data?.data?.totalElements ?? 0} công việc)
      </h2>

      {/* Kết quả */}
      {isLoading ? (
        <DataLoader />
      ) : isError ? (
        <p className="text-red-600 text-center p-10 bg-red-50 rounded-xl border border-red-200 shadow-md">
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
        </p>
      ) : data?.data?.content?.length === 0 ? (
        <p className="text-gray-600 text-center p-10 bg-yellow-50 rounded-xl border border-yellow-200 shadow-md flex items-center justify-center gap-3">
          <Search size={24} className="text-yellow-600" />
          **Rất tiếc!** Không tìm thấy công việc nào phù hợp với yêu cầu của
          bạn.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {data?.data.content.map((job: JobPosting) => (
            <JobPostingCard key={job.id} job={job as any} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      {data?.data?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={() =>
              setSearchParams((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={searchParams.page === 0}
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft /> Trang trước
          </button>
          <span className="text-2xl font-bold text-teal-700">
            {searchParams.page + 1} / {data?.data.totalPages}
          </span>
          <button
            onClick={() =>
              setSearchParams((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={searchParams.page >= data?.data.totalPages - 1}
            className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trang sau <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobView;
