import React, { useState, useEffect } from "react";
import {
  Trash2,
  Briefcase,
  ClipboardList,
  Wallet,
  Image,
  Send,
  Loader,
  XCircle,
  LayoutGrid,
  Zap,
  Save,
  Rocket,
  Pencil,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetJobPostingDetailQuery,
  useUpdateJobPostingMutation,
} from "../../redux/api/postApiSlice";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";
import type { JobType, Location } from "../../types/PostingProps";
import SectionTitle from "../../components/UI/SectionTitle";
import InputField from "../../components/UI/InputField";
import { getImageUrl } from "../../utils/helper";

const EditJobPostingView = () => {
  const jobId = useParams().id as string;

  const {
    data: jobResponse,
    isLoading: isFetchingJob,
    isError: isFetchError,
  } = useGetJobPostingDetailQuery(jobId);
  const [updateJobPosting, { isLoading: isUpdating }] =
    useUpdateJobPostingMutation();
  const navigate = useNavigate();
  const { data: locationsData } = useGetAllLocationsQuery();
  const locations: Location[] = locationsData?.data ?? [];

  // State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [requiredExperienceDescription, setRequiredExperienceDescription] =
    useState<string>("");
  const [expiredAt, setExpiredAt] = useState("");
  const [locationId, setLocationId] = useState("");

  // Image handling
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // UI State
  const [error, setError] = useState("");
  const maxImages = 5;

  // Effect to load data into state once fetched
  useEffect(() => {
    if (jobResponse?.data) {
      const job = jobResponse.data;
      setTitle(job.title || "");
      setType(job.type || "FULL_TIME");
      setDescription(job.description || "");
      setRequirements(job.requirements || "");
      setBenefits(job.benefits || "");
      setMinSalary(job.minSalary ? String(job.minSalary) : "");
      setMaxSalary(job.maxSalary ? String(job.maxSalary) : "");
      setRequiredExperienceDescription(job.experience || "");
      // Format date for datetime-local input
      setExpiredAt(job.expiredAt ? job.expiredAt.substring(0, 16) : "");
      setLocationId(job.location.id || "");
      setExistingImageUrls(job.imageNames || []);
    }
  }, [jobResponse]);

  const state = jobResponse?.data?.state;

  // Handle form submission (for both Save Draft and Publish)
  const handleSubmit = async (
    e: React.FormEvent,
    state: "DRAFT" | "PUBLISHED"
  ) => {
    e.preventDefault();
    setError("");

    if (!locationId) {
      setError("Vui lòng chọn Địa điểm làm việc.");
      return;
    }
    if (!title || !description || !requirements || !expiredAt) {
      setError(
        "Vui lòng điền các trường bắt buộc (Tiêu đề, Mô tả, Yêu cầu, Hạn chót)."
      );
      return;
    }

    const formData = new FormData();

    const payload = {
      id: jobId,
      title,
      type,
      description,
      requirements,
      benefits,
      minSalary: minSalary === "" ? null : Number(minSalary),
      maxSalary: maxSalary === "" ? null : Number(maxSalary),
      experience: requiredExperienceDescription || null,
      expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null,
      locationId,
      state,
      imagesToRetain: existingImageUrls,
    };

    formData.append("data", JSON.stringify(payload));

    // 2. Append new image files
    newImages.forEach((file) => formData.append("images", file));

    try {
      await updateJobPosting({ data: formData, id: jobId }).unwrap();
      navigate("/recruiter/jobs");
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Đã xảy ra lỗi không xác định khi cập nhật bài đăng."
      );
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;

    if ("files" in e.target) {
      files = e.target.files;
    } else if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
    }

    if (files) {
      const totalImages = existingImageUrls.length + newImages.length;
      const allowedFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      const newFiles = allowedFiles.slice(0, maxImages - totalImages);
      setNewImages((prev) => [...prev, ...newFiles]);

      if ("target" in e && "value" in e.target) {
        e.target.value = "";
      }
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const totalImages = existingImageUrls.length + newImages.length;
  const canUpload = totalImages < maxImages;
  const isLoading = isFetchingJob || isUpdating;

  if (isFetchingJob) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-teal-600 mr-3" />
        <p className="text-xl text-gray-700 font-medium">
          Đang tải dữ liệu bài đăng...
        </p>
      </div>
    );
  }

  if (isFetchError || !jobResponse?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <XCircle className="h-8 w-8 text-red-600 mr-3" />
        <p className="text-xl text-red-700 font-medium">
          Không tìm thấy bài đăng hoặc có lỗi xảy ra.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form className="max-w-6xl mx-auto sm:p-10 bg-white shadow-2xl rounded space-y-10">
        {/* Header */}
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
          <div className="mb-4 sm:mb-0 w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
              <Pencil className="h-8 w-8 text-teal-600" />
              Chỉnh sửa bài đăng tuyển dụng
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Cập nhật chi tiết cho công việc:{" "}
              <span className="text-teal-500 font-bold">**{title}**</span>
            </p>
            {/* STATE */}
            <div className="absolute top-[25%] right-0 flex justify-center p-2">
              <div
                className={`mt-3 px-3 py-1 inline-block text-sm font-semibold rounded-full ${
                  state === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Trạng thái hiện tại:{" "}
                {state === "PUBLISHED" ? "ĐÃ XUẤT BẢN" : "NHÁP"}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg font-medium flex items-center gap-2">
            <XCircle size={20} className="flex-shrink-0" />
            <span className="font-semibold">Lỗi:</span> {error}
          </div>
        )}

        {/* 1. Thông tin cơ bản & Phân loại */}
        <div className="space-y-6">
          <SectionTitle icon={<Briefcase />} title="Thông tin cơ bản" />

          <InputField
            label="Tiêu đề Công việc"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Kỹ sư AI nhận diện bệnh cây trồng"
            required={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Loại công việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại công việc <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 transition duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm appearance-none bg-white pr-8"
              >
                <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
                <option value="PART_TIME">Bán thời gian (Part-time)</option>
                <option value="INTERNSHIP">Thực tập (Internship)</option>
                <option value="FREELANCE">Tự do (Freelance)</option>
                <option value="CONTRACT">Hợp đồng (Contract)</option>
                <option value="TEMPORARY">Tạm thời (Temporary)</option>
                <option value="REMOTE">Làm việc từ xa (Remote)</option>
              </select>
            </div>

            {/* Địa điểm làm việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa điểm làm việc <span className="text-red-500">*</span>
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 transition duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm appearance-none bg-white pr-8"
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {locations.map((loc: Location) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Nội dung chi tiết */}
        <div className="space-y-6">
          <SectionTitle icon={<ClipboardList />} title="Nội dung chi tiết" />

          <InputField
            label="Mô tả công việc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết công việc, nhiệm vụ chính (Sử dụng dấu gạch đầu dòng để ứng viên dễ đọc)"
            required={true}
            rows={5}
          />

          <InputField
            label="Yêu cầu Bắt buộc"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Kinh nghiệm tối thiểu, kỹ năng chuyên môn, bằng cấp..."
            required={true}
            rows={4}
          />

          <InputField
            label="Quyền lợi & Phúc lợi"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Mức lương, làm việc từ xa, bảo hiểm, thưởng, nghỉ phép..."
            rows={4}
          />
        </div>

        {/* 3. Thông tin tài chính, Kinh nghiệm & Thời hạn */}
        <div className="space-y-6 border-t border-gray-100 pt-6">
          <SectionTitle
            icon={<Wallet />}
            title="Tài chính, Kinh nghiệm & Thời hạn"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Mức lương Tối thiểu */}
            <InputField
              label="Mức lương Tối thiểu (VND)"
              Icon={Wallet}
              value={minSalary}
              onChange={(e) =>
                setMinSalary(e.target.value.replace(/[^0-9]/g, ""))
              }
              type="number"
              placeholder="VD: 25000000"
            />

            {/* Mức lương Tối đa */}
            <InputField
              label="Mức lương Tối đa (VND)"
              Icon={Wallet}
              value={maxSalary}
              onChange={(e) =>
                setMaxSalary(e.target.value.replace(/[^0-9]/g, ""))
              }
              type="number"
              placeholder="VD: 35000000"
            />

            {/* Mô tả Kinh nghiệm Yêu cầu */}
            <InputField
              label="Mô tả Kinh nghiệm Yêu cầu"
              Icon={Zap}
              value={requiredExperienceDescription}
              onChange={(e) => setRequiredExperienceDescription(e.target.value)}
              type="text"
              placeholder="Ví dụ: Tối thiểu 3 năm lập trình React Native."
            />

            {/* Hạn nộp */}
            <InputField
              label="Hạn chót nộp hồ sơ"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              type="datetime-local"
              required={true}
            />
          </div>
        </div>

        {/* 4. Tải ảnh & Preview */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <SectionTitle icon={<Image />} title="Ảnh minh họa (Tùy chọn)" />

          <p className="text-sm font-medium text-gray-500">
            Tổng cộng: {totalImages} / {maxImages} ảnh.
          </p>

          {/* Image Preview Area - Existing Images */}
          {(existingImageUrls.length > 0 || newImages.length > 0) && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-4">
                {/* Existing Images */}
                {existingImageUrls.map((url, idx) => (
                  <div
                    key={`exist-${idx}`}
                    className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg"
                  >
                    <img
                      src={getImageUrl(url)}
                      alt={`Existing ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow-xl hover:bg-red-700 transition opacity-90"
                      title="Xóa ảnh này khỏi bài đăng"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="absolute bottom-0 left-0 text-xs bg-green-500 text-white px-1.5 rounded-tr-lg font-semibold">
                      Cũ
                    </span>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((img, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-teal-500 shadow-lg transform transition hover:scale-[1.03]"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`New Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() =>
                        URL.revokeObjectURL(URL.createObjectURL(img))
                      } // Clean up memory
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow-xl hover:bg-red-700 transition opacity-90"
                      title="Xóa ảnh mới này"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="absolute bottom-0 left-0 text-xs bg-teal-500 text-white px-1.5 rounded-tr-lg font-semibold">
                      Mới
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-teal-600", "bg-teal-50");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-teal-600", "bg-teal-50");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-teal-600", "bg-teal-50");
              if (canUpload) {
                handleImageChange(e);
              }
            }}
            className={`w-full border-2 border-dashed ${
              canUpload
                ? "border-teal-400 hover:border-teal-500 cursor-pointer"
                : "border-gray-300 cursor-not-allowed opacity-70"
            } rounded-xl px-6 py-10 text-center transition bg-teal-50/30 mt-4`}
            onClick={() =>
              canUpload && document.getElementById("imageInput")?.click()
            }
          >
            <LayoutGrid
              size={32}
              className={`mx-auto mb-2 ${
                canUpload ? "text-teal-600" : "text-gray-400"
              }`}
            />
            <p
              className={`font-semibold mb-1 ${
                canUpload ? "text-teal-700" : "text-gray-500"
              }`}
            >
              {canUpload
                ? `Kéo thả hoặc nhấn để chọn thêm tối đa ${
                    maxImages - totalImages
                  } ảnh`
                : `Đã đạt giới hạn ${maxImages} ảnh`}
            </p>
            <p className="text-sm text-gray-500">
              Hỗ trợ JPG, PNG (Ảnh mới sẽ được tải lên khi nhấn 'Lưu/Xuất bản')
            </p>
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={!canUpload}
            />
          </div>
        </div>

        {/* Footer & Submit Buttons - Đã tối ưu hóa */}
        <div className="pt-8 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
          {/* Nút 3: Xem danh sách ứng viên (Ưu tiên cao hơn khi đã PUBLISHED) */}
          {state === "PUBLISHED" && (
            <button
              type="button"
              onClick={() => navigate(`/recruiter/applicants/${jobId}`)}
              className="order-1 w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
            >
              <ClipboardList size={20} />
              Xem danh sách ứng viên
            </button>
          )}

          {/* Nút 1: Save Draft Button (Ưu tiên thấp nhất) */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={isLoading}
            className="order-2 w-full sm:w-auto bg-gray-100 text-gray-700 font-medium py-2.5 px-6 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isLoading && state === "DRAFT" ? (
              <Loader className="animate-spin h-5 w-5 text-gray-500" />
            ) : (
              <Save size={18} />
            )}
            {state === "PUBLISHED" ? "Chuyển về Nháp & Lưu" : "Lưu Nháp"}
          </button>

          {/* Nút 2: Publish/Update Button (Ưu tiên cao nhất) */}
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            disabled={isLoading}
            className="order-3 w-full sm:w-auto bg-teal-600 text-white font-bold text-base py-2.5 px-6 rounded-lg shadow-xl shadow-teal-500/50 hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            {isUpdating ? (
              <>
                <Loader className="animate-spin h-5 w-5" /> Đang xử lý...
              </>
            ) : state === "PUBLISHED" ? (
              <>
                <Send size={18} /> Cập nhật Bài đăng
              </>
            ) : (
              <>
                <Rocket size={18} /> Xuất bản Bài đăng
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPostingView;
