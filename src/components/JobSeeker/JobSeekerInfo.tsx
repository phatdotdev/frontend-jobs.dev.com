import { useState } from "react";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useUpdateJobSeekerProfileMutation } from "../../redux/api/userApiSlice";

type JobSeekerInfoProp = {
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
};

const JobSeekerInfo = ({
  jobSeekerInfo,
}: {
  jobSeekerInfo: JobSeekerInfoProp;
}) => {
  if (!jobSeekerInfo) {
    return <p className="text-gray-500">Đang tải thông tin ứng viên...</p>;
  }

  const [isEditing, setIsEditing] = useState(false);

  const [firstname, setFirstname] = useState(jobSeekerInfo.firstname || "");
  const [lastname, setLastname] = useState(jobSeekerInfo.lastname || "");
  const [dob, setDob] = useState(jobSeekerInfo.dob || "");
  const [gender, setGender] = useState(jobSeekerInfo.gender || "");
  const [phone, setPhone] = useState(jobSeekerInfo.phone || "");
  const [address, setAddress] = useState(jobSeekerInfo.address || "");

  const [updateProfile, { isLoading }] = useUpdateJobSeekerProfileMutation();

  const saveJobSeekerInfomation = async () => {
    try {
      await updateProfile({
        firstname,
        lastname,
        dob,
        gender,
        phone,
        address,
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  const handleCancel = () => {
    setFirstname(jobSeekerInfo.firstname || "");
    setLastname(jobSeekerInfo.lastname || "");
    setDob(jobSeekerInfo.dob || "");
    setGender(jobSeekerInfo.gender || "");
    setPhone(jobSeekerInfo.phone || "");
    setAddress(jobSeekerInfo.address || "");
    setIsEditing(false);
  };

  return (
    <>
      <div className="space-y-4 grid grid-cols-2 gap-4">
        {[
          { label: "Họ ứng viên", value: firstname, set: setFirstname },
          { label: "Tên ứng viên", value: lastname, set: setLastname },
          { label: "Ngày sinh", value: dob, set: setDob, type: "date" },
          { label: "Giới tính", value: gender, set: setGender },
          { label: "Số điện thoại", value: phone, set: setPhone },
          { label: "Địa chỉ", value: address, set: setAddress },
        ].map(({ label, value, set, type }, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type || "text"}
              value={value}
              onChange={(e) => set(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition"
          >
            <FaRegEdit />
            Cập nhật ứng viên
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="mt-2 mr-2 flex items-center gap-2 bg-gray-400 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              <MdCancel className="mr-2" />
              Hủy
            </button>
            <button
              onClick={saveJobSeekerInfomation}
              disabled={isLoading}
              className="mt-2 flex items-center gap-2 bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 transition disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {isLoading ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default JobSeekerInfo;
