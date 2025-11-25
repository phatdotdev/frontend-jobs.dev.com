import { Filter, Frown, HistoryIcon, Search } from "lucide-react";
import { useGetMyCompletedJobPostingQuery } from "../../redux/api/apiPostSlice";
import JobPostingCard from "../../components/Recruiter/JobPostingCard";
import DataLoader from "../../components/UI/DataLoader";

const HistoryView = () => {
  const {
    data: completedData,
    isLoading: loadingCompleted,
    isError: errorCompleted,
    refetch: refetchCompleted,
  } = useGetMyCompletedJobPostingQuery({ page: 0, size: 50 });

  const completed = completedData?.data?.content || [];

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

      {/* Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Tìm kiếm...`}
            className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-gray-600"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-medium whitespace-nowrap">
          <Filter className="w-5 h-5" />
          Bộ lọc nâng cao
        </button>
      </div>

      {/* Content */}
      {loadingCompleted ? (
        <DataLoader content={`Đang tải danh sách tin...`} />
      ) : errorCompleted ? (
        <div className="text-center py-20">
          <Frown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-500">
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      ) : completed.length === 0 ? (
        <p></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {completed.map((job: any) => (
            <JobPostingCard
              key={job.id}
              job={job}
              onUpdate={refetchCompleted}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default HistoryView;
