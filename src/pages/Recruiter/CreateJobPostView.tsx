import React, { useState, type TextareaHTMLAttributes } from "react";
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
  Edit,
} from "lucide-react";
import { useCreateJobPostingMutation } from "../../redux/api/postApiSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";
import type { JobType, Location } from "../../types/PostingProps";
import SectionTitle from "../../components/UI/SectionTitle";
import InputField from "../../components/UI/InputField";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const CreateJobPostForm = () => {
  const [createJobPosting, { isLoading }] = useCreateJobPostingMutation();
  const navigate = useNavigate();
  const { data } = useGetAllLocationsQuery();
  const locations: Location[] = data?.data ?? [];

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
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [locationId, setLocationId] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!locationId) {
      setError("Vui lòng chọn Địa điểm làm việc.");
      return;
    }

    const formData = new FormData();
    const payload = {
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
    };

    formData.append("data", JSON.stringify(payload));
    images.forEach((file) => formData.append("images", file));

    try {
      await createJobPosting(formData).unwrap();
      dispatch(
        addToast({
          type: "success",
          title: "Tạo bài đăng thành công",
          message: "Tạo bài đăng thành công (được ghi bản nháp)",
        })
      );
      navigate("/recruiter/jobs");
    } catch (err: any) {
      setError(
        err?.data?.message || "Đã xảy ra lỗi không xác định khi tạo bài đăng."
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
      const allowedFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      const newFiles = allowedFiles.slice(0, 5 - images.length);
      setImages((prev) => [...prev, ...newFiles]);

      // Clear input value if it came from the input element
      if ("target" in e && "value" in e.target) {
        e.target.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const maxImages = 5;
  const canUpload = images.length < maxImages;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-4 lg:px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto sm:p-10 bg-white shadow-3xl space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
              <Edit className="h-8 w-8 text-teal-600" />
              Viết bài tuyển dụng
            </h1>
            <p className="text-gray-500 mt-1.5 text-lg">
              Điền đầy đủ thông tin để thu hút các ứng viên tìm năng.
            </p>
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
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setTitle(e.target.value)}
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
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết công việc, nhiệm vụ chính (Sử dụng dấu gạch đầu dòng để ứng viên dễ đọc)"
            required={true}
            rows={5}
          />

          <InputField
            label="Yêu cầu Bắt buộc"
            value={requirements}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setRequirements(e.target.value)}
            placeholder="Kinh nghiệm tối thiểu, kỹ năng chuyên môn, bằng cấp..."
            required={true}
            rows={4}
          />

          <InputField
            label="Quyền lợi & Phúc lợi"
            value={benefits}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setBenefits(e.target.value)}
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
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setMinSalary(
                  e.target.value === ""
                    ? ""
                    : e.target.value.replace(/[^0-9]/g, "")
                )
              }
              type="number"
              placeholder="VD: 25000000 (Để trống nếu không công khai)"
            />

            {/* Mức lương Tối đa */}
            <InputField
              label="Mức lương Tối đa (VND)"
              Icon={Wallet}
              value={maxSalary}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setMaxSalary(
                  e.target.value === ""
                    ? ""
                    : e.target.value.replace(/[^0-9]/g, "")
                )
              }
              type="number"
              placeholder="VD: 35000000 (Để trống nếu không công khai)"
            />

            {/* Mô tả Kinh nghiệm Yêu cầu */}
            <InputField
              label="Mô tả Kinh nghiệm Yêu cầu"
              Icon={Zap}
              value={requiredExperienceDescription}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setRequiredExperienceDescription(e.target.value)}
              type="text"
              placeholder="Ví dụ: Tối thiểu 3 năm kinh nghiệm lập trình React Native."
            />

            {/* Hạn nộp */}
            <InputField
              label="Hạn chót nộp hồ sơ"
              value={expiredAt}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setExpiredAt(e.target.value)}
              type="datetime-local"
              required={true}
            />
          </div>
        </div>

        {/* 4. Tải ảnh & Preview */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <SectionTitle icon={<Image />} title="Ảnh minh họa (Tùy chọn)" />

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
            } rounded-xl px-6 py-10 text-center transition bg-teal-50/30`}
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
                ? `Kéo thả hoặc nhấn để chọn tối đa ${
                    maxImages - images.length
                  } ảnh`
                : `Đã đạt giới hạn ${maxImages} ảnh`}
            </p>
            <p className="text-sm text-gray-500">
              Hỗ trợ JPG, PNG (Dùng ảnh chất lượng cao để bài đăng chuyên nghiệp
              hơn)
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

          {/* Image Preview Area */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Ảnh đã chọn ({images.length} / {maxImages}):
              </p>
              <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg transform transition hover:scale-[1.03]"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() =>
                        URL.revokeObjectURL(URL.createObjectURL(img))
                      } // Clean up memory
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 shadow-xl hover:bg-red-700 transition opacity-90"
                      title="Xóa ảnh này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer & Submit Button */}
        <div className="pt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={
              isLoading ||
              !title ||
              !description ||
              !requirements ||
              !expiredAt ||
              !locationId
            }
            className="w-full bg-teal-600 text-white font-extrabold text-lg py-3.5 rounded-xl shadow-2xl shadow-teal-500/40 hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.005]"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin h-5 w-5" /> Đang tạo bài đăng...
              </>
            ) : (
              <>
                <Send size={20} /> Đăng bài tuyển dụng (Lưu Nháp)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPostForm;
