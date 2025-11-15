import React from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import FileDropZone from "./FileDropZone";

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  documentFiles: File[];
  setDocumentFiles: (files: File[]) => void;
  isSubmitting?: boolean;
}

const SupplementModal: React.FC<SupplementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  documentFiles,
  setDocumentFiles,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bổ sung tài liệu
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Nhà tuyển dụng yêu cầu bạn cung cấp thêm hồ sơ
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* FileDropZone */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <FileDropZone onFilesChange={setDocumentFiles} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              disabled={documentFiles.length === 0 || isSubmitting}
              className={`flex items-center gap-2.5 px-6 py-2.5 font-semibold rounded-lg transition-all ${
                documentFiles.length > 0 && !isSubmitting
                  ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Gửi tài liệu
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplementModal;
