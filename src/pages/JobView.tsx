import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Loader,
  RotateCw,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
type JobPosting = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  postedDate: string;
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

// --- MOCK COMPONENTS & DATA ---

// Mock Job Data
const mockJobs: JobPosting[] = [
  {
    id: "j1",
    title: "Senior React Developer",
    companyName: "TechCorp Global",
    location: "TP.HCM",
    minSalary: 1500,
    maxSalary: 2500,
    type: "FULL_TIME",
    postedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    avatarUrl: "https://placehold.co/40x40/003C5C/ffffff?text=TCG",
  },
  {
    id: "j2",
    title: "Marketing Specialist (Remote)",
    companyName: "Digital Waves",
    location: "Remote",
    minSalary: 800,
    maxSalary: 1200,
    type: "FULL_TIME",
    postedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    avatarUrl: "https://placehold.co/40x40/ED1C24/ffffff?text=DW",
  },
  {
    id: "j3",
    title: "Internship Backend Java",
    companyName: "Innovate Solutions",
    location: "Hà Nội",
    minSalary: 300,
    maxSalary: 500,
    type: "INTERNSHIP",
    postedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    avatarUrl: "https://placehold.co/40x40/40C4FF/ffffff?text=IS",
  },
  {
    id: "j4",
    title: "Project Manager (IT)",
    companyName: "Global Systems Inc.",
    location: "Đà Nẵng",
    minSalary: 2000,
    maxSalary: 3500,
    type: "CONTRACT",
    postedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    avatarUrl: "https://placehold.co/40x40/009688/ffffff?text=GSI",
  },
  {
    id: "j5",
    title: "Data Analyst Junior",
    companyName: "Data Insights Co.",
    location: "TP.HCM",
    minSalary: 1000,
    maxSalary: 1800,
    type: "FULL_TIME",
    postedDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    avatarUrl: "https://placehold.co/40x40/5E35B1/ffffff?text=DI",
  },
  {
    id: "j6",
    title: "UX/UI Designer",
    companyName: "Creative Hub",
    location: "Hà Nội",
    minSalary: 1200,
    maxSalary: 2000,
    type: "FULL_TIME",
    postedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    avatarUrl: "https://placehold.co/40x40/FF5722/ffffff?text=CH",
  },
  {
    id: "j7",
    title: "DevOps Engineer",
    companyName: "Cloud Ninjas",
    location: "TP.HCM",
    minSalary: 2200,
    maxSalary: 3000,
    type: "FULL_TIME",
    postedDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    avatarUrl: "https://placehold.co/40x40/8BC34A/ffffff?text=CN",
  },
];

// Mock DataLoader component
const DataLoader: React.FC = () => (
  <div className="flex items-center justify-center p-16 text-teal-600">
    <Loader className="animate-spin h-8 w-8 mr-3" />
    <p className="text-xl font-medium">Đang tải công việc...</p>
  </div>
);

