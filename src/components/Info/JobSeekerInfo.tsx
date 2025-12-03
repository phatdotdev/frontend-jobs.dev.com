import {
  Cake,
  CircleX,
  FilePenLine,
  IdCard,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  SaveAll,
  Tag,
  User,
  VenusAndMars,
} from "lucide-react";
import {
  useGetJobSeekerProfileQuery,
  useUpdateJobSeekerProfileMutation,
} from "../../redux/api/apiUserSlice";
import DataLoader from "../UI/DataLoader";
import { formatDateTime } from "../../utils/helper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const JobSeekerInfo = () => {
  const { data: { data: info } = {}, isLoading } = useGetJobSeekerProfileQuery(
    undefined,
    { refetchOnMountOrArgChange: true, refetchOnReconnect: true }
  );
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGener] = useState("");
  const [recommended, setRecommended] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const [updateProfile] = useUpdateJobSeekerProfileMutation();

  const handleSaveProfile = async () => {
    try {
      updateProfile({
        username,
        firstname,
        lastname,
        address,
        phone,
        gender,
        dob,
        recommended,
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
        message: "Cập nhật hồ sơ thành công.",
      })
    );
  };

  useEffect(() => {
    if (info) {
      setUsername(info.username || "");
      setFirstname(info.firstname || "");
      setLastname(info.lastname || "");
      setAddress(info.address || "");
      setPhone(info.phone || "");
      setGener(info.gender || "");
      setDob(info.dob || "");
      setRecommended(info.recommended || false);
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
            Thông tin người tìm việc
          </h3>
          <p className="text-gray-600 text-medium">
            Quản lý và cập nhật thông tin tìm việc
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
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firstname */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Tag className="h-5 w-5 text-teal-600" />
            Họ
          </label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          />
        </div>
        {/* Lastname */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <User className="h-5 w-5 text-teal-600" />
            Tên
          </label>
          <input
            type="text"
            value={lastname}
            disabled={!isEditing}
            onChange={(e) => setLastname(e.target.value)}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          />
        </div>
        {/* Phone */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Phone className="h-5 w-5 text-teal-600" />
            Số điện thoại
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          />
        </div>
        {/* Address */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <MapPin className="h-5 w-5 text-teal-600" />
            Địa chỉ
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          />
        </div>
        {/* DOB */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Cake className="h-5 w-5 text-teal-600" />
            Ngày sinh
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          />
        </div>
        {/* Gender */}
        <div className="col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <VenusAndMars className="h-5 w-5 text-teal-600" />
            Giới tính
          </label>
          <select
            value={gender}
            onChange={(e) => setGener(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-xl font-medium border-2 text-gray-700 
                        ${
                          isEditing
                            ? "bg-white border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-900"
                            : "bg-gray-50 border-gray-200 cursor-default"
                        }`}
          >
            <option value=""></option>
            <option value={"MALE"}>Nam</option>
            <option value={"FEMALE"}>Nữ</option>
            <option value={"OTHER"}>Khác</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center justify-between p-6 bg-teal-50 rounded-xl">
          <div>
            <p className="font-bold text-gray-800">
              Hiển thị trong danh sách đề xuất
            </p>
            <p className="text-sm text-gray-600">
              Cho phép nhà tuyển dụng tìm thấy bạn dễ dàng hơn
            </p>
          </div>
          <button
            type="button"
            disabled={!isEditing}
            onClick={() => setRecommended(!recommended)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${recommended ? "bg-teal-600" : "bg-gray-300"}
      ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${recommended ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
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

export default JobSeekerInfo;
