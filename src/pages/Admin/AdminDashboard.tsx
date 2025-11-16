import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaUserCheck,
} from "react-icons/fa6";
import { FaExclamationTriangle, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdPending, MdDangerous } from "react-icons/md";
import { Badge } from "../../components/UI/Badge";
import { Skeleton } from "../../components/UI/Skeleton";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "../../components/UI/Card";
import { useGetGeneralStatisticsQuery } from "../../redux/api/apiStatisticsSlice";
import DataLoader from "../../components/UI/DataLoader";

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  activeUsersToday: number;
  pendingApprovals: number;
  bannedUsers: number;
  usersChange: number;
  postsChange: number;
  applicationsChange: number;
  companiesChange: number;
}

const AdminDashboard = () => {
  const [greeting, setGreeting] = useState("");

  // Gọi API
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetGeneralStatisticsQuery();

  const statistics = response?.data;

  // KHỞI TẠO stats với giá trị mặc định an toàn
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    activeUsersToday: 0,
    pendingApprovals: 0,
    bannedUsers: 0,
    usersChange: 0,
    postsChange: 0,
    applicationsChange: 0,
    companiesChange: 0,
  });

  // Cập nhật stats khi có dữ liệu mới
  useEffect(() => {
    if (statistics) {
      setStats({
        totalUsers: statistics.totalUsers ?? 0,
        totalJobs: statistics.totalPosts ?? 0,
        totalApplications: statistics.totalApplications ?? 0,
        totalCompanies: statistics.totalCompanies ?? 0,
        activeUsersToday: statistics.totalActiveAccounts ?? 0,
        pendingApprovals: statistics.totalInactiveAccounts ?? 0,
        bannedUsers: statistics.totalBannedAccounts ?? 0,
        usersChange: statistics.usersChange ?? 0,
        postsChange: statistics.postsChange ?? 0,
        applicationsChange: statistics.applicationsChange ?? 0,
        companiesChange: statistics.companiesChange ?? 0,
      });
    }
  }, [statistics]); // Chỉ chạy khi statistics thay đổi

  const calcPercentChange = (total: number, change: number) => {
    if (total === 0) return 0;
    const percent = (change / total) * 100;
    return Math.round(isNaN(percent) ? 0 : percent);
  };

  // Cập nhật lời chào
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  // Danh sách card thống kê - SỬA CHECK AN TOÀN
  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      change: stats.usersChange,
      icon: <FaUsers className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Tin tuyển dụng",
      value: stats.totalJobs,
      change: stats.postsChange,
      icon: <FaBriefcase className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-100",
    },
    {
      title: "Hồ sơ ứng tuyển",
      value: stats.totalApplications,
      change: stats.applicationsChange,
      icon: <FaUserCheck className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Doanh nghiệp",
      value: stats.totalCompanies,
      change: stats.companiesChange,
      icon: <FaBuilding className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Hiển thị loader toàn màn hình
  if (isLoading) {
    return <DataLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {greeting}, Quản trị viên
              </h1>
              <p className="text-gray-600 mt-1">
                Chào mừng bạn đến với bảng điều khiển
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                <FaChartLine className="w-4 h-4 mr-1" />
                Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
              </Badge>
              <button
                onClick={refetch}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {!isLoading && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {isLoading ? "Đang tải..." : "Làm mới"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => {
            // Kiểm tra an toàn trước khi tính toán
            const currentValue = Number(stat.value) || 0;
            const changeValue = Number(stat.change) || 0;
            const percentChange = calcPercentChange(currentValue, changeValue);
            const isPositive = changeValue >= 0;

            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-lg ${stat.bg} text-gray-700 group-hover:scale-110 transition-transform`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {currentValue.toLocaleString("vi-VN")}
                  </div>
                  <div
                    className={`text-xs flex items-center mt-1 font-medium ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? (
                      <FaArrowUp className="mr-1 w-3 h-3" />
                    ) : (
                      <FaArrowDown className="mr-1 w-3 h-3" />
                    )}
                    {Math.abs(percentChange)}% so với tuần trước
                  </div>
                </CardContent>
                <div
                  className={`h-1 bg-gradient-to-r ${stat.color} opacity-70 group-hover:opacity-100 transition`}
                />
              </Card>
            );
          })}
        </div>

        {/* Extra Info - 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Active Users Today */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MdPending className="text-green-500" size={20} />
                Người dùng hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-3xl font-bold text-green-600">
                {stats.activeUsersToday.toLocaleString("vi-VN")}
              </p>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-500" size={20} />
                Đang chờ duyệt
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-3xl font-bold text-amber-600">
                {stats.pendingApprovals}
              </p>
            </CardContent>
          </Card>

          {/* Banned Users */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MdDangerous className="text-red-500" size={22} />
                Đã bị cấm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-3xl font-bold text-red-600">
                {stats.bannedUsers}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FaExclamationTriangle className="w-5 h-5" />
              <p className="font-medium">Không thể tải dữ liệu</p>
            </div>
            <p className="text-sm text-center">
              Vui lòng kiểm tra kết nối và thử lại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
