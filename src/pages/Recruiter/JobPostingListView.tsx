import { useGetMineJobPostingsQuery } from "../../redux/api/postApiSlice";
import JobPostingCard from "../../components/Post/JobPostingCard";

type JobPosting = {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP";
  description: string;
  requirements: string;
  benefits: string;
  promotedSalary: number | null;
  locationId: string | null;
  location?: { id: string; name: string };
  imageNames: string[];
  views: number;
  likes: number;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  state: string;
};

const JobPostingListView = () => {
  const { data: response, isLoading, isError } = useGetMineJobPostingsQuery();

  if (isLoading) {
    return (
      <p className="text-center py-4">Đang tải danh sách bài tuyển dụng...</p>
    );
  }

  if (isError || !response?.data) {
    return (
      <p className="text-center py-4 text-red-500">Không thể tải dữ liệu.</p>
    );
  }

  const postings: JobPosting[] = response.data.filter(
    (post: JobPosting) => post?.title?.trim() !== ""
  );
  if (isLoading) {
    return <p>Dang tai du lieu</p>;
  }
  if (isError) {
    <p>Khong the tai du lieu</p>;
  }

  return (
    <div className="px-4 sm:px-10 py-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-6">
        📋 Danh sách bài tuyển dụng của bạn
      </h1>

      {postings.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có bài tuyển dụng nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postings.map((job) => (
            <JobPostingCard key={job.id} job={job as any} showActions={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostingListView;
