import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Clock,
  Zap,
  CheckCircle,
  X,
  Send,
  Loader,
  Calendar,
  type LucideIcon,
} from "lucide-react";

// --- MOCK DATA & HOOKS (Giả lập môi trường React Router và Redux) ---

// 1. Mock useParams
const useParams = () => ({ jobId: "senior-react-dev-hanoi-001" });

// 2. Mock API Hook - CHÚ Ý: Dữ liệu description, requirements, benefits giờ là CHUỖI TEXT
const mockJobDetail = {
  id: "senior-react-dev-hanoi-001",
  title: "Senior Full-stack React & Node.js Developer",
  companyName: "Innovate Solutions Corp.",
  companyAvatar: "https://placehold.co/60x60/40C4FF/ffffff?text=ISC",
  location: "Quận Hoàn Kiếm, Hà Nội",
  minSalary: 2000,
  maxSalary: 3500,
  type: "Toàn thời gian",
  experience: "Tối thiểu 3 năm",
  postedDate: "2024-10-15",
  expiryDate: "2024-11-30",
  // Dữ liệu là CHUỖI VĂN BẢN (có thể có ký tự xuống dòng \n)
  description:
    "Dẫn dắt và thực hiện phát triển các tính năng front-end sử dụng React, Redux/Zustand.\n" +
    "Phát triển các API backend hiệu suất cao bằng Node.js và Express/NestJS.\n" +
    "Tham gia vào quá trình thiết kế cơ sở dữ liệu (PostgreSQL/MongoDB).\n" +
    "Review code, mentoring các thành viên Junior.\n" +
    "Làm việc trực tiếp với Product Manager để đề xuất giải pháp kỹ thuật.",

  requirements:
    "3+ năm kinh nghiệm với React, thành thạo hooks và tối ưu hiệu suất.\n" +
    "Kinh nghiệm làm việc với Node.js, RESTful API và kiến trúc Microservices.\n" +
    "Am hiểu về CI/CD và sử dụng Docker.\n" +
    "Tư duy giải quyết vấn đề tốt, kỹ năng giao tiếp tiếng Anh (đọc/viết) là lợi thế.",

  benefits:
    "Mức lương cạnh tranh (lên đến 3500 USD), review 2 lần/năm.\n" +
    "Bảo hiểm sức khỏe cao cấp, khám sức khỏe định kỳ.\n" +
    "Laptop và thiết bị làm việc hiện đại (Macbook Pro/Dell XPS).\n" +
    "Môi trường làm việc linh hoạt, 15 ngày phép/năm.\n" +
    "Phụ cấp ăn trưa, gửi xe và gym membership.",
};

const useGetJobDetailQuery = (jobId: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      if (jobId) {
        setData({ data: mockJobDetail });
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [jobId]);

  return { data, isLoading, isError };
};

