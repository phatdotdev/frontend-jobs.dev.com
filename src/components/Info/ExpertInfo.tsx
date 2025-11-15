import {
  CircleX,
  FilePenLine,
  IdCard,
  KeyRound,
  Mail,
  SaveAll,
  User,
} from "lucide-react";
import {
  useGetExpertProfileQuery,
  useUpdateExpertProfileMutation,
} from "../../redux/api/userApiSlice";
import DataLoader from "../UI/DataLoader";
import { formatDateTime } from "../../utils/helper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const ExpertInfo = () => {
  const { data: { data: info } = {}, isLoading } = useGetExpertProfileQuery();
  const [username, setUsername] = useState("");

  console.log(info);

  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const [updateProfile] = useUpdateExpertProfileMutation();

  const handleSaveProfile = async () => {
    try {
      updateProfile({
        username,
      }).unwrap();
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          message: "Đã có lỗi khi lưu hồ sơ.",
        })
      );
    }
    setIsEditing(false);
    dispatch(
      addToast({
        type: "success",
        message: "Cập nhật hồ sơ thành công!",
      })
    );
  };

  useEffect(() => {
    if (info) {
      setUsername(info.username || "");
    }
  }, [info]);
  if (isLoading) {
    return <DataLoader />;
  }
  return (
    <div className="p-8 space-y-8 border-t-2 border-gray-300 border-dashed">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-2 border-gray-100">
        {/* Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Thông tin doanh nghiệp
          </h3>
          <p className="text-gray-600 text-medium">
            Quản lý và cập nhật thông tin doanh nghiệp
          </p>
        </div>
        {/* Action */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                className="flex bg-teal-500 text-white rounded-lg p-2 gap-2 font-semibold hover:scale-105"
              >
                <SaveAll />
                Lưu hồ sơ
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex bg-gray-500 text-white rounded-lg p-2 gap-2 font-semibold hover:scale-105"
              >
                <CircleX />
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex bg-teal-500 text-white rounded-lg p-2 gap-2 font-semibold hover:scale-105"
            >
              <FilePenLine />
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ID */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <IdCard className="h-5 w-5 text-teal-600" />
            Mã người dùng
          </label>
          <input
            type="text"
            value={info.id || ""}
            readOnly
            className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 text-gray-700 cursor-default"
          />
        </div>
        {/* USERNAME */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <User className="h-5 w-5 text-teal-600" />
            Tên người dùng
          </label>
          <input
            type="text"
            value={username}
            disabled={!isEditing}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 text-gray-700 cursor-default"
          />
        </div>
        {/* EMAIL */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Mail className="h-5 w-5 text-teal-600" />
            Email
          </label>
          <input
            type="text"
            value={info.email || ""}
            readOnly
            className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 text-gray-700 cursor-default"
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <span className="font-medium text-gray-500">Tạo lúc</span>
            <p className="font-semibold text-gray-800">
              {formatDateTime(info.createdAt)}
            </p>
          </div>
        </div>

        {info.updatedAt && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-amber-600"
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
            </div>
            <div>
              <span className="font-medium text-gray-500">Cập nhật</span>
              <p className="font-semibold text-gray-800">
                {formatDateTime(info.updatedAt)}
              </p>
            </div>
          </div>
        )}

        <button
          className="flex items-center gap-3 bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-105"
          title="Chuyển hướng đến trang đổi mật khẩu"
        >
          <KeyRound size={20} />
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ExpertInfo;
