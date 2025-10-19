import { Link } from "react-router-dom";
import { MdErrorOutline, MdHome } from "react-icons/md";
import { FaBackward } from "react-icons/fa6";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <MdErrorOutline className="text-red-500 text-6xl mb-4 animate-bounce" />

      <h1 className="text-4xl font-extrabold text-red-600 mb-2">
        404 - Không tìm thấy trang
      </h1>

      <p className="text-gray-700 text-center max-w-md mb-6 font-medium text-teal-700">
        Có vẻ như bạn đã đi lạc. Đường dẫn bạn truy cập không tồn tại hoặc đã bị
        xoá.
      </p>

      <Link
        to="/"
        className="flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition duration-300"
      >
        <FaBackward className="mr-4" size={20} /> Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
