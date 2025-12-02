import { useState, type FormEvent } from "react";

import {
  useCreateJobSeekerMutation,
  useCreateRecruiterMutation,
  useCreateExpertMutation,
} from "../../redux/api/apiAdminSlice";

import {
  User,
  Mail,
  Lock,
  UserRoundCheck,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  X,
  PlusCircle,
} from "lucide-react";
import SelectField from "../UI/SelectField";
import InputField from "../UI/InputField";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const CreateUserModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [role, setRole] = useState<"JOBSEEKER" | "RECRUITER" | "EXPERT">(
    "JOBSEEKER"
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // JobSeeker fields
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // Recruiter fields
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");

  const [createJobSeeker, { isLoading: isJobSeekerLoading }] =
    useCreateJobSeekerMutation();
  const [createRecruiter, { isLoading: isRecruiterLoading }] =
    useCreateRecruiterMutation();
  const [createExpert, { isLoading: isExpertLoading }] =
    useCreateExpertMutation();

  const isLoading = isJobSeekerLoading || isRecruiterLoading || isExpertLoading;
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (role === "JOBSEEKER") {
        await createJobSeeker({
          username,
          email,
          password,
          role,
          firstname,
          lastname,
          phone,
          address,
          gender,
          dob,
        }).unwrap();
      } else if (role === "RECRUITER") {
        await createRecruiter({
          username,
          email,
          password,
          role,
          companyName,
          description,
          phone,
          address,
        }).unwrap();
      } else if (role === "EXPERT") {
        await createExpert({
          username,
          email,
          password,
          role,
        }).unwrap();
      }
      onSuccess();
      onClose();
      dispatch(
        addToast({
          type: "success",
          message: "Tạo người dùng thành công!",
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          message: "Lỗi khi tạo người dùng!",
        })
      );
    }
  };

  const roleConfigs = {
    JOBSEEKER: { title: "Người tìm việc", color: "text-blue-600" },
    RECRUITER: { title: "Nhà tuyển dụng", color: "text-green-600" },
    EXPERT: { title: "Chuyên gia", color: "text-purple-600" },
  };

  const currentRole = roleConfigs[role];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition duration-300 ease-out scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <PlusCircle className="w-6 h-6 text-teal-500 mr-2" />
            Thêm người dùng mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <SelectField
              Icon={UserRoundCheck}
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "JOBSEEKER" | "RECRUITER" | "EXPERT")
              }
              placeholder="Chọn vai trò"
            >
              <option value="JOBSEEKER">Người tìm việc</option>
              <option value="RECRUITER">Nhà tuyển dụng</option>
              <option value="EXPERT">Chuyên gia</option>
            </SelectField>
          </div>

          <h3
            className={`text-lg font-bold border-b-2 ${currentRole.color} pb-1`}
          >
            Thông tin Tài khoản Cơ bản
          </h3>

          {/* Basic Account Fields */}
          <div className="space-y-4">
            <InputField
              Icon={User}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập (Username)"
              required
            />
            <InputField
              Icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ Email"
              required
            />
            <InputField
              Icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
            />
          </div>

          {/* Role-Specific Fields Section */}
          <div className="border border-dashed border-gray-300 p-4 rounded-xl space-y-4 bg-gray-50">
            <h4 className={`text-md font-semibold ${currentRole.color}`}>
              Thông tin chi tiết cho vai trò: {currentRole.title}
            </h4>

            {role === "JOBSEEKER" && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  Icon={User}
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Họ"
                />
                <InputField
                  Icon={User}
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Tên"
                />

                <InputField
                  Icon={Phone}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                />
                <InputField
                  Icon={MapPin}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ"
                />

                <SelectField
                  Icon={User}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Giới tính"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </SelectField>

                <InputField
                  Icon={Calendar}
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Ngày sinh"
                />
              </div>
            )}

            {role === "RECRUITER" && (
              <div className="space-y-4">
                <InputField
                  Icon={Building}
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Tên công ty"
                  required
                />

                <div className="relative border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-teal-500 transition duration-150">
                  <FileText className="w-5 h-5 text-gray-400 ml-3 mt-3 absolute" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả công ty"
                    className="w-full px-4 py-2.5 pl-10 bg-white rounded-lg focus:outline-none placeholder-gray-500 text-sm resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    Icon={Phone}
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại liên hệ"
                  />
                  <InputField
                    Icon={MapPin}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Địa chỉ công ty"
                  />
                </div>
              </div>
            )}

            {role === "EXPERT" && (
              <p className="text-gray-600 italic p-2 text-sm">
                Vai trò Chuyên gia chỉ yêu cầu thông tin tài khoản cơ bản
                (Username, Email, Mật khẩu).
              </p>
            )}
          </div>
          {/* End Role-Specific Fields Section */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition duration-150"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition duration-150 shadow-md shadow-teal-300 disabled:bg-teal-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                "Tạo người dùng mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
