import { Loader } from "lucide-react";

const DataLoader = () => {
  return (
    <div className="flex items-center justify-center p-12 text-teal-600">
      <Loader className="animate-spin text-4xl mr-3" />
      <p className="text-xl font-medium">Đang tải dữ liệu...</p>
    </div>
  );
};

export default DataLoader;
