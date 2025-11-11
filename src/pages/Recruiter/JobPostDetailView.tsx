import { Edit, Edit2, Eye } from "lucide-react";
import EditJobPostingView from "./EditJobPostView";
import { useState } from "react";
import JobDetailView from "../JobDetailView";

const JobPostDetailView = () => {
  const [isPreview, setIsPreview] = useState(false);
  return (
    <div className="mt-6">
      <div className="max-w-6xl mx-auto flex justify-end">
        <button
          onClick={() => setIsPreview(false)}
          className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-semibold text-base rounded-lg 
                    shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transition duration-200 ease-in-out"
        >
          <Edit className="mr-2" />
          Chỉnh sửa bài đăng
        </button>
        <button
          onClick={() => setIsPreview(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold text-base 
                    rounded-lg border border-gray-300 shadow-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                    transition duration-200 ease-in-out"
        >
          <Eye className="mr-2" />
          Xem trước bài đăng
        </button>
      </div>
      {isPreview ? <JobDetailView /> : <EditJobPostingView />}
    </div>
  );
};

export default JobPostDetailView;
