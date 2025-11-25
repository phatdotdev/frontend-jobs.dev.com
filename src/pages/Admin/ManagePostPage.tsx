// src/pages/Admin/ManagePostPage.tsx
import { useState, useEffect } from "react";
import { useGetPostsByFilterQuery } from "../../redux/api/apiAdminSlice";
import {
  Search,
  Building2,
  MapPin,
  Users,
  Heart,
  Eye,
  Briefcase,
  DollarSign,
  Archive,
  CheckCircle2,
  PauseCircle,
  Clock,
  Home,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import DataLoader from "../../components/UI/DataLoader";

type PostState = "DRAFT" | "PUBLISHED" | "CLOSED" | "COMPLETED";
type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "FREELANCE"
  | "CONTRACT"
  | "TEMPORARY"
  | "REMOTE";

interface JobPost {
  id: string;
  title?: string;
  type?: JobType;
  companyName?: string;
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  state?: PostState;
  views?: number;
  likes?: number;
  location?: { city?: string; district?: string };
  avatarUrl?: string;
  createdAt?: string;
  expiredAt?: string;
  applicationsCount?: number;
}

// Cấu hình mặc định khi dữ liệu bị thiếu
const DEFAULT_STATE = {
  label: "Không xác định",
  color: "text-gray-600",
  bg: "bg-gray-100",
  border: "border-gray-300",
  icon: HelpCircle,
};

const DEFAULT_TYPE = {
  label: "Không xác định",
  color: "text-gray-600",
  bg: "bg-gray-100",
  border: "border-gray-300",
  icon: HelpCircle,
};

const stateConfig: Record<PostState, any> = {
  DRAFT: {
    label: "Bản nháp",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    icon: Archive,
  },
  PUBLISHED: {
    label: "Đang đăng",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Đã đóng",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-300",
    icon: PauseCircle,
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-300",
    icon: Clock,
  },
};

const typeConfig: Record<JobType, any> = {
  FULL_TIME: {
    label: "Toàn thời gian",
    color: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-300",
    icon: Briefcase,
  },
  PART_TIME: {
    label: "Bán thời gian",
    color: "text-indigo-700",
    bg: "bg-indigo-100",
    border: "border-indigo-300",
    icon: Clock,
  },
  INTERNSHIP: {
    label: "Thực tập",
    color: "text-pink-700",
    bg: "bg-pink-100",
    border: "border-pink-300",
    icon: Users,
  },
  FREELANCE: {
    label: "Freelance",
    color: "text-teal-700",
    bg: "bg-teal-100",
    border: "border-teal-300",
    icon: Briefcase,
  },
  CONTRACT: {
    label: "Hợp đồng",
    color: "text-orange-700",
    bg: "bg-orange-100",
    border: "border-orange-300",
    icon: Briefcase,
  },
  TEMPORARY: {
    label: "Tạm thời",
    color: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-300",
    icon: Clock,
  },
  REMOTE: {
    label: "Làm từ xa",
    color: "text-cyan-700",
    bg: "bg-cyan-100",
    border: "border-cyan-300",
    icon: Home,
  },
};

const ManagePostPage = () => {
  const [page, setPage] = useState(0);
  const size = 10;

  const [searchTitle, setSearchTitle] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [filterState, setFilterState] = useState<PostState | "">("");
  const [filterType, setFilterType] = useState<JobType | "">("");

  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedCompany, setDebouncedCompany] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setDebouncedTitle(searchTitle), 500);
    const t2 = setTimeout(() => setDebouncedCompany(searchCompany), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [searchTitle, searchCompany]);

  useEffect(() => {
    setPage(0);
  }, [debouncedTitle, debouncedCompany, filterState, filterType]);

  const { data, isLoading, isFetching, isError } = useGetPostsByFilterQuery({
    page,
    size,
    title: debouncedTitle || undefined,
    companyName: debouncedCompany || undefined,
    state: filterState || undefined,
    type: filterType || undefined,
  });

  const posts: JobPost[] = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;
  const totalPages = Math.max(1, data?.data?.totalPages || 1);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Thoả thuận";
    const fmt = (v?: number) => (v ? `${(v / 1000000).toFixed(1)} triệu` : "");
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  if (isLoading) return <DataLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl shadow-2xl">
              <Briefcase className="w-14 h-14 text-white" />
            </div>
            Quản lý Tin tuyển dụng
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Theo dõi và quản lý tất cả bài đăng tuyển dụng
          </p>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
          <div className="flex items-center gap-3 mb-7">
            <Filter className="w-8 h-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Bộ lọc nâng cao
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition"
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Tên công ty..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition"
              />
            </div>

            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as PostState | "")}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PUBLISHED">Đang đăng</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as JobType | "")}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition"
            >
              <option value="">Tất cả hình thức</option>
              <option value="FULL_TIME">Toàn thời gian</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="INTERNSHIP">Thực tập</option>
              <option value="FREELANCE">Freelance</option>
              <option value="CONTRACT">Hợp đồng</option>
              <option value="TEMPORARY">Tạm thời</option>
              <option value="REMOTE">Làm từ xa</option>
            </select>
          </div>
        </div>

        {/* Danh sách */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative">
          <div className="px-8 py-6 bg-gradient-to-r from-teal-600 to-emerald-600">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              Tất cả tin tuyển dụng ({totalElements})
            </h2>
          </div>

          {isError && (
            <div className="p-16 text-center">
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-red-600">Lỗi kết nối</p>
              <p className="text-gray-600 mt-2">
                Không thể tải dữ liệu từ server
              </p>
            </div>
          )}

          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
          )}

          {posts.length === 0 && !isError && (
            <div className="text-center py-32">
              <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-2xl font-bold text-gray-600">
                Không tìm thấy tin nào
              </p>
              <p className="text-gray-500 mt-3">Thử thay đổi bộ lọc</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="divide-y divide-gray-100">
              {posts.map((post) => {
                // Đảm bảo luôn có giá trị mặc định
                const state =
                  post.state && stateConfig[post.state as PostState]
                    ? stateConfig[post.state as PostState]
                    : DEFAULT_STATE;
                const type =
                  post.type && typeConfig[post.type as JobType]
                    ? typeConfig[post.type as JobType]
                    : DEFAULT_TYPE;
                const StateIcon = state.icon;
                const TypeIcon = type.icon;

                return (
                  <div
                    key={post.id}
                    className="p-8 hover:bg-gradient-to-r hover:from-teal-50/40 hover:to-emerald-50/40 transition-all duration-400 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-5">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-2xl flex-shrink-0 flex items-center justify-center">
                            {post.avatarUrl ? (
                              <img
                                src={post.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-extrabold text-gray-900 line-clamp-2">
                              {post.title || "Chưa có tiêu đề"}
                            </h3>
                            <p className="text-lg font-semibold text-teal-600 mt-1 flex items-center gap-2">
                              <Building2 className="w-5 h-5" />
                              {post.companyName || "Chưa có công ty"}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <span
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${type.bg} ${type.color}`}
                              >
                                {TypeIcon && <TypeIcon className="w-5 h-5" />}
                                {type.label}
                              </span>
                              <span
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${state.bg} ${state.color} border-2 ${state.border}`}
                              >
                                <StateIcon className="w-5 h-5" />
                                {state.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 text-center">
                        <p className="text-sm text-gray-500 mb-1">Mức lương</p>
                        <p className="text-xl font-bold text-teal-600 flex items-center justify-center gap-1">
                          <DollarSign className="w-6 h-6" />
                          {formatSalary(post.minSalary, post.maxSalary)}
                        </p>
                      </div>

                      <div className="lg:col-span-2 text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                          <MapPin className="w-5 h-5" />
                          Vị trí
                        </p>
                        <p className="font-bold text-gray-900">
                          {post.location?.city || "Toàn quốc"}
                        </p>
                      </div>

                      <div className="lg:col-span-2 text-center space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="w-6 h-6 text-gray-500" />
                          <span className="font-bold text-2xl">
                            {post.views ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-pink-600">
                          <Heart className="w-6 h-6" />
                          <span className="font-bold text-2xl">
                            {post.likes ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-teal-600">
                          <Users className="w-6 h-6" />
                          <span className="font-bold text-2xl">
                            {post.applicationsCount ?? 0}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-1 text-center">
                        <button className="p-4 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition shadow-lg transform hover:scale-110">
                          <Eye className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between border-t">
              <p className="text-gray-700 font-medium">
                Trang{" "}
                <span className="font-bold text-teal-600 text-xl">
                  {page + 1}
                </span>{" "}
                / {totalPages}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePostPage;
