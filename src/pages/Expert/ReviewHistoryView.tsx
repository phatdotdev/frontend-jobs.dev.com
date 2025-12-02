import { History, Clock, CheckCircle, FileText, User } from "lucide-react";
import moment from "moment";
import { useGetMyFeedbacksQuery } from "../../redux/api/apiReviewSlice";
import DataLoader from "../../components/UI/DataLoader";
import { Link } from "react-router-dom";

const ReviewHistoryPage = () => {
  const { data: response, isLoading } = useGetMyFeedbacksQuery({});
  const historyData = response?.data.content;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Đang đánh giá
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Đã Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return <DataLoader />;
  }
  return (
    <div className="sm:mx-auto max-w-7xl mt-4 p-6 bg-white shadow-2xl rounded-xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-gray-900 tracking-tight">
          <History className="w-8 h-8 text-indigo-600" /> Lịch Sử Đánh Giá
        </h1>
        <p className="text-lg font-medium text-gray-600">
          Bạn đã thực hiện: **{historyData.length}** lượt đánh giá
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FileText className="w-4 h-4 inline mr-1" /> Tiêu đề Hồ sơ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <User className="w-4 h-4 inline mr-1" /> Ứng viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Gửi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoàn thành (Dự kiến)
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historyData.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition duration-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:underline cursor-pointer">
                  {item.resume.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.resume.firstname + " " + item.resume.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(item.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(item.state || "COMPLETED")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                  {item.score ? (
                    <span
                      className={`text-lg ${
                        item.score >= 7 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.score}/10
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(item.completedAt).format("DD/MM/YYYY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/expert/reviews/${item.id}`}>
                    <button className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs py-1 px-3 border border-indigo-300 rounded-md">
                      Xem Chi Tiết
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewHistoryPage;
