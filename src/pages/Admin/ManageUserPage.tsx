// src/pages/Admin/ManageUserPage.tsx
import { useState } from "react";
import {
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Search,
  RotateCw,
  CirclePlus,
  Users,
  Mail,
  UserRoundCheck,
  Calendar,
  Shield,
  ShieldOff,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useGetUsersByFilterQuery,
  useUpdateUserStatusMutation,
} from "../../redux/api/apiAdminSlice";
import CreateUserModal from "../../components/Admin/CreateUserModal";

type UserResponseProps = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
};

const ManageUserPage = () => {
  const [page, setPage] = useState(0);
  const size = 10;

  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const {
    data: { data } = {},
    isLoading,
    isError,
    refetch,
  } = useGetUsersByFilterQuery({
    page,
    size,
    username,
    email,
    role,
    status,
  });

  const users: UserResponseProps[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const roleConfig: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    ADMIN: { label: "Quản trị viên", bg: "bg-red-100", text: "text-red-700" },
    JOBSEEKER: { label: "Ứng viên", bg: "bg-blue-100", text: "text-blue-700" },
    RECRUITER: {
      label: "Nhà tuyển dụng",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    },
    EXPERT: {
      label: "Chuyên gia",
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
  };

  const statusConfig: Record<
    string,
    { label: string; icon: any; color: string; bg: string }
  > = {
    ACTIVE: {
      label: "Hoạt động",
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    INACTIVE: {
      label: "Tạm dừng",
      icon: ShieldOff,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    BANNED: {
      label: "Bị cấm",
      icon: ShieldOff,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  };

  const handleSearch = () => {
    setPage(0);
    setUsername(searchUsername);
    setEmail(searchEmail);
    setRole(searchRole);
    setStatus(searchStatus);
  };

  const handleReset = () => {
    setSearchUsername("");
    setSearchEmail("");
    setSearchRole("");
    setSearchStatus("");
    setUsername("");
    setEmail("");
    setRole("");
    setStatus("");
    setPage(0);
    refetch();
  };

  const handleToggleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus !== "ACTIVE" ? "ACTIVE" : "BANNED";
    await updateUserStatus({ userId, status: newStatus });
    refetch();
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {createModalOpen && (
        <CreateUserModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            refetch();
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              Quản lý người dùng
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Theo dõi và quản lý toàn bộ tài khoản trên hệ thống
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <CirclePlus className="w-6 h-6" />
            Thêm người dùng mới
          </button>
        </div>

        {/* Bộ lọc tìm kiếm */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-7 h-7 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Bộ lọc tìm kiếm
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative">
              <UserRoundCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition"
              />
            </div>

            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition"
            >
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="JOBSEEKER">Ứng viên</option>
              <option value="RECRUITER">Nhà tuyển dụng</option>
              <option value="EXPERT">Chuyên gia</option>
            </select>

            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm dừng</option>
              <option value="BANNED">Bị cấm</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RotateCw className="w-5 h-5" /> Làm mới
            </button>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-3"
            >
              <Search className="w-5 h-5" /> Tìm kiếm
            </button>
          </div>
        </div>

        {/* Danh sách người dùng */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Danh sách người dùng
              <span className="ml-3 text-teal-600 font-bold text-lg">
                ({totalElements})
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-14 h-14 text-teal-600 animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-600">
              <AlertCircle className="w-20 h-20 mx-auto mb-4 opacity-70" />
              <p className="text-xl font-bold">Lỗi tải dữ liệu</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <Users className="w-20 h-20 mx-auto mb-4 opacity-40" />
              <p className="text-xl font-medium">
                Không tìm thấy người dùng nào
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const role = roleConfig[user.role] || roleConfig.JOBSEEKER;
                const st = statusConfig[user.status];

                return (
                  <div
                    key={user.id}
                    className="p-8 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-emerald-50/30 transition-all duration-300 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Thông tin chính */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-2xl font-extrabold text-gray-900">
                              {user.username}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Vai trò & Trạng thái */}
                      <div className="flex items-center gap-6">
                        <span
                          className={`px-5 py-2.5 rounded-full font-bold text-sm ${role.bg} ${role.text}`}
                        >
                          {role.label}
                        </span>
                        <div
                          className={`flex items-center gap-3 px-5 py-2.5 rounded-full ${st.bg} border-2 border-dashed`}
                        >
                          <st.icon className={`w-5 h-5 ${st.color}`} />
                          <span className={`font-bold ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                      </div>

                      {/* Ngày tạo / cập nhật */}
                      <div className="text-sm text-gray-500 space-y-1">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Tạo:{" "}
                          <span className="font-medium text-gray-700">
                            {formatDate(user.createdAt)}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Cập nhật:{" "}
                          <span className="font-medium text-gray-700">
                            {formatDate(user.updatedAt)}
                          </span>
                        </p>
                      </div>

                      {/* Hành động */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleBlock(user.id, user.status)
                          }
                          disabled={isUpdating}
                          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg ${
                            user.status !== "ACTIVE"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                              : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
                          } disabled:opacity-70`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : user.status !== "ACTIVE" ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Unlock className="w-5 h-5" />
                          )}
                          {user.status !== "ACTIVE" ? "Kích hoạt" : "Khóa"}
                        </button>

                        <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-600 transition">
                          <Trash2 className="w-5 h-5" />
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
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
              <p className="text-gray-700 font-medium">
                Trang{" "}
                <span className="font-bold text-teal-600">{page + 1}</span> /{" "}
                {totalPages}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUserPage;
