import { useState } from "react";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

type AccountInfoProp = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

const AccountInfo = ({ accountInfo }: { accountInfo: AccountInfoProp }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState(accountInfo.username || "");
  const [email, setEmail] = useState(accountInfo.email || "");
  const [role, setRole] = useState(accountInfo.role || "");
  const [status, setStatus] = useState(accountInfo.status || "");

  const handleCancel = () => {
    setUsername(accountInfo.username || "");
    setEmail(accountInfo.email || "");
    setRole(accountInfo.role || "");
    setStatus(accountInfo.status || "");
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Thông tin tài khoản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã người dùng
          </label>
          <input
            type="text"
            value={accountInfo.id}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên người dùng
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại tài khoản
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày tạo tài khoản
          </label>
          <input
            type="text"
            value={accountInfo.createdAt}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày cập nhật
          </label>
          <input
            type="text"
            value={accountInfo.updatedAt || "Chưa cập nhật"}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>
      </div>

      {/* Nút cập nhật */}
      <div className="flex justify-end">
        <button className="mt-2 mr-2 flex items-center gap-2 bg-red-400 text-gray-900 px-4 py-2 rounded-md hover:bg-red-500 transition">
          <RiLockPasswordFill />
          Đổi mật khẩu
        </button>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition"
          >
            <FaRegEdit />
            Cập nhật tài khoản
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="mt-2 mr-2 flex items-center gap-2 bg-gray-400 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              <MdCancel />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition"
            >
              <FaSave />
              Lưu
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
