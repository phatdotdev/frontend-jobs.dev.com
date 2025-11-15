import React, { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileDropZoneProps {
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[];
  label?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  accept = "*",
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesChange,
  initialFiles = [],
  label = "Thả file vào đây hoặc nhấn để chọn",
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return <Image size={16} className="text-blue-600" />;
    if (["pdf"].includes(ext || ""))
      return <FileText size={16} className="text-red-600" />;
    if (["xls", "xlsx"].includes(ext || ""))
      return <FileSpreadsheet size={16} className="text-green-600" />;
    if (["doc", "docx"].includes(ext || ""))
      return <FileText size={16} className="text-blue-700" />;
    return <FileCode size={16} className="text-gray-600" />;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const validFiles: FileWithPreview[] = Array.from(newFiles).filter(
        (file) => {
          const isTypeValid =
            accept === "*" ||
            accept.includes(file.type) ||
            accept.includes(`.${file.name.split(".").pop()}`);
          const isSizeValid = file.size <= maxSizeMB * 1024 * 1024;
          return isTypeValid && isSizeValid;
        }
      );

      const finalFiles = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(finalFiles);
      onFilesChange(finalFiles);
    },
    [files, accept, maxFiles, maxSizeMB, onFilesChange]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${
            isDragging
              ? "border-teal-500 bg-teal-50"
              : "border-gray-300 hover:border-teal-400"
          }
          ${files.length >= maxFiles ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <Upload
          size={32}
          className={`mx-auto mb-3 ${
            isDragging ? "text-teal-600" : "text-gray-500"
          }`}
        />
        <p
          className={`font-medium ${
            isDragging ? "text-teal-700" : "text-gray-700"
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tối đa {maxFiles} file, mỗi file ≤ {maxSizeMB}MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Đã chọn ({files.length}/{maxFiles}):
          </p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2 text-sm">
                {getFileIcon(file.name)}
                <span className="truncate max-w-xs font-medium">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
