import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ChevronDown,
  Briefcase,
  Building,
  Home,
  LogOut,
  Settings,
  UserCircle,
  LogIn,
  UserPlus,
  MessageSquareText,
  UserCheck,
  Menu as MenuIcon,
  X,
  Star,
} from "lucide-react";
import { useGetUserInfoQuery } from "../redux/api/apiUserSlice";
import { useLogoutMutation } from "../redux/api/authenticationApiSlice";
import NotificationPanel from "./Notification/NotificationPanel";

const PublicNavigation = () => {
  const [logout] = useLogoutMutation();
  const { data: { data: userInfo } = {} } = useGetUserInfoQuery();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    window.location.href = "/";
  };

  const navItems = [
    { label: "Trang chủ", icon: Home, path: "/" },
    { label: "Công việc", icon: Briefcase, path: "/jobs" },
    { label: "Doanh nghiệp", icon: Building, path: "/companies" },
  ];

  const renderUserRole = (role: string) => {
    const baseStyle =
      "px-2 py-0.5 text-xs font-bold rounded-full whitespace-nowrap tracking-wider transition duration-300";
    switch (role) {
      case "JOBSEEKER":
        return (
          <span className={`${baseStyle} bg-blue-100 text-blue-700`}>
            Ứng viên
          </span>
        );
      case "RECRUITER":
        return (
          <span className={`${baseStyle} bg-teal-100 text-teal-700`}>
            Nhà tuyển dụng
          </span>
        );
      case "ADMIN":
        return (
          <span className={`${baseStyle} bg-red-100 text-red-700`}>
            Quản trị viên
          </span>
        );
      case "EXPERT":
        return (
          <span className={`${baseStyle} bg-purple-100 text-purple-700`}>
            Chuyên gia
          </span>
        );
      default:
        return null;
    }
  };

  const userMenuItems = [
    {
      label: "Thông tin tài khoản",
      path: "/account",
      icon: UserCircle,
      role: "ALL",
    },
    {
      label: "Quản lý ứng viên",
      path: "/job-seeker",
      icon: UserCheck,
      role: "JOBSEEKER",
    },
    {
      label: "Quản lý doanh nghiệp",
      path: "/recruiter",
      icon: Building,
      role: "RECRUITER",
    },
    {
      label: "Quản lý đánh giá",
      path: "/expert",
      icon: Star,
      role: "EXPERT",
    },
    {
      label: "Quản lý hệ thống",
      path: "/admin",
      icon: Settings,
      role: "ADMIN",
    },
    {
      label: "Lịch sử liên hệ",
      path: "/chat",
      icon: MessageSquareText,
      role: "ALL",
    },
  ];

  const avatarUrl = `https://placehold.co/40x40/f0f9ff/009688?text=${
    userInfo?.username[0].toUpperCase() || "?"
  }`;

  const userMenuContent = (
    <div
      className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-xl p-3 z-50 border border-gray-100 animate-slide-down origin-top-right focus:outline-none"
      onMouseLeave={() => setShowUserMenu(false)}
      tabIndex={0}
      role="menu"
    >
      {/* User Info Header in Dropdown */}
      <div className="flex items-center gap-3 p-3 mb-2 border-b border-gray-100">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
        />
        <div className="min-w-0">
          <p className="text-base font-bold text-gray-800 truncate">
            {userInfo?.username}
          </p>
          <div className="mt-0.5">{renderUserRole(String(userInfo?.role))}</div>
        </div>
      </div>

      {/* Menu Items */}
      {userMenuItems
        .filter((item) => item.role === "ALL" || item.role === userInfo?.role)
        .map(({ label, path, icon: IconComponent }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-150 font-medium group"
            onClick={() => setShowUserMenu(false)}
          >
            <IconComponent
              size={20}
              className="text-teal-500 group-hover:text-teal-600 flex-shrink-0"
            />
            {label}
          </Link>
        ))}

      <hr className="my-2 border-gray-100" />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-150 font-medium"
      >
        <LogOut size={20} className="flex-shrink-0" />
        Đăng xuất
      </button>
    </div>
  );

  return (
    <nav className="bg-white sticky top-0 z-30 shadow-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-3xl font-extrabold text-gray-800 tracking-tight">
            <Link to="/" className="flex items-center gap-1 group">
              <span className="relative text-2xl md:text-3xl font-extrabold tracking-tight">
                {/* Gradient Text */}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-400 to-teal-600 bg-clip-text text-transparent">
                  WorkNest
                </span>

                {/* Shine Effect */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] animate-shine"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                ></span>
              </span>

              <span className="text-gray-700 text-2xl md:text-3xl font-extrabold tracking-tighter">
                .vn
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <ul className="hidden md:flex gap-1 text-gray-600 font-semibold">
            {navItems.map(({ label, icon: IconComponent, path }) => {
              const isActive = currentPath === path;

              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base transition duration-300 group ${
                      isActive
                        ? "bg-teal-50 text-teal-700 font-bold"
                        : "text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      className="text-teal-600 transition"
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Section / Auth Buttons */}
          <div className="flex items-center gap-3">
            {userInfo ? (
              // Logged In User Menu
              <div className="flex items-center gap-4">
                <NotificationPanel />
                <div
                  className="relative"
                  onMouseEnter={() => setShowUserMenu(true)}
                >
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center gap-2 bg-white border border-gray-200 p-1 pl-3 rounded-full text-gray-800 font-semibold hover:border-teal-500 transition duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {/* Role Chip */}
                    <div className="hidden sm:block">
                      {renderUserRole(String(userInfo.role))}
                    </div>

                    {/* Avatar */}
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />

                    {/* Dropdown Indicator */}
                    <ChevronDown
                      size={18}
                      className={`text-teal-600 transition-transform duration-300 mr-1 ${
                        showUserMenu ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && userMenuContent}
                </div>
              </div>
            ) : (
              // Auth Buttons (Logged Out)
              <div className="flex gap-2 items-center">
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-teal-600/40 hover:bg-teal-700 transition transform hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                >
                  <LogIn size={18} />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden md:flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition transform hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                >
                  <UserPlus size={18} />
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Sliding) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 animate-slide-down">
          <div className="p-4 space-y-2">
            {/* Auth/User Info for Mobile */}
            {userInfo ? (
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-600"
                />
                <div>
                  <p className="text-base font-bold text-gray-800">
                    {userInfo.username}
                  </p>
                  {renderUserRole(String(userInfo.role))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2 justify-center">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-teal-600 text-white flex-1 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-teal-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn size={18} /> Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 flex-1 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus size={18} /> Đăng ký
                </Link>
              </div>
            )}

            {/* Main Navigation Links */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {navItems.map(({ label, icon: IconComponent, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-150 font-medium ${
                    currentPath === path
                      ? "bg-teal-50 text-teal-700 font-bold"
                      : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent
                    size={20}
                    className="text-teal-600 flex-shrink-0"
                  />
                  {label}
                </Link>
              ))}
            </div>

            {/* User Menu Items (if logged in) */}
            {userInfo && (
              <>
                <hr className="my-2 border-gray-100" />
                {userMenuItems
                  .filter(
                    (item) => item.role === "ALL" || item.role === userInfo.role
                  )
                  .map(({ label, path, icon: IconComponent }) => (
                    <Link
                      key={path}
                      to={path}
                      className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-150 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent
                        size={20}
                        className="text-teal-600 flex-shrink-0"
                      />
                      {label}
                    </Link>
                  ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-150 font-medium mt-2"
                >
                  <LogOut size={20} className="flex-shrink-0" />
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
            animation: slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </nav>
  );
};

export default PublicNavigation;
