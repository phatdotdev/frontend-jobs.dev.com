import { useParams } from "react-router-dom";
import { useGetReviewByIdQuery } from "../../redux/api/apiReviewSlice";
import FeedbackViewer from "../View/FeedbackViewer";
import DataLoader from "../../components/UI/DataLoader";
import ResumeViewer from "../View/ResumeViewer";

const DetailHistoryReviewView = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useGetReviewByIdQuery(id);
  const resumeData = response?.data?.resume;
  const reviewData = response?.data;

  if (isLoading) {
    return <DataLoader />;
  }

  return (
    <div className="sm:mx-auto max-w-7xl mt-4 p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
        Chi Tiết Review Hồ sơ:{" "}
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
          <FeedbackViewer review={reviewData} />
        </div>
      </div>
    </div>
  );
};

export default DetailHistoryReviewView;
