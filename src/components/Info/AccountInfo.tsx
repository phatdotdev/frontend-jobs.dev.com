import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  Home,
  Camera,
  Image,
  Shield,
  Mail,
  Activity,
  ImageUp,
  SaveAll,
} from "lucide-react";
import {
  useChangePasswordMutation,
  useGetUserInfoQuery,
  useUploadUserAvatarMutation,
  useUploadUserBackgroundMutation,
} from "../../redux/api/apiUserSlice";
import DataLoader from "../UI/DataLoader";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/helper";
import InputField from "../UI/InputField";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import JobSeekerInfo from "./JobSeekerInfo";
import { MdCancel } from "react-icons/md";
import RecruiterInfo from "./RecruiterInfo";
import ExpertInfo from "./ExpertInfo";

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

  const [isEditingImages, setIsEditingImages] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const [uploadUserAvatar] = useUploadUserAvatarMutation();
  const [uploadUserCover] = useUploadUserBackgroundMutation();
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  const handleSaveImages = async () => {
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

      setIsEditingImages(false);
      dispatch(
        addToast({
          type: "success",
          title: "Cập nhật thông tin thành công",
          message: "Thông tin tài khoản người dùng đã được cập nhật!",
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          title: "Cập nhật thông tin thất bại",
          message: "Không thể cập nhật thông tin người dùng!",
        })
      );
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverFile(file);
  };

  const handleSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
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

    setSuccess("Đổi mật khẩu thành công!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  const previewAvatarUrl = avatarFile
    ? URL.createObjectURL(avatarFile)
    : accountInfo?.avatarUrl && getImageUrl(accountInfo.avatarUrl);

  const previewCoverUrl = coverFile
    ? URL.createObjectURL(coverFile)
    : accountInfo?.coverUrl && getImageUrl(accountInfo.coverUrl);

  if (isLoading || !accountInfo) {
    return <DataLoader content="Đang tải dữ liệu tài khoản" />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8 font-inter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Trang cá nhân</h1>
          <Link
            to="/"
            className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-800 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-teal-500 transition-colors duration-200 shadow-md hover:shadow-lg"
            aria-label="Quay về Trang Chủ"
          >
            <Home size={20} className="text-teal-600" />
            Worknest.vn
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
          {/* Cover + Avatar */}
          <div className="relative">
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

              {isEditingImages && (
                <label
                  htmlFor="background-upload"
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-colors duration-200 shadow-lg cursor-pointer group"
                  title="Chỉnh sửa ảnh bìa"
                >
                  <Image
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                </label>
              )}
              <input
                id="background-upload"
                type="file"
                ref={coverInputRef}
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                disabled={!isEditingImages}
              />
            </div>

            <div className="relative px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
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

                  {isEditingImages && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 hover:bg-teal-600 hover:scale-110 ring-3 ring-white"
                      title="Tải lên ảnh đại diện mới"
                    >
                      <Camera size={20} />
                    </label>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={!isEditingImages}
                  />
                </div>

                <div className="flex items-center justify-between flex-1 md:mb-4">
                  {/* Account info */}
                  <div>
                    <h2
                      className="text-3xl mt-8 font-bold mb-1 font-extrabold
                                bg-gradient-to-b from-teal-300 to-teal-500 
                                bg-clip-text text-transparent"
                    >
                      {accountInfo.username}
                    </h2>

                    <p className="font-semibold text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {accountInfo.email}
                    </p>
                    <div className="flex gap-4 items-center h-14">
                      <StatusBadge value={accountInfo.role} isRole={true} />
                      <StatusBadge value={accountInfo.status} isRole={false} />
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    {isEditingImages ? (
                      <>
                        <button
                          onClick={handleSaveImages}
                          className="flex items-center gap-2 bg-gradient-to-b from-teal-300 to-teal-500 text-white px-5 py-2 rounded-md font-medium hover:bg-teal-600 transition-colors"
                        >
                          <SaveAll className="w-5 h-5" />
                          <span>Lưu ảnh</span>
                        </button>
                        <button
                          onClick={() => setIsEditingImages(false)}
                          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
                        >
                          <MdCancel className="w-5 h-5" />
                          <span>Huỷ</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditingImages(true)}
                        className="flex items-center gap-2 bg-gradient-to-b from-teal-300 to-teal-500 text-white px-5 py-2 rounded-md font-medium hover:scale-105 transition-colors"
                      >
                        <ImageUp className="w-5 h-5" />
                        <span>Tải ảnh</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobseeker */}
          {accountInfo.role === "JOBSEEKER" && <JobSeekerInfo />}

          {/* Recruiter */}
          {accountInfo.role === "RECRUITER" && <RecruiterInfo />}

          {/* Expert */}
          {accountInfo.role === "EXPERT" && <ExpertInfo />}

          {/*  */}
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-3">
              Đổi Mật Khẩu
            </h2>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <InputField
                label="Mật khẩu hiện tại"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <InputField
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <InputField
                label="Xác nhận mật khẩu mới"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-3">{success}</p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 font-medium"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={
                    !currentPassword || !newPassword || !confirmPassword
                  }
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition duration-150 disabled:bg-teal-400 disabled:cursor-not-allowed"
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
