import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  History,
  Loader2,
  AlertTriangle,
  Building2,
  MapPin,
  Mail,
  Globe,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  ArrowBigLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useGetRecruiterProfileQuery } from "../../redux/api/apiUserSlice";
import { getImageUrl } from "../../utils/helper";
import NotificationPanel from "../Notification/NotificationPanel";

const defaultAvatar = "https://placehold.co/100x100/10b981/ffffff";
const defaultBackground = "https://placehold.co/1200x250/374151/ffffff";

const RecruiterPageHeader = () => {
  const { data: response, isLoading, isError } = useGetRecruiterProfileQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-20 bg-white shadow-md">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
        <p className="text-gray-600 font-medium">Đang tải dữ liệu hồ sơ...</p>
      </div>
    );

  if (isError || !response?.data)
    return (
      <div className="flex items-center justify-center h-20 bg-red-50 shadow-md">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
        <p className="text-red-600 font-medium">
          Lỗi khi tải dữ liệu công ty. Vui lòng thử lại.
        </p>
      </div>
    );

  const recruiterInfo = response.data;

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const navLinks = [
    {
      path: "/recruiter",
      label: "Tổng quan doanh nghiệp",
      Icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/recruiter/post",
      label: "Viết bài tuyển dụng",
      Icon: PlusCircle,
      exact: true,
    },
    {
      path: "/recruiter/jobs",
      label: "Danh sách bài tuyển dụng",
      Icon: ListTodo,
      exact: false,
    },
    {
      path: "/recruiter/history",
      label: "Lịch sử tuyển dụng",
      Icon: History,
      exact: false,
    },
  ];

  return (
    <header className="bg-white shadow-xl rounded-b-xl overflow">
      {/* 1. Cover Image and Avatar Section */}
      <div className="relative">
        <Link
          to="/"
          className="
            absolute top-4 left-4 z-20 
            flex items-center gap-1 border-teal-300 border-1
            bg-teal-100 text-gray-800 
            px-3 py-2 rounded-lg text-teal-700
            shadow-xl font-semibold text-lg font-bold
            hover:bg-white transition duration-200
        "
        >
          <ArrowBigLeft className="w-4 h-4 text-teal-700 mr-1" />
          Về trang chủ
        </Link>

        {/* Cover Image */}
        <div className="h-48 sm:h-64 bg-gray-900">
          <img
            src={getImageUrl(recruiterInfo.coverUrl) || defaultBackground}
            alt="Ảnh bìa công ty"
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultBackground;
            }}
          />
        </div>

        {/* Avatar/Logo */}
        <div className="absolute bottom-[-35px] left-4 sm:left-20 z-10 p-1 bg-white rounded-full shadow-2xl">
          <img
            src={getImageUrl(recruiterInfo.avatarUrl) || defaultAvatar}
            alt="Logo công ty"
            className="w-32 h-32 sm:w-42 sm:h-42 rounded-full object-cover border-4 border-white"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
      </div>

      {/* 2. Company Info & Quick Details */}
      <div className="pt-14 pb-5 px-4 sm:px-25 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-gray-900 leading-snug">
            {recruiterInfo.companyName}{" "}
            {recruiterInfo.verified ? (
              <span className="inline-flex items-center gap-1 px-2 py-2 text-xs font-bold text-teal-600 bg-teal-50 rounded-full">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-2 items-center gap-1 px-2 py-1 text-xs font-bold text-gray-500 bg-gray-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                Chưa xác minh
              </span>
            )}
          </h1>
          <p className="text-md my-2 line-clamp-3 px-4">
            {recruiterInfo.description || "Chưa có mô tả công ty chi tiết."}
          </p>

          <div className="hidden font-bold gap-4 md:flex flex-wrap items-center gap-x-6 gap-y-2 text text-gray-700 mt-3">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-teal-600" />
              {recruiterInfo.address || "Chưa cập nhật địa chỉ"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={16} className="text-teal-600" />
              {recruiterInfo.email || "Chưa cập nhật email"}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={16} className="text-teal-600" />
              {recruiterInfo.website || "Chưa cập nhật website"}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall size={16} className="text-teal-600" />
              {recruiterInfo.phone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/account">
            <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-150 text-sm flex-shrink-0">
              <Building2 size={18} />
              Chỉnh sửa hồ sơ
            </button>
          </Link>

          <NotificationPanel />
        </div>
      </div>
      {/* NAV LINKS */}
      <nav className="border-t border-gray-100 bg-gray-50/70 backdrop-blur-sm sticky top-0 z-20">
        <ul className="flex flex-nowrap overflow-x-auto whitespace-nowrap px-15 sm:px-25 py-2.5">
          {navLinks.map(({ path, label, Icon, exact }) => {
            const active = exact ? currentPath === path : isActive(path);

            return (
              <li key={path} className="flex-shrink-0 mr-3">
                <Link
                  to={path}
                  className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 border-2 ${
                    active
                      ? "bg-teal-600 text-white bg-teal-500 border-teal-600 shadow-lg shadow-teal-500/20"
                      : "bg-white text-gray-700 hover:bg-teal-50 hover:border-teal-300 border-gray-200"
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default RecruiterPageHeader;
