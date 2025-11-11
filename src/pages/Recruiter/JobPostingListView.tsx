import {
  AlertTriangle,
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Frown,
  Wallet,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetMineJobPostingsQuery } from "../../redux/api/postApiSlice";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import DataLoader from "../../components/UI/DataLoader";

// Cập nhật Type để phản ánh các trường dữ liệu đầy đủ
type JobPosting = {
  id: string;
  title: string;
  type:
    | "FULL_TIME"
    | "PART_TIME"
    | "INTERNSHIP"
    | "FREELANCE"
    | "CONTRACT"
    | "TEMPORARY"
    | "REMOTE";
  description: string;
  requirements: string;
  benefits: string;
  minSalary: number | null;
  maxSalary: number | null;
  experience: string | null;
  locationId: string | null;
  location?: { id: string; name: string };
  imageNames: string[];
  views: number;
  likes: number;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  state: string; // Draft, Published, etc.
};

const JobPostingCard = ({ job }: { job: JobPosting }) => {
  const isDraft = job.state === "DRAFT";
  const stateClasses = isDraft
    ? "bg-gray-100 text-gray-700 border-gray-300"
    : "bg-teal-50 text-teal-700 border-teal-300";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const typeText = job.type
    .replace("_", " ")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const salaryText =
    job.minSalary && job.maxSalary
      ? `${formatCurrency(job.minSalary)} - ${formatCurrency(job.maxSalary)}`
      : job.maxSalary
      ? `Lên đến ${formatCurrency(job.maxSalary)}`
      : "Thỏa thuận";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 cursor-pointer">
      <div className="p-5 space-y-4">
        {/* Trạng thái */}
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${stateClasses}`}
        >
          {isDraft ? "Nháp (Draft)" : "Đã đăng (Published)"}
        </span>

        {/* Tiêu đề */}
        <h2 className="text-lg font-bold text-gray-900 leading-snug hover:text-teal-600 transition">
          {job.title}
        </h2>

        {/* Thông tin nhanh */}
        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <Briefcase size={16} className="text-teal-500 flex-shrink-0" />
            <span>{typeText}</span>
          </p>
          <p className="flex items-center gap-2">
            <Wallet size={16} className="text-teal-500 flex-shrink-0" />
            <span className="font-semibold text-gray-800">{salaryText}</span>
          </p>
          <p className="flex items-center gap-2">
            <Eye size={16} className="text-teal-500 flex-shrink-0" />
            <span>{job.views.toLocaleString("vi-VN")} lượt xem</span>
          </p>
        </div>

        {/* Nút hành động */}
        <div className="pt-3 flex justify-between gap-3 border-t border-gray-100 mt-4">
          <Link to={`/recruiter/jobs/${job.id}`}>
            <button className="flex-grow text-sm font-medium text-teal-600 hover:text-teal-800 transition py-1 px-2 rounded-md hover:bg-teal-50">
              {isDraft ? "Hoàn thiện" : "Xem chi tiết"}
            </button>
          </Link>
          <button
            className={`text-sm font-medium ${
              isDraft
                ? "text-gray-500 hover:bg-gray-50"
                : "text-red-500 hover:text-red-700 hover:bg-red-50"
            } transition py-1 px-2 rounded-md`}
          >
            {isDraft ? "Xóa nháp" : "Tạm dừng"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorAlert = () => (
  <div className="p-6 my-8 bg-red-50 border border-red-300 text-red-700 rounded-xl shadow-md flex items-start gap-4">
    <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
    <div>
      <h3 className="font-bold text-lg">Lỗi tải dữ liệu</h3>
      <p className="text-sm">
        Rất tiếc, chúng tôi không thể tải danh sách bài tuyển dụng của bạn. Vui
        lòng thử lại sau.
      </p>
    </div>
  </div>
);

const JobPostingListView = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetMineJobPostingsQuery({
    page: 0,
    size: 6,
  });

  if (isLoading) {
    return <DataLoader content="Đang tải các bài tuyển dụng..." />;
  }

  if (isError || !data?.data?.content) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorAlert />
      </div>
    );
  }

  const postings: JobPosting[] = data.data.content.filter(
    (post: JobPosting) => post?.title?.trim() !== ""
  ) as JobPosting[];

  const handleCreateNew = () => {
    navigate("/post");
  };

  return (
    <main className="bg-white mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. Header & Call to Action (CTA) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-teal-600" />
            Quản lý Bài Tuyển Dụng
          </h1>
          <p className="text-gray-500 mt-1.5 text-lg">
            Tổng quan và điều chỉnh các vị trí bạn đã đăng.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition duration-200 transform hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          Đăng Vị Trí Mới
        </button>
      </div>

      {/* 2. Thanh lọc/Tìm kiếm (Placeholder) */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, địa điểm hoặc trạng thái..."
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-5 rounded-lg hover:bg-gray-200 transition font-medium flex-shrink-0 border border-gray-300">
            <Filter size={18} />
            Lọc (3/3)
          </button>
        </div>
      </div>

      {/* 3. Danh sách Bài đăng */}
      {postings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-200">
          <Frown size={50} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800">
            Không tìm thấy bài tuyển dụng nào
          </h3>
          <p className="text-gray-500 mt-2">
            Hãy bắt đầu tạo vị trí tuyển dụng đầu tiên của bạn ngay!
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-6 inline-flex items-center gap-2 bg-teal-500 text-white py-2.5 px-5 rounded-full hover:bg-teal-600 transition font-medium shadow-md"
          >
            <PlusCircle size={18} />
            Tạo Bài Mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {postings.map((job) => (
            <JobPostingCard
              key={job.id}
              job={job} // Dùng type JobPosting
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default JobPostingListView;
