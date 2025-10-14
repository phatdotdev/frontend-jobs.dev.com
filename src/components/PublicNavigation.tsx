import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import { logout } from "../redux/features/authSlice";
import type { RootState } from "../redux/features/store";

const PublicNavigation = () => {
  const selectCurrentUser = (state: RootState) => state.authentication.userInfo;
  const userInfo = useSelector(selectCurrentUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="flex px-6 py-4 justify-between items-center shadow-md">
      {/* Logo */}
      <div className="relative" style={{ fontFamily: "Ubuntu" }}>
        <Link to="/">
          <div className="text-2xl font-bold text-teal-500">
            WorkNest
            <span className="text-gray-600 text-lg">.vn</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex items-center">
        <ul className="flex gap-6 text-gray-700 mr-6 font-bold">
          <li>
            <Link to="/" className="hover:text-teal-600 transition">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-teal-600 transition">
              Công việc
            </Link>
          </li>
          <li>
            <Link to="/companies" className="hover:text-teal-600 transition">
              Doanh nghiệp
            </Link>
          </li>
        </ul>

        <ul className="flex gap-2">
          {userInfo ? (
            <li className="relative bg-teal-200 px-2 py-1 rounded-lg">
              <button
                onClick={() => setShowUserMenu((value) => !value)}
                className="flex items-center text-gray-700"
              >
                {userInfo.role}{" "}
                <span className="font-bold ml-1">{userInfo.username}</span>
                <FaAngleDown className="ml-1" />
              </button>
              {showUserMenu && (
                <div
                  onClick={() => setShowUserMenu(false)}
                  className="absolute right-0 top-[150%] block w-[12rem] bg-white shadow-md rounded-md p-2"
                >
                  <Link
                    to="/profile"
                    className="rounded-lg p-2 w-full block text-left hover:bg-teal-200"
                  >
                    Thông tin tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg w-full p-2 text-left text-red-600 hover:text-red-700 hover:bg-teal-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow transition"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow transition"
                >
                  Đăng ký
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default PublicNavigation;
