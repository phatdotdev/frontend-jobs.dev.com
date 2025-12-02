import {
  LayoutDashboard,
  FileText,
  ListTodo,
  History,
  Loader2,
  AlertTriangle,
  User,
  MapPin,
  Mail,
  PhoneCall,
  Cake,
  VenusAndMars,
  ArrowBigLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useGetJobSeekerProfileQuery } from "../../redux/api/apiUserSlice";
import {
  formatDate,
  getImageUrl,
  mapGenderToVietnamese,
} from "../../utils/helper";
import DataLoader from "../UI/DataLoader";
import ErrorAlert from "../UI/ErrorAlert";
import NotificationPanel from "../Notification/NotificationPanel";

// Mock Default Assets
const defaultAvatar = "https://placehold.co/100x100/10b981/ffffff?text=JS";
const defaultBackground =
  "https://placehold.co/1200x250/2563eb/ffffff?text=Job+Seeker+Banner";

const JobSeekerPageHeader = () => {
  const { data: response, isLoading, isError } = useGetJobSeekerProfileQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  console.log(response);

  if (isLoading) return <DataLoader content="Đang tải dữ liệu người dùng..." />;

  if (isError || !response?.data) {
    return <ErrorAlert content="Lỗi khi tải dữ liệu người dùng!" />;
  }

  const jobSeekerInfo = response.data;

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const navLinks = [
    {
      path: "/job-seeker",
      label: "Hồ sơ cá nhân",
      Icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/job-seeker/resume",
      label: "Hồ sơ xin việc",
      Icon: FileText,
      exact: false,
    },
    {
      path: "/job-seeker/applied-jobs",
      label: "Việc làm đã ứng tuyển",
      Icon: ListTodo,
      exact: false,
    },
    {
      path: "/job-seeker/activities",
      label: "Hoạt động & Lịch sử",
      Icon: History,
      exact: false,
    },
  ];

  const primaryColor = "blue-600";
  const secondaryColor = "blue-50";

  return (
    <header className="bg-white shadow-xl rounded-b-xl">
      {/* 1. Cover Image and Avatar Section */}
      <div className="relative">
        <Link
          to="/"
          className="
                    absolute top-4 left-4 z-20 
                    flex items-center gap-1 
                    bg-blue-100 border-blue-300 border-2
                    px-3 py-2 rounded-lg text-blue-700
                    shadow-xl font-semibold text-lg font-bold
                    hover:bg-white transition duration-200
                "
        >
          <ArrowBigLeft className="w-4 h-4 text-blue-700 mr-1" />
          Về trang chủ
        </Link>
        {/* Cover Image */}
        <div className="h-48 sm:h-64 bg-gray-900">
          <img
            src={getImageUrl(jobSeekerInfo.coverUrl) || defaultBackground}
            alt="Ảnh bìa cá nhân"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultBackground;
            }}
          />
        </div>

        {/* Avatar/Logo */}
        <div className="absolute bottom-[-35px] left-4 sm:left-20 z-10 p-1 bg-white rounded-full shadow-2xl">
          <img
            src={getImageUrl(jobSeekerInfo.avatarUrl) || defaultAvatar}
            alt="Ảnh đại diện"
            className="w-32 h-32 sm:w-42 sm:h-42 rounded-full object-cover border-4 border-white"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
      </div>

      {/* 2. Company Info -> Job Seeker Info & Quick Details */}
      <div className="pt-14 pb-5 px-4 sm:px-25 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-snug">
            {`${jobSeekerInfo.firstname} ${jobSeekerInfo.lastname}` ||
              "Tên Người tìm việc"}
          </h1>
          <p className="text-md ml-10 text-gray-600 mt-1 truncate font-semibold">
            {jobSeekerInfo.role || "Chức danh/Vị trí mong muốn"}
          </p>

          <div className="text-lg font-bold flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className={`text-${primaryColor}`} />
              {jobSeekerInfo.address || "Chưa cập nhật địa chỉ"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={16} className={`text-${primaryColor}`} />
              {jobSeekerInfo.email || "Chưa cập nhật email"}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall size={16} className={`text-${primaryColor}`} />
              {jobSeekerInfo.phone || "Chưa cập nhật SĐT"}
            </span>
            <span className="flex items-center gap-1.5">
              <Cake size={16} className={`text-${primaryColor}`} />
              {formatDate(jobSeekerInfo.dob) || "Chưa cập nhật ngày sinh"}
            </span>
            <span className="flex items-center gap-1.5">
              <VenusAndMars size={16} className={`text-${primaryColor}`} />
              {mapGenderToVietnamese(jobSeekerInfo.gender) ||
                "Chưa cập nhật giới tính"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Button: Edit Profile */}
          <Link
            to="/account"
            className={`flex items-center gap-1.5 bg-${secondaryColor} text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-150 text-sm flex-shrink-0`}
          >
            <User size={18} />
            Chỉnh sửa Hồ sơ cá nhân
          </Link>
          <NotificationPanel />
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="border-t border-gray-100 bg-gray-50/70 backdrop-blur-sm sticky top-0 z-20">
        <ul className="flex flex-nowrap overflow-x-auto whitespace-nowrap px-15 sm:px-20 py-2.5">
          {navLinks.map(({ path, label, Icon, exact }) => {
            const active = exact ? currentPath === path : isActive(path);

            return (
              <li key={path} className="flex-shrink-0 mr-3">
                <Link
                  to={path}
                  className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 border-2 ${
                    active
                      ? `bg-blue-500 text-white border-${primaryColor} shadow-lg shadow-${primaryColor}/20`
                      : "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 border-gray-200"
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

export default JobSeekerPageHeader;
