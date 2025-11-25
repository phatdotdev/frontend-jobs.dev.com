import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  BriefcaseBusiness,
  Code2,
  Star,
  CheckCircle2,
  Clock,
} from "lucide-react";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { getImageUrl } from "../../utils/helper";
import ChatModal from "../../components/Modal/ChatModal";
import { format } from "date-fns";
import { useGetExpertByIdQuery } from "../../redux/api/apiUserSlice";

type Expertise = {
  id: string;
  title: string;
  field: string;
  yearsOfExperience: number;
  description: string;
};

type Expert = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt: string;
  status: string;
  expertises: Expertise[];
};

const ReviewerDetailPage: React.FC = () => {
  const { id: reviewerId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetExpertByIdQuery(reviewerId!);
  const expert: Expert | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DataLoader />
      </div>
    );
  }

  if (isError || !expert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorAlert content="Không tìm thấy chuyên gia này" />
      </div>
    );
  }

  const joinDate = format(new Date(expert.createdAt), "dd 'tháng' MM, yyyy");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-bold text-lg transition-all hover:-translate-x-1"
        >
          <ArrowLeft
            size={24}
            className="transition-transform group-hover:-translate-x-1"
          />
          Quay lại
        </button>

        {/* Header: Cover + Avatar + Tên */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          {/* Cover */}
          <div className="h-56 sm:h-72 relative">
            {expert.coverUrl ? (
              <img
                src={getImageUrl(expert.coverUrl)}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Avatar + Info */}
          <div className="relative -mt-20 sm:-mt-32 px-6 pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition" />
                <img
                  src={
                    getImageUrl(expert.avatarUrl as string) ||
                    "/default-avatar.png"
                  }
                  alt={expert.username}
                  className="relative w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full border-8 border-white shadow-2xl"
                />
                <div className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-white" />
                </div>
              </div>

              {/* Tên + Role + Chat */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
                  {expert.username}
                </h1>
                <p className="text-2xl text-white/90 font-medium mt-2">
                  Chuyên gia đánh giá hồ sơ
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
                  <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white font-bold rounded-full text-sm">
                    Chuyên gia
                  </span>
                  <span className="px-5 py-2 bg-green-500 text-white font-bold rounded-full text-sm">
                    Đang hoạt động
                  </span>
                </div>
              </div>

              <div className="sm:ml-auto">
                <ChatModal
                  name={expert.username}
                  id={expert.id}
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin liên hệ + Chuyên môn */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <BriefcaseBusiness className="text-indigo-600" size={28} />
                Thông tin liên hệ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={expert.email}
                  href={`mailto:${expert.email}`}
                />
                <InfoItem
                  icon={Phone}
                  label="Điện thoại"
                  value={expert.phone || "Chưa cung cấp"}
                  href={expert.phone ? `tel:${expert.phone}` : undefined}
                />
                <InfoItem
                  icon={Calendar}
                  label="Tham gia từ"
                  value={joinDate}
                />
                <InfoItem
                  icon={Star}
                  label="Số lĩnh vực chuyên môn"
                  value={`${expert.expertises.length} lĩnh vực`}
                />
              </div>
            </div>

            {/* Danh sách chuyên môn */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Code2 className="text-teal-600" size={28} />
                Chuyên môn & Kinh nghiệm
              </h2>

              <div className="space-y-6">
                {expert.expertises.map((exp) => (
                  <div
                    key={exp.id}
                    className="group bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-teal-700">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-medium text-teal-600 mt-1">
                          Lĩnh vực:{" "}
                          <span className="font-bold">{exp.field}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span className="text-teal-700 font-semibold">
                            {exp.yearsOfExperience} năm kinh nghiệm
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {exp.yearsOfExperience}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700 leading-relaxed italic">
                      "{exp.description}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Tổng quan */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8">Tổng quan chuyên gia</h3>
              <div className="space-y-6 text-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Trạng thái</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full font-bold">
                    Hoạt động
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng kinh nghiệm</span>
                  <span className="text-3xl font-bold">
                    {expert.expertises.reduce(
                      (sum, e) => sum + e.yearsOfExperience,
                      0
                    )}
                    + năm
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lĩnh vực chuyên sâu</span>
                  <span className="text-xl font-bold">
                    {expert.expertises.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoItem component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.FC<any>;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50 hover:shadow-md transition">
    <div className="p-3 bg-white rounded-xl shadow">
      <Icon size={24} className="text-indigo-600" />
    </div>
    <div>
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="text-lg font-bold text-indigo-800 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default ReviewerDetailPage;
