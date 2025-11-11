import { HistoryIcon } from "lucide-react";

const HistoryView = () => {
  return (
    <main className="bg-white mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-teal-600" />
            Lịch sử tuyển dụng
          </h1>
          <p className="text-gray-500 mt-1.5 text-lg">
            Thông tin các bài tuyển dụng của bạn sẽ được lưu ở đây.
          </p>
        </div>
      </div>
    </main>
  );
};

export default HistoryView;
