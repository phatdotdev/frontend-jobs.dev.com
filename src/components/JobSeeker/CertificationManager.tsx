import { useState } from "react";
import type { CertificationProps } from "../../types/ResumeProps";
import {
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
  useGetAllCertificationsQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCertificate, FaCalendarAlt } from "react-icons/fa";
import {
  Award,
  Building,
  Edit3,
  Trash2,
  Loader2,
  Calendar,
  Link, // Icon cho URL
  CreditCard,
  Info,
  ClipboardCheck,
  Clock,
  ShieldCheck, // Icon cho ID
} from "lucide-react";
// Giả định InputWithIcon là component chung bạn đang sử dụng
import InputWithIcon from "../UI/InputWithIcon";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const CertificationManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllCertificationsQuery();
  const certifications = response?.data ?? [];

  const [createCertification, { isLoading: isCreating }] =
    useCreateCertificationMutation();
  const [updateCertification, { isLoading: isUpdating }] =
    useUpdateCertificationMutation();
  const [deleteCertification, { isLoading: isDeleting }] =
    useDeleteCertificationMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Khởi tạo trạng thái với tên trường 'issuer'
  const initialState: CertificationProps = {
    id: "",
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<CertificationProps>(initialState);

  const isEditing = !!editingId;
  // Tính toán trạng thái loading tổng thể
  const isLoading = isCreating || isUpdating || isDeleting;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialState);
    setEditingId(null);
    setShowForm(false);
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      issuer: form.issuer,
      issueDate: form.issueDate,
      expirationDate: form.expirationDate,
      credentialId: form.credentialId,
      credentialUrl: form.credentialUrl,
      description: form.description,
    };

    try {
      if (isEditing) {
        await updateCertification({ id: editingId, ...payload }).unwrap();
      } else {
        await createCertification(payload).unwrap();
      }

      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật chứng chỉ thành công!",
        })
      );

      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Lỗi khi cập nhật chứng chỉ!",
        })
      );
    }
  };

  const handleEdit = (certification: CertificationProps) => {
    setEditingId(certification.id as string);
    setForm({ ...certification });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chứng chỉ này không?")) {
      try {
        await deleteCertification(id).unwrap();
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa chứng chỉ!",
          })
        );
      }
    }
  };

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg mt-6">
      {/* 1. Header & Nút Thêm/Đóng (Màu blue) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaCertificate className="mr-3 text-2xl text-blue-600" /> Quản lý
          Chứng chỉ
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-700 border-blue-600 shadow-md"
          }`}
          disabled={isDeleting}
        >
          {showForm ? (
            <IoMdCloseCircle className="mr-1" size={20} />
          ) : (
            <MdOutlineAddCircle className="mr-1" size={20} />
          )}
          {showForm ? "Đóng Form" : "Thêm mới"}
        </button>
      </div>

      {/* 2. Form Thêm/Chỉnh sửa (Màu nền blue) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          {/* Nhóm 1: Tên & Tổ chức (issuer) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tên chứng chỉ <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Award}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tổ chức cấp <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Building}
                name="issuer"
                value={form.issuer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Nhóm 2: Ngày cấp & Ngày hết hạn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày cấp <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Calendar}
                name="issueDate"
                type="date"
                value={form.issueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày hết hạn (tùy chọn)
              </label>
              <InputWithIcon
                Icon={Calendar}
                name="expirationDate"
                type="date"
                value={form.expirationDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Nhóm 3: Credential ID & URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Credential ID (tùy chọn)
              </label>
              <InputWithIcon
                Icon={CreditCard}
                name="credentialId"
                value={form.credentialId}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Credential URL (tùy chọn)
              </label>
              <InputWithIcon
                Icon={Link}
                name="credentialUrl"
                value={form.credentialUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="relative mb-3">
            <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
              Mô tả chứng chỉ
            </label>
            <MdOutlineDescription className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả nội dung chứng chỉ, phạm vi, kỹ năng đạt được..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={3}
            />
          </div>

          {/* Nút Submit/Update */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-500 hover:bg-blue-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 inline mr-2" /> Đang xử
                lý...
              </>
            ) : isEditing ? (
              "Cập nhật Chứng chỉ"
            ) : (
              "Lưu Chứng chỉ"
            )}
          </button>

          {/* Nút Hủy Chỉnh sửa */}
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 mt-4 text-gray-600 hover:text-red-600 font-medium text-sm transition"
            >
              Hủy
            </button>
          )}
        </form>
      )}

      {/* 3. Danh sách Chứng chỉ */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách chứng chỉ.
          </p>
        ) : certifications.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm chứng chỉ chuyên môn của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert: CertificationProps) => (
              <div
                key={cert.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  cert.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-blue-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Tên chứng chỉ và Đơn vị cấp */}
                <div className="flex justify-between items-start mb-3 border-b pb-2 border-yellow-200">
                  <div>
                    <h4 className="text-xl font-extrabold text-yellow-800">
                      <Award
                        size={20}
                        className="inline mr-2 text-yellow-600"
                      />
                      {cert.name}
                    </h4>
                    <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
                      <ShieldCheck size={16} className="mr-2 text-yellow-600" />
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Thông tin Ngày cấp, Hết hạn và ID */}
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Ngày cấp */}
                    <p className="flex items-center font-medium">
                      <Calendar size={14} className="mr-2 text-yellow-600" />
                      Cấp ngày:{" "}
                      <span className="ml-1 font-semibold">
                        {cert.issueDate}
                      </span>
                    </p>

                    {/* Ngày hết hạn */}
                    {cert.expirationDate && (
                      <p className="flex items-center font-medium text-red-600">
                        <Clock size={14} className="mr-2 text-red-500" />
                        Hết hạn:{" "}
                        <span className="ml-1 font-semibold">
                          {cert.expirationDate}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Credential ID */}
                  {cert.credentialId && (
                    <p className="flex items-center text-xs font-medium bg-yellow-100 p-1 rounded">
                      <ClipboardCheck
                        size={14}
                        className="mr-2 text-yellow-700"
                      />
                      Credential ID:{" "}
                      <span className="ml-1 font-semibold text-gray-800">
                        {cert.credentialId}
                      </span>
                    </p>
                  )}

                  {/* Credential URL */}
                  {cert.credentialUrl && (
                    <p className="flex items-center">
                      <Link size={14} className="mr-2 text-blue-500" />
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm"
                        title="Xem chứng chỉ trực tuyến"
                      >
                        Xem Chứng chỉ (Link)
                      </a>
                    </p>
                  )}
                </div>

                {/* Mô tả chi tiết */}
                {cert.description && (
                  <div className="pt-3 mt-3 border-t border-yellow-100">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center">
                      <Info size={14} className="mr-2 text-gray-500" />
                      Mô tả:
                    </p>
                    {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                    <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-yellow-300 pl-3 ml-1">
                      {cert.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationManager;
