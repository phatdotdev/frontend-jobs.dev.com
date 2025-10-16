import { useState } from "react";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useUpdateRecruiterProfileMutation } from "../../redux/api/userApiSlice";

type RecruiterProfile = {
  companyName: string;
  description: string;
  phone: string;
  address: string;
  verified: boolean;
};

const RecruiterInfo = ({ recruiter }: { recruiter: RecruiterProfile }) => {
  console.log(recruiter);
  const [isEditing, setIsEditing] = useState(false);

  const [companyName, setCompanyName] = useState(recruiter.companyName || "");
  const [description, setDescription] = useState(recruiter.description || "");
  const [phone, setPhone] = useState(recruiter.phone || "");
  const [address, setAddress] = useState(recruiter.address || "");
  const [verified, setVerified] = useState(recruiter.verified);

  const handleCancel = () => {
    setCompanyName(recruiter.companyName || "");
    setDescription(recruiter.description || "");
    setPhone(recruiter.phone || "");
    setAddress(recruiter.address || "");
    setVerified(recruiter.verified);
    setIsEditing(false);
  };

  const [updateProfile, { isLoading, error }] =
    useUpdateRecruiterProfileMutation();

  const handleSave = async () => {
    await updateProfile({ companyName, description, phone, address }).unwrap();
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {isLoading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên công ty
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            readOnly={!isEditing}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả công ty
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái xác minh
          </label>
          <input
            type="text"
            value={verified ? "Đã xác minh" : "Chưa xác minh"}
            readOnly
            className={`w-full px-3 py-2 border rounded-md text-white ${
              verified ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition"
          >
            <FaRegEdit />
            Cập nhật thông tin
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

export default RecruiterInfo;
