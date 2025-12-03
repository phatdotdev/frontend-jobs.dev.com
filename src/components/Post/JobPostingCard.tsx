import { Briefcase, Building2, Clock, DollarSign, MapPin } from "lucide-react";
import { getImageUrl, mapJobTypeVietnamese, timeAgo } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import { useViewJobPostingMutation } from "../../redux/api/apiPostSlice";

type JobPosting = {
  id: string;
  title: string;
  companyName: string;
  location: { id: string; name: string };
  minSalary: number;
  maxSalary: number;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  createdAt: string;
  avatarUrl: string;
};

const JobPostingCard = ({ job }: { job: JobPosting }) => {
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => num.toLocaleString("en-US");
    return `${formatNumber(min)} - ${formatNumber(max)} USD`;
  };
  const navigate = useNavigate();
  const [viewJobPost] = useViewJobPostingMutation();

  const handleViewJob = async () => {
    try {
      await viewJobPost(job.id).unwrap();
    } catch (error) {}
    navigate(`/jobs/${job.id}`);
  };

  const typeStyle =
    job.type === "FULL_TIME"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-teal-300 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-1 items-center gap-4">
          <img
            src={getImageUrl(job.avatarUrl)}
            alt={job.companyName}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border-2 border-teal-500 p-0.5"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1">
              <Building2 size={16} /> {job.companyName}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeStyle} whitespace-nowrap`}
        >
          {mapJobTypeVietnamese(job.type)}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 text-sm font-medium pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-teal-600">
          <DollarSign size={16} />
          <span className="text-gray-700 font-semibold">
            {formatSalary(job.minSalary, job.maxSalary)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-teal-600">
          <MapPin size={16} />
          <span className="text-gray-700">{job.location.name}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={16} />
          <span>Đăng {timeAgo(job.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Briefcase size={16} />
          <span>{job.type === "INTERNSHIP" ? "Thực tập" : "Lâu dài"}</span>
        </div>
      </div>

      <button
        onClick={handleViewJob}
        className="mt-auto block w-full bg-teal-500 text-white py-2 mt-2 rounded-lg font-bold hover:bg-teal-600 transition duration-200"
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default JobPostingCard;
