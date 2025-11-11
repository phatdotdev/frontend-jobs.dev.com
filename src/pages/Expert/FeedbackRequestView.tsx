import { Files, Clock, Calendar, CheckCircle, Info, Eye } from "lucide-react";
import { useGetActiveFeedbackRequestQuery } from "../../redux/api/apiReviewSlice";
import moment from "moment";
import { Link } from "react-router-dom";
import type { FeedbackRequestProps } from "../../types/FeedbackProps";

const FeedbackRequestView = () => {
  const { data: response } = useGetActiveFeedbackRequestQuery({});
  if (!response || !response.data || response.data.totalElements === 0) {
    return (
      <div className="sm:mx-[100px] mt-4 p-8 bg-white shadow-2xl rounded-lg text-center">
        <Info className="w-10 h-10 mx-auto text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Chưa có yêu cầu góp ý nào đang hoạt động.
        </h2>
        <p className="text-gray-500 mt-2">
          Hãy tạo yêu cầu review đầu tiên của bạn!
        </p>
      </div>
    );
  }

  const requests = response.data.content;

  const renderStatus = (status: string) => {
    switch (status) {
      case "REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
            <Clock className="w-4 h-4 mr-1" /> Đang Review
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" /> Đã Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-gray-900 tracking-tight">
          <Files className="w-8 h-8 text-purple-600" /> Yêu Cầu Góp Ý Hồ Sơ
        </h1>
        <p className="text-lg font-medium text-gray-600">
          Tổng cộng:{" "}
          <span className="text-purple-600 font-bold">
            {response.data.totalElements}
          </span>{" "}
          yêu cầu
        </p>
      </div>

      {/* Danh sách các yêu cầu */}
      <div className="space-y-6">
        {requests.map((request: FeedbackRequestProps) => (
          <div
            key={request.id}
            className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition duration-300 bg-purple-50"
          >
            {/* Header Hồ sơ và Trạng thái */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-purple-700">
                  {request.resume.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 font-bold">
                  Gửi bởi:{" "}
                  <span className="text-purple-700">
                    {request.resume.lastname} {request.resume.firstname}
                  </span>{" "}
                  ({request.resume.email})
                </p>
              </div>
              <div>{renderStatus(request.status)}</div>
            </div>

            {/* Chi tiết Hồ sơ */}
            <div className="text-sm">
              {/* Thong tin ngay */}
              <div className="flex py-4 gap-[10rem]">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-semibold">Ngày Gửi:</span>
                  <span className="ml-1">
                    {moment(request.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-semibold">Ngày kết thúc Dự kiến:</span>
                  <span
                    className={`ml-1 font-bold ${
                      request.status === "REVIEW"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {moment(request.completedAt).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              {/* Thong tin ve ho so */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 flex flex-col justify-between bg-white border rounded-lg p-4">
                  <span className="font-semibold text-gray-900">
                    Tên hồ sơ:
                  </span>
                  <span className="italic">{request.resume.title}</span>
                </div>
                <div className="flex-1 flex flex-col justify-between bg-white border rounded-lg p-4">
                  <span className="font-semibold text-gray-900 mb-2">
                    Mục tiêu nghề nghiệp:
                  </span>
                  <span className="italic">{request.resume.objectCareer}</span>
                </div>
                <div className="flex-1 flex flex-col justify-between bg-white border rounded-lg p-4">
                  <span className="font-semibold text-gray-900 mb-2">
                    Ghi chú gửi kèm:
                  </span>
                  <span className="text-gray-800">{request.notes}</span>
                </div>
              </div>
            </div>

            {/* Footer - Nút hành động */}
            <div className="mt-6 flex justify-end">
              <Link to={`/expert/requests/${request.id}`}>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition duration-150 shadow-md">
                  <Eye className="mr-2" />
                  Xem Chi Tiết
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackRequestView;
