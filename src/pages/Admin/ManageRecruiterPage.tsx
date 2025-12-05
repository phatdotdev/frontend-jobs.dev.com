// src/pages/Admin/ManageJobSeekerPage.tsx
import { useState, useEffect } from "react";
import {
  useGetAllRecruitersByFilterQuery,
  useVerifyRecruiterMutation,
} from "../../redux/api/apiAdminSlice";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Search,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  ShieldOff,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CircleCheckBig,
  BadgeCheck,
  BadgeAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

interface JobSeeker {
  status: string;
  id: string;
  username: string;
  email: string;
  phone: string;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  postCount?: number;
  verified: boolean;
}

const ManageRecruiterPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Bộ lọc tìm kiếm
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  // Debounce search
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(searchUsername);
      setDebouncedEmail(searchEmail);
      setDebouncedPhone(searchPhone);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchUsername, searchEmail, searchPhone]);

  useEffect(() => {
    setPage(0);
  }, [debouncedUsername, debouncedEmail, debouncedPhone]);

  const { data, isLoading, isFetching, refetch } =
    useGetAllRecruitersByFilterQuery({
      page,
      size,
      username: debouncedUsername || undefined,
      email: debouncedEmail || undefined,
      phone: debouncedPhone || undefined,
    });

  const dispatch = useDispatch();
  const [verify] = useVerifyRecruiterMutation();

  const jobSeekers: JobSeeker[] = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;
  const totalPages = data?.data?.totalPages || 0;

  const verifyRecruiter = async (id: string) => {
    if (confirm("Xác minh người dùng?")) {
      try {
        await verify(id).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Xác thực nhà tuyển dụng thành công!",
          })
        );
        await refetch();
      } catch (error) {
        dispatch(
          addToast({
            type: "error",
            message: "Xác thực nhà tuyển dụng thất bại!",
          })
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <User className="w-10 h-10 text-teal-600" />
            Quản lý nhà tuyển dụng
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý tất cả tài khoản ứng viên
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên đăng nhập..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Tìm theo email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo số điện thoại..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
          ) : jobSeekers.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-600">
                Không tìm thấy nhà tuyển dụng nào
              </p>
              <p className="text-gray-500 mt-2">
                Thử thay đổi từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        Ứng viên
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        Tham gia
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        Hoạt động
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobSeekers.map((seeker) => (
                      <tr
                        key={seeker.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="flex items-center gap-2 font-bold text-gray-900">
                              {seeker.companyName || "Chưa cập nhật"}
                              {seeker.verified ? (
                                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <BadgeAlert className="w-4 h-4 text-red-500" />
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              @{seeker.username}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {seeker.email}
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {seeker.phone || "Chưa có"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                              seeker.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {seeker.status === "ACTIVE" ? (
                              <>
                                <Shield className="w-4 h-4" />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <ShieldOff className="w-4 h-4" />
                                Bị khóa
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center text-sm">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(seeker.createdAt), "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">
                              Bài tuyển dụng
                            </p>
                            <p className="text-gray-500">
                              {seeker.postCount || 0} bài tuyển dụng
                            </p>
                          </div>
                        </td>
                        <td className="flex flex-col gap-2 px-6 py-5 text-center">
                          <Link
                            to={`/admin/users/recruiter/${seeker.id}`}
                            className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </Link>
                          {!seeker.verified && (
                            <button
                              onClick={() => verifyRecruiter(seeker.id)}
                              className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-red-600 to-purple-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-md"
                            >
                              <CircleCheckBig className="w-4 h-4" />
                              Xác minh
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-bold">{jobSeekers.length}</span> trong
                    tổng <span className="font-bold">{totalElements}</span> ứng
                    viên
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 font-medium text-gray-700">
                      Trang {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRecruiterPage;
