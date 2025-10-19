import { useGetMineJobPostingsQuery } from "../../redux/api/postApiSlice";
import JobPosting from "../../components/Post/JobPosting";

const JobPostingListView = () => {
  const { data: response, isLoading, isError } = useGetMineJobPostingsQuery();

  if (isLoading)
    return (
      <p className="text-center py-4">Đang tải danh sách bài tuyển dụng...</p>
    );
  if (isError || !response?.data)
    return (
      <p className="text-center py-4 text-red-500">Không thể tải dữ liệu.</p>
    );

  const postings = response.data.filter(
    (post: any) => post.title && post.title.trim() !== ""
  );

  return (
    <div className="px-4 sm:px-10 py-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-6">
        📋 Danh sách bài tuyển dụng của bạn
      </h1>
      {postings.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có bài tuyển dụng nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postings.map((posting: any) => (
            <JobPosting key={posting.id} posting={posting} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostingListView;
