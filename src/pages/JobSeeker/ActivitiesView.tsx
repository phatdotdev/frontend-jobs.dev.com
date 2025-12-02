import {
  Activity,
  Clock,
  DollarSign,
  Eye,
  FileCheck,
  Heart,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useGetJobSeekerActivitiesQuery } from "../../redux/api/apiStatisticsSlice";
import { Link } from "react-router-dom";
import { formatDate, getImageUrl } from "../../utils/helper";
import DataLoader from "../../components/UI/DataLoader";

const ActivitiesView = () => {
  const { data: response, isLoading } = useGetJobSeekerActivitiesQuery();
  const data = response?.data;

  const [activeTab, setActiveTab] = useState<"views" | "likes" | "applies">(
    "views"
  );

  if (isLoading) {
    return <DataLoader />;
  }

  const tabs = [
    {
      key: "views",
      label: "Đã xem",
      icon: Eye,
      count: data?.views.length || 0,
    },
    {
      key: "likes",
      label: "Đã thích",
      icon: Heart,
      count: data?.likes.length || 0,
    },
    {
      key: "applies",
      label: "Đã ứng tuyển",
      icon: FileCheck,
      count: data?.applies.length || 0,
    },
  ];

  const currentJobs =
    activeTab === "views"
      ? data?.views
      : activeTab === "likes"
      ? data?.likes
      : data?.applies;

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-blue-100 text-blue-700";
      case "PART_TIME":
        return "bg-purple-100 text-purple-700";
      case "FREELANCE":
        return "bg-emerald-100 text-emerald-700";
      case "INTERN":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
          <Activity className="mr-3 w-8 h-8 text-blue-600" /> Lịch sử hoạt động
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-2 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 sm:flex-initial flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.key ? "bg-white/30" : "bg-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Danh sách công việc */}
      {currentJobs && currentJobs.length > 0 ? (
        <div className="grid gap-6">
          {currentJobs.map((job: any) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="block group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-blue-500 rounded shadow-lg">
                      <img
                        src={
                          job.avatarUrl
                            ? getImageUrl(job.avatarUrl)
                            : getImageUrl("avatars/default-recruiter.png")
                        }
                        alt={job.companyName}
                        className="w-full h-full object-cover rounded bg-white"
                      />
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-blue-700 font-semibold mt-1">
                          {job.companyName}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getJobTypeColor(
                          job.type
                        )}`}
                      >
                        {job.type === "FULL_TIME"
                          ? "Toàn thời gian"
                          : job.type === "PART_TIME"
                          ? "Bán thời gian"
                          : job.type === "FREELANCE"
                          ? "Freelance"
                          : "Thực tập"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-blue-600" />
                        {job.location.name}
                      </div>
                      {job.minSalary && (
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={16} className="text-emerald-600" />
                          {(job.minSalary / 1000000).toFixed(0)} -{" "}
                          {(job.maxSalary / 1000000).toFixed(0)} triệu
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-purple-600" />
                        Hết hạn: {formatDate(job.expiredAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm">
                      {job.views !== undefined && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye size={16} /> {job.views} lượt xem
                        </div>
                      )}
                      {job.likes !== undefined && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Heart
                            size={16}
                            className="text-red-500 fill-red-500"
                          />{" "}
                          {job.likes} thích
                        </div>
                      )}
                      {activeTab === "applies" && (
                        <span className="ml-auto px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-full text-xs">
                          Đã ứng tuyển
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 max-w-md mx-auto">
            <Eye size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">
              Bạn chưa{" "}
              {activeTab === "views"
                ? "xem"
                : activeTab === "likes"
                ? "thích"
                : "ứng tuyển"}{" "}
              công việc nào
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesView;
