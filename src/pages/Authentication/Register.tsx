import { useState } from "react";
import { FaBuilding, FaUser } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useRegisterMutation } from "../../redux/api/authenticationApiSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmitForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      return;
    }
    if (email.length < 0) {
      return;
    }
    if (password.length < 8) {
      return;
    }
    if (password != confirmPassword) {
      return;
    }
    setShowModal(true);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleConfirm = async (role: "JOBSEEKER" | "RECRUITER") => {
    try {
      console.log({ username, password, email, role });
      await register({
        username,
        email,
        password,
        role,
      }).unwrap();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  };

  return (
    <>
      <form className="relative w-[30rem] mt-[4rem] mx-auto p-6 rounded-lg shadow-md bg-white space-y-6">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 animate-pulse rounded-t-md" />
        )}
        <div className="text-lg fw-medium">Đăng ký tài khoản</div>

        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập username của bạn"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmitForm}
          className="w-full py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition"
        >
          Đăng ký
        </button>
      </form>
      {/* modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
        >
          <div
            onClick={handleClose}
            className="absolute w-[25rem] bg-white rounded-lg shadow-lg p-6 space-y-4"
          >
            {/* close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold focus:outline-none"
            >
              <MdCancel />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 text-center">
              Chọn loại tài khoản
            </h1>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleConfirm("JOBSEEKER")}
                className="w-[160px] flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
              >
                <FaUser className="mr-4" />
                Ứng viên
              </button>
              <button
                onClick={() => handleConfirm("RECRUITER")}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                <FaBuilding className="mr-2" />
                Nhà tuyển dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
