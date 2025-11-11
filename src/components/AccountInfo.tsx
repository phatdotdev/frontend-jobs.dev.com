import React, {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEventHandler,
} from "react";
import {
  Save,
  X,
  KeyRound,
  Home,
  Camera,
  Image,
  User,
  Edit2,
  Shield,
  Mail,
  Activity,
  Calendar,
  Check,
} from "lucide-react";
import {
  useChangePasswordMutation,
  useGetUserInfoQuery,
  useUploadUserAvatarMutation,
  useUploadUserBackgroundMutation,
} from "../redux/api/userApiSlice";
import DataLoader from "./UI/DataLoader";
import { Link } from "react-router-dom";
import { formatDateTime, getImageUrl } from "../utils/helper";
import InputField from "./UI/InputField";
import type { FormSubmitHandler } from "react-hook-form";

const StatusBadge = ({
  value,
  isRole = false,
}: {
  value: string;
  isRole?: boolean;
}) => {
  let color = "bg-gray-100 text-gray-700";
  let Icon = isRole ? Shield : Activity;

  if (isRole) {
    color =
      value === "ADMIN"
        ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
        : value === "EMPLOYER"
        ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
        : "bg-teal-100 text-teal-700 border-2 border-teal-300";
  } else {
    color =
      value === "ACTIVE"
        ? "bg-green-100 text-green-700 border-2 border-green-300"
        : value === "INACTIVE"
        ? "bg-red-100 text-red-700 border-2 border-red-300"
        : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300";
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg ${color}`}
    >
      <Icon className="h-4 w-4" />
      {value}
    </span>
  );
};

const AccountInfo = () => {
  const { data: { data: accountInfo } = {}, isLoading } = useGetUserInfoQuery();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // AVATAR & BACKGROUND
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (accountInfo) {
      setUsername(accountInfo?.username || "");
      setEmail(accountInfo?.email || "");
      setRole(accountInfo?.role || "");
      setStatus(accountInfo?.status || "");
    }
  }, [accountInfo]);

  const handleCancel = () => {
    if (accountInfo) {
      setUsername(accountInfo.username || "");
      setEmail(accountInfo.email || "");
      setRole(accountInfo.role || "");
      setStatus(accountInfo.status || "");
    }
    setIsEditing(false);
  };

  const [uploadUserAvatar] = useUploadUserAvatarMutation();
  const [uploadUserCover] = useUploadUserBackgroundMutation();

  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  const handleSave = async () => {
    console.log("Saving account info:", {
      id: accountInfo?.id,
      username,
      email,
      role,
      status,
    });

    try {
      if (avatarFile) {
        const avatarForm = new FormData();
        avatarForm.append("file", avatarFile);
        await uploadUserAvatar(avatarForm).unwrap();
      }

      if (coverFile) {
        const coverForm = new FormData();
        coverForm.append("file", coverFile);
        await uploadUserCover(coverForm).unwrap();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handlers change Avatar and Background
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };
  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    await changePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
    }).unwrap();

    // Dùng giả lập thành công để demo:
    setSuccess("Đổi mật khẩu thành công!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  const previewAvatarUrl = avatarFile
    ? URL.createObjectURL(avatarFile)
    : accountInfo?.avatarUrl && getImageUrl(accountInfo?.avatarUrl as string);
  const previewCoverUrl = coverFile
    ? URL.createObjectURL(coverFile)
    : accountInfo?.coverUrl && getImageUrl(accountInfo?.coverUrl as string);

  if (isLoading || !accountInfo)
    return <DataLoader content="Đang tải dữ liệu tài khoản" />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8 font-inter">
      {/* Vùng chứa chính */}
      <div className="max-w-5xl mx-auto">
        {/* Nút trở về trang chủ */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Trang cá nhân</h1>
          <Link
            to="/"
            className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-800 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-teal-500 transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Quay về Trang Chủ"
          >
            <Home size={20} className="text-teal-600" />
            Worknest.vn
          </Link>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
          {/* Background + Avatar Section */}
          <div className="relative">
            {/* Background Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  previewCoverUrl ||
                  "https://placehold.co/1200x300/0d9488/ffffff?text=Your+Profile+Banner"
                }
                alt="Profile cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.style.background =
                      "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)";
                  }
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

              {/* Edit Cover Button */}
              <label
                htmlFor="background-upload"
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-all duration-200 shadow-lg cursor-pointer group"
                title="Chỉnh sửa ảnh bìa"
              >
                <Image
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </label>
              <input
                id="background-upload"
                type="file"
                ref={coverInputRef}
                accept="image/*"
                onChange={handleCoverChange}
                style={{ display: "none" }}
                disabled={!isEditing}
              />
            </div>

            {/* Avatar Container */}
            <div className="relative px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Avatar */}
                <div className="relative -mt-20">
                  <div className="w-40 h-40 border-4 border-white rounded-2xl overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-500 shadow-2xl flex items-center justify-center">
                    {previewAvatarUrl ? (
                      <img
                        src={previewAvatarUrl}
                        alt={accountInfo.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-white text-5xl font-bold">
                        {accountInfo.username?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Camera Button */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-teal-600 transform hover:scale-110 ring-4 ring-white"
                    title="Tải lên ảnh đại diện mới"
                  >
                    <Camera size={20} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                    disabled={!isEditing}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 md:mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {accountInfo.username}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {accountInfo.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Header với action buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Thông tin tài khoản
                </h3>
                <p className="text-gray-600 text-sm">
                  Quản lý và cập nhật thông tin cá nhân của bạn
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:scale-105"
                >
                  <Edit2 className="h-4 w-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl"
                  >
                    <Save className="h-4 w-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {/* ID - Read only */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Shield className="h-5 w-5 text-gray-500" />
                Mã người dùng (ID)
              </label>
              <div className="font-mono text-gray-900 font-bold text-lg bg-white px-4 py-3 rounded-xl border border-gray-200">
                {accountInfo.id}
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <User className="h-5 w-5 text-teal-600" />
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
                    isEditing
                      ? "bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none text-gray-900 shadow-sm"
                      : "bg-gray-50 border-2 border-gray-200 text-gray-700 cursor-default"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Mail className="h-5 w-5 text-teal-600" />
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
                    isEditing
                      ? "bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none text-gray-900 shadow-sm"
                      : "bg-gray-50 border-2 border-gray-200 text-gray-700 cursor-default"
                  }`}
                />
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Shield className="h-5 w-5 text-teal-600" />
                  Loại tài khoản
                </label>
                {isEditing ? (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl font-medium bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none text-gray-900 cursor-pointer appearance-none shadow-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option value="JOB_SEEKER">Người tìm việc</option>
                    <option value="EMPLOYER">Nhà tuyển dụng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                ) : (
                  <div className="flex items-center h-14">
                    <StatusBadge value={role} isRole={true} />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Activity className="h-5 w-5 text-teal-600" />
                  Trạng thái
                </label>
                {isEditing ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl font-medium bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none text-gray-900 cursor-pointer appearance-none shadow-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                    <option value="PENDING">Chờ xác nhận</option>
                  </select>
                ) : (
                  <div className="flex items-center h-14">
                    <StatusBadge value={status} isRole={false} />
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-100">
              {/* Created At */}
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Ngày tạo tài khoản
                </label>
                <div className="text-gray-900 font-bold text-lg">
                  {formatDateTime(accountInfo.createdAt)}
                </div>
              </div>

              {/* Updated At */}
              <div className="bg-gradient-to-br from-green-50 via-teal-50 to-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Check className="h-5 w-5 text-green-600" />
                  Ngày cập nhật gần nhất
                </label>
                <div className="text-gray-900 font-bold text-lg">
                  {formatDateTime(accountInfo.updatedAt as string) ||
                    "Chưa cập nhật"}
                </div>
              </div>
            </div>

            {/* Change Password Button */}
            <div className="flex justify-end pt-6 border-t-2 border-gray-100">
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3.5 rounded-xl font-bold hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-105"
                title="Chuyển hướng đến trang đổi mật khẩu"
              >
                <KeyRound size={20} />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Change password modal */}
      {isChangingPassword && (
        // Modal Backdrop
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-3">
              Đổi Mật Khẩu
            </h2>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {/* Trường Mật khẩu Hiện tại */}
              <InputField
                label="Mật khẩu hiện tại"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              {/* Trường Mật khẩu Mới */}
              <InputField
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              {/* Trường Xác nhận Mật khẩu Mới */}
              <InputField
                label="Xác nhận mật khẩu mới"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Hiển thị lỗi hoặc thông báo thành công */}
              {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-3">{success}</p>
              )}

              {/* Các nút hành động */}
              <div className="flex justify-end gap-3 pt-4">
                {/* Nút Hủy */}
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 font-medium"
                >
                  Hủy
                </button>

                {/* Nút Xác nhận Đổi */}
                <button
                  type="submit"
                  disabled={
                    !currentPassword || !newPassword || !confirmPassword
                  }
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg 
                       hover:bg-teal-700 transition duration-150
                       disabled:bg-teal-300 disabled:cursor-not-allowed"
                >
                  {isChanging ? "Đang đổi..." : "Xác nhận Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
