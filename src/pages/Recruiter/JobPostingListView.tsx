// src/pages/JobPostingListView.tsx
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Frown,
  FileText,
  Eye,
  CheckCircle2, // Icon đẹp cho trạng thái "Đã đóng"
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyClosedJobPostingQuery,
  useGetMyDraftJobPostingQuery,
  useGetMyPublishedJobPostingQuery,
} from "../../redux/api/apiPostSlice";
import DataLoader from "../../components/UI/DataLoader";
import { useState } from "react";
import JobPostingCard from "../../components/Recruiter/JobPostingCard";

type JobPosting = {
  id: string;
  title: string;
  type:
    | "FULL_TIME"
    | "PART_TIME"
    | "INTERNSHIP"
    | "FREELANCE"
    | "CONTRACT"
    | "TEMPORARY"
    | "REMOTE";
  minSalary: number | null;
  maxSalary: number | null;
  views: number;
  state: "DRAFT" | "PUBLISHED" | "CLOSED";
  expiredAt?: string;
  createdAt: string;
  location?: { name: string } | null;
  applications: any[];
};

const EmptyState = ({ type }: { type: "draft" | "published" | "closed" }) => {
  const messages = {
    draft: {
      title: "Chưa có bản nháp nào",
      desc: "Các bài tuyển dụng chưa hoàn thiện sẽ xuất hiện tại đây",
      icon: FileText,
    },
    published: {
      title: "Chưa có tin đang đăng",
      desc: "Bắt đầu tuyển dụng bằng cách đăng tin mới ngay hôm nay!",
      icon: Eye,
    },
    closed: {
      title: "Chưa có tin nào đã đóng",
      desc: "Các tin đã kết thúc nhận hồ sơ và đang xét duyệt ứng viên sẽ hiển thị ở đây",
      icon: CheckCircle2,
    },
  };

  const msg = messages[type];
  const Icon = msg.icon;

  return (
    <div className="text-center py-24">
      <div className="bg-gray-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-14 h-14 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{msg.title}</h3>
      <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
        {msg.desc}
      </p>
    </div>
  );
};

const JobPostingListView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"published" | "draft" | "closed">(
    "published"
  );

  // API Queries
  const {
    data: publishedData,
    isLoading: loadingPublished,
    isError: errorPublished,
    refetch: refetchPublished,
  } = useGetMyPublishedJobPostingQuery({ page: 0, size: 50 });

  const {
    data: draftData,
    isLoading: loadingDraft,
    isError: errorDraft,
    refetch: refetchDraft,
  } = useGetMyDraftJobPostingQuery({ page: 0, size: 50 });

  const {
    data: closedData,
    isLoading: loadingClosed,
    isError: errorClosed,
    refetch: refetchClosed,
  } = useGetMyClosedJobPostingQuery({ page: 0, size: 50 });

  const refetch = async () => {
    if (activeTab === "closed") {
      await refetchClosed();
    } else if (activeTab === "draft") {
      await refetchDraft();
    } else if (activeTab === "published") {
      await refetchPublished();
    }
  };

  // Dữ liệu
  const published = publishedData?.data?.content || [];
  const draft = draftData?.data?.content || [];
  const closed = closedData?.data?.content || [];

  // Tabs config
  const tabs = [
    {
      key: "published",
      label: "Đang đăng",
      count: published.length,
      icon: Eye,
      color: "emerald",
    },
    {
      key: "draft",
      label: "Nháp",
      count: draft.length,
      icon: FileText,
      color: "amber",
    },
    {
      key: "closed",
      label: "Đã đóng",
      count: closed.length,
      icon: CheckCircle2,
      color: "blue",
      badge: "bg-blue-100 text-blue-600",
    },
  ] as const;

  const getCurrentData = () => {
    if (activeTab === "published")
      return {
        data: published,
        loading: loadingPublished,
        error: errorPublished,
      };
    if (activeTab === "draft")
      return { data: draft, loading: loadingDraft, error: errorDraft };
    return { data: closed, loading: loadingClosed, error: errorClosed };
  };

  const { data, loading, error } = getCurrentData();
  const currentTabLabel =
    tabs.find((t) => t.key === activeTab)?.label || "Tin tuyển dụng";

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <Briefcase className="w-11 h-11 text-teal-500" />
              Quản lý Tin Tuyển Dụng
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Theo dõi và quản lý toàn bộ vị trí tuyển dụng của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/recruiter/post")}
            className="mt-6 sm:mt-0 flex items-center gap-3 bg-teal-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:bg-teal-600 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-6 h-6" />
            Đăng tin mới
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-3 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-fit flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-teal-500 text-white shadow-lg"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : tab.key === "closed"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Tìm kiếm trong "${currentTabLabel}"...`}
              className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-gray-600"
            />
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-medium whitespace-nowrap">
            <Filter className="w-5 h-5" />
            Bộ lọc nâng cao
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <DataLoader
            content={`Đang tải danh sách tin "${currentTabLabel}"...`}
          />
        ) : error ? (
          <div className="text-center py-20">
            <Frown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">
              Không thể tải dữ liệu. Vui lòng thử lại sau.
            </p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {data.map((job: JobPosting) => (
              <JobPostingCard
                key={job.id}
                job={job as any}
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default JobPostingListView;
