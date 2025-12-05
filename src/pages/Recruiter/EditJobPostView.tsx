import React, { useEffect, useState } from "react";
import {
  Trash2,
  Briefcase,
  ClipboardList,
  Wallet,
  Image,
  Loader,
  LayoutGrid,
  Save,
  Edit2,
  File,
  PenBoxIcon,
  X,
} from "lucide-react";
import { FiSend } from "react-icons/fi";
import { RiGeminiLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateJobPostingMutation } from "../../redux/api/apiPostSlice";
import { useGetAllLocationsQuery } from "../../redux/api/apiAdminSlice";
import type { JobType, Location } from "../../types/PostingProps";
import SectionTitle from "../../components/UI/SectionTitle";
import InputField from "../../components/UI/InputField";
import { getImageUrl } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDraftField,
  addNewImages,
  removeExistingImage,
  removeNewImage,
  type JobFormData,
  removeNewDocument,
  addNewDocuments,
} from "../../redux/features/postSlice";
import { addToast } from "../../redux/features/toastSlice";
import { getFileIcon, getFileIconFromName } from "../../utils/helpRender";
import { useGetSuggestionCandidatesMutation } from "../../redux/api/apiResumeSlice";
import DataLoader from "../../components/UI/DataLoader";
import { useSendInvitationMutation } from "../../redux/api/apiCommunication";

