import { MdDashboard } from "react-icons/md";
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { useGetRecruiterStatisticQuery } from "../../redux/api/apiStatisticsSlice";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "teal",
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.FC<any>;
  color?: string;
  trend?: string;
}) => {
  const colorMap = {
    teal: "from-teal-500 to-teal-600",
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          colorMap[color as keyof typeof colorMap]
        } opacity-5 group-hover:opacity-10 transition-opacity`}
      ></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={14} />
              {trend}
            </p>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${
            colorMap[color as keyof typeof colorMap]
          } text-white shadow-lg`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

const RecruiterPageView = () => {
  const {
    data: { data } = {},
    isLoading,
    error,
  } = useGetRecruiterStatisticQuery();
  if (isLoading) return <DataLoader />;
  if (error) return <ErrorAlert />;

  return (
    <main className="bg-white mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <MdDashboard className="h-8 w-8 text-teal-600" />
            Tổng quan doanh nghiệp
          </h1>
          <p className="text-teal-800 mt-1.5 text-lg">
            Thông tin tổng quát về doanh nghiệp của bạn.
          </p>
        </div>
      </div>
      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Tổng tin đăng"
          value={data.totalJobPosts}
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          title="Tin đang hoạt động"
          value={data.activeJobPosts}
          icon={FileText}
          color="emerald"
          trend="+2 đang mở"
        />
        <StatCard
          title="Tin nháp"
          value={data.draftJobPosts}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Đã hoàn thành"
          value={data.completedJobPosts}
          icon={CheckCircle}
          color="blue"
        />
      </div>

      {/* Ứng tuyển & Tuyển dụng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng hồ sơ ứng tuyển"
          value={data.totalApplications}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Ứng tuyển tuần này"
          value={data.applicationsThisWeek}
          icon={TrendingUp}
          color="teal"
          trend="Mới nhất hôm nay"
        />
        <div className="md:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">
                Tỷ lệ tuyển dụng thành công
              </h3>
              <Target className="text-teal-600" size={24} />
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-teal-600">
                {(data.hiringRate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {data.hiresCompleted} người được tuyển
              </p>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${data.hiringRate * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê phụ */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
          <XCircle className="text-red-500 mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-600">Bị từ chối</p>
          <p className="text-2xl font-bold text-red-600">
            {data.rejectedApplications}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
          <CheckCircle className="text-emerald-600 mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-600">Đã tuyển</p>
          <p className="text-2xl font-bold text-emerald-600">
            {data.hiresCompleted}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
          <Users className="text-blue-600 mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-600">Đang xem xét</p>
          <p className="text-2xl font-bold text-blue-600">
            {data.totalApplications -
              data.rejectedApplications -
              data.hiresCompleted}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
          <TrendingUp className="text-purple-600 mx-auto mb-2" size={28} />
          <p className="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
          <p className="text-2xl font-bold text-purple-600">
            {data.totalApplications > 0
              ? ((data.hiresCompleted / data.totalApplications) * 100).toFixed(
                  1
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </main>
  );
};

export default RecruiterPageView;
