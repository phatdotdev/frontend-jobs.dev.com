import { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useRegisterMutation } from "../../redux/api/authenticationApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading, isSuccess, isError, error, data }] =
    useRegisterMutation();

  // Reset errors khi người dùng nhập
  useEffect(() => {
    setErrors({});
  }, [username, email, password, confirmPassword]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) newErrors.username = "Vui lòng nhập username";
    else if (username.trim().length < 3)
      newErrors.username = "Username phải từ 3 ký tự";

    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải từ 8 ký tự";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowModal(true);
    }
  };

  const handleConfirm = async (role: "JOBSEEKER" | "RECRUITER") => {
    try {
      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      }).unwrap();

      dispatch(
        addToast({
          type: "success",
          title: "Đăng ký thành công!",
          message:
            response.message || "Tài khoản đã được tạo. Vui lòng đăng nhập!",
        })
      );
      navigate("/login");
    } catch (err: any) {
      const message = "Tài khoản đã tồn tại!";
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi đăng ký",
          message,
        })
      );
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <form
            onSubmit={handleSubmitForm}
            className="relative bg-white rounded-2xl shadow-xl p-8 space-y-6 overflow-hidden"
          >
            {/* Loading Bar */}
            {isLoading && (
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-500 to-blue-500 animate-pulse" />
            )}

            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Tạo tài khoản mới
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Đăng ký để bắt đầu hành trình của bạn
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên người dùng
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                placeholder="Nhập tên người dùng"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-blue-600 transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
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
                  Đang xử lý...
                </span>
              ) : (
                "Tiếp tục"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-teal-600 font-semibold hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
            >
              <MdCancel className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Bạn là ai?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Chọn loại tài khoản để tiếp tục
            </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleConfirm("JOBSEEKER")}
                className="group flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <FaUser className="w-6 h-6 group-hover:animate-pulse" />
                <span className="font-semibold">Tôi là Ứng viên</span>
              </button>

              <button
                onClick={() => handleConfirm("RECRUITER")}
                className="group flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <FaBuilding className="w-6 h-6 group-hover:animate-pulse" />
                <span className="font-semibold">Tôi là Nhà tuyển dụng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
