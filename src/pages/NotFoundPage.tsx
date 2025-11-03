import { Link } from "react-router-dom";
import { Frown, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-center">
      <div className="bg-white p-12 md:p-16 rounded-3xl shadow-2xl max-w-lg w-full transform transition duration-500 hover:scale-[1.01] border-t-4 border-teal-500">
        <div className="flex justify-center mb-6">
          <Frown className="text-teal-500 w-20 h-20" />
        </div>

        {/* Status Code */}
        <h1 className="text-7xl md:text-8xl font-extrabold text-slate-800 mb-4 tracking-tighter">
          4<span className="text-teal-500">0</span>4
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Không tìm thấy trang (Page Not Found)
        </h2>

        {/* Message */}
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
          Rất tiếc, đường dẫn bạn đang tìm kiếm có thể đã bị thay đổi, xóa bỏ
          hoặc không tồn tại. Vui lòng trở về trang chủ để tiếp tục.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-full text-base font-semibold 
                     transition duration-300 shadow-lg shadow-teal-500/50
                     hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/60 transform hover:-translate-y-1 active:scale-95"
        >
          <Home size={20} />
          Về trang chủ
        </Link>
      </div>

      {/* Custom Animation for Icon (Optional, for visual flourish) */}
      <style>{`
        @keyframes subtleShake {
            0%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(-1deg); }
            20% { transform: rotate(1deg); }
            30% { transform: rotate(-1deg); }
            40% { transform: rotate(1deg); }
        }
        .animate-subtle-shake {
            animation: subtleShake 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
