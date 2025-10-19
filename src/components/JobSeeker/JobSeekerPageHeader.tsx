import { Link, useLocation } from "react-router-dom";
import { useGetJobSeekerProfileQuery } from "../../redux/api/userApiSlice";
import defaultAvatar from "../../../public/default-jobseeker-avatar.png";
import defaultBackground from "../../../public/default-recruiter-background.png";
import { MdAddToPhotos, MdDashboard } from "react-icons/md";
import { FaHistory, FaListAlt } from "react-icons/fa";

const JobSeekerPageHeader = () => {
  const { data: response, isLoading, isError } = useGetJobSeekerProfileQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isLoading) return <p className="text-center py-4">Đang tải dữ liệu...</p>;
  if (isError || !response?.data)
    return (
      <p className="text-center py-4 text-red-500">Lỗi khi tải dữ liệu.</p>
    );

  const recruiterInfo = response.data;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="bg-white shadow-md">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={recruiterInfo.coverImageUrl || defaultBackground}
          alt="Ảnh bìa"
          className="w-full h-full object-cover"
        />

        {/* Avatar */}
        <div className="absolute bottom-[-40px] left-10 border-2 border-gray-500 rounded-full bg-white">
          <img
            src={recruiterInfo.avatarUrl || defaultAvatar}
            alt="Logo công ty"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-14 px-10 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          {recruiterInfo.companyName}
        </h1>
        <p className="text-gray-600">{recruiterInfo.description}</p>
      </div>

      {/* Navigation */}
      <nav className="sm:mx-[50px] px-4 sm:px-10 py-3 bg-gray-50">
        <ul className="flex flex-wrap gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible whitespace-nowrap">
          <li className="w-full sm:w-auto">
            <Link
              to="/recruiter"
              className={`flex items-center px-4 py-2 rounded-md font-bold transition ${
                isActive("/recruiter")
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <MdDashboard className="mr-2" />
              Tổng quan doanh nghiệp
            </Link>
          </li>
          <li className="w-full sm:w-auto">
            <Link
              to="/recruiter/post"
              className={`flex items-center px-4 py-2 rounded-md font-bold transition ${
                isActive("/recruiter/post")
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <MdAddToPhotos className="mr-2" />
              Viết bài tuyển dụng
            </Link>
          </li>
          <li className="w-full sm:w-auto">
            <Link
              to="/recruiter/list"
              className={`flex items-center px-4 py-2 rounded-md font-bold transition ${
                isActive("/recruiter/list")
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaListAlt className="mr-2" />
              Danh sách bài tuyển dụng
            </Link>
          </li>
          <li className="w-full sm:w-auto">
            <Link
              to="/recruiter/history"
              className={`flex items-center px-4 py-2 rounded-md font-bold transition ${
                isActive("/recruiter/history")
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaHistory className="mr-2" />
              Lịch sử tuyển dụng
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default JobSeekerPageHeader;
