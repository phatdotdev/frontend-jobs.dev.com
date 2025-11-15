import { Edit2, Eye, Loader2, Pencil } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import PostViewer from "../View/PostViewer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import ErrorAlert from "../../components/UI/ErrorAlert";
import { setDraft } from "../../redux/features/postSlice";
import CreateJobPostView from "./CreateJobPostView";
import type { JobType } from "../../types/PostingProps";
import { useGetRecruiterProfileQuery } from "../../redux/api/apiUserSlice";

const CreateAndPreviewJobPostingView = () => {
  const handleToggle = (preview: boolean) => {
    startTransition(() => {
      setIsPreview(preview);
    });
  };

  const dispatch = useDispatch();

  const { data: response } = useGetRecruiterProfileQuery();

  useEffect(() => {
    const draftData = {
      title: "",
      type: "FULL_TIME" as JobType,
      description: "",
      requirements: "",
      benefits: "",
      minSalary: "",
      maxSalary: "",
      experience: "",
      requiredDocuments: "",
      expiredAt: "",
      locationId: "",
      imageUrls: [] as string[],
      documents: [] as any[],
      newImageUrls: [] as string[],
      newImages: [] as File[],
      newDocuments: [] as File[],
      newDocumentUrls: [] as string[],
      companyName: response?.data.companyName,
      avatarUrl: response?.data.avatarUrl,
      location: { id: "", name: "" },
    };

    dispatch(setDraft(draftData));
  }, [dispatch]);

  const formData = useSelector((state: RootState) => state.post.draft);

  const [isPreview, setIsPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <div className="mt-8">
      {/* Header với Toggle Buttons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
              <Pencil className="h-8 w-8 text-teal-600" />
              Tạo bài tuyển dụng
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
            <CreateJobPostView />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAndPreviewJobPostingView;
