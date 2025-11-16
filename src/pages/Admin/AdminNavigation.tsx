import { Link, useLocation } from "react-router-dom";
import {
  Users,
  ClipboardList,
  Tag,
  BarChart,
  LayoutDashboard,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const AdminNavigation = () => {
  const location = useLocation();

  const isActive = (path: string | undefined, children: any[] | undefined) => {
    if (path && location.pathname === path) return true;
    if (children) {
      return children.some(
        (child) =>
          location.pathname.startsWith(child.path) &&
          location.pathname !== child.path
      );
    }
    return false;
  };

  const adminMenu = [
    {
      label: "Bảng điều khiển",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Tài khoản người dùng",
      icon: Users,
      children: [
        { label: "Tổng quan tài khoản", path: "/admin/users" },
        { label: "Ứng viên tìm việc", path: "/admin/users/jobseeker" },
        { label: "Nhà tuyển dụng", path: "/admin/users/recruiter" },
        { label: "Chuyên gia tư vấn", path: "/admin/users/expert" },
      ],
    },
    {
      label: "Quản lý tin tuyển dụng",
      path: "/admin/posts",
      icon: ClipboardList,
    },
    {
      label: "Danh mục hệ thống",
      icon: Tag,
      children: [
        { label: "Nhãn & thẻ dữ liệu", path: "/admin/resource/tags" },
        { label: "Địa điểm hoạt động", path: "/admin/resource/locations" },
        { label: "Trường học liên kết", path: "/admin/resource/schools" },
        { label: "Chứng chỉ chuyên môn", path: "/admin/resource/certificates" },
      ],
    },
    {
      label: "Phân tích & báo cáo",
      path: "/admin/reports",
      icon: BarChart,
    },
  ];

  const [isExpanded, setIsExpanded] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(
    adminMenu.find((item) => isActive(item.path, item.children))?.label || ""
  );

  const handleToggleSubmenu = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? "" : label));
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      if (!newState) setOpenSubmenu("");
      return newState;
    });
  };

  return (
    <aside
      className={`h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out left-0 top-0 z-50 ${
        isExpanded ? "w-76" : "w-20"
      }`}
    >
      {/* Background overlay khi thu gọn */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 to-transparent pointer-events-none" />

      <div className="flex flex-col h-full">
        {/* Header */}
        <header
          className={`flex items-center ${
            isExpanded ? "justify-between px-6" : "justify-center px-3"
          } py-6`}
        >
          {isExpanded && (
            <Link
              to="/"
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/50 transition-shadow">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                  WorkNest
                </h1>
                <p className="text-xs text-teal-300 -mt-1">.vn</p>
              </div>
            </Link>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl bg-slate-800/50 backdrop-blur-sm hover:bg-teal-700/50 text-teal-400 hover:text-white transition-all duration-300 group ${
              !isExpanded && "mx-auto"
            }`}
          >
            {isExpanded ? (
              <ChevronsLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            ) : (
              <ChevronsRight size={20} />
            )}
          </button>
        </header>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {adminMenu.map(({ label, path, icon: Icon, children }) => {
            const isItemActive = isActive(path, children);
            const isSubmenuOpen = openSubmenu === label;

            const baseClasses = `relative flex items-center gap-3 rounded-xl transition-all duration-300 group ${
              isExpanded ? "px-4 py-3" : "p-3 justify-center"
            } ${
              isItemActive || (isExpanded && isSubmenuOpen)
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/30"
                : "text-gray-400 hover:bg-slate-800/70 hover:text-white"
            }`;

            const itemContent = (
              <>
                <div className="flex-shrink-0">
                  <Icon
                    size={22}
                    className={`${
                      isItemActive || isSubmenuOpen
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    } transition-colors`}
                  />
                </div>

                {isExpanded && (
                  <span className="flex-grow text-sm font-medium truncate">
                    {label}
                  </span>
                )}

                {isExpanded && children && (
                  <ChevronDown
                    size={16}
                    className={`text-gray-300 transition-transform duration-300 ${
                      isSubmenuOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                )}

                {/* Tooltip khi thu gọn */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl z-50 before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-slate-700">
                    {label}
                  </div>
                )}
              </>
            );

            return (
              <div key={path || label}>
                {path && !children ? (
                  <Link to={path} className={baseClasses}>
                    {itemContent}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleToggleSubmenu(label)}
                    className={baseClasses}
                  >
                    {itemContent}
                  </button>
                )}

                {/* Submenu */}
                {isExpanded && children && (
                  <div
                    className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      isSubmenuOpen || isItemActive
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-8 space-y-0.5 border-l-2 border-teal-700/50 pl-4 py-1">
                      {children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            location.pathname === child.path
                              ? "bg-teal-700 text-white shadow-md"
                              : "text-gray-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 mt-auto">
          <button
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-300 group ${
              !isExpanded && "justify-center"
            }`}
          >
            <LogOut size={22} className="flex-shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium">Đăng xuất</span>
            )}
            {!isExpanded && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-red-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl z-50 before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-red-900">
                Đăng xuất
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminNavigation;
