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
  const size = 5;

  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // @ts-ignore (Giả định hook gốc trả về mảng)
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  // @ts-ignore
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

  const formatDate = (date: string): string => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? "Không xác định"
      : parsed.toLocaleDateString("vi-VN");
  };

  const translateUserRole = (
    role: string
  ): { name: string; classes: string } => {
    switch (role) {
      case "ADMIN":
        return { name: "Quản trị viên", classes: "bg-red-100 text-red-800" };
      case "JOBSEEKER":
        return { name: "Người tìm việc", classes: "bg-blue-100 text-blue-800" };
      case "RECRUITER":
        return {
          name: "Nhà tuyển dụng",
          classes: "bg-green-100 text-green-800",
        };
      case "EXPERT":
        return { name: "Chuyên gia", classes: "bg-purple-100 text-purple-800" };
      default:
        return { name: "Không xác định", classes: "bg-gray-100 text-gray-800" };
    }
  };

  const translateUserStatus = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "BANNED":
        return "Bị cấm";
      default:
        return "Không xác định";
    }
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
    setStatus("");
    setRole("");
    setPage(0);
    refetch();
  };

  const handleToggleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
    try {
      await updateUserStatus({ userId, status: newStatus });
      refetch();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái người dùng:", error);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-700 bg-green-100 ring-green-500/20 border-green-300";
      case "INACTIVE":
        return "text-yellow-700 bg-yellow-100 ring-yellow-500/20 border-yellow-300";
      case "BANNED":
        return "text-red-700 bg-red-100 ring-red-500/20 border-red-300";
      default:
        return "text-gray-700 bg-gray-100 ring-gray-500/20 border-gray-300";
    }
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Deleting user with ID: ${userId}`);
    // Cần thêm modal xác nhận xóa tại đây
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const onSuccess = () => {
    setCreateModalOpen(false);
    refetch();
  };

  const onClose = () => {
    setCreateModalOpen(false);
  };

  const FilterInput = ({ Icon, ...props }: any) => (
    <div className="relative flex items-center">
      <Icon className="w-5 h-5 text-gray-400 absolute left-3" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 transition duration-150"
      />
    </div>
  );

  const FilterSelect = ({ Icon, ...props }: any) => (
    <div className="relative flex items-center">
      <Icon className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
      <select
        {...props}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-4 focus:ring-teal-100 transition duration-150 bg-white"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />{" "}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {createModalOpen && (
        <CreateUserModal onClose={onClose} onSuccess={onSuccess} />
      )}

      {/* Header & Add Button */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-teal-500/50">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
          <Users className="w-8 h-8 text-teal-600" />
          Quản lý Người Dùng
        </h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/40 hover:bg-teal-700 transition transform hover:scale-[1.02] active:scale-95"
        >
          <CirclePlus className="mr-2 w-6 h-6" /> Thêm người dùng mới
        </button>
      </header>

      {/* Form tìm kiếm nâng cao */}
      <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Search className="text-teal-500 w-5 h-5" /> Bộ lọc Tìm kiếm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FilterInput
            Icon={UserRoundCheck}
            type="text"
            value={searchUsername}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchUsername(e.target.value)
            }
            placeholder="Tìm theo Username..."
          />
          <FilterInput
            Icon={Mail}
            type="text"
            value={searchEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchEmail(e.target.value)
            }
            placeholder="Tìm theo Email..."
          />

          <FilterSelect
            Icon={UserRoundCheck}
            name="role"
            value={searchRole}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSearchRole(e.target.value)
            }
          >
            <option value="">Tất cả Vai trò</option>
            <option value="JOBSEEKER">Người tìm việc</option>
            <option value="RECRUITER">Nhà tuyển dụng</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="EXPERT">Chuyên gia</option>
          </FilterSelect>

          <FilterSelect
            Icon={UserRoundCheck}
            name="status"
            value={searchStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSearchStatus(e.target.value)
            }
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
            <option value="BANNED">Bị cấm</option>
          </FilterSelect>
        </div>

        {/* Nút Tìm kiếm và Làm mới */}
        <div className="flex justify-end pt-4 border-t mt-6 border-gray-100 gap-4">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-teal-500 text-white px-6 py-2 rounded-xl font-bold shadow-md shadow-teal-500/30 hover:bg-teal-600 transition duration-200 transform hover:scale-[1.02]"
          >
            <Search className="w-4 h-4" /> Tìm kiếm
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-md shadow-blue-500/30 hover:bg-blue-600 transition duration-200 transform hover:scale-[1.02]"
          >
            <RotateCw className="w-4 h-4" /> Làm mới
          </button>
        </div>
      </section>

      {/* Danh sách người dùng */}
      <section className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Danh sách Người Dùng
          <span className="ml-2 text-teal-600">
            ({data?.totalElements || 0})
          </span>
        </h2>

        {/* Trạng thái tải và lỗi */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-teal-500 bg-teal-50 rounded-xl">
            <Loader2 className="animate-spin w-8 h-8 mb-3" />
            <p className="text-xl font-medium">
              Đang tải dữ liệu người dùng...
            </p>
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center p-8 text-red-600 bg-red-100 rounded-xl border border-red-300">
            <AlertCircle className="w-8 h-8 mr-3" />
            <p className="italic font-medium">
              Lỗi khi tải dữ liệu người dùng. Vui lòng kiểm tra kết nối hoặc thử
              lại.
            </p>
          </div>
        )}
        {!isLoading && !isError && users.length === 0 && (
          <p className="text-gray-500 italic p-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            Không tìm thấy người dùng nào phù hợp với bộ lọc đã chọn.
          </p>
        )}

        {/* User Cards */}
        <div className="space-y-4">
          {users.map((user: UserResponseProps) => {
            const userRole = translateUserRole(String(user.role));
            return (
              <div
                key={user.id}
                className="bg-white p-5 rounded-r-xl border-l-4 border-teal-500 shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between transition duration-300 hover:shadow-xl hover:bg-teal-50/50"
              >
                {/* Thông tin chính và Vai trò */}
                <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-extrabold text-gray-900 truncate">
                      {user.username}
                    </h3>
                    <span
                      className={`inline-block text-xs font-semibold py-1 px-3 rounded-full ${userRole.classes}`}
                    >
                      {userRole.name}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-teal-600 mb-2 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>

                  {/* Chip Trạng thái */}
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset border ${getStatusClasses(
                      user.status
                    )}`}
                  >
                    {translateUserStatus(user.status)}
                  </span>
                </div>

                {/* Ngày tháng */}
                <div className="flex-shrink-0 text-xs text-gray-500 space-y-1 lg:text-right mr-6">
                  <p className="flex items-center gap-1 lg:justify-end">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    Ngày tạo:{" "}
                    <strong className="font-semibold text-gray-700">
                      {formatDate(user.createdAt)}
                    </strong>
                  </p>
                  <p className="flex items-center gap-1 lg:justify-end">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    Cập nhật:{" "}
                    <strong className="font-semibold text-gray-700">
                      {formatDate(user.updatedAt)}
                    </strong>
                  </p>
                </div>

                {/* Hành động */}
                <div className="flex-shrink-0 mt-4 lg:mt-0 flex gap-3">
                  <button
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition duration-200 shadow-lg ${
                      user.status === "BANNED"
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/30"
                        : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => handleToggleBlock(user.id, user.status)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : user.status === "BANNED" ? (
                      <>
                        <Unlock className="w-4 h-4" /> Mở khóa
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Khóa
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-gray-300 text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition duration-200"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-200">
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="flex items-center gap-1 px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-teal-100 hover:text-teal-700 transition disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" /> Trang trước
            </button>
            <span className="text-lg text-gray-600 font-bold">
              <span className="text-teal-600">{page + 1}</span> / {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="flex items-center gap-1 px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-teal-100 hover:text-teal-700 transition disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-700"
            >
              Trang sau <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageUserPage;
