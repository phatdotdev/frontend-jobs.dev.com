import React, { useState } from "react";
import {
  Trash2,
  Briefcase,
  ClipboardList,
  Wallet,
  Image,
  XCircle,
  LayoutGrid,
  Edit,
  File,
} from "lucide-react";
import { useCreateJobPostingMutation } from "../../redux/api/apiPostSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";
import type { JobType, Location } from "../../types/PostingProps";
import SectionTitle from "../../components/UI/SectionTitle";
import InputField from "../../components/UI/InputField";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import {
  updateDraftField,
  addNewImages,
  removeNewImage,
  removeNewDocument,
  addNewDocuments,
} from "../../redux/features/postSlice";
import { FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { getFileIcon } from "../../utils/helpRender";

const CreateJobPostView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createJobPosting, { isLoading }] = useCreateJobPostingMutation();
  const { data } = useGetAllLocationsQuery();
  const locations: Location[] = data?.data ?? [];

  // Lấy draft từ Redux
  const draft = useSelector((state: any) => state.post.draft) || {};
  const {
    title = "",
    type = "FULL_TIME",
    description = "",
    requirements = "",
    benefits = "",
    minSalary = "",
    maxSalary = "",
    experience = "",
    expiredAt = "",
    locationId = "",
    requiredDocuments,
    newImageUrls = [],
  } = draft;

  // Local state: chỉ lưu File thật
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const maxImages = 5;
  const totalImages = imageFiles.length;
  const canUploadImage = totalImages < maxImages;

  const maxDocuments = 5;
  const totalDocuments = documentFiles.length;
  const canUploadDocument = totalDocuments < maxDocuments;

  // Cập nhật field → Redux
  const updateField = (field: keyof typeof draft, value: any) => {
    dispatch(updateDraftField({ [field]: value }));
  };

  // Xử lý ảnh
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;
    if ("files" in e.target) files = e.target.files;
    else if ("dataTransfer" in e) files = e.dataTransfer.files;

    if (!files) return;

    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newFiles = validFiles.slice(0, maxImages - totalImages);

    setImageFiles((prev) => [...prev, ...newFiles]);
    dispatch(addNewImages(newFiles.map((file) => URL.createObjectURL(file))));

    if ("target" in e && "value" in e.target) {
      e.target.value = "";
    }
  };

  // Xử lý tài liệu
  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;
    if ("files" in e.target) files = e.target.files;
    else if ("dataTransfer" in e) files = e.dataTransfer.files;

    if (!files) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validFiles = Array.from(files).filter((f) =>
      allowedTypes.includes(f.type)
    );
    const newFiles = validFiles.slice(0, maxDocuments - documentFiles.length);

    // Lưu File thật
    setDocumentFiles((prev) => [...prev, ...newFiles]);

    // Lưu tên file vào Redux (string → an toàn)
    dispatch(addNewDocuments(newFiles.map((file) => file.name)));

    if ("target" in e && "value" in e.target) {
      e.target.value = "";
    }
  };

  // Xóa hình ảnh
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeNewImage(index));
  };

  // Xóa tài liệu
  const handleRemoveDocument = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeNewDocument(index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationId || !title || !description || !requirements || !expiredAt) {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi khi tạo bài viết",
          message: "Điền đầy đủ các thông tin cần thiết!",
        })
      );
      return;
    }

    const formData = new FormData();
    const payload = {
      title,
      type,
      description,
      requirements,
      benefits,
      requiredDocuments,
      minSalary: minSalary ? Number(minSalary) : null,
      maxSalary: maxSalary ? Number(maxSalary) : null,
      experience: experience || null,
      expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null,
      locationId,
    };

    formData.append("data", JSON.stringify(payload));
    imageFiles.forEach((file) => formData.append("images", file));
    documentFiles.forEach((file) => formData.append("documents", file));

    console.log(formData.get("documents"));

    try {
      await createJobPosting(formData).unwrap();
      dispatch(
        addToast({
          type: "success",
          title: "Thành công",
          message: "Tạo bài đăng thành công (đã lưu nháp)",
        })
      );
      // navigate("/recruiter/jobs");
    } catch (err: any) {
      dispatch(
        addToast({
          type: "error",
          title: "Tạo bài đăng thất bại",
          message: err.message || "Lỗi không xác định!",
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white shadow-3xl rounded-xl p-6 sm:p-10 space-y-10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b">
          <Edit className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Viết bài tuyển dụng
            </h1>
            <p className="text-gray-500">Điền đầy đủ để thu hút ứng viên</p>
          </div>
        </div>

        {/* 1. Thông tin cơ bản */}
        <div className="space-y-6">
          <SectionTitle icon={<Briefcase />} title="Thông tin cơ bản" />
          <InputField
            label="Tiêu đề"
            value={title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="VD: Kỹ sư AI nhận diện bệnh cây trồng"
            required
          />
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Loại công việc *
              </label>
              <select
                value={type}
                onChange={(e) => updateField("type", e.target.value as JobType)}
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500"
              >
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
                <option value="INTERNSHIP">Thực tập</option>
                <option value="FREELANCE">Tự do</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="TEMPORARY">Tạm thời</option>
                <option value="REMOTE">Từ xa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Địa điểm *
              </label>
              <select
                value={locationId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedLocation = locations.find(
                    (loc) => loc.id === selectedId
                  );
                  updateField("locationId", selectedId);
                  updateField("location", selectedLocation || {});
                }}
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Nội dung */}
        <div className="space-y-6">
          <SectionTitle icon={<ClipboardList />} title="Nội dung chi tiết" />
          <InputField
            label="Mô tả công việc"
            value={description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Nhiệm vụ chính..."
            required
            rows={5}
          />
          <InputField
            label="Yêu cầu"
            value={requirements}
            onChange={(e) => updateField("requirements", e.target.value)}
            placeholder="Kinh nghiệm, kỹ năng..."
            required
            rows={4}
          />
          <InputField
            label="Quyền lợi"
            value={benefits}
            onChange={(e) => updateField("benefits", e.target.value)}
            placeholder="Lương, bảo hiểm..."
            rows={4}
          />

          <InputField
            label="Hồ sơ yêu cầu"
            value={requiredDocuments}
            required={true}
            onChange={(e) => updateField("requiredDocuments", e.target.value)}
            placeholder="Hồ sơ xin việc, sơ yếu lý lịch, học bạ, ..."
            rows={4}
          />
        </div>

        {/* 3. Tài chính & Thời hạn */}
        <div className="space-y-6 border-t pt-6">
          <SectionTitle icon={<Wallet />} title="Tài chính & Thời hạn" />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <InputField
              label="Lương tối thiểu (VND)"
              value={minSalary}
              onChange={(e) =>
                updateField("minSalary", e.target.value.replace(/[^0-9]/g, ""))
              }
              type="number"
              placeholder="25000000"
            />
            <InputField
              label="Lương tối đa (VND)"
              value={maxSalary}
              onChange={(e) =>
                updateField("maxSalary", e.target.value.replace(/[^0-9]/g, ""))
              }
              type="number"
              placeholder="35000000"
            />
            <InputField
              label="Kinh nghiệm yêu cầu"
              value={experience}
              onChange={(e) => updateField("experience", e.target.value)}
              placeholder="3+ năm React"
            />
            <InputField
              label="Hạn nộp"
              value={expiredAt}
              onChange={(e) => updateField("expiredAt", e.target.value)}
              type="datetime-local"
              required
            />
          </div>
        </div>

        {/* 4. Ảnh */}
        <div className="space-y-4 border-t pt-6">
          <SectionTitle icon={<Image />} title="Ảnh minh họa" />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-teal-600");
            }}
            onDragLeave={(e) =>
              e.currentTarget.classList.remove("border-teal-600")
            }
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-teal-600");
              if (canUploadImage) handleImageChange(e);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              canUploadImage
                ? "border-teal-400 cursor-pointer"
                : "border-gray-300 opacity-60"
            }`}
            onClick={() =>
              canUploadImage && document.getElementById("imageInput")?.click()
            }
          >
            <LayoutGrid size={32} className="mx-auto mb-2 text-teal-600" />
            <p className="font-semibold">
              {canUploadImage
                ? `Thêm tối đa ${maxImages - totalImages} ảnh`
                : "Đủ ảnh"}
            </p>
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={!canUploadImage}
            />
          </div>

          {newImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {newImageUrls.map((url: string, i: number) => (
                <div
                  key={i}
                  className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-teal-500"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Tài liệu */}
        <div className="space-y-4 border-t pt-6">
          <SectionTitle
            icon={<File />}
            title="Tài liệu đính kèm (PDF, Word, Excel)"
          />

          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-teal-600");
            }}
            onDragLeave={(e) =>
              e.currentTarget.classList.remove("border-teal-600")
            }
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-teal-600");
              if (canUploadDocument) handleDocumentChange(e);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
              canUploadDocument
                ? "border-teal-400 hover:border-teal-500 cursor-pointer"
                : "border-gray-300 opacity-60"
            }`}
            onClick={() =>
              canUploadDocument &&
              document.getElementById("documentInput")?.click()
            }
          >
            <File size={32} className="mx-auto mb-2 text-teal-600" />
            <p className="font-semibold text-teal-700">
              {canUploadDocument
                ? `Thêm tối đa ${maxDocuments - documentFiles.length} tài liệu`
                : `Đã đạt giới hạn ${maxDocuments} tài liệu`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, Word, Excel (tối đa 5MB mỗi file)
            </p>
            <input
              id="documentInput"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleDocumentChange}
              className="hidden"
              disabled={!canUploadDocument}
            />
          </div>

          {/* Danh sách tài liệu */}
          {documentFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Đã chọn ({documentFiles.length} / {maxDocuments}):
              </p>
              {documentFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2 text-sm">
                    {getFileIcon(file)}

                    <span className="truncate max-w-xs">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(i)}
                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-8 border-t">
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
            className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <>Đang tạo...</> : <>Đăng bài (Lưu nháp)</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPostView;
