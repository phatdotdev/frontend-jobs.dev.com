import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../redux/features/authSlice";
import { useLoginMutation } from "../../redux/api/authenticationApiSlice";
import { jwtDecode } from "jwt-decode";

interface UserInfoProp {
  id: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const resposne = await login({ email, password }).unwrap();
      const token = resposne.data.token;
      const decoded = jwtDecode<UserInfoProp>(token);
      dispatch(setCredentials(decoded));
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(decoded));
      localStorage.setItem("expirationTime", decoded.exp.toString());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form className="relative w-[30rem] mt-[4rem] mx-auto p-6 rounded-lg shadow-md bg-white space-y-6">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 animate-pulse rounded-t-md" />
        )}
        <div className="text-lg">Đăng nhập</div>
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

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition"
        >
          Đăng nhập
        </button>

        <Link to="/register">
          <button className="w-full py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition">
            Đăng ký tài khoản
          </button>
        </Link>
      </form>
    </>
  );
};

export default Login;
