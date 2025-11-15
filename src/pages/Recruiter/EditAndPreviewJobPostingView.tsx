import { Edit2, Eye, Loader2, Pencil } from "lucide-react";
import EditJobPostingView from "./EditJobPostView";
import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import PostViewer from "../View/PostViewer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { useGetJobPostingDetailQuery } from "../../redux/api/apiPostSlice";
import { useParams } from "react-router-dom";
import { setDraft } from "../../redux/features/postSlice";
import DataLoader from "../../components/UI/DataLoader";

const EditAndPreviewJobPostingView = () => {
  const jobId = useParams().id as string;
  const {
    data: jobResponse,
    isLoading,
    isError,
  } = useGetJobPostingDetailQuery(jobId);

  const handleToggle = (preview: boolean) => {
    startTransition(() => {
      setIsPreview(preview);
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (jobResponse?.data) {
      const job = jobResponse.data;

      const draftData = {
        title: job.title || "",
        type: job.type || "FULL_TIME",
        state: job.state || "DRAFT",
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        minSalary: job.minSalary ? String(job.minSalary) : "",
        maxSalary: job.maxSalary ? String(job.maxSalary) : "",
        experience: job.experience || "",
        requiredDocuments: job.requiredDocuments || "",
        expiredAt: job.expiredAt ? job.expiredAt.substring(0, 16) : "",
        locationId: job.location.id || "",
        imageUrls: job.imageUrls || [],
        newImageUrls: [] as string[],
        newImages: [] as File[],
        newDocumentUrls: [] as string[],
        newDocuments: [] as File[],
        companyName: job.companyName || "",
        avatarUrl: job.avatarUrl || "",
        location: job.location || { name: "" },
        likes: job.likes ?? 0,
        views: job.views ?? 0,
        applied: job.applied ?? 0,
        documents: job.documents ?? [],
      };

      dispatch(setDraft(draftData));
    }
  }, [jobResponse, dispatch]);

  const formData = useSelector((state: RootState) => state.post.draft);

  const [isPreview, setIsPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  if (isLoading) return <DataLoader />;
  if (isError) return <ErrorAlert />;
  return (
    <div className="mt-8">
      {/* Header với Toggle Buttons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
              <Pencil className="h-8 w-8 text-teal-600" />
              Quản lý bài đăng tuyển dụng
            </h1>

            {/* Toggle Buttons */}
            <div className="inline-flex rounded-xl shadow-lg p-1 bg-gray-50 border border-gray-200">
              {/* Nút Chỉnh sửa */}
              <button
                onClick={() => handleToggle(false)}
                disabled={isPending}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 
                  ${
                    !isPreview
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-gray-600 hover:text-teal-600 hover:bg-white"
                  }
                  ${isPending ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isPending && !isPreview && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <Edit2 className="w-5 h-5" />
                Chỉnh sửa
              </button>

              {/* Nút Xem trước */}
              <button
                onClick={() => handleToggle(true)}
                disabled={isPending}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 
                  ${
                    isPreview
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-gray-600 hover:text-teal-600 hover:bg-white"
                  }
                  ${isPending ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isPending && isPreview && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <Eye className="w-5 h-5" />
                Xem trước
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính với transition mượt */}
      <div className="mt-8 max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
        <motion.div
          key={isPreview ? "preview" : "edit"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {isPreview ? (
            formData ? (
              <PostViewer formData={formData} />
            ) : (
              <ErrorAlert />
            )
          ) : (
            <EditJobPostingView />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EditAndPreviewJobPostingView;
