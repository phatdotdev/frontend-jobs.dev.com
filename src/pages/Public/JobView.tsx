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
import JobPostingItem from "../../components/Post/JobPostingCard";

// Đổi tên Loader để tránh xung đột và dùng cho animation
const LoaderIcon = Loader;

type JobPosting = {
  id: string;
  title: string;
  companyName: string;
  location: { id: string; name: string };
  minSalary: number;
  maxSalary: number;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  createdAt: string;
  avatarUrl: string;
};
type SearchParams = {
  keyword: string;
  minSalary: number | undefined;
  maxSalary: number | undefined;
  locationId: string;
  type: string;
  page: number;
  size: number;
};

const JobView: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    minSalary: undefined,
    maxSalary: undefined,
    locationId: "",
    type: "",
    page: 0,
    size: 6,
  });

  const { data, isLoading, isError } = useSearchJobPostingsQuery(searchParams);

  const handleInputChange = (
    field: keyof SearchParams,
    value: string | number
  ) => {
    let finalValue: string | number | undefined = value;
    if (field === "minSalary" || field === "maxSalary") {
      finalValue =
        value === ""
          ? undefined
          : typeof value === "string"
          ? parseInt(value, 10)
          : value;
    }

    setSearchParams((prev) => ({ ...prev, [field]: finalValue as any }));
  };

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      minSalary: undefined,
      maxSalary: undefined,
      locationId: "",
      type: "",
      page: 0,
      size: 6,
    });
  };

  const handleNextPage = () => {
    if (
      data?.data?.totalPages &&
      searchParams.page < data.data.totalPages - 1
    ) {
      setSearchParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (searchParams.page > 0) {
      setSearchParams((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const isResetEnabled = Object.values(searchParams).some((val, index) => {
    const key = Object.keys(searchParams)[index];
    if (key === "page" || key === "size") return false;

    return (
      (typeof val === "string" && val !== "") ||
      (typeof val === "number" && val !== undefined)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 space-y-10">
      {/* HEADER */}
      <h1 className="text-4xl lg:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
        <Briefcase className="text-teal-600 w-8 h-8" />
        <span className="text-teal-600">Tìm kiếm</span> Công việc
      </h1>

      {/* --- */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 transition duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Từ khóa */}
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
            <input
              type="text"
              value={searchParams.keyword}
              onChange={(e) => handleInputChange("keyword", e.target.value)}
              placeholder="Từ khóa (vị trí, công ty...)"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 transition text-sm text-gray-800 placeholder-gray-500 font-normal"
            />
          </div>

          {/* Vị trí */}
          <div className="relative col-span-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
            <input
              type="text"
              value={searchParams.locationId}
              onChange={(e) => handleInputChange("locationId", e.target.value)}
              placeholder="Vị trí làm việc"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 transition text-sm text-gray-800 placeholder-gray-500 font-normal"
            />
          </div>

          {/* Loại hình */}
          <div className="relative col-span-1">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
            <select
              value={searchParams.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 transition text-sm text-gray-800 bg-white font-normal appearance-none"
            >
              <option value="">Tất cả loại hình</option>
              <option value="FULL_TIME">Toàn thời gian</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="CONTRACT">Hợp đồng</option>
              <option value="INTERNSHIP">Thực tập</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Mức lương + Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
          {/* Mức lương */}
          <div className="relative flex w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-teal-400 transition">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 z-10" />
            <input
              type="number"
              value={searchParams.minSalary ?? ""}
              onChange={(e) => handleInputChange("minSalary", e.target.value)}
              placeholder="Lương tối thiểu"
              className="w-1/2 pl-10 pr-2 py-3 bg-transparent rounded-l-xl focus:outline-none text-sm text-gray-800 placeholder-gray-500 font-normal"
            />
            <div className="flex items-center text-gray-500 border-x border-gray-200 px-2 text-sm font-medium">
              Đến
            </div>
            <input
              type="number"
              value={searchParams.maxSalary ?? ""}
              onChange={(e) => handleInputChange("maxSalary", e.target.value)}
              placeholder="Lương tối đa"
              className="w-1/2 pl-3 pr-3 py-3 bg-transparent rounded-r-xl focus:outline-none text-sm text-gray-800 placeholder-gray-500 font-normal"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full md:w-1/3 lg:w-auto md:justify-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:from-teal-600 hover:to-indigo-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoaderIcon className="animate-spin h-4 w-4" />
              ) : (
                <Search size={16} />
              )}
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading || !isResetEnabled}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition border border-gray-300 disabled:opacity-50"
            >
              <Filter size={16} /> Đặt lại
            </button>
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
            <JobPostingItem key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      {data?.data?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={handlePrevPage}
            disabled={searchParams.page === 0 || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-teal-500 rounded-full text-teal-600 font-bold hover:bg-teal-50 hover:shadow-lg disabled:opacity-50 transition duration-200"
          >
            <ChevronLeft size={20} />
            Trang trước
          </button>
          <span className="text-lg font-extrabold text-teal-700 bg-teal-100 px-4 py-2 rounded-lg min-w-[100px] text-center shadow-md">
            {searchParams.page + 1} / {data?.data?.totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              searchParams.page >= (data?.data?.totalPages || 1) - 1 ||
              isLoading
            }
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 hover:shadow-lg disabled:opacity-50 transition duration-200"
          >
            Trang sau
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobView;
