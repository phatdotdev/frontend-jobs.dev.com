import React, { useState } from "react";
import { useCreateJobPostingMutation } from "../../redux/api/postApiSlice";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import InputField from "../../components/UI/InputField";
import SectionTitle from "../../components/UI/SectionTitle";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";

type JobType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP";

const CreateJobPostForm = () => {
  const [createJobPosting, { isLoading }] = useCreateJobPostingMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [promotedSalary, setPromotedSalary] = useState<string>("");
  const [expiredAt, setExpiredAt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [locationId, setLocationId] = useState("");
  const { data } = useGetAllLocationsQuery();
  const locations = data?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    const payload = {
      title,
      type,
      description,
      requirements,
      benefits,
      promotedSalary: promotedSalary === "" ? null : Number(promotedSalary),
      expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null,
      locationId,
      state: "DRAFT",
    };

    formData.append("data", JSON.stringify(payload));
    images.forEach((file) => formData.append("images", file));

    try {
      await createJobPosting(formData).unwrap();
      navigate("/jobs");
    } catch (err: any) {
      setError(err?.data?.message || "Đã xảy ra lỗi khi tạo bài đăng.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files as FileList).slice(
        0,
        5 - images.length
      );
      setImages((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 space-y-8"
      >
        {/* Header */}
        <div className="text-center border-b border-teal-200 pb-4">
          {" "}
          <h2 className="text-3xl font-extrabold text-teal-700">
            ✍️ Tạo Bài Đăng Tuyển Dụng
          </h2>{" "}
          <p className="text-gray-500 mt-1">
            Điền đầy đủ thông tin chi tiết về vị trí công việc mới của bạn.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* 1. Thông tin cơ bản */}
        <div className="space-y-4">
          <SectionTitle icon="💼" title="Thông tin cơ bản" />

          <InputField
            label="Tiêu đề Công việc"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Kỹ sư AI nhận diện bệnh cây trồng"
            required={true}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Loại công việc <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as JobType)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-teal-500 focus:border-teal-500 shadow-sm appearance-none bg-white pr-8"
            >
              <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
              <option value="PART_TIME">Bán thời gian (Part-time)</option>
              <option value="INTERNSHIP">Thực tập (Internship)</option>
            </select>
          </div>
        </div>

        {/* 2. Chi tiết công việc */}
        <div className="space-y-4">
          <SectionTitle icon="📋" title="Chi tiết Công việc" />

          <InputField
            label="Mô tả công việc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Chi tiết công việc, nhiệm vụ..."
            required={true}
            rows={4}
          />

          <InputField
            label="Yêu cầu"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Kinh nghiệm, kỹ năng, bằng cấp..."
            required={true}
            rows={3}
          />

          <InputField
            label="Quyền lợi & Phúc lợi"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Lương thưởng, làm việc từ xa, phúc lợi..."
            rows={3}
          />
        </div>

        {/* 3. Thông tin khác */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SectionTitle icon="💰" title="Mức lương & Hạn nộp" />
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Mức lương đề xuất (VND)"
              value={promotedSalary}
              onChange={(e) =>
                setPromotedSalary(e.target.value === "" ? "" : e.target.value)
              }
              type="number"
              placeholder="VD: 20000000"
            />

            <InputField
              label="Hạn nộp hồ sơ"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              type="datetime-local"
              required={true}
            />
          </div>
        </div>

        {/* Noi lam viec */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Địa điểm làm việc <span className="text-red-500">*</span>
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-teal-500 focus:border-teal-500 shadow-sm appearance-none bg-white pr-8"
          >
            <option value="">-- Chọn tỉnh/thành --</option>
            {locations.map((loc: any) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Tải ảnh & Preview */}
        <div className="space-y-4">
          <SectionTitle icon="🖼️" title="Ảnh minh họa" />

          {/* Drag & Drop Area - Màu Teal */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files).filter(
                (file) => file.type.startsWith("image/")
              );
              const newFiles = droppedFiles.slice(0, 5 - images.length);
              setImages((prev) => [...prev, ...newFiles]);
            }}
            className={`w-full border-2 border-dashed ${
              images.length < 5
                ? "border-teal-400"
                : "border-gray-300 cursor-not-allowed"
            } rounded-xl px-6 py-10 text-center transition bg-teal-50/50 hover:bg-teal-100/70 cursor-pointer`}
            onClick={() =>
              images.length < 5 &&
              document.getElementById("imageInput")?.click()
            }
          >
            <p className="text-teal-600 font-semibold mb-1">
              {" "}
              📂 Kéo thả hoặc nhấn để chọn tối đa {5 - images.length} ảnh
            </p>
            <p className="text-sm text-gray-500">
              Hỗ trợ các định dạng JPG, PNG, GIF
            </p>
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={images.length >= 5}
            />
          </div>

          {/* Image Preview Area */}
          {images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Ảnh đã chọn ({images.length} ảnh):
              </p>
              <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-md"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                      title="Xóa ảnh này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer & Submit Button - Màu Teal */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={
              isLoading || !title || !description || !requirements || !expiredAt
            }
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">🔄</span> Đang tạo bài đăng...
              </>
            ) : (
              "Đăng bài tuyển dụng (Lưu Nháp)"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPostForm;