// --- HELPER FUNCTIONS ---
const formatSalary = (min: number, max: number) => {
  const formatNumber = (num: number) => num.toLocaleString("en-US");
  return `${formatNumber(min)} - ${formatNumber(max)} USD`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- REUSABLE LIST ITEM COMPONENT ---
interface JobDetailListItemProps {
  text: string;
  Icon: LucideIcon;
  iconClassName: string;
}

const JobDetailListItem: React.FC<JobDetailListItemProps> = ({
  text,
  Icon,
  iconClassName,
}) => (
  <li className="flex items-start text-gray-700">
    <Icon size={20} className={`flex-shrink-0 mt-1 mr-3 ${iconClassName}`} />
    <span>{text}</span>
  </li>
);

// --- MAIN COMPONENT: JobDetailView ---

const JobDetailView: React.FC = () => {
  const { jobId } = useParams();
  const { data, isLoading, isError } = useGetJobDetailQuery(jobId);
  const job = data?.data;

  const [activeTab, setActiveTab] = useState("description"); // description, requirements, benefits
  const [isApplying, setIsApplying] = useState(false); // State cho nút ứng tuyển

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-teal-600" />
        <p className="ml-3 text-lg font-medium text-gray-700">
          Đang tải chi tiết công việc...
        </p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-red-200">
          <X className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600">
            Không tìm thấy công việc
          </h2>
          <p className="text-gray-600 mt-2">
            ID công việc không hợp lệ hoặc đã hết hạn.
          </p>
        </div>
      </div>
    );
  }

  // Handle Apply Click (Mock implementation)
  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      // Giả lập logic ứng tuyển thành công
      alert("Bạn đã ứng tuyển thành công! Vui lòng kiểm tra email."); // Dùng alert cho mock
      setIsApplying(false);
    }, 1500);
  };

  /**
   * Cập nhật hàm renderTabContent:
   * 1. Nhận input là một CHUỖI LỚN (string), không phải mảng.
   * 2. Tách chuỗi thành mảng các dòng bằng cách sử dụng .split('\n').
   * 3. Lọc bỏ các dòng trống (trim().length > 0).
   * 4. Lặp qua các dòng đã tách để render JobDetailListItem.
   */
  const renderTabContent = (
    content: string,
    Icon: LucideIcon,
    iconClass: string
  ) => {
    const items = content.split("\n").filter((line) => line.trim().length > 0);

    // Nếu nội dung chỉ là một đoạn văn bản dài không có \n, hiển thị dưới dạng đoạn văn.
    if (items.length <= 1) {
      return <p className="text-gray-700 whitespace-pre-wrap">{content}</p>;
    }

    // Nếu có nhiều dòng (từ textarea), hiển thị dưới dạng bullet points.
    return (
      <ul className="space-y-4 pt-4">
        {items.map((item, index) => (
          <JobDetailListItem
            key={index}
            text={item.trim()} // Đảm bảo không có khoảng trắng thừa ở đầu/cuối dòng
            Icon={Icon}
            iconClassName={iconClass}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Header Section - Title, Salary, Location */}
      <header className="bg-white shadow-lg py-8 border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={job.companyAvatar}
            alt={job.companyName}
            className="w-20 h-20 rounded-xl object-cover border-4 border-teal-500 shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-xl font-semibold text-teal-600 mt-1">
              {job.companyName}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-3 text-gray-600 text-base font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-teal-500" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <DollarSign size={18} className="text-teal-500" />
                {formatSalary(job.minSalary, job.maxSalary)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content and Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - Job Tabs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-3 px-4 font-bold text-lg rounded-t-lg transition-colors duration-200 ${
                    activeTab === "description"
                      ? "border-b-4 border-teal-600 text-teal-700"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mô tả công việc
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`py-3 px-4 font-bold text-lg rounded-t-lg transition-colors duration-200 ${
                    activeTab === "requirements"
                      ? "border-b-4 border-teal-600 text-teal-700"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Yêu cầu
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  className={`py-3 px-4 font-bold text-lg rounded-t-lg transition-colors duration-200 ${
                    activeTab === "benefits"
                      ? "border-b-4 border-teal-600 text-teal-700"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Quyền lợi
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-6">
              {activeTab === "description" &&
                renderTabContent(job.description, CheckCircle, "text-teal-500")}
              {activeTab === "requirements" &&
                renderTabContent(
                  job.requirements,
                  CheckCircle,
                  "text-teal-500"
                )}
              {activeTab === "benefits" &&
                renderTabContent(job.benefits, Zap, "text-orange-500")}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company & Quick Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-3 flex items-center gap-2">
              <Building2 size={20} className="text-teal-600" />
              Thông tin chung
            </h3>

            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Kinh nghiệm</p>
                  <p className="text-sm">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Loại hình</p>
                  <p className="text-sm">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-teal-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Hạn nộp hồ sơ</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatDate(job.expiryDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Apply Button - Sticky on desktop */}
          <div className="sticky top-24">
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full flex items-center justify-center gap-3 bg-teal-600 text-white text-lg font-bold py-4 rounded-xl shadow-2xl shadow-teal-600/50 hover:bg-teal-700 transition duration-300 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Ứng tuyển ngay
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Nộp hồ sơ trực tuyến chỉ trong 1 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailView;
