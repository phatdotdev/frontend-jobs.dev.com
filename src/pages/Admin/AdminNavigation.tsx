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
    if (path && location.pathname === path) {
      return true;
    }
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
    if (openSubmenu === label) {
      setOpenSubmenu("");
    } else {
      setOpenSubmenu(label);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      if (!newState) {
        setOpenSubmenu("");
      }
      return newState;
    });
  };

  return (
    <aside
      className={`h-screen flex flex-col justify-between ${
        isExpanded ? "w-76 px-4" : "w-20"
      } bg-slate-900 shadow-2xl shadow-slate-950/50 py-6 transition-all duration-300 transform left-0 top-0 z-40`}
    >
      <div>
        {/* Header (Logo & Toggle Button) */}
        <header
          className={`mb-10 flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <h1 className="text-2xl font-extrabold text-teal-400 tracking-wider transition-opacity duration-300">
              WorkNest<span className="text-white">.vn</span>
            </h1>
          )}
          <button
            onClick={toggleSidebar} // Sử dụng hàm toggleSidebar mới
            className={`text-gray-400 hover:text-teal-400 p-1 rounded-full transition duration-300 ${
              isExpanded ? "hover:bg-slate-800" : "hover:bg-slate-800"
            }`}
          >
            {isExpanded ? (
              <ChevronsLeft
                size={22}
                className="hover:-translate-x-1 transition-transform duration-200"
              />
            ) : (
              <ChevronsRight size={22} />
            )}
          </button>
        </header>

        {/* Navigation Links */}
        <ul className="space-y-2 font-medium">
          {adminMenu.map(({ label, path, icon: IconComponent, children }) => {
            const isItemActive = isActive(path, children);
            const isSubmenuOpen = openSubmenu === label;

            const baseClasses = `flex items-center gap-3 py-3 rounded-xl transition duration-200 
                                 ${isExpanded ? "px-3" : "justify-center "} 
                                 ${
                                   isItemActive || (isExpanded && isSubmenuOpen)
                                     ? "bg-teal-800 text-white shadow-inner"
                                     : "text-gray-400 hover:text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-700/30"
                                 }
                                 group w-full`;

            const itemContent = (
              <>
                <div className="flex-shrink-0 mx-2">
                  <IconComponent size={24} />
                </div>
                {isExpanded && (
                  <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 text-base">
                    {label}
                  </span>
                )}
                {/* Chevron cho submenu */}
                {isExpanded && children && (
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      isSubmenuOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                {/* Tooltip khi thu gọn */}
                {!isExpanded && (
                  <span className="absolute left-full ml-4 px-3 py-1 bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl z-50">
                    {label}
                  </span>
                )}
              </>
            );

            return (
              <li key={path || label} className="relative">
                {/* Nếu có path mà KHÔNG có children (như Tổng quan hệ thống) thì là Link */}
                {path && !children ? (
                  <Link to={path} className={baseClasses}>
                    {itemContent}
                  </Link>
                ) : (
                  // Nếu không có path HOẶC có children thì là Button Toggle
                  <button
                    onClick={() => handleToggleSubmenu(label)}
                    className={baseClasses}
                  >
                    {itemContent}
                  </button>
                )}

                {/* Submenu Content */}
                {isExpanded && children && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSubmenuOpen || isItemActive
                        ? "max-h-96 opacity-100 mt-1"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <ul className="ml-10 mt-1 space-y-1 text-sm border-l border-teal-700 pl-4 py-1">
                      {children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`block px-3 py-2 rounded-lg transition text-base
                                            ${
                                              location.pathname === child.path // Chỉ kiểm tra path chính xác
                                                ? "bg-teal-700 text-white font-semibold"
                                                : "text-gray-300 hover:bg-slate-800 hover:text-white"
                                            }
                                        `}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <ul className="mt-8">
        <li className="relative group">
          <button
            // Màu đăng xuất mặc định là đỏ, hover nổi bật hơn
            className={`flex items-center gap-3 py-3 w-full text-left text-red-400 rounded-xl transition duration-200 
            ${isExpanded ? "px-3" : "justify-center"}
            hover:bg-red-900 hover:bg-opacity-50 hover:text-red-300
            
            `}
          >
            <LogOut size={24} className="mx-2 flex-shrink-0" />

            {isExpanded && (
              <span className="font-medium transition-opacity duration-300 text-base">
                Đăng xuất
              </span>
            )}

            {/* Tooltip khi thu gọn */}
            {!isExpanded && (
              <span className="absolute left-full ml-4 px-3 py-1 bg-red-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl z-50">
                Đăng xuất
              </span>
            )}
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminNavigation;
