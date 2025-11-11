import { type FC, useState } from "react";
import { X, Loader2, Send, PlusCircle } from "lucide-react";
import type { ResumeProps as ResumeResponse } from "../../types/ResumeProps";
import ResumeItem from "../JobSeeker/ResumeItem";
import { Link } from "react-router-dom";

interface CvSelectionModalProps {
  jobId: string;
  resumes: ResumeResponse[];
  onClose: () => void;
  onCreateNewCv: () => void;
  isResumesLoading: boolean;
  onConfirmApply: (resumeId: string) => void;
}

const CvSelectionModal: FC<CvSelectionModalProps> = ({
  resumes,
  onClose,
  onCreateNewCv,
  isResumesLoading,
  onConfirmApply,
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    resumes[0]?.id || null
  );
  const currentPathEncoded = encodeURIComponent(
    location.pathname + location.search
  );

  const [submittingResumeId, setSubmittingResumeId] = useState<string | null>(
    null
  );

  const handleApplySelected = async () => {
    if (!selectedResumeId || submittingResumeId) return;

    setSubmittingResumeId(selectedResumeId);
    await onConfirmApply(selectedResumeId);
    setSubmittingResumeId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        {/* Nút đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-teal-700 mb-5 border-b pb-2">
          Chọn CV để nộp hồ sơ
        </h3>

        {isResumesLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
            <span className="ml-3 text-lg text-teal-700">
              Đang tải danh sách CV...
            </span>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {resumes.length > 0 ? (
              resumes.map((resume) => (
                <ResumeItem
                  key={resume.id}
                  resume={resume}
                  onSelect={setSelectedResumeId}
                  isSelected={selectedResumeId === resume.id}
                  isSubmitting={submittingResumeId === resume.id}
                />
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-semibold mb-3">
                  Bạn chưa có CV nào trong hệ thống.
                </p>
                <button
                  onClick={onCreateNewCv}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PlusCircle size={18} className="mr-2" /> Tạo CV mới ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nút xác nhận nộp và nút tạo CV mới */}
        <div className="pt-4 border-t mt-4 flex justify-between gap-3">
          <button
            onClick={onCreateNewCv}
            className="flex-grow flex items-center justify-center px-4 py-3 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <PlusCircle size={18} className="mr-2" /> Tạo CV mới
          </button>

          <button
            onClick={handleApplySelected}
            disabled={!selectedResumeId || !!submittingResumeId} // Disabled nếu chưa chọn hoặc đang nộp
            className="flex-grow flex items-center justify-center px-6 py-3 text-sm font-bold bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {!!submittingResumeId ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Đang nộp...
              </>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                Xác nhận và Ứng tuyển
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CvSelectionModal;
