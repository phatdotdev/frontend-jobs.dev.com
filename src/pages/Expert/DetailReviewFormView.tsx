import { useParams } from "react-router-dom";
import { useGetRequestByIdQuery } from "../../redux/api/apiReviewSlice";
import DataLoader from "../../components/UI/DataLoader";
import ErrorAlert from "../../components/UI/ErrorAlert";
import ResumeViewer from "../View/ResumeViewer";
import DetailedReviewForm from "../../components/Expert/DetailedReviewForm";

const ReviewDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetRequestByIdQuery(id);

  const request: any = response;
  const resumeData = request?.resume;

  if (isLoading) return <DataLoader />;
  if (isError || !request) return <ErrorAlert />;

  return (
    <div className="sm:mx-auto max-w-7xl mt-4 p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
        Chi Tiết Đánh Giá Hồ Sơ:{" "}
        <span className="text-purple-700">{resumeData.title}</span>
      </h1>

      {/* Bố cục 2 cột chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[80vh]">
        {/* Cột 1: Thông tin CV */}
        <div className="shadow-2xl rounded-xl overflow-hidden bg-white">
          <ResumeViewer resume={resumeData} />
        </div>

        {/* Cột 2: Form Bình luận */}
        <div className="shadow-2xl rounded-xl overflow-hidden bg-white">
          <DetailedReviewForm
            requestId={request.id}
            resumeTitle={resumeData.title}
          />
        </div>
      </div>

      <div className="mt-4 p-2 text-center text-sm text-gray-500">
        Trạng thái yêu cầu:{" "}
        <span className="font-bold text-yellow-600">{request.status}</span>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
