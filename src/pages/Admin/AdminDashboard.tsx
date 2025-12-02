import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaUserCheck,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { MdPending, MdDangerous } from "react-icons/md";
import { Megaphone, X } from "lucide-react";
import { Badge } from "../../components/UI/Badge";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "../../components/UI/Card";
import DataLoader from "../../components/UI/DataLoader";
import { useGetGeneralStatisticsQuery } from "../../redux/api/apiStatisticsSlice";
import { useCreateNotificationMutation } from "../../redux/api/apiCommunication";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const AnnouncementModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  isSubmitting: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim());
  };

  // Reset form khi mở lại
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setContent("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-purple-600" />
            Tạo thông báo mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề thông báo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cập nhật tính năng mới, bảo trì hệ thống..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              maxLength={100}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 ký tự
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung thông báo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo gửi đến toàn bộ người dùng..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              maxLength={1000}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/1000 ký tự
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4" />
                  Gửi thông báo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetGeneralStatisticsQuery();

  const [createNotification] = useCreateNotificationMutation();

  const statistics = response?.data;

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
  }, [statistics]);

  const calcPercentChange = (total: number, change: number) => {
    if (total === 0) return 0;
    const percent = (change / total) * 100;
    return Math.round(isNaN(percent) ? 0 : percent);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  const dispatch = useDispatch();

  const handleSendAnnouncement = async (title: string, content: string) => {
    setIsSubmitting(true);
    try {
      await createNotification({ title, content }).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Tạo thông báo thành công!",
        })
      );
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      dispatch(
        addToast({
          type: "error",
          message: "Tạo thông báo thất bại!",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) return <DataLoader />;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header - đã thêm nút mở modal */}
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

                {/* Nút mở modal */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
                >
                  <Megaphone className="w-5 h-5" />
                  Tạo thông báo
                </button>
              </div>
            </div>
          </div>

          {/* Giữ nguyên phần thống kê... */}
          {/* ... statCards, extra info, error state ... */}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statCards.map((stat, index) => {
              // Kiểm tra an toàn trước khi tính toán
              const currentValue = Number(stat.value) || 0;
              const changeValue = Number(stat.change) || 0;
              const percentChange = calcPercentChange(
                currentValue,
                changeValue
              );
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

      {/* Modal tạo thông báo */}
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendAnnouncement}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AdminDashboard;
