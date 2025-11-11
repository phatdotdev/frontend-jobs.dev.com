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
  Building, // Sử dụng Building cho Issuer/Tổ chức cấp
  Edit3,
  Trash2,
  Loader2,
  Calendar,
  Link, // Icon cho URL
  CreditCard, // Icon cho ID
} from "lucide-react";
// Giả định InputWithIcon là component chung bạn đang sử dụng
import InputWithIcon from "../UI/InputWithIcon";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payload sử dụng tên trường 'issuer'
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

      resetForm();
      refetch();
    } catch (err) {
      console.error(
        `Lỗi khi ${isEditing ? "cập nhật" : "tạo"} chứng chỉ:`,
        err
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
        console.error("Lỗi khi xóa chứng chỉ:", err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg mt-6">
      {/* 1. Header & Nút Thêm/Đóng (Màu Teal) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaCertificate className="mr-3 text-2xl text-teal-600" /> Quản lý
          Chứng chỉ
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-teal-600 text-white hover:bg-teal-700 border-teal-600 shadow-md"
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

      {/* 2. Form Thêm/Chỉnh sửa (Màu nền Teal) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-teal-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          {/* Nhóm 1: Tên & Tổ chức (issuer) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputWithIcon
              Icon={Award}
              name="name"
              placeholder="Tên chứng chỉ (*)"
              value={form.name}
              onChange={handleChange}
              required
            />

            <InputWithIcon
              Icon={Building}
              name="issuer"
              placeholder="Tổ chức cấp (*)"
              value={form.issuer}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nhóm 2: Ngày cấp & Ngày hết hạn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputWithIcon
              Icon={Calendar}
              name="issueDate"
              type="date"
              placeholder="Ngày cấp (*)"
              value={form.issueDate}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              Icon={Calendar}
              name="expirationDate"
              type="date"
              placeholder="Ngày hết hạn (tùy chọn)"
              value={form.expirationDate}
              onChange={handleChange}
            />
          </div>

          {/* Nhóm 3: Credential ID & URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <InputWithIcon
              Icon={CreditCard}
              name="credentialId"
              placeholder="ID chứng chỉ (tùy chọn)"
              value={form.credentialId}
              onChange={handleChange}
            />
            <InputWithIcon
              Icon={Link}
              name="credentialUrl"
              placeholder="URL chứng chỉ (tùy chọn)"
              value={form.credentialUrl}
              onChange={handleChange}
            />
          </div>

          {/* Mô tả */}
          <div className="relative">
            <MdOutlineDescription className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả nội dung chứng chỉ, phạm vi, kỹ năng đạt được..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              rows={3}
            />
          </div>

          {/* Nút Submit/Update (Màu Teal) */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-teal-600 hover:bg-teal-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
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
                    : "border-teal-500"
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

                <h3 className="text-lg font-bold text-teal-700 leading-snug pr-20">
                  {cert.name}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  {/* HIỂN THỊ: Sử dụng 'issuer' */}
                  {cert.issuer}
                </p>

                <div className="mt-2 text-xs font-medium text-gray-500 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-teal-500" />
                    Cấp ngày: **{formatDate(cert.issueDate)}**
                  </span>
                  {cert.expirationDate && (
                    <span className="flex items-center gap-1">
                      — Hết hạn: **{formatDate(cert.expirationDate)}**
                    </span>
                  )}
                  {cert.credentialId && (
                    <span className="flex items-center gap-1">
                      — ID: **{cert.credentialId}**
                    </span>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-500 hover:text-teal-700 flex items-center mt-1 font-medium"
                  >
                    <Link className="inline w-3 h-3 mr-1" /> Xem Chứng chỉ
                  </a>
                )}

                {cert.description && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2 whitespace-pre-line">
                    {cert.description}
                  </p>
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
