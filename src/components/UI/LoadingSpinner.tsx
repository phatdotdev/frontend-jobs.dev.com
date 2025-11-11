import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 text-teal-600">
    <Loader2 className="h-10 w-10 animate-spin mb-3" />
    <p className="text-lg font-medium">Đang tải danh sách bài đăng...</p>
    <p className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát.</p>
  </div>
);

export default LoadingSpinner;