// Mock JobPostingItem component
const JobPostingItem = ({ job }: { job: JobPosting }) => {
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => num.toLocaleString("en-US");
    return `${formatNumber(min)} - ${formatNumber(max)} USD`;
  };

  const timeAgo = (dateString: string) => {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  const typeStyle =
    job.type === "FULL_TIME"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-teal-300 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={job.avatarUrl}
            alt={job.companyName}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border-2 border-teal-500 p-0.5"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1">
              <Building2 size={16} /> {job.companyName}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeStyle} whitespace-nowrap`}
        >
          {job.type.replace("_", " ").toLowerCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm font-medium pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-teal-600">
          <DollarSign size={16} />
          <span className="text-gray-700 font-semibold">
            {formatSalary(job.minSalary, job.maxSalary)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-teal-600">
          <MapPin size={16} />
          <span className="text-gray-700">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={16} />
          <span>Đăng {timeAgo(job.postedDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Briefcase size={16} />
          <span>{job.type === "INTERNSHIP" ? "Thực tập" : "Lâu dài"}</span>
        </div>
      </div>

      <button className="w-full bg-teal-500 text-white py-2 mt-2 rounded-lg font-bold hover:bg-teal-600 transition duration-200">
        Xem chi tiết
      </button>
    </div>
  );
};

// Mock useSearchJobPostingsQuery
const useSearchJobPostingsQuery = (params: SearchParams) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const filteredJobs = useMemo(() => {
    let results = mockJobs;
    const lowerCaseKeyword = params.keyword.toLowerCase().trim();
    const lowerCaseLocation = params.locationId.toLowerCase().trim();

    // 1. Filter by Keyword (Title or Company Name)
    if (lowerCaseKeyword) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerCaseKeyword) ||
          job.companyName.toLowerCase().includes(lowerCaseKeyword)
      );
    }

    // 2. Filter by Location
    if (lowerCaseLocation) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(lowerCaseLocation)
      );
    }

    // 3. Filter by Salary
    if (
      params.minSalary !== undefined &&
      params.minSalary !== null &&
      params.minSalary > 0
    ) {
      results = results.filter((job) => job.maxSalary >= params.minSalary);
    }
    if (
      params.maxSalary !== undefined &&
      params.maxSalary !== null &&
      params.maxSalary > 0
    ) {
      results = results.filter((job) => job.minSalary <= params.maxSalary);
    }

    return results;
  }, [params.keyword, params.locationId, params.minSalary, params.maxSalary]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    // Simulate API delay
    const timer = setTimeout(() => {
      const start = params.page * params.size;
      const end = start + params.size;
      const content = filteredJobs.slice(start, end);
      const totalPages = Math.ceil(filteredJobs.length / params.size);

      setData({
        data: {
          content: content,
          totalElements: filteredJobs.length,
          totalPages: totalPages,
          page: params.page,
        },
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params, filteredJobs]);

  return { data, isLoading, isError };
};

// --- MAIN COMPONENT ---
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
    // Convert string to number for salary fields, using undefined if empty
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

  const isResetEnabled = Object.values(searchParams).some(
    (val) =>
      (typeof val === "string" && val !== "") ||
      (typeof val === "number" && val > 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
        <Briefcase className="text-teal-600" size={32} />
        <span className="text-teal-600">Tìm kiếm</span> Công việc Mơ ước
      </h1>

      {/* Thanh tìm kiếm nâng cấp */}
      <div className="bg-white p-5 rounded-3xl shadow-2xl shadow-teal-100 border border-gray-100 transition duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Tên công ty / từ khóa */}
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchParams.keyword}
              onChange={(e) => handleInputChange("keyword", e.target.value)}
              placeholder="Từ khóa (vị trí, công ty...)"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Vị trí */}
          <div className="relative col-span-1">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchParams.locationId}
              onChange={(e) => handleInputChange("locationId", e.target.value)}
              placeholder="Vị trí làm việc"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Type (Dropdown - Mocked for simplicity) */}
          <div className="relative col-span-1">
            <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={searchParams.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 text-gray-700 placeholder-gray-400 appearance-none bg-white"
            >
              <option value="">Tất cả loại hình</option>
              <option value="FULL_TIME">Toàn thời gian</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="CONTRACT">Hợp đồng</option>
              <option value="INTERNSHIP">Thực tập</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Lương và Buttons - Căn chỉnh ngang */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
          {/* Mức lương */}
          <div className="relative flex w-full md:w-2/3 lg:w-1/2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500 transition duration-150">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
              type="number"
              value={searchParams.minSalary ?? ""}
              onChange={(e) => handleInputChange("minSalary", e.target.value)}
              placeholder="Lương tối thiểu (USD)"
              className="w-1/2 pl-11 pr-2 py-3 bg-white rounded-l-xl focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <div className="flex items-center text-gray-400 border-x border-gray-200 px-2">
              Đến
            </div>
            <input
              type="number"
              value={searchParams.maxSalary ?? ""}
              onChange={(e) => handleInputChange("maxSalary", e.target.value)}
              placeholder="Lương tối đa (USD)"
              className="w-1/2 pl-4 pr-4 py-3 bg-white rounded-r-xl focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full md:w-1/3 lg:w-auto md:justify-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition duration-200 shadow-lg shadow-teal-600/40 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Search size={20} />
              )}
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading || !isResetEnabled}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition duration-200 disabled:opacity-50"
            >
              <RotateCw size={20} /> Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Tiêu đề Kết quả */}
      <h2 className="text-2xl font-bold text-gray-800 pt-4 border-t border-gray-200">
        Kết quả ({data?.data?.totalElements ?? 0} công việc)
      </h2>

      {/* Kết quả */}
      {isLoading ? (
        <DataLoader />
      ) : isError ? (
        <p className="text-red-600 text-center p-10 bg-red-50 rounded-lg border border-red-200">
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
        </p>
      ) : data?.data?.content?.length === 0 ? (
        <p className="text-gray-600 text-center p-10 bg-yellow-50 rounded-lg border border-yellow-200">
          Không tìm thấy công việc nào phù hợp với yêu cầu của bạn.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.content.map((job: JobPosting) => (
            <JobPostingItem key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      {data?.data?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={searchParams.page === 0 || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-200"
          >
            <ChevronLeft size={20} />
            Trang trước
          </button>
          <span className="text-base font-bold text-teal-600">
            {searchParams.page + 1} / {data?.data?.totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              searchParams.page >= (data?.data?.totalPages || 1) - 1 ||
              isLoading
            }
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-200"
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