const EditJobPostingView = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateJobPosting, { isLoading: isUpdating }] =
    useUpdateJobPostingMutation();
  const { data: locationsData } = useGetAllLocationsQuery();
  const locations: Location[] = locationsData?.data ?? [];

  const [showCandidateSugestion, setShowCandidateSuggestion] = useState(false);

  // Lấy draft từ Redux để đồng bộ
  const {
    id,
    title,
    type,
    description,
    requirements,
    benefits,
    requiredDocuments,
    minSalary,
    maxSalary,
    experience,
    expiredAt,
    locationId,
    imageUrls,
    state,
    documents,
  } = useSelector((state: any) => state.post.draft) || {};

  // Ảnh
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocument] = useState<any[]>([]);

  useEffect(() => {
    setExistingImageUrls(imageUrls || []);
    setExistingDocument(documents || []);
  }, [imageUrls, documents]);

  const [getCandidateSuggestions] = useGetSuggestionCandidatesMutation();

  const maxImages = 5;
  const totalImages = existingImageUrls?.length + newImages?.length;
  const canUpload = totalImages < maxImages;

  const maxDocuments = 5;
  const totalDocuments = documentFiles.length;
  const canUploadDocument = totalDocuments < maxDocuments;

  const isLoading = isUpdating;

  const updateField = (field: keyof JobFormData, value: any) => {
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

    const allowedFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newFiles = allowedFiles.slice(0, maxImages - totalImages);

    setNewImages((prev) => [...prev, ...newFiles]);
    dispatch(addNewImages(newFiles.map((file) => URL.createObjectURL(file))));
    console.log(newFiles.map((file) => URL.createObjectURL(file)));

    if ("target" in e && "value" in e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
    dispatch(removeExistingImage(url));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeNewImage(index));
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

  // Xóa tài liệu

  const handleRemoveExistingDocument = (index: number) => {
    setExistingDocument((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewDocument = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeNewDocument(index));
  };

  const [sendInvitation] = useSendInvitationMutation();
  const sendInvitationToUser = async (
    postId: string,
    receiverId: string,
    name: string
  ) => {
    try {
      await sendInvitation({ postId, receiverId }).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: `Đã gửi lời mời cho ${name}`,
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          message: "Gửi lời mời thất bại!",
        })
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    publishState: "DRAFT" | "PUBLISHED"
  ) => {
    e.preventDefault();

    if (!locationId) {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi",
          message: "Vui lòng chọn địa điểm làm việc",
        })
      );
      return;
    }

    if (
      !title ||
      !description ||
      !requirements ||
      !expiredAt ||
      !requiredDocuments
    ) {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi khi lưu tài liệu",
          message: "Vui lòng điền đầy đủ các trường bắt buộc",
        })
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
      requiredDocuments,
      benefits,
      minSalary: minSalary ? Number(minSalary) : null,
      maxSalary: maxSalary ? Number(maxSalary) : null,
      experience: experience || null,
      expiredAt: expiredAt ? new Date(expiredAt).toISOString() : null,
      locationId,
      state: publishState,
      imagesToRetain: existingImageUrls,
      documentsToRetain: existingDocuments.map((document) => document.fileName),
    };

    formData.append("data", JSON.stringify(payload));
    newImages.forEach((file) => formData.append("images", file));
    documentFiles.forEach((file) => formData.append("documents", file));

    try {
      await updateJobPosting({ data: formData, id: jobId }).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật bài viết thành công!",
        })
      );
      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 0);
    } catch (err: any) {
      dispatch(
        addToast({
          type: "error",
          title: "Lỗi",
          message: err?.data?.message || "Cập nhật thất bại",
        })
      );
    }
  };

  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateSuggestions, setCandidateSuggestion] = useState<any>(null);
  const fetchJobSuggestions = async () => {
    if (candidateSuggestions !== null) return;

    setLoadingCandidates(true);
    try {
      const res = await getCandidateSuggestions(jobId).unwrap();

      let suggestedCandidates: any[] = [];

      if (res.success && res.data) {
        if (typeof res.data === "string") {
          try {
            const parsed = JSON.parse(res.data);
            suggestedCandidates = parsed.suggested_candidates || [];
          } catch (e) {
            console.error("Parse JSON từ backend thất bại:", e);
            suggestedCandidates = [];
          }
        } else if (res.data.suggested_candidates) {
          suggestedCandidates = res.data.suggested_candidates;
        }
      }

      const validCandidates = suggestedCandidates.filter(
        (candidate: any) =>
          candidate.id && candidate.fullName && candidate.match_score > 0
      );

      setCandidateSuggestion(validCandidates);
    } catch (err) {
      setCandidateSuggestion([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleOpenCandidateSuggestion = async () => {
    setShowCandidateSuggestion(true);
    await fetchJobSuggestions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form className="max-w-6xl mx-auto sm:p-10 bg-white shadow-2xl rounded space-y-10">
        {/* Header */}
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
          <div className="mb-4 sm:mb-0 w-full">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Edit2 className="w-6 h-6 text-teal-600" />
              Quản lý bài đăng tuyển dụng
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Cập nhật chi tiết cho công việc:{" "}
              <span className="text-teal-500 font-bold">
                **{title || "..."}**
              </span>
            </p>
            <div className="absolute top-[25%] right-0 flex justify-center p-2">
              <div
                className={`mt-3 px-3 py-1 inline-block text-sm font-semibold rounded-full ${
                  state === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Trạng thái: {state === "PUBLISHED" ? "ĐÃ XUẤT BẢN" : "NHÁP"}
              </div>
            </div>
          </div>
        </div>
        {/* 1. Thông tin cơ bản */}
        <div className="space-y-6">
          <SectionTitle icon={<Briefcase />} title="Thông tin cơ bản" />

          <InputField
            label="Tiêu đề Công việc"
            value={title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="VD: Kỹ sư AI nhận diện bệnh cây trồng"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại công việc <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => updateField("type", e.target.value as JobType)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <select
                value={locationId}
                onChange={(e) => updateField("locationId", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
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
        {/* 2. Nội dung chi tiết */}
        <div className="space-y-6">
          <SectionTitle icon={<ClipboardList />} title="Nội dung chi tiết" />

          <InputField
            label="Mô tả công việc"
            value={description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Nhiệm vụ chính, môi trường làm việc..."
            required
            rows={5}
          />

          <InputField
            label="Yêu cầu"
            value={requirements}
            onChange={(e) => updateField("requirements", e.target.value)}
            placeholder="Kinh nghiệm, kỹ năng, bằng cấp..."
            required
            rows={4}
          />

          <InputField
            label="Quyền lợi"
            value={benefits}
            onChange={(e) => updateField("benefits", e.target.value)}
            placeholder="Lương, bảo hiểm, nghỉ phép..."
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
          <p className="text-sm text-gray-500">
            Tổng: {totalImages} / {maxImages}
          </p>

          {(existingImageUrls?.length > 0 || newImages?.length > 0) && (
            <div className="flex flex-wrap gap-4 mt-4">
              {existingImageUrls.map((url, i) => (
                <div
                  key={`old-${i}`}
                  className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg"
                >
                  <img
                    src={getImageUrl(url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-tr-lg">
                    Cũ
                  </span>
                </div>
              ))}

              {newImages.map((file, i) => (
                <div
                  key={`new-${i}`}
                  className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-teal-500 shadow-lg"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="absolute bottom-0 left-0 bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-tr-lg">
                    Mới
                  </span>
                </div>
              ))}
            </div>
          )}

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
              if (canUpload) handleImageChange(e);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
              canUpload
                ? "border-teal-400 hover:border-teal-500 cursor-pointer"
                : "border-gray-300 cursor-not-allowed opacity-60"
            }`}
            onClick={() =>
              canUpload && document.getElementById("imageInput")?.click()
            }
          >
            <LayoutGrid size={32} className="mx-auto mb-2 text-teal-600" />
            <p className="font-semibold text-teal-700">
              {canUpload
                ? `Thêm tối đa ${maxImages - totalImages} ảnh`
                : "Đã đủ ảnh"}
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
          {existingDocuments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Đã đăng ({existingDocuments.length} / {maxDocuments}):
              </p>
              {existingDocuments.map((document: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2 text-sm">
                    {getFileIconFromName(document.originalName)}

                    <span className="truncate max-w-xs">
                      {document.originalName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingDocument(i)}
                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
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
                    onClick={() => handleRemoveNewDocument(i)}
                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Nút hành động */}
        <div className="pt-8 border-t flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Lưu nháp
          </button>

          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            disabled={isLoading}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-teal-700 flex items-center gap-2 shadow-lg"
          >
            <PenBoxIcon />
            {isUpdating ? (
              <>Đang xử lý...</>
            ) : state === "PUBLISHED" ? (
              <>Cập nhật</>
            ) : (
              <>Xuất bản</>
            )}
          </button>
          {state === "PUBLISHED" && (
            <button
              type="button"
              onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <ClipboardList size={20} /> Xem ứng viên
            </button>
          )}
          {state === "PUBLISHED" && (
            <button
              type="button"
              onClick={handleOpenCandidateSuggestion}
              className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <RiGeminiLine size={20} /> Gợi ý ứng viên
            </button>
          )}
        </div>
      </form>

      {/* Suggest modal */}
      {showCandidateSugestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-teal-500 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Ứng viên phù hợp với nhu cầu của bạn
              </h2>
              <button
                onClick={() => setShowCandidateSuggestion(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X size={24} className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              {loadingCandidates ? (
                <div className="text-center py-16">
                  <DataLoader content="Tìm kiếm ứng viên..." />
                </div>
              ) : candidateSuggestions && candidateSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {candidateSuggestions.map((candidate: any) => (
                    <div
                      key={candidate.id}
                      className="flex justify-between border rounded-xl p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-teal-700">
                            {candidate.fullName || "Chưa cập nhật"}
                          </h3>
                          <p className="text-gray-700 font-medium">
                            {candidate.email || "Chưa cập nhật"}
                          </p>
                          <p className="text-gray-700 font-medium">
                            {candidate.phone || "Chưa cập nhật"}
                          </p>

                          {candidate.reason && (
                            <p className="text-xs text-gray-600 mt-1">
                              Lý do: {candidate.reason}
                            </p>
                          )}
                        </div>
                        {candidate.matchScore && (
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              {candidate.matchScore}%
                            </span>
                            <p className="text-xs text-gray-500">phù hợp</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            sendInvitationToUser(
                              jobId as string,
                              candidate.id,
                              candidate.fullName
                            )
                          }
                          className="flex items-center gap-2 p-2 bg-blue-500 rounded-lg text-white font-medium"
                        >
                          <FiSend />
                          Gửi lời mời
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg">Chưa có ứng viên phù hợp.</p>
                  <p className="text-sm mt-2">
                    Hãy chờ đợi ứng viên có kinh nghiệm nhé!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --- */}
    </div>
  );
};

export default EditJobPostingView;
