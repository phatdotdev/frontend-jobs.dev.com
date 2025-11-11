import { useState } from "react";
import type { AwardProps } from "../../types/ResumeProps";
import {
  useCreateAwardMutation,
  useUpdateAwardMutation,
  useDeleteAwardMutation,
  useGetAllAwardsQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaMedal, FaCalendarAlt } from "react-icons/fa";
// Import icons từ lucide-react
import {
  Award,
  Building,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";

const AwardManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllAwardsQuery();
  const awards = response?.data ?? [];

  const [createAward, { isLoading: isCreating }] = useCreateAwardMutation();
  const [updateAward] = useUpdateAwardMutation();
  const [deleteAward] = useDeleteAwardMutation();
  const [showForm, setShowForm] = useState(false);

  // State quản lý ID đang chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialState: AwardProps = {
    id: "",
    name: "",
    organization: "",
    receivedDate: "",
    achievement: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<AwardProps>(initialState);

  const isEditing = !!editingId;
  const isLoading = isCreating;

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
    const payload = {
      name: form.name,
      organization: form.organization,
      receivedDate: form.receivedDate,
      achievement: form.achievement,
      description: form.description,
    };

    try {
      if (isEditing) {
        await updateAward({ id: editingId, ...payload }).unwrap();
      } else {
        await createAward(payload).unwrap();
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error(
        `Lỗi khi ${isEditing ? "cập nhật" : "tạo"} giải thưởng:`,
        err
      );
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (award: AwardProps) => {
    setEditingId(award.id as string);
    setForm({ ...award });
    setShowForm(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải thưởng này không?")) {
      try {
        console.log("Xóa giải thưởng:", id);
        await deleteAward(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Lỗi khi xóa giải thưởng:", err);
      }
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg mt-6">
      {/* 1. Header & Nút Thêm/Đóng (Màu Teal) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaMedal className="mr-3 text-2xl text-teal-600" /> Quản lý Giải
          thưởng
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-teal-600 text-white hover:bg-teal-700 border-teal-600 shadow-md"
          }`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Tên giải thưởng */}
            <InputWithIcon
              Icon={Award}
              name="name"
              placeholder="Tên giải thưởng (*)"
              value={form.name}
              onChange={handleChange}
              required
            />
            {/* Tổ chức trao giải */}
            <InputWithIcon
              Icon={Building}
              name="organization"
              placeholder="Tổ chức trao giải (*)"
              value={form.organization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Ngày nhận */}
            <InputWithIcon
              Icon={Calendar}
              name="receivedDate"
              type="date"
              placeholder="Ngày nhận giải (*)"
              value={form.receivedDate}
              onChange={handleChange}
              required
            />
            {/* Thành tích */}
            <InputWithIcon
              Icon={Sparkles}
              name="achievement"
              placeholder="Thành tích (ví dụ: Giải Nhất toàn quốc)"
              value={form.achievement}
              onChange={handleChange}
            />
          </div>

          {/* Mô tả */}
          <div className="relative">
            <MdOutlineDescription className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả thêm về giải thưởng, nội dung thi, ý nghĩa..."
              value={form.description}
              onChange={handleChange}
              // Focus màu Teal
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
              "Cập nhật Giải thưởng"
            ) : (
              "Lưu Giải thưởng"
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

      {/* 3. Danh sách Giải thưởng */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách giải thưởng.
          </p>
        ) : awards.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm các giải thưởng và thành tựu của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {awards.map((award: AwardProps) => (
              <div
                key={award.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  // Viền Teal
                  award.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-teal-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(award)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(award.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-teal-700 leading-snug pr-20">
                  {award.name}
                </h3>

                <p className="text-sm font-semibold text-gray-700 mt-1">
                  Tổ chức: {award.organization}
                </p>

                <div className="mt-1 text-xs font-medium text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-teal-500" />
                    Ngày nhận: {formatDate(award.receivedDate)}
                  </span>
                  {award.achievement && (
                    <span className="flex items-center gap-1">
                      — Thành tích: **{award.achievement}**
                    </span>
                  )}
                </div>

                {award.description && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2 whitespace-pre-line">
                    {award.description}
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

export default AwardManager;
