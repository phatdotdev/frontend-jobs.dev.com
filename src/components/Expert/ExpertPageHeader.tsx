import { Link, useLocation } from "react-router-dom";
import { useGetUserInfoQuery } from "../../redux/api/userApiSlice";
import DataLoader from "../UI/DataLoader";
import ErrorAlert from "../UI/ErrorAlert";
import {
  LayoutDashboard,
  History,
  CheckCircle,
  Building2,
  Mail,
  Globe,
  ArrowBigLeft,
} from "lucide-react";
import { getImageUrl } from "../../utils/helper";

const defaultAvatar = "https://placehold.co/100x100/10b981/ffffff?text=Logo";
const defaultBackground =
  "https://placehold.co/1200x250/374151/ffffff?text=Company+Banner";

const ExpertPageHeader = () => {
  const { data: response, isLoading, isError } = useGetUserInfoQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isLoading) return <DataLoader content="Đang tải dữ liệu người dùng..." />;

  if (isError || !response?.data)
    return <ErrorAlert content="Có lỗi xảy ra khi tải dữ liệu người dùng!" />;

  const expertInfo = response.data;

  const isActive = (path: string) => currentPath.startsWith(path);

  const navLinks = [
    {
      path: "/expert/requests",
      label: "Yêu cầu góp ý hồ sơ",
      Icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/expert/reviews",
      label: "Hồ sơ đã hoàn thành",
      Icon: CheckCircle,
      exact: false,
    },
  ];

  return (
    <header className="bg-white shadow-xl rounded-b-xl overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <Link
          to="/"
          className="
                    absolute top-4 left-4 z-20 
                    flex items-center gap-1 
                    bg-purple-100 border-purple-300 border-2
                    px-3 py-2 rounded-lg text-purple-700
                    shadow-xl font-semibold text-lg font-bold
                    hover:bg-white transition duration-200
                "
        >
          <ArrowBigLeft className="w-4 h-4 text-purple-700 mr-1" />
          Về trang chủ
        </Link>
        <div className="h-48 sm:h-64 bg-gray-900">
          <img
            src={getImageUrl(expertInfo.coverUrl) || defaultBackground}
            alt="Ảnh bìa"
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultBackground;
            }}
          />
        </div>

        {/* Avatar */}
        <div className="absolute bottom-[-35px] left-4 sm:left-20 z-10 p-1 bg-white rounded-full shadow-2xl">
          <img
            src={getImageUrl(expertInfo.avatarUrl) || defaultAvatar}
            alt="Logo chuyên gia"
            className="w-32 h-32 sm:w-42 sm:h-42 rounded-full object-cover border-4 border-white"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
      </div>

      {/* Info & Action */}
      <div className="pt-14 pb-5 px-4 sm:px-25 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-gray-900 leading-snug">
            {expertInfo.username}{" "}
          </h1>

          <div className="hidden font-bold gap-4 md:flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
            <span className="flex items-center gap-1.5">
              <Mail size={16} className="text-purple-600" />
              {expertInfo.email || "Chưa cập nhật email"}
            </span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-150 text-sm flex-shrink-0">
          <Building2 size={18} />
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Navigation */}
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
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20"
                      : "bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-300 border-gray-200"
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

export default ExpertPageHeader;
