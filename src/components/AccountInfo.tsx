import { FaRegEdit } from "react-icons/fa";
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
  return (
    <div className="space-y-4">
      {/* Thông tin tài khoản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên người dùng
          </label>
          <input
            type="text"
            value={accountInfo.username}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Địa chỉ email
          </label>
          <input
            type="text"
            value={accountInfo.email}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Loại tài khoản
          </label>
          <input
            type="text"
            value={accountInfo.role}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="createdAt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="updatedAt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
        <button className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition">
          <FaRegEdit />
          Cập nhật tài khoản
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
