import { MdDashboard } from "react-icons/md";
import HorizontalJobList from "../../components/Post/HorizontalJobList";
import { useGetMineJobPostingsQuery } from "../../redux/api/apiPostSlice";

const RecruiterPageView = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useGetMineJobPostingsQuery({ page: 0, size: 5 });
  if (isLoading) return <p>Đang tải dữ liệu</p>;
  if (error) return <p>Không thể tải dữ liệu</p>;
  const postings = response?.data;

  return (
    <main className="bg-white mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <MdDashboard className="h-8 w-8 text-teal-600" />
            Tổng quan doanh nghiệp
          </h1>
          <p className="text-teal-800 mt-1.5 text-lg">
            Thông tin tổng quát về doanh nghiệp của bạn.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RecruiterPageView;
